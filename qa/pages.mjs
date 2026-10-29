// Writes harness pages that use the generated Navigation Studio templates: node qa/pages.mjs
// www/side.html renders the default options; the look under test travels in the hash (#ns=...), like the Designer.
import fs from "node:fs";
import { renderPage, utList, readTemplate } from "./render.mjs";
const L = new URL("../apexlang/shared-components/themes/universal-theme/list-templates/", import.meta.url).pathname;
const opt = f => fs.existsSync(L + f) ? readTemplate(L + f) : null;
const side = readTemplate(L + "modern-side-navigation.apx");
const bar = opt("modern-navigation-bar.apx") || utList("navigation-bar");
const top = opt("modern-top-navigation.apx") || utList("top-navigation-menu");
const sideDefaults = side.props["templateOptions.default"] || [];
const out = new URL("www/", import.meta.url).pathname;
const barDefaults = bar.props["templateOptions.default"] || [];
for (const style of ["redwood", "vita"]) {
  for (const dir of ["ltr", "rtl"]) {
    const sfx = (style === "redwood" ? "" : "-" + style) + (dir === "rtl" ? "-rtl" : "");
    fs.writeFileSync(out + `side${sfx}.html`, renderPage({ side, bar, sideClasses: sideDefaults, barClasses: barDefaults, style, dir, current: "dashboard" }));
    fs.writeFileSync(out + `side-sub${sfx}.html`, renderPage({ side, bar, sideClasses: sideDefaults, barClasses: barDefaults, style, dir, current: "reports-weekly" }));
    fs.writeFileSync(out + `top${sfx}.html`, renderPage({ top, bar, topClasses: top.props["templateOptions.default"] || [], barClasses: barDefaults, style, dir }));
  }
}
console.log("harness pages written");
