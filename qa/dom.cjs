const { chromium } = require("playwright");
(async () => {
  const [url, sel, w = 1366] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 800 } });
  await p.goto(url); await p.waitForTimeout(800);
  console.log(await p.evaluate(s => { const e = document.querySelector(s); return e ? e.outerHTML.replace(/></g, ">\n<").slice(0, 6000) : "none"; }, sel));
  await b.close();
})();
