import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL(".", import.meta.url));
const allowed = new Set([
  "/index.html",
  "/src/app.js",
  "/src/model.js",
  "/src/ui.js",
  "/src/style.css",
]);
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname === "/") pathname = "/index.html";
    if (!allowed.has(pathname)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const data = await readFile(path.join(root, pathname));
    const type = pathname.endsWith(".js")
      ? "text/javascript"
      : pathname.endsWith(".css")
        ? "text/css"
        : "text/html";
    res.writeHead(200, {
      "Content-Type": type + "; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(Number(process.env.PORT || 4186), "127.0.0.1", () =>
  console.log("Ready on port " + (process.env.PORT || 4186)),
);
