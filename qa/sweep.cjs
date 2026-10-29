// QA sweep: every design on six screens. Checks: no horizontal scroll, menu button and current entry visible
// without scrolling, no console errors. Writes a contact sheet per screen size: node qa/sweep.cjs
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const SCREENS = [[1920, 1080], [1366, 768], [820, 1180], [1180, 820], [390, 844], [360, 640]];
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const looks = PRESETS.filter(p => !/ - /.test(p.name)).concat(PRESETS.filter(p => /^Top/.test(p.name)));
  const uniq = [...new Map(looks.map(p => [p.id, p])).values()];
  const b = await chromium.launch(); const dir = path.join(__dirname, "out", "sweep"); fs.mkdirSync(dir, { recursive: true });
  const problems = [];
  for (const [w, h] of SCREENS) {
    const files = [];
    for (const p of uniq) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); const errs = [];
      pg.on("pageerror", e => errs.push(e.message)); pg.on("console", m => m.type() === "error" && errs.push(m.text()));
      await pg.goto(`http://localhost:8642/${p.pos === "top" ? "top" : "side"}.html#ns=${encodeURIComponent(p.nav)}&nb=${encodeURIComponent(p.bar)}&nsx=${p.state}`); await pg.waitForTimeout(700);
      const m = await pg.evaluate(pos => {
        const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < innerWidth && r.right > 0 && getComputedStyle(el).visibility !== "hidden"; };
        const ctl = pos === "top" ? (document.querySelector("#t_MenuNav .a-Menu--current") || document.querySelector("#t_Button_navControl")) : document.querySelector("#t_Button_navControl");
        return { hs: document.documentElement.scrollWidth > innerWidth + 1, ctl: vis(ctl) || vis(document.querySelector("#t_Button_navControl")) };
      }, p.pos);
      if (m.hs || !m.ctl || errs.length) problems.push(`${w}x${h} ${p.id}: ${m.hs ? "H-SCROLL " : ""}${m.ctl ? "" : "MENU-CONTROL-HIDDEN "}${errs.join(" | ")}`);
      const f = path.join(dir, `${w}x${h}-${p.id}.png`); await pg.screenshot({ path: f }); files.push([f, p.name]); await ctx.close();
    }
    const cols = w < 900 ? 9 : 6, tw = w < 900 ? 200 : 300;
    fs.writeFileSync(path.join(dir, "s.html"), `<body style="margin:0;background:#111;color:#ddd;font:12px system-ui"><div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:8px;padding:8px">` +
      files.map(([f, n]) => `<div><img src="file://${f}" style="width:${tw}px;display:block">${n}</div>`).join("") + "</div>");
    const sp = await b.newPage({ viewport: { width: cols * (tw + 8) + 8, height: 300 } }); await sp.goto("file://" + path.join(dir, "s.html")); await sp.waitForTimeout(300);
    await sp.screenshot({ path: path.join(__dirname, "out", `sweep-${w}x${h}.png`), fullPage: true }); await sp.close();
  }
  await b.close();
  console.log(problems.length ? problems.join("\n") : "no problems", "\nlooks:", uniq.length, "screens:", SCREENS.length);
})();
