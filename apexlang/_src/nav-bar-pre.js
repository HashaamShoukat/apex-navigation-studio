/* Modern Navigation Bar - Navigation Studio designer preview: #nb=<template options> */
(() => {
  const ul = document.currentScript.previousElementSibling, R = /^(ns-(Bar|Accent)-|js-menu)/;
  const look = () => {
    const m = /[#&]nb=([^&]*)/.exec(location.hash);
    if (!m || !ul) { return; }
    let want;
    try { want = decodeURIComponent(m[1]).split(/[\s,+]+/); } catch (e) { return; /* a damaged link: keep the bar's own look */ }
    [...ul.classList].forEach(c => R.test(c) && ul.classList.remove(c));
    want.forEach(c => R.test(c) && ul.classList.add(c));
  };
  look();
  window.addEventListener("hashchange", look);
})();
