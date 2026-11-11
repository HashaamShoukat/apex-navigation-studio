// Harness server: static files from qa/www (with /i -> APEX images) and APEX-style f?p=APP:PAGE:SESSION URLs mapped to harness pages.
// node qa/server.cjs [port]
// Local only: it listens on 127.0.0.1 and serves nothing outside qa/www and the gallery thumbnails.
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "www"), port = +process.argv[2] || 8642;
const GALLERY = path.join(__dirname, "..", "apexlang", "shared-components", "static-files", "gallery");
const PAGES = { "DEMO-DASHBOARD": "side.html", "DEMO-TOP-NAV": "top.html", DESIGNER: "designer.html", HOME: "gallery.html", "1": "gallery.html" };
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".gif": "image/gif" };
// the file a request path stands for, or null when it is damaged or points outside its folder
// (path.resolve does not follow links, so qa/www/i may still be a link to the APEX images)
function resolve(urlPath) {
  let file;
  try { file = decodeURIComponent(urlPath); } catch (e) { return null; }
  if (file.includes("\0")) { return null; }
  const gallery = file.startsWith("/gallery/"), base = gallery ? GALLERY : ROOT,
        full = path.resolve(base, "." + (gallery ? file.slice("/gallery".length) : file)), rel = path.relative(base, full);
  return rel.startsWith("..") || path.isAbsolute(rel) ? null : full;
}
const server = http.createServer((req, res) => {
  let u;
  try { u = new URL(req.url, "http://x"); } catch (e) { res.writeHead(400); res.end("bad request"); return; }
  let file = u.pathname;
  if (file === "/f" && u.searchParams.get("p")) { file = "/" + (PAGES[u.searchParams.get("p").split(":")[1]] || "side.html"); }
  const full = resolve(file);
  if (!full) { res.writeHead(400); res.end("bad request"); return; }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(full)] || "application/octet-stream" }); res.end(data);
  });
});
if (require.main === module) { server.listen(port, "127.0.0.1", () => console.log("harness on http://localhost:" + port)); }
module.exports = { resolve, server };
