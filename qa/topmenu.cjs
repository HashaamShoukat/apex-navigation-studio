const { chromium } = require("playwright");
(async () => {
  const [page = "top.html", hash = "#ns=js-tabLike+ns-Accent--indigo"] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 700 } }); const errs = [];
  p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:8642/" + page + hash); await p.waitForTimeout(900);
  const vis = () => p.evaluate(() => [...document.querySelectorAll(".a-Menu")].filter(m => m.offsetParent && getComputedStyle(m).display !== "none").map(m => m.id + ":" + m.querySelectorAll(".a-Menu-item").length));
  console.log("split buttons:", await p.$$eval(".a-Menu-subMenuCol", e => e.length), "menus in DOM:", await p.$$eval(".a-Menu", e => e.map(m => m.id).join(",")));
  await p.click("#t_MenuNav_3isb"); await p.waitForTimeout(500);
  console.log("after arrow click:", await vis());
  await p.screenshot({ path: __dirname + "/out/topmenu.png", clip: { x: 0, y: 0, width: 700, height: 360 } });
  await p.keyboard.press("Escape"); await p.focus("#t_MenuNav_3i"); await p.keyboard.press("ArrowDown"); await p.waitForTimeout(500);
  console.log("after ArrowDown on label:", await vis());
  console.log("errors:", errs);
  await b.close();
})();
