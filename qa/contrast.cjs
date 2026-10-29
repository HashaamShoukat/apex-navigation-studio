// Contrast audit: every design x accent x scheme, every visible text in the menu and header >= 4.5:1 (3:1 for large text, icons not checked)
// node qa/contrast.cjs side|top
const { chromium } = require("playwright");
const SIDE = ["", "inset", "floating", "midnight", "rail", "gradient", "glass", "soft", "bold", "outline", "editorial", "terminal"].map(d => d && "ns-Design--" + d);
const TOP = ["", "pills", "segmented", "midnight", "gradient", "glass"].map(d => d && "ns-Top--" + d);
const ACC = ["", "ocean", "indigo", "violet", "emerald", "rose", "amber", "slate", "wine", "tangerine", "cyan"].map(a => a && "ns-Accent--" + a);
(async () => {
  const kind = process.argv[2] || "side";
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  await p.goto(`http://localhost:8642/${kind === "top" ? "top.html" : "side-sub.html"}#ns=js-navCollapsed--default+ns-Fx--search&nsx=expanded&nb=ns-Bar--avatar+ns-Bar--search`);
  await p.waitForTimeout(900);
  await p.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  const fails = {};
  let n = 0;
  for (const d of kind === "top" ? TOP : SIDE) for (const a of ACC) for (const s of ["", "ns-Scheme--dark"]) {
    const cls = [kind === "top" ? "js-tabLike" : "js-navCollapsed--default ns-Fx--search", d, a, s].filter(Boolean).join(" ");
    await p.evaluate(h => { location.hash = h; }, "ns=" + encodeURIComponent(cls) + "&nsx=expanded&nb=ns-Bar--avatar+ns-Bar--search");
    await p.waitForTimeout(120);
    const res = await p.evaluate(() => {
      const parse = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const v = m.map(Number); if (/^color\(srgb/.test(c)) return [v[0] * 255, v[1] * 255, v[2] * 255, v[3] ?? 1]; return [v[0], v[1], v[2], v[3] ?? 1]; };
      const lum = ([r, g, b]) => { const f = x => (x /= 255) <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
      const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
      const colorsIn = img => (img.match(/(rgba?|color)\([^)]*\)/g) || []).map(parse).filter(Boolean);
      // background candidates (worst case for gradients)
      const bgs = el => {
        // layers from the element down to the root; the TreeView paints fills on the sibling .a-TreeView-row
        const layers = [];
        for (let e = el; e; e = e.parentElement) {
          const add = x => { const cs = getComputedStyle(x), bc = parse(cs.backgroundColor), gi = /url\(/.test(cs.backgroundImage) ? [] : colorsIn(cs.backgroundImage);
            if (gi.length) layers.push(gi); if (bc && bc[3] > 0) layers.push([bc]); };
          add(e);
          if (e.classList && e.classList.contains("a-TreeView-content")) { const row = e.parentElement.querySelector(":scope > .a-TreeView-row"); if (row) add(row); }
        }
        let set = [[255, 255, 255, 1]];
        for (const l of layers.reverse()) set = set.flatMap(c => l.map(g => over(g, c)));
        return set;
      };
      const out = [];
      const sel = ".t-Body-nav .a-TreeView-label, .t-Body-nav [data-ns-section], .t-Body-nav .a-TreeView-badge, .ns-Search input, .t-Header .t-Header-logo-link, .t-Header .t-Button-label, .t-Header .t-Button-badge, .ns-Avatar, .t-Header-nav .a-MenuBar-label, .ns-TopBadge, .ns-Results a";
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(el).visibility === "hidden" || r.top > innerHeight) continue;
        const isSec = el.hasAttribute("data-ns-section");
        const cs = getComputedStyle(el, isSec ? "::before" : null);
        let fg = parse(cs.color); if (!fg || (el.tagName === "INPUT")) { fg = parse(getComputedStyle(el, "::placeholder").color) || fg; }
        if (!fg || !el.textContent.trim() && el.tagName !== "INPUT") continue;
        const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700, large = size >= 24 || (bold && size >= 18.66);
        const bgList = bgs(el.tagName === "INPUT" ? el : el);
        let worst = 99;
        for (const bg of bgList) { const f = fg[3] < 1 ? over(fg, bg) : fg; const L1 = lum(f), L2 = lum(bg); worst = Math.min(worst, (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05)); }
        const need = large ? 3 : 4.5;
        if (worst < need) out.push((isSec ? "section:" + el.getAttribute("data-ns-section") : (el.className + "").split(" ")[0] + ":" + (el.value || el.placeholder || el.textContent).trim().slice(0, 14)) + " " + worst.toFixed(2));
      }
      return out;
    });
    n++;
    if (res.length) fails[cls] = res;
  }
  for (const [k, v] of Object.entries(fails)) console.log(k, "=>", [...new Set(v)].join(" | "));
  console.log(n, "combinations,", Object.keys(fails).length, "with failures");
  await b.close();
})();
