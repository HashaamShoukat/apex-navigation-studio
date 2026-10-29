// node qa/clip.cjs <url> <out> <w> <h> x y cw ch [actions]
const { chromium } = require("playwright");
(async () => {
  const [url, out, w, h, x, y, cw, ch, act] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  await p.goto(url); await p.waitForTimeout(800);
  if (act) for (const a of act.split(";")) { const [k, v] = a.split("="); if (k === "hover") await p.hover(v); if (k === "click") await p.click(v); if (k === "key") await p.keyboard.press(v); await p.waitForTimeout(400); }
  await p.screenshot({ path: out, clip: { x: +x, y: +y, width: +cw, height: +ch } }); await b.close();
})();
