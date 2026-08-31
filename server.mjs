import { createReadStream } from "node:fs";
import { mkdir, appendFile } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { MongoClient } from "mongodb";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const webRoot = join(root, "apps", "web");
const port = Number.parseInt(process.env.PORT || "4173", 10);
const logDir = process.env.AUREA_LOG_DIR || join(root, "logs");
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "aurea";
const apiKey = process.env.AUREA_API_KEY;
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:4173";
const requests = new Map();
const counters = new Map();
let mongoClient;
let db;

await mkdir(logDir, { recursive: true });
function log(event) { const line = JSON.stringify({ timestamp: new Date().toISOString(), service: "aurea", ...event }); process.stdout.write(`${line}\n`); appendFile(join(logDir, "aurea.log"), `${line}\n`).catch(() => undefined); }
function json(response, status, payload) { response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": allowedOrigin, "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type, authorization" }); response.end(JSON.stringify(payload)); }
function authorized(request) { const provided = request.headers.authorization?.replace(/^Bearer\s+/i, "") || ""; return Boolean(apiKey) && provided.length === apiKey.length && timingSafeEqual(Buffer.from(provided), Buffer.from(apiKey)); }
function limited(request) { const now = Date.now(); const key = request.socket.remoteAddress || "unknown"; const item = requests.get(key); if (!item || now - item.at >= 60_000) { requests.set(key, { at: now, count: 1 }); return false; } item.count += 1; return item.count > 120; }
async function body(request) { let value = ""; for await (const chunk of request) { value += chunk; if (value.length > 100_000) { const error = new Error("request_body_too_large"); error.statusCode = 413; throw error; } } try { return value ? JSON.parse(value) : {}; } catch { const error = new Error("invalid_json"); error.statusCode = 400; throw error; } }
function pathFor(urlPath) { const requested = urlPath === "/" ? "/index.html" : urlPath.split("?")[0]; const path = normalize(join(webRoot, requested)); return path.startsWith(`${webRoot}/`) ? path : null; }
async function connect() { if (!mongoUri) return log({ event: "mongodb_not_configured" }); try { mongoClient = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 }); await mongoClient.connect(); db = mongoClient.db(databaseName); await db.collection("tenants").createIndex({ slug: 1 }, { unique: true }); log({ event: "mongodb_connected", database: databaseName }); } catch (error) { log({ event: "mongodb_connection_failed", error: error.message }); } }

const server = http.createServer(async (request, response) => {
  const route = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname;
  const key = `${request.method}|${route}`;
  counters.set(key, (counters.get(key) || 0) + 1);
  if (request.method === "OPTIONS") return json(response, 204, {});
  if (limited(request)) return json(response, 429, { error: "too_many_requests" });
  if (route === "/health" && request.method === "GET") return json(response, db ? 200 : 503, { ok: Boolean(db), service: "aurea-backend", database: databaseName, mongodb: db ? "connected" : "disconnected" });
  if (route === "/metrics" && request.method === "GET") { response.writeHead(200, { "content-type": "text/plain; version=0.0.4; charset=utf-8" }); return response.end([...counters].map(([name, count]) => `aurea_http_requests_total{route="${name.split("|")[1]}",method="${name.split("|")[0]}"} ${count}`).join("\n") + "\n"); }
  if (route.startsWith("/api/") && !authorized(request)) return json(response, 401, { error: "unauthorized" });
  if (route.startsWith("/api/") && !db) return json(response, 503, { error: "database_unavailable" });
  try {
    if (route === "/api/tenants" && request.method === "GET") return json(response, 200, { tenants: await db.collection("tenants").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() });
    if (route === "/api/tenants" && request.method === "POST") { const input = await body(request); const name = typeof input.name === "string" ? input.name.trim() : ""; const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : ""; if (!name || !/^[a-z0-9-]+$/.test(slug)) return json(response, 400, { error: "name_and_valid_slug_required" }); const tenant = { name, slug, createdAt: new Date() }; await db.collection("tenants").insertOne(tenant); return json(response, 201, { tenant }); }
    const match = route.match(/^\/api\/tenants\/([a-z0-9-]+)$/);
    if (match && request.method === "GET") { const tenant = await db.collection("tenants").findOne({ slug: match[1] }, { projection: { _id: 0 } }); return tenant ? json(response, 200, { tenant }) : json(response, 404, { error: "tenant_not_found" }); }
    if (route.startsWith("/api/")) return json(response, 404, { error: "not_found" });
    if (!['GET', 'HEAD'].includes(request.method)) return json(response, 405, { error: "method_not_allowed" });
    const filePath = pathFor(request.url || "/"); if (!filePath) return json(response, 400, { error: "bad_request" });
    const stream = createReadStream(filePath); stream.once("error", () => { response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); response.end("Not found"); }); stream.once("open", () => { response.writeHead(200, { "content-type": ({ ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" })[extname(filePath)] || "application/octet-stream" }); if (request.method === "HEAD") response.end(); else stream.pipe(response); });
  } catch (error) { log({ event: "request_failed", error: error.message }); return json(response, error.statusCode || (error.code === 11000 ? 409 : 500), { error: error.code === 11000 ? "tenant_slug_already_exists" : error.statusCode ? error.message : "internal_server_error" }); }
});
server.listen(port, "0.0.0.0", () => log({ event: "server_started", port }));
connect();
async function shutdown(signal) { log({ event: "server_stopping", signal }); server.close(); if (mongoClient) await mongoClient.close(); }
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
