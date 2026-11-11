/* Modern Top Navigation - runs right after the menu markup, before the first paint */
(() => {
  const nav = document.getElementById("t_MenuNav"), body = document.body, OWN = /^(ns-(?!Bar-)|js-(tabLike|menu-callout|showSubMenuIcons))/;
  // Navigation Studio designer preview: #ns=<template options>
  const look = () => {
    const m = /[#&]ns=([^&]*)/.exec(location.hash);
    let want;
    try { want = m && decodeURIComponent(m[1]).split(/[\s,+]+/); } catch (e) { /* a damaged link: keep the page's own look */ }
    if (want) {
      [...nav.classList].forEach(c => OWN.test(c) && nav.classList.remove(c));
      want.forEach(c => OWN.test(c) && nav.classList.add(c));
      [...body.classList].forEach(c => /^ns-(?!Bar-|TopNav$)/.test(c) && body.classList.remove(c));
    }
    body.classList.add("ns-TopNav");
    nav.classList.forEach(c => c.startsWith("ns-") && body.classList.add(c));
  };
  look();
  window.addEventListener("hashchange", look);
  // badges: "Inbox [12]" - remembered before the menu bar is drawn, then shown by the template's JavaScript
  window.nsTopBadges = [...nav.querySelectorAll(":scope > ul > li > a")].map(a => {
    const m = /\s*\[(.*?)\]\s*$/.exec(a.textContent);
    if (m) { a.textContent = a.textContent.slice(0, m.index); }
    return m ? m[1] : "";
  });
})();
