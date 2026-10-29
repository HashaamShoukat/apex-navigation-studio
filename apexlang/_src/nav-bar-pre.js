/* Modern Navigation Bar - Navigation Studio designer preview: #nb=<template options> */
(() => {
  const ul = document.currentScript.previousElementSibling, R = /^(ns-(Bar|Accent)-|js-menu)/;
  const look = () => {
    const m = /[#&]nb=([^&]*)/.exec(location.hash);
    if (!m || !ul) { return; }
    [...ul.classList].forEach(c => R.test(c) && ul.classList.remove(c));
    decodeURIComponent(m[1]).split(/[\s,+]+/).forEach(c => R.test(c) && ul.classList.add(c));
  };
  look();
  window.addEventListener("hashchange", look);
})();
