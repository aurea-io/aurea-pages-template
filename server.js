import { appendFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const webRoot = join(root, "apps", "web");
const port = Number.parseInt(process.env.PORT || "4173", 10);
const logDir = process.env.AUREA_LOG_DIR || join(root, "logs");
const logFile = join(logDir, "aurea.log");
const counters = new Map();
const durations = new Map();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

await mkdir(logDir, { recursive: true });

function log(event) {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), service: "aurea", ...event });
  process.stdout.write(`${line}\n`);
  appendFile(logFile, `${line}\n`).catch(() => undefined);
}

function record(method, route, status, elapsedMs) {
  const key = `${method}|${route}|${status}`;
  counters.set(key, (counters.get(key) || 0) + 1);
  durations.set(key, (durations.get(key) || 0) + elapsedMs / 1000);
}

function metrics() {
  const lines = [
    "# HELP aurea_http_requests_total Total HTTP requests.",
    "# TYPE aurea_http_requests_total counter",
    ...[...counters].map(([key, value]) => {
      const [method, route, status] = key.split("|");
      return `aurea_http_requests_total{method="${method}",route="${route}",status="${status}"} ${value}`;
    }),
    "# HELP aurea_http_request_duration_seconds_total Total HTTP request duration in seconds.",
    "# TYPE aurea_http_request_duration_seconds_total counter",
    ...[...durations].map(([key, value]) => {
      const [method, route, status] = key.split("|");
      return `aurea_http_request_duration_seconds_total{method="${method}",route="${route}",status="${status}"} ${value}`;
    }),
  ];
  return `${lines.join("\n")}\n`;
}

function safeFilePath(urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath.split("?")[0];
  const filePath = normalize(join(webRoot, requested));
  return filePath.startsWith(`${webRoot}/`) ? filePath : null;
}

const server = http.createServer((request, response) => {
  const started = performance.now();
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const route = url.pathname;
  let status = 200;

  const finish = () => {
    const elapsedMs = performance.now() - started;
    record(request.method || "GET", route, status, elapsedMs);
    log({ event: "http_request", method: request.method, route, status, duration_ms: Math.round(elapsedMs) });
  };

  response.once("finish", finish);
  if (request.method !== "GET" && request.method !== "HEAD") {
    status = 405;
    response.writeHead(status, { "content-type": "application/json; charset=utf-8", allow: "GET, HEAD" });
    response.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }
  if (route === "/health") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({ status: "ok", service: "aurea" }));
    return;
  }
  if (route === "/metrics") {
    response.writeHead(200, { "content-type": "text/plain; version=0.0.4; charset=utf-8" });
    response.end(metrics());
    return;
  }

  const filePath = safeFilePath(request.url || "/");
  if (!filePath) {
    status = 400;
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }
  const stream = createReadStream(filePath);
  stream.once("error", (error) => {
    status = error.code === "ENOENT" ? 404 : 500;
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    response.end(status === 404 ? "Not found" : "Internal server error");
  });
  stream.once("open", () => {
    response.writeHead(200, { "content-type": contentTypes[extname(filePath)] || "application/octet-stream" });
    if (request.method === "HEAD") response.end();
    else stream.pipe(response);
  });
});

server.listen(port, "0.0.0.0", () => log({ event: "server_started", port }));

function shutdown(signal) {
  log({ event: "server_stopping", signal });
  server.close(() => process.exit(0));
}
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
