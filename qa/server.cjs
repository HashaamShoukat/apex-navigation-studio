// Harness server: static files from qa/www (with /i -> APEX images) and APEX-style f?p=APP:PAGE:SESSION URLs mapped to harness pages.
// node qa/server.cjs [port]
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "www"), port = +process.argv[2] || 8642;
const PAGES = { "DEMO-DASHBOARD": "side.html", "DEMO-TOP-NAV": "top.html", DESIGNER: "designer.html", HOME: "gallery.html", "1": "gallery.html" };
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".gif": "image/gif" };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let file = u.pathname;
  if (file === "/f" && u.searchParams.get("p")) { file = "/" + (PAGES[u.searchParams.get("p").split(":")[1]] || "side.html"); }
  if (file.startsWith("/gallery/")) { file = "/../../apexlang/shared-components/static-files" + file; }
  const full = path.join(ROOT, decodeURIComponent(file));
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(full)] || "application/octet-stream" }); res.end(data);
  });
}).listen(port, () => console.log("harness on http://localhost:" + port));
