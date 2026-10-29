// preview.gif frames: node qa/gif.cjs  (then qa/gif.py assembles them)
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
(async () => {
  const D = "js-navCollapsed--default ns-Fx--tips ns-Fx--search ns-Fx--tabbar ";
  const F = [
    ["side-sub", D + "ns-Accent--indigo", "", "expanded"], ["side-sub", D + "ns-Design--inset ns-Accent--violet", "ns-Bar--segmented", "expanded"],
    ["side-sub", D + "ns-Design--floating ns-Accent--ocean", "ns-Bar--pills", "expanded"], ["side-sub", D + "ns-Design--midnight ns-Accent--violet", "ns-Bar--icons", "expanded"],
    ["side", D + "ns-Design--midnight ns-Accent--violet", "ns-Bar--icons", "collapsed", "hover"], ["side", D + "ns-Design--rail ns-Accent--emerald", "ns-Bar--icons", "collapsed"],
    ["side-sub", D + "ns-Design--gradient ns-Accent--indigo", "", "expanded"], ["side", D + "ns-Design--glass ns-Accent--violet", "ns-Bar--pills", "expanded", "search"],
    ["side-sub", D + "ns-Design--soft ns-Accent--indigo", "", "expanded"], ["side-sub", D + "ns-Design--bold ns-Accent--amber", "ns-Bar--outline ns-Bar--badgeRed", "expanded"],
    ["side-sub", D + "ns-Design--outline ns-Accent--emerald", "", "expanded"], ["side-sub", D + "ns-Design--editorial", "ns-Bar--icons", "expanded"],
    ["side-sub", D + "ns-Design--terminal", "ns-Bar--badgeDot", "expanded"], ["side-sub", D + "ns-Design--inset ns-Accent--emerald ns-Scheme--dark", "ns-Bar--segmented", "expanded"],
    ["top", "js-tabLike ns-Top--pills ns-Accent--rose", "ns-Bar--pills", ""], ["top", "js-tabLike ns-Top--gradient ns-Accent--ocean", "", ""], ["top", "js-tabLike ns-Top--midnight ns-Accent--violet", "", ""]
  ];
  const b = await chromium.launch(); const dir = path.join(__dirname, "out/gif"); fs.mkdirSync(dir, { recursive: true });
  for (const [i, [pg, ns, nb, st, act]] of F.entries()) {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(`http://localhost:8642/${pg}.html#ns=${encodeURIComponent(ns)}&nb=${encodeURIComponent("ns-Bar--avatar ns-Bar--search " + nb)}${st ? "&nsx=" + st : ""}`); await p.waitForTimeout(900);
    if (act === "hover") { await p.hover("#t_TreeNav_1 .a-TreeView-content"); await p.waitForTimeout(400); }
    if (act === "search") { await p.click(".ns-Search input"); await p.keyboard.type("rep"); await p.waitForTimeout(400); }
    await p.screenshot({ path: path.join(dir, String(i).padStart(2, "0") + ".png") }); await p.close();
  }
  await b.close(); console.log(F.length, "frames");
})();
