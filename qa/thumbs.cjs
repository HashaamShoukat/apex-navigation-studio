// Gallery thumbnails: every preset shot at full size on the demo page, shrunk in a canvas to 640x400 JPEG.
// node qa/thumbs.cjs   (harness server on :8642, see qa/README.md)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const outDir = path.join(__dirname, "../apexlang/shared-components/static-files/gallery");
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const shrink = await b.newPage();
  for (const p of PRESETS) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    const url = `http://localhost:8642/${p.pos === "top" ? "top" : "side"}.html#ns=${encodeURIComponent(p.nav)}&nb=${encodeURIComponent(p.bar)}&nsx=${p.state}`;
    await pg.goto(url); await pg.waitForTimeout(900);
    // a Flyout preset shows its panel open
    if (/flyout/.test(p.tags)) { await pg.hover(p.state === "collapsed" ? "#t_TreeNav_3 .a-TreeView-content" : "#t_TreeNav_9 .a-TreeView-content"); await pg.waitForTimeout(500); }
    const png = await pg.screenshot();
    await ctx.close();
    const jpg = await shrink.evaluate(async b64 => {
      const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
      const c = document.createElement("canvas"); c.width = 640; c.height = 400;
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, 640, 400);
      return c.toDataURL("image/jpeg", 0.86).split(",")[1];
    }, png.toString("base64"));
    fs.writeFileSync(path.join(outDir, p.id + ".jpg"), Buffer.from(jpg, "base64"));
  }
  await b.close();
  console.log(PRESETS.length, "thumbnails written");
})();
