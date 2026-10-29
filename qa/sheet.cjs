// Shoots a list of looks and states and assembles a contact sheet.
// node qa/sheet.cjs <jobs.json> <sheet.png> [columns]
// job: { name, page, ns, nsx, w, h, actions: [{click|hover|eval|key, wait}] }
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const [jobsFile, sheet, cols = 3] = process.argv.slice(2);
  const jobs = JSON.parse(fs.readFileSync(jobsFile, "utf8"));
  const dir = path.join(__dirname, "out", "shots"); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const report = [];
  for (const j of jobs) {
    const ctx = await b.newContext({ viewport: { width: j.w || 1366, height: j.h || 768 }, reducedMotion: j.reduced ? "reduce" : "no-preference", colorScheme: j.dark ? "dark" : "light" });
    const p = await ctx.newPage(); const errs = [];
    p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
    p.on("pageerror", e => errs.push(e.message));
    const hash = j.ns !== undefined ? "#ns=" + encodeURIComponent(j.ns) + (j.nsx ? "&nsx=" + j.nsx : "") : "";
    await p.goto("http://localhost:8642/" + (j.page || "side.html") + hash, { waitUntil: "load" });
    await p.waitForTimeout(700);
    for (const a of j.actions || []) {
      if (a.click) await p.click(a.click); if (a.hover) await p.hover(a.hover); if (a.key) await p.keyboard.press(a.key);
      if (a.type) await p.keyboard.type(a.type); if (a.eval) await p.evaluate(a.eval); await p.waitForTimeout(a.wait || 450);
    }
    const file = path.join(dir, j.name.replace(/[^\w-]+/g, "_") + ".png");
    await p.screenshot({ path: file });
    const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    report.push({ name: j.name, file, hscroll: m.sw > m.cw, errs });
    await ctx.close();
  }
  // contact sheet
  const html = `<html><body style="margin:0;background:#222;font:13px system-ui;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:8px">` +
    report.map(r => `<div><div style="padding:2px 0 4px">${r.name}${r.hscroll ? " <b style=color:#f66>H-SCROLL</b>" : ""}${r.errs.length ? " <b style=color:#f66>ERR</b>" : ""}</div><img src="file://${r.file}" style="width:100%;display:block"></div>`).join("") + "</div></body></html>";
  const hf = path.join(dir, "_sheet.html"); fs.writeFileSync(hf, html);
  const p = await b.newPage({ viewport: { width: 1800, height: 800 } });
  await p.goto("file://" + hf); await p.waitForTimeout(300);
  await p.screenshot({ path: sheet, fullPage: true });
  await b.close();
  report.forEach(r => (r.hscroll || r.errs.length) && console.log(r.name, r.hscroll ? "H-SCROLL" : "", r.errs.join(" | ")));
  console.log("sheet:", sheet, report.length, "shots");
})();
