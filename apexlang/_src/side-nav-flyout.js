/* Modern Side Navigation - Sub-menus: Flyout. Sub-levels open in a panel beside the menu instead of expanding in place.
   Pointer: hover opens it (with a short delay); touch: tap the arrow; keyboard: Right arrow (Left in RTL) opens it and moves
   into it, Up / Down move, Left / Escape close it. Phones (< 640px) keep expanding in place. Plain JavaScript: it runs from
   "Before List Entries" and reads the menu through the TreeView widget when the panel opens. */
(() => {
  const d = document, add = (t, f) => d.addEventListener(t, f, true),
        on = () => d.body.classList.contains("ns-Sub--flyout") && matchMedia("(min-width: 640px)").matches,
        rtl = el => getComputedStyle(el).direction === "rtl",
        strip = s => s.replace(/\s*\[.*?\]\s*$/, "");
  let box, owner, timer;
  const parentOf = t => {
    const li = t.closest && t.closest("#t_TreeNav .a-TreeView-node--topLevel");
    return li && li.matches(".is-expandable, .is-collapsible") ? li : null;
  };
  const close = back => {
    clearTimeout(timer);
    if (box) { box.hidden = true; }
    if (back && owner) { owner.querySelector(".a-TreeView-label").focus(); }
    owner = null;
  };
  const open = (li, focus) => {
    clearTimeout(timer);
    const $ = apex.jQuery, esc = apex.util.escapeHTML, nav$ = $("#t_TreeNav"), a = nav$.treeView("getNodeAdapter"),
          node = nav$.treeView("getNodes", $(li).children(".a-TreeView-content"))[0], cur = nav$.treeView("getSelectedNodes")[0];
    if (!node || !a.childCount(node)) { return; }
    if (!box) {
      box = d.createElement("div");
      box.className = "ns-Flyout";
      box.setAttribute("role", "group");
      d.body.append(box);
    }
    let h = "";
    const walk = (n, l) => {
      for (let i = 0; i < a.childCount(n); i++) {
        const c = a.child(n, i);
        h += '<a href="' + esc(a.getLink(c) || "#") + '" style="--l:' + l + '"' + (c === cur ? ' aria-current="page"' : "") + ">" + esc(strip(a.getLabel(c))) + "</a>";
        walk(c, l + 1);
      }
    };
    walk(node, 0);
    const title = strip(a.getLabel(node));
    box.setAttribute("aria-label", title);
    box.innerHTML = "<p>" + esc(title) + "</p>" + h;
    box.hidden = false;
    owner = li;
    const r = li.querySelector(".a-TreeView-row").getBoundingClientRect(), m = d.getElementById("t_Body_nav").getBoundingClientRect();
    box.style.top = Math.max(8, Math.min(r.top - 6, innerHeight - box.offsetHeight - 8)) + "px";
    box.style.left = (rtl(li) ? m.left - box.offsetWidth - 6 : m.right + 6) + "px";
    if (focus) { box.querySelector("a").focus(); }
  };
  // pointer
  add("mouseover", e => {
    if (!on()) { return; }
    if (box && box.contains(e.target)) { clearTimeout(timer); return; }
    const li = parentOf(e.target);
    clearTimeout(timer);
    if (li) { if (li !== owner) { timer = setTimeout(() => open(li), owner ? 60 : 160); } }
    else if (owner) { timer = setTimeout(() => close(), 300); }
  });
  // touch and mouse: the arrow opens the panel; a click outside closes it
  const arrow = e => {
    if (!on()) { return; }
    const t = e.target.closest && e.target.closest("#t_TreeNav .a-TreeView-node--topLevel > .a-TreeView-toggle");
    if (t) {
      e.preventDefault(); e.stopPropagation();
      if (e.type === "click") { const li = t.parentElement; owner === li ? close() : open(li); }
    } else if (e.type === "click" && owner && !box.contains(e.target)) { close(); }
  };
  add("mousedown", arrow);
  add("click", arrow);
  // keyboard
  add("keydown", e => {
    if (!on()) { return; }
    const li = parentOf(e.target), inBox = box && box.contains(e.target), dir = rtl(e.target) ? -1 : 1;
    const top = e.target.matches && e.target.matches("#t_TreeNav .a-TreeView-node--topLevel > .a-TreeView-content > .a-TreeView-label");
    if (li && top && e.key === (dir > 0 ? "ArrowRight" : "ArrowLeft")) {
      e.preventDefault(); e.stopPropagation(); open(li, true);
    } else if (top && /^(ArrowDown|ArrowUp|Home|End|ArrowLeft|ArrowRight)$/.test(e.key)) {
      // move between top-level entries only - the sub-levels live in the flyout
      e.preventDefault(); e.stopPropagation();
      const all = [...d.querySelectorAll("#t_TreeNav .a-TreeView-node--topLevel > .a-TreeView-content > .a-TreeView-label")], i = all.indexOf(e.target),
            n = { ArrowDown: all[i + 1], ArrowUp: all[i - 1], Home: all[0], End: all[all.length - 1] }[e.key];
      if (n) { e.target.tabIndex = -1; n.tabIndex = 0; n.focus(); }
    } else if (inBox) {
      const links = [...box.querySelectorAll("a")], i = links.indexOf(e.target);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); (links[i + (e.key === "ArrowDown" ? 1 : -1)] || links[e.key === "ArrowDown" ? 0 : links.length - 1]).focus(); }
      if (e.key === "Escape" || e.key === (dir > 0 ? "ArrowLeft" : "ArrowRight")) { e.preventDefault(); close(true); }
    }
  });
  add("focusout", e => { if (box && box.contains(e.target) && !box.contains(e.relatedTarget)) { close(); } });
  add("scroll", e => { if (owner && !(box && box.contains(e.target))) { close(); } });
  addEventListener("resize", () => close());
  // in-place expansion is off in this mode (CSS hides the sub-levels). The tab stop must not stay on a hidden entry
  // (the current page inside a folded parent): move it to the visible top-level parent. Nothing is collapsed, so the
  // current page stays selected.
  const stop = () => {
    const t = d.querySelector("#t_TreeNav .a-TreeView-label[tabindex='0']");
    if (on() && t && !t.closest(".a-TreeView-node--topLevel > .a-TreeView-content")) {
      t.tabIndex = -1;
      t.closest(".a-TreeView-node--topLevel").querySelector(".a-TreeView-label").tabIndex = 0;
    }
  };
  addEventListener("load", () => setTimeout(stop, 0));
})();
