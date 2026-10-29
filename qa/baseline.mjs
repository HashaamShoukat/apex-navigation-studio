// Baseline: Universal Theme's own Side Navigation Menu + Navigation Bar, rendered by the harness.
import fs from "node:fs";
import { renderPage, utList } from "./render.mjs";
const side = utList("side-navigation-menu"), bar = utList("navigation-bar"), top = utList("top-navigation-menu");
fs.writeFileSync(new URL("www/ut-side.html", import.meta.url), renderPage({ side, bar, sideClasses: ["t-TreeNav--styleA", "js-navCollapsed--default"] }));
fs.writeFileSync(new URL("www/ut-top.html", import.meta.url), renderPage({ top, bar, topClasses: ["js-tabLike"] }));
console.log("ok");
