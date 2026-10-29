// node shot.cjs <url> <out.png> [width] [height] [actions-json]
const { chromium } = require("playwright");
(async () => {
  const [url, out, w = 1366, h = 768, act] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = [];
  p.on("console", m => { if (m.type() === "error" || m.type() === "warning") errs.push(m.type() + ": " + m.text()); });
  p.on("pageerror", e => errs.push("pageerror: " + e.message));
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(800);
  if (act) for (const a of JSON.parse(act)) { if (a.click) await p.click(a.click); if (a.hover) await p.hover(a.hover); if (a.eval) await p.evaluate(a.eval); await p.waitForTimeout(a.wait || 500); }
  await p.screenshot({ path: out });
  const info = await p.evaluate(() => ({ body: document.body.className, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(JSON.stringify(info)); errs.forEach(e => console.log(e));
  await b.close();
})();
