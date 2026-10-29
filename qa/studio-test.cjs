// Drives the mock Gallery and Designer: node qa/studio-test.cjs
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:8642/gallery.html"); await p.waitForTimeout(800);
  const cards = await p.$$eval(".nvs-Card", c => c.length);
  const imgs = await p.$$eval(".nvs-Card img", i => i.filter(x => x.naturalWidth > 0).length);
  await p.click('.nvs-Filter [data-f="top"]'); const shown = await p.$$eval(".nvs-Card:not([hidden])", c => c.length);
  console.log("gallery cards", cards, "images loaded", imgs, "top filter shows", shown);
  await p.screenshot({ path: __dirname + "/out/mock-gallery.png" });
  // Customize on a top preset -> designer with #look
  const href = await p.$eval('.nvs-Card:not([hidden]) .t-Button--hot', a => a.getAttribute("href"));
  console.log("customize ->", href.slice(0, 120));
  await p.goto("http://localhost:8642/" + href.replace(/^f\?p=100:DESIGNER:1/, "designer.html")); await p.waitForTimeout(2000);
  const st = () => p.evaluate(() => ({ pos: $v("P2_POSITION"), topDesign: $v("P2_TOP_DESIGN"), accent: $v("P2_ACCENT"), src: document.getElementById("nvd-frame").getAttribute("src"),
    code: document.getElementById("nvd-code").textContent, sideHidden: !$("#P2_DESIGN_CONTAINER").is(":visible") }));
  console.log("designer from gallery:", JSON.stringify(await st()));
  await p.screenshot({ path: __dirname + "/out/mock-designer-top.png" });
  // switch to side, midnight -> scheme disabled; collapsed state
  await p.selectOption("#P2_POSITION", "SIDE"); await p.waitForTimeout(1500);
  await p.selectOption("#P2_DESIGN", "ns-Design--midnight"); await p.waitForTimeout(800);
  console.log("scheme disabled for midnight:", await p.evaluate(() => $("#P2_SCHEME").prop("disabled") + " / " + $("#P2_SCHEME_CONTAINER").attr("data-why")));
  await p.selectOption("#P2_STATE", "COLLAPSED"); await p.waitForTimeout(1200);
  const frameBody = await p.frame({ url: /DEMO-DASHBOARD/ }).evaluate(() => document.body.className);
  console.log("iframe body:", frameBody.split(" ").filter(c => /^ns-|js-nav/.test(c)).join(" "));
  await p.selectOption("#P2_SEARCH", "N"); await p.waitForTimeout(600);
  console.log("bar search disabled when menu search off:", await p.evaluate(() => $("#P2_BAR_SEARCH").prop("disabled")));
  await p.selectOption("#P2_COLLAPSE", "js-navCollapsed--hidden"); await p.waitForTimeout(2000);
  const fb2 = await p.frame({ url: /DEMO-DASHBOARD/ }).evaluate(() => document.body.className);
  console.log("after Hidden collapse mode (reload):", fb2.split(" ").filter(c => /js-nav/.test(c)).join(" "));
  console.log("code:\n" + (await st()).code);
  await p.selectOption("#P2_DEVICE", "PHONE"); await p.waitForTimeout(800);
  await p.screenshot({ path: __dirname + "/out/mock-designer-side.png" });
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
