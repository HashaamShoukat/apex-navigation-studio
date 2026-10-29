// README images: designer.png, gallery-page.png, gallery-1/2.png, phones.png: node qa/docs-images.cjs
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../docs/images");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto("http://localhost:8642/designer-doc.html#look=" + encodeURIComponent(PRESETS[2].nav) + "&bar=" + encodeURIComponent(PRESETS[2].bar) + "&pos=side&st=expanded");
  await p.waitForTimeout(2500); await p.screenshot({ path: path.join(OUT, "designer.png") });
  await p.goto("http://localhost:8642/gallery-doc.html"); await p.waitForTimeout(1500); await p.screenshot({ path: path.join(OUT, "gallery-page.png") }); await p.close();
  // thumbnail sheets
  const dir = path.join(__dirname, "../apexlang/shared-components/static-files/gallery");
  for (const [n, list] of [[1, PRESETS.slice(0, 12)], [2, PRESETS.slice(12)]]) {
    fs.writeFileSync(path.join(__dirname, "out/gs.html"), `<body style="margin:0;background:#f4f5f8;font:600 15px system-ui;color:#1f2328"><div style="display:grid;grid-template-columns:repeat(4,400px);gap:18px;padding:18px">` +
      list.map(x => `<div><img src="file://${dir}/${x.id}.jpg" style="display:block;width:400px;border-radius:10px;box-shadow:0 6px 18px -8px rgba(15,23,42,.35)"><div style="padding:8px 2px 0">${x.name}</div></div>`).join("") + "</div>");
    p = await b.newPage({ viewport: { width: 1690, height: 400 } }); await p.goto("file://" + path.join(__dirname, "out/gs.html")); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `gallery-${n}.png`), fullPage: true }); await p.close();
  }
  // phones: closed with the bottom bar, open menu, search, top menu
  const shots = [["side", "ns-Design--floating ns-Accent--ocean", "", ""], ["side", "ns-Design--midnight ns-Accent--violet", "ns-Bar--icons", "open"], ["side", "ns-Design--gradient ns-Accent--rose", "ns-Bar--pills", "open"],
                 ["side", "ns-Design--clean ns-Accent--emerald", "", "search"], ["side", "ns-Design--editorial", "", "open"], ["top", "ns-Top--gradient ns-Accent--indigo", "", ""]];
  const files = [];
  for (const [i, [pos, cls, barc, act]] of shots.entries()) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const pg = await ctx.newPage();
    const nav = (pos === "top" ? "js-tabLike " : "js-navCollapsed--default ns-Fx--tips ns-Fx--search ns-Fx--tabbar ") + cls;
    await pg.goto(`http://localhost:8642/${pos}.html#ns=${encodeURIComponent(nav)}&nb=${encodeURIComponent("ns-Bar--avatar ns-Bar--search " + barc)}`); await pg.waitForTimeout(900);
    if (act) { await pg.click("#t_Button_navControl"); await pg.waitForTimeout(600); }
    if (act === "search") { await pg.click(".ns-Search input"); await pg.keyboard.type("re"); await pg.waitForTimeout(400); }
    const f = path.join(__dirname, `out/phone${i}.png`); await pg.screenshot({ path: f }); files.push(f); await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, "out/ph.html"), `<body style="margin:0;background:#f4f5f8"><div style="display:flex;gap:28px;padding:28px">` +
    files.map(f => `<img src="file://${f}" style="width:390px;border-radius:34px;box-shadow:0 0 0 10px #1f2329,0 24px 48px -16px rgba(0,0,0,.45)">`).join("") + "</div>");
  p = await b.newPage({ viewport: { width: 6 * 418 + 28, height: 900 } }); await p.goto("file://" + path.join(__dirname, "out/ph.html")); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT, "phones.png"), fullPage: true });
  await b.close(); console.log("docs images written");
})();
