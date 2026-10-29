// Sub-menus: Flyout - pointer, keyboard, tap, RTL, phone: node qa/flyout-test.cjs
const { chromium } = require("playwright");
const D = "js-navCollapsed--default+ns-Fx--tips+ns-Fx--search+ns-Sub--flyout";
(async () => {
  const b = await chromium.launch(); const errs = []; const shots = [];
  const page = async (url, w = 1366, h = 768) => { const p = await b.newPage({ viewport: { width: w, height: h } }); p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text())); await p.goto("http://localhost:8642/" + url); await p.waitForTimeout(900); return p; };
  const box = p => p.evaluate(() => { const f = document.querySelector(".ns-Flyout"); if (!f || f.hidden) return "closed"; const r = f.getBoundingClientRect(); return `open "${f.querySelector("p").textContent}" ${f.querySelectorAll("a").length} links at x=${Math.round(r.left)} focus=${f.contains(document.activeElement) ? document.activeElement.textContent.trim() : "-"}`; });
  // 1 hover, expanded, current page inside Reports
  let p = await page("side-sub.html#ns=" + D + "+ns-Accent--indigo&nsx=expanded");
  console.log("inline sub-levels hidden:", await p.evaluate(() => getComputedStyle(document.querySelector("#t_TreeNav_9 > ul") || document.body).display));
  await p.hover("#t_TreeNav_9 .a-TreeView-content"); await p.waitForTimeout(500); console.log("hover Reports:", await box(p));
  await p.screenshot({ path: __dirname + "/out/fly1.png", clip: { x: 0, y: 0, width: 620, height: 768 } });
  await p.mouse.move(900, 400); await p.waitForTimeout(600); console.log("mouse away:", await box(p));
  // keyboard
  console.log("tab stop:", await p.evaluate(() => [...document.querySelectorAll("#t_TreeNav .a-TreeView-label[tabindex='0']")].map(a => a.textContent.trim() + (a.offsetParent ? "" : " (HIDDEN)")).join(",")));
  console.log("page focus after load:", await p.evaluate(() => document.activeElement.tagName + "." + document.activeElement.className));
  console.log("current highlighted in panel:", await (async () => { await p.hover("#t_TreeNav_9 .a-TreeView-content"); await p.waitForTimeout(400); return p.evaluate(() => (document.querySelector(".ns-Flyout [aria-current]") || {}).textContent); })());
  await p.mouse.move(900, 400); await p.waitForTimeout(500);
  await p.focus("#t_TreeNav .a-TreeView-label[tabindex='0']");
  await p.keyboard.press("ArrowUp"); console.log("ArrowUp from Reports ->", await p.evaluate(() => document.activeElement.textContent.trim()));
  await p.keyboard.press("ArrowDown");
  console.log("focused:", await p.evaluate(() => document.activeElement.textContent.trim()));
  await p.keyboard.press("ArrowRight"); await p.waitForTimeout(200); console.log("Right:", await box(p));
  await p.keyboard.press("ArrowDown"); await p.keyboard.press("ArrowDown"); console.log("Down x2:", await box(p));
  await p.keyboard.press("Escape"); await p.waitForTimeout(200); console.log("Escape:", await box(p));
  await p.close();
  // 2 collapsed rail, hover
  p = await page("side.html#ns=" + D + "+ns-Design--midnight+ns-Accent--violet&nsx=collapsed");
  await p.hover("#t_TreeNav_3 .a-TreeView-content"); await p.waitForTimeout(500); console.log("rail hover Projects:", await box(p), "| nav still collapsed:", await p.evaluate(() => document.body.classList.contains("js-navCollapsed")));
  await p.screenshot({ path: __dirname + "/out/fly2.png", clip: { x: 0, y: 0, width: 620, height: 500 } }); await p.close();
  // 3 tap on the arrow
  p = await page("side.html#ns=" + D + "+ns-Design--floating+ns-Accent--ocean&nsx=expanded");
  await p.evaluate(() => document.querySelector("#t_TreeNav_3 > .a-TreeView-toggle").dispatchEvent(new MouseEvent("click", { bubbles: true })));
  await p.waitForTimeout(300); console.log("tap arrow:", await box(p)); await p.close();
  // 4 RTL
  p = await page("side-sub-rtl.html#ns=" + D + "+ns-Accent--rose&nsx=expanded");
  await p.hover("#t_TreeNav_9 .a-TreeView-content"); await p.waitForTimeout(500); console.log("RTL hover:", await box(p));
  await p.screenshot({ path: __dirname + "/out/fly3.png", clip: { x: 746, y: 0, width: 620, height: 768 } }); await p.close();
  // 5 phone: expands in place
  p = await page("side.html#ns=" + D + "+ns-Accent--indigo", 390, 844);
  await p.click("#t_Button_navControl"); await p.waitForTimeout(500);
  await p.click("#t_TreeNav_3 > .a-TreeView-toggle"); await p.waitForTimeout(400);
  console.log("phone tap arrow:", await box(p), "| expanded in place:", await p.evaluate(() => { const u = document.querySelector("#t_TreeNav_3 > ul"); return !!u && getComputedStyle(u).display !== "none"; }));
  await p.close();
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
