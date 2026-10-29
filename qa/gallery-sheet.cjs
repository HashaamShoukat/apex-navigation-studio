// Contact sheet of the gallery thumbnails: node qa/gallery-sheet.cjs <out.png> [cols] [from] [to]
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const [out, cols = 4, from = 0, to = 99] = process.argv.slice(2);
  const dir = path.join(__dirname, "../apexlang/shared-components/static-files/gallery");
  const list = PRESETS.slice(+from, +to);
  const html = `<body style="margin:0;background:#111;font:600 15px system-ui;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},640px);gap:14px;padding:14px">` +
    list.map(p => `<div><img src="file://${dir}/${p.id}.jpg" style="display:block;border-radius:8px"><div style="padding:6px 2px">${p.name}</div></div>`).join("") + "</div>";
  fs.writeFileSync(path.join(__dirname, "out/gs.html"), html);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: cols * 654 + 14, height: 400 } });
  await pg.goto("file://" + path.join(__dirname, "out/gs.html")); await pg.waitForTimeout(300);
  await pg.screenshot({ path: out, fullPage: true }); await b.close();
})();
