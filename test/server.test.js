import assert from "node:assert/strict";
import { test } from "node:test";

test("server source uses the expected health and metrics contracts", async () => {
  const source = await (await import("node:fs/promises")).readFile("server.js", "utf8");
  assert.match(source, /route === "\/health"/);
  assert.match(source, /aurea_http_requests_total/);
});
