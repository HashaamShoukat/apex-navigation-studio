// node qa/zoom.cjs <out.png> <w> <h> <clipW> <clipH> <cols> <job hash>... : shots clipped to the top-left (nav + header) side by side
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
(async () => {
  const [out, w, h, cw, ch, cols, ...jobs] = process.argv.slice(2);
  const b = await chromium.launch(); const files = [];
  for (const [i, j] of jobs.entries()) {
    const [page, hash, act] = j.split("|");
    const p = await b.newPage({ viewport: { width: +w, height: +h } });
    await p.goto("http://localhost:8642/" + page + hash); await p.waitForTimeout(700);
    if (act) { for (const a of act.split(";")) { const [k, v] = a.split("="); if (k === "hover") await p.hover(v); if (k === "click") await p.click(v); if (k === "key") await p.keyboard.press(v); if (k === "type") await p.keyboard.type(v); await p.waitForTimeout(400); } }
    const f = path.join(__dirname, "out", "z" + i + ".png"); await p.screenshot({ path: f, clip: { x: 0, y: 0, width: +cw, height: +ch } }); files.push([f, hash]); await p.close();
  }
  const html = `<body style="margin:0;background:#333"><div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px;padding:6px">` + files.map(([f]) => `<img src="file://${f}">`).join("") + "</div>";
  fs.writeFileSync(path.join(__dirname, "out", "z.html"), html);
  const p = await b.newPage({ viewport: { width: cols * (+cw + 6) + 6, height: 400 } }); await p.goto("file://" + path.join(__dirname, "out", "z.html")); await p.waitForTimeout(200);
  await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
