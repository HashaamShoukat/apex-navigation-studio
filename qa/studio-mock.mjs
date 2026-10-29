// Mock Gallery / Designer pages built from the generated page .apx files (real page JS and CSS, items as plain controls),
// to test their logic against the harness demo pages: node qa/studio-mock.mjs
import fs from "node:fs";
import { parseApx } from "./apx.mjs";
const P = new URL("../apexlang/pages/", import.meta.url).pathname, OUT = new URL("www/", import.meta.url).pathname;
const sub = s => String(s).replace(/#APP_FILES#/g, "/").replace(/&APP_ID\./g, "100").replace(/&APP_SESSION\./g, "1");
const css = ["/i/app_ui/css/Core.min.css", "/i/libraries/font-apex/latest/css/font-apex.min.css", "/i/themes/theme_42/26.1/css/Core.min.css",
  "/i/libraries/oracle-fonts/oraclesans-apex.min.css", "/i/themes/theme_42/26.1/css/Redwood.min.css", "/i/themes/theme_42/26.1/css/Redwood-Theme.min.css"];
function item(it) {
  const p = it.props, id = it.id, label = p["label.label"];
  let ctl;
  if (p.type === "switch") { ctl = `<select id="${id}"><option value="Y">On</option><option value="N">Off</option></select>`; }
  else {
    const vals = (p["lov.staticValues"] || "").replace(/^STATIC2:/, "").split(",").map(v => v.split(";"));
    ctl = `<select id="${id}">${p["lov.nullDisplayValue"] ? `<option value="">${p["lov.nullDisplayValue"]}</option>` : ""}${vals.map(([d, r]) => `<option value="${r}">${d}</option>`).join("")}</select>`;
  }
  const def = p["default.staticValue"] || "";
  return { html: `<div id="${id}_CONTAINER" class="nvm-Item"><label for="${id}">${label}</label>${ctl}</div>`, id, def };
}
function page(no, file, out) {
  const [pg] = parseApx(fs.readFileSync(P + file, "utf8"));
  const regions = pg.children.filter(c => c.type === "region"), items = pg.children.filter(c => c.type === "pageItem").map(i => ({ ...item(i), region: i.props["layout.region"] }));
  const btns = pg.children.filter(c => c.type === "button");
  const body = regions.filter(r => !r.props["layout.parentRegion"]).map(r => {
    const kids = regions.filter(k => k.props["layout.parentRegion"] === "@" + r.id);
    return `<section class="nvm-Region" id="R_${r.id}"><h2>${r.props.name}</h2>${items.filter(i => i.region === "@" + r.id).map(i => i.html).join("")}
${btns.filter(b => b.props["layout.region"] === "@" + r.id).map(b => `<button type="button" class="t-Button ${b.props["appearance.cssClasses"] || ""}">${b.props.label}</button>`).join("")}
${sub(r.props["source.htmlCode"] || "")}${kids.map(k => sub(k.props["source.htmlCode"] || "")).join("")}</section>`;
  }).join("\n");
  const init = items.map(i => `document.getElementById("${i.id}").value = ${JSON.stringify(i.def)};`).join("\n");
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${pg.props.title}</title>${css.map(h => `<link rel="stylesheet" href="${h}">`).join("")}
<style>body{padding:16px;background:#f5f4f2} .nvm-Region{background:#fff;border-radius:10px;padding:12px;margin:0 0 12px} .nvm-Item{display:inline-flex;flex-direction:column;margin:4px 8px 4px 0;font-size:12px} #R_options{width:380px;float:left;margin-right:12px} #R_preview{overflow:hidden}
${pg.props["css.inline"] || ""}</style></head><body class="t-PageBody apex-icons-fontapex">
<form id="wwvFlowForm"><input type="hidden" id="pFlowId" value="100"><input type="hidden" id="pFlowStepId" value="${no}"><input type="hidden" id="pInstance" value="1">
${body}</form>
<script>var apex_img_dir = "/i/"; var apex = { env: { APP_ID: "100", APP_PAGE_ID: "${no}", APP_SESSION: "1", APEX_FILES: "/i/" } };</script>
<script src="/i/libraries/apex/minified/desktop_all.min.js"></script>
<script>${init}
${sub(pg.props["javaScript.functionAndGlobalVariableDeclaration"] || "")}
apex.jQuery(function () { apex.page.init(this, function () {
${sub(pg.props["javaScript.executeWhenPageLoads"] || "")}
}); });</script></body></html>`;
  fs.writeFileSync(OUT + out, html);
}
page(1, "p00001-home.apx", "gallery.html");
page(2, "p00002-designer.apx", "designer.html");
console.log("mock studio pages written");
