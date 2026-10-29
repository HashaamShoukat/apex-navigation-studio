/* Modern Side Navigation - runs right after the menu markup, before the first paint (no jQuery here) */
(() => {
  const nav = document.getElementById("t_TreeNav"), body = document.body, d = document,
        OWN = /^(ns-(?!Bar-|Top-)|js-(navCollapsed--|defaultCollapsed|hideDefaultIcon))/,
        has = c => body.classList.contains(c);
  // Navigation Studio designer preview: #ns=<template options>&nsx=expanded|collapsed
  const look = first => {
    const m = /[#&]ns=([^&]*)/.exec(location.hash), x = /[#&]nsx=(\w+)/.exec(location.hash);
    if (m) {
      const want = decodeURIComponent(m[1]).split(/[\s,+]+/);
      [...nav.classList].forEach(c => OWN.test(c) && (first || c.startsWith("ns-")) && nav.classList.remove(c));
      want.forEach(c => OWN.test(c) && (first || c.startsWith("ns-")) && nav.classList.add(c));
      [...body.classList].forEach(c => /^ns-(?!Bar-|Top-|Nav$|HasSearch$|Searching$)/.test(c) && body.classList.remove(c));
      if (x && first) { sessionStorage.setItem("ORA_WWV_apex.toggleCore.nav.&APP_ID..preferenceForExpanded", x[1] === "expanded"); }
      if (x && !first && (x[1] === "expanded") !== has("js-navExpanded")) { d.getElementById("t_Button_navControl")?.click(); }
    }
    body.classList.add("ns-Nav");
    nav.classList.forEach(c => c.startsWith("ns-") && body.classList.add(c));
  };
  look(true);
  window.addEventListener("hashchange", () => look(false));
  // the search field is added now so nothing moves later
  if (has("ns-Fx--search")) {
    nav.insertAdjacentHTML("beforebegin", '<div class="ns-Search" role="search"><span class="fa fa-search" aria-hidden="true"></span><input type="search" autocomplete="off" spellcheck="false"><kbd></kbd></div><ul class="ns-Results" id="ns_results"></ul>');
  }
  // section headings (list entry attribute 3) - remembered here because the menu is drawn again by JavaScript
  window.nsSections = [...nav.querySelectorAll(":scope > ul > li")].map(li => li.getAttribute("data-section") || "");
  // tooltips on the collapsed rail
  const tip = d.createElement("div");
  tip.className = "ns-Tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true;
  body.append(tip);
  const show = e => {
    const li = e.target.closest(".a-TreeView-node--topLevel"), lab = li && li.querySelector(".a-TreeView-label");
    tip.hidden = !(lab && has("ns-Fx--tips") && has("js-navCollapsed") && !has("ns-Design--rail"));
    if (tip.hidden) { return; }
    const r = li.querySelector(".a-TreeView-row").getBoundingClientRect(), rtl = getComputedStyle(nav).direction === "rtl";
    tip.textContent = lab.childNodes[0].textContent.replace(/\s*\[.*?\]\s*$/, "").trim();
    tip.style.top = (r.top + r.height / 2 - tip.offsetHeight / 2) + "px";
    tip.style.left = (rtl ? r.left - tip.offsetWidth - 10 : r.right + 10) + "px";
  };
  const hide = () => { tip.hidden = true; };
  nav.addEventListener("mouseover", show); nav.addEventListener("focusin", show);
  nav.addEventListener("mouseleave", hide); nav.addEventListener("focusout", hide);
})();
