// Renders the Gallery and Designer pages inside the Universal Theme page (with the studio's own Modern Side Navigation)
// for the README screenshots and for testing their JavaScript: node qa/docs-pages.mjs -> www/gallery-doc.html, www/designer-doc.html
import fs from "node:fs";
import { parseApx } from "./apx.mjs";
import { renderPage, readTemplate } from "./render.mjs";
const L = new URL("../apexlang/shared-components/themes/universal-theme/list-templates/", import.meta.url).pathname;
const P = new URL("../apexlang/pages/", import.meta.url).pathname, OUT = new URL("www/", import.meta.url).pathname;
const side = readTemplate(L + "modern-side-navigation.apx"), bar = readTemplate(L + "modern-navigation-bar.apx");
const sub = s => String(s || "").replace(/#APP_FILES#/g, "/").replace(/&APP_ID\./g, "100").replace(/&APP_SESSION\./g, "1");
const MENU = [
    { id: "home", label: "Gallery", icon: "fa-th-large", section: "Navigation Studio" }, { id: "designer", label: "Designer", icon: "fa-paint-brush" },
    { id: "how", label: "How to Use", icon: "fa-book" }, { id: "demo-side", label: "Side Menu Demo", icon: "fa-columns", section: "Demos" }, { id: "demo-top", label: "Top Menu Demo", icon: "fa-window-maximize" }
];
const title = name => `<div class="t-BreadcrumbRegion t-BreadcrumbRegion--showBreadcrumb t-BreadcrumbRegion--useBreadcrumbTitle"><div class="t-BreadcrumbRegion-body"><div class="t-BreadcrumbRegion-breadcrumb">
<ul class="t-Breadcrumb"><li class="t-Breadcrumb-item"><a href="#">Gallery</a></li><li class="t-Breadcrumb-item is-active"><h1 class="t-Breadcrumb-label">${name}</h1></li></ul></div></div></div>`;
const region = (id, name, body, buttons = "", cls = "") => `<div class="t-Region ${cls}" id="R_${id}"><div class="t-Region-header"><div class="t-Region-headerItems t-Region-headerItems--title"><h2 class="t-Region-title">${name}</h2></div>
<div class="t-Region-headerItems t-Region-headerItems--buttons">${buttons}</div></div><div class="t-Region-bodyWrap"><div class="t-Region-body">${body}</div></div></div>`;
const regs = [];
function item(it) {
    const p = it.props, id = it.id, label = p["label.label"], def = p["default.staticValue"] || "";
    if (p.type === "switch") {
        regs.push(`apex.item.create("${id}", { getValue() { return document.getElementById("${id}").checked ? "Y" : "N"; }, setValue(v) { document.getElementById("${id}").checked = v === "Y"; } });`);
        return `<div class="t-Form-fieldContainer t-Form-fieldContainer--floatingLabel apex-item-wrapper apex-item-wrapper--yes-no nvm-Half js-show-label" id="${id}_CONTAINER"><div class="t-Form-labelContainer"><label for="${id}" class="t-Form-label">${label}</label></div>
<div class="t-Form-inputContainer"><div class="t-Form-itemWrapper"><span class="a-Switch"><input type="checkbox" id="${id}" value="Y"${def === "Y" ? " checked" : ""}><span class="a-Switch-toggle"></span></span></div></div></div>`;
    }
    const vals = (p["lov.staticValues"] || "").replace(/^STATIC2:/, "").split(",").map(v => v.split(";"));
    if (p.type === "radioGroup") {
        regs.push(`apex.item.create("${id}", { getValue() { return (document.querySelector('[name="${id}"]:checked') || {}).value || ""; }, setValue(v) { const r = document.querySelector('[name="${id}"][value="' + v + '"]'); if (r) { r.checked = true; } } });`);
        return `<div class="t-Form-fieldContainer t-Form-fieldContainer--radioButtonGroup nvm-Radio" id="${id}_CONTAINER"><div class="apex-item-group apex-item-group--rc apex-item-radio" role="radiogroup" id="${id}" aria-label="${label}"><div class="apex-item-grid radio_group"><div class="apex-item-grid-row">` +
            vals.map(([d, r], i) => `<div class="apex-item-option"><input type="radio" id="${id}_${i}" name="${id}" value="${r}"${r === def ? " checked" : ""}><label for="${id}_${i}">${d}</label></div>`).join("") + `</div></div></div></div>`;
    }
    return `<div class="t-Form-fieldContainer t-Form-fieldContainer--floatingLabel apex-item-wrapper apex-item-wrapper--select-list js-show-label" id="${id}_CONTAINER"><div class="t-Form-labelContainer"><label for="${id}" class="t-Form-label">${label}</label></div>
<div class="t-Form-inputContainer"><div class="t-Form-itemWrapper"><select id="${id}" class="selectlist apex-item-select">${p["lov.nullDisplayValue"] ? `<option value="">${p["lov.nullDisplayValue"]}</option>` : ""}${vals.map(([d, r]) => `<option value="${r}"${r === def ? " selected" : ""}>${d}</option>`).join("")}</select></div></div></div>`;
}
const CSS = `.nvm-Items { display: flex; flex-wrap: wrap; gap: 0 .75rem; } .nvm-Items > .t-Form-fieldContainer { flex: 1 1 100%; } .nvm-Items > .nvm-Half { flex: 1 1 calc(50% - .75rem); }
.nvm-Radio { margin: 0 .5rem 0 0; } #R_preview .t-Region-headerItems--buttons { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.nvm-Block h3 { font-size: 1rem; margin: 1rem 0 .5rem; }`;

function build(file, out, name) {
    regs.length = 0;
    const [pg] = parseApx(fs.readFileSync(P + file, "utf8"));
    const R = pg.children.filter(c => c.type === "region" && c.props.type === "staticContent");
    const items = pg.children.filter(c => c.type === "pageItem");
    let body;
    if (name === "Designer") {
        const opt = items.filter(i => i.props["layout.region"] === "@options").map(item).join("");
        const pre = items.filter(i => i.props["layout.region"] === "@preview").map(item).join("") + `<button type="button" class="t-Button t-Button--icon t-Button--iconLeft js-nvd-open"><span class="t-Icon fa fa-external-link" aria-hidden="true"></span><span class="t-Button-label">Open Full Page</span></button>`;
        const summary = R.find(r => r.id === "summary");
        body = `<div class="container"><div class="row"><div class="col col-4">${region("options", "Template Options", `<div class="nvm-Items">${opt}</div><div class="nvm-Block"><h3>Your Choice</h3>${sub(summary.props["source.htmlCode"])}</div>`)}</div>
<div class="col col-8">${region("preview", "Live Preview", sub(R.find(r => r.id === "preview").props["source.htmlCode"]), pre, "t-Region--noPadding")}</div></div></div>`;
    } else {
        body = `<div class="container">${R.map(r => `<div class="row"><div class="col col-12">${sub(r.props["source.htmlCode"])}</div></div>`).join("")}</div>`;
    }
    const html = renderPage({
        side, bar, menu: MENU, current: name === "Designer" ? "designer" : "home", sideClasses: ["js-navCollapsed--default", "ns-Fx--tips", "ns-Fx--search", "ns-Fx--tabbar", "ns-Design--inset", "ns-Accent--indigo"],
        barClasses: ["ns-Bar--avatar", "ns-Bar--search"], barList: [{ label: "GitHub", icon: "fa-github", url: "#" }], title: name === "Designer" ? title("Designer") : "", body, pageCss: CSS + "\n" + (pg.props["css.inline"] || ""),
        pageFn: sub(pg.props["javaScript.functionAndGlobalVariableDeclaration"] || ""), pageJs: regs.join("\n") + "\n" + sub(pg.props["javaScript.executeWhenPageLoads"])
    }).replace(/<span class="apex-logo-text">Harbor<\/span>/, '<span class="apex-logo-text">Navigation Studio</span>');
    fs.writeFileSync(OUT + out, html);
}
build("p00002-designer.apx", "designer-doc.html", "Designer");
build("p00001-home.apx", "gallery-doc.html", "Gallery");
console.log("docs pages written");
