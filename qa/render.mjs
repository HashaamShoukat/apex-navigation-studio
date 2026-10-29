// Renders a Universal Theme 26.1 "Standard" page the way APEX does, from real .apx templates:
// the page template, a side or top navigation menu list template and the navigation bar list template.
// The page loads the real UT 26.1 files from /i/ (served from an extracted apex_26.1 images folder).
import fs from "node:fs";
import { parseApx } from "./apx.mjs";
import { DEMO_MENU, DEMO_BAR, APP_TITLE } from "../apexlang/_src/demo.mjs";

// Universal Theme 26.1 in APEXlang, from SQLcl: unzip sqlcl/lib/ext/apexlang-compiler.jar "mmd/26.1.0+3102/apexlang.zip", unzip that, point UT_APEXLANG at
// apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme/
const UT = (process.env.UT_APEXLANG || "/home/user/tools/mmd/261/apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme").replace(/\/?$/, "/");
const TEXT = {
    "APEX.TEMPLATE.APPLICATION": "Application", "APEX.TEMPLATE.MAIN_NAV_LABEL": "Main Navigation",
    APEX_PAGE_NOSCRIPT: "You must run this web page in a JavaScript-enabled browser.", UI_PAGE_SKIP_TO_CONTENT: "Skip to Main Content",
    "APEX.UI.BACK_TO_TOP": "Start of page", "APEX.SUCCESS": "Success", WARNING: "Warning"
};
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function readTemplate(file) {
    const [c] = parseApx(fs.readFileSync(file, "utf8"));
    return c;
}
export const utList = name => readTemplate(UT + "list-templates/" + name + ".apx");
export const utPage = name => readTemplate(UT + "page-templates/" + name + ".apx");

function appSubst(s, ctx) {
    return s
        .replace(/&"APP_TEXT\$([\w.]+)"(!\w+)?\./g, (m, k) => TEXT[k] || k)
        .replace(/&APP_TEXT\$([\w.]+?)(!\w+)?\./g, (m, k) => TEXT[k] || k)
        .replace(/&APP_ID(!\w+)?\./g, "100").replace(/&APP_PAGE_ID(!\w+)?\./g, String(ctx.page || 10))
        .replace(/&APP_SESSION(!\w+)?\./g, "1").replace(/&APP_ALIAS(!\w+)?\./g, "HARBOR")
        .replace(/&BROWSER_LANGUAGE(!\w+)?\./g, "en").replace(/&APP_USER(!\w+)?\./g, "nobody")
        .replace(/&[A-Z_]+(!\w+)?\./g, "") // unknown substitutions become empty, like APEX
        .replace(/#APEX_CSP_NONCE_ATTRIBUTE#/g, "");
}

// a list rendered with a list template
export function renderList(tpl, entries, { classes = [], staticId = "navigation-menu", currentId }) {
    const p = tpl.props;
    const pick = (grp, e, hasSub) => {
        const cur = e.current ? "current" : "noncurrent";
        return p[`${grp}.${cur}${hasSub ? "WithSublist" : ""}`] ?? p[`${grp}.${cur}`] ?? "";
    };
    const fill = (t, e) => t
        .replace(/#TEXT_ESC_SC#|#TEXT#/g, esc(e.label)).replace(/#LINK#/g, esc(e.link || "#"))
        .replace(/#ICON_CSS_CLASSES#|#IMAGE#/g, e.icon || "").replace(/#IMAGE_ATTR#|#LINK_ATTR#/g, "")
        .replace(/#A01#/g, esc(e.a01 ?? "")).replace(/#A02#/g, esc(e.a02 ?? "")).replace(/#A03#/g, esc(e.a03 ?? ""))
        .replace(/#A(0[4-9]|10)#/g, "").replace(/#LIST_ITEM_ID#/g, e.itemId).replace(/#PARENT_LIST_ITEM_ID#/g, e.parentItemId || "");
    let n = 0;
    const walk = (list, level, parent) => list.map(e => {
        e.itemId = staticId + "_" + (++n);
        e.parentItemId = parent && parent.itemId;
        const kids = e.children && e.children.length;
        const grp = level === 1 ? "entry" : "sublistEntry";
        let h = fill(pick(grp, e, kids), e);
        if (kids) {
            h += fill((p["sublist.beforeEntries"] || "").replace(/#PARENT_LIST_ITEM_ID#/g, e.itemId), e);
            h += walk(e.children, level + 1, e);
            h += p["sublist.afterEntries"] || "";
        }
        return h;
    }).join("\n");
    const html = (p["list.beforeEntries"] || "") + walk(entries, 1) + (p["list.afterEntries"] || "");
    return html.replace(/#COMPONENT_CSS_CLASSES#/g, [].concat(classes).join(" ")).replace(/#PARENT_STATIC_ID#/g, staticId).replace(/#LIST_ID#/g, staticId);
}

// the demo menu with links and "current"
function menuEntries(currentId, menu = DEMO_MENU) {
    const conv = list => list.map(e => ({
        label: e.label, icon: e.icon, a03: e.section, link: "#" + e.id, current: e.id === currentId,
        children: e.children ? conv(e.children) : null, id: e.id
    }));
    return conv(menu);
}
function barEntries(list = DEMO_BAR) {
    const conv = list => list.map(e => ({ label: e.label, icon: e.icon, a01: e.badge || "", a02: e.css || "", link: e.url || "#", children: e.children ? conv(e.children) : null }));
    return conv(list);
}

const CONTENT = `
<div class="t-BreadcrumbRegion t-BreadcrumbRegion--showBreadcrumb t-BreadcrumbRegion--useBreadcrumbTitle">
  <div class="t-BreadcrumbRegion-body"><div class="t-BreadcrumbRegion-breadcrumb">
    <ul class="t-Breadcrumb"><li class="t-Breadcrumb-item"><a href="#">Workspace</a></li><li class="t-Breadcrumb-item is-active"><h1 class="t-Breadcrumb-label">Dashboard</h1></li></ul>
  </div></div>
</div>`;
const BODY = `
<div class="container"><div class="row">
${[["Open orders", "128", "+12% this week"], ["Revenue", "48,290", "+4.1% this month"], ["Tasks due", "17", "5 overdue"], ["New customers", "36", "+9 since Monday"]].map(([t, v, s]) => `
  <div class="col col-3 col-sm-6"><div class="t-Region t-Region--scrollBody" style="margin-bottom:1rem"><div class="t-Region-bodyWrap"><div class="t-Region-body">
    <div style="font-size:.8125rem;opacity:.7">${t}</div><div style="font-size:1.75rem;font-weight:700;margin:.25rem 0">${v}</div><div style="font-size:.75rem;opacity:.65">${s}</div>
  </div></div></div></div>`).join("")}
</div><div class="row"><div class="col col-12">
  <div class="t-Region t-Region--scrollBody"><div class="t-Region-header"><div class="t-Region-headerItems t-Region-headerItems--title"><h2 class="t-Region-title">Recent orders</h2></div></div>
  <div class="t-Region-bodyWrap"><div class="t-Region-body"><table class="t-Report-report" style="width:100%"><thead><tr><th class="t-Report-colHead">Order</th><th class="t-Report-colHead">Customer</th><th class="t-Report-colHead">Status</th><th class="t-Report-colHead">Total</th></tr></thead><tbody>
  ${[["#10482", "Lena Fischer", "Shipped", "1,240.00"], ["#10481", "Omar Haddad", "Processing", "312.50"], ["#10480", "Priya Nair", "Shipped", "89.90"], ["#10479", "Jonas Berg", "Cancelled", "0.00"], ["#10478", "Maya Chen", "Delivered", "2,018.00"], ["#10477", "Tom Evans", "Delivered", "455.10"]].map(r => `<tr>${r.map(c => `<td class="t-Report-cell">${c}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div></div></div>
</div></div>
${Array.from({ length: 3 }, (_, i) => `<div class="row"><div class="col col-12"><div class="t-Region t-Region--scrollBody" style="margin-top:1rem"><div class="t-Region-header"><div class="t-Region-headerItems t-Region-headerItems--title"><h2 class="t-Region-title">Activity ${i + 1}</h2></div></div><div class="t-Region-bodyWrap"><div class="t-Region-body"><p>Lena Fischer updated the delivery address of order #10482. Omar Haddad added two items to the spring catalogue. The weekly sales report is ready to download.</p></div></div></div></div></div>`).join("")}
</div>`;

const CSS = (v = "26.1") => [
    "/i/app_ui/css/Core.min.css", "/i/libraries/font-apex/latest/css/font-apex.min.css",
    `/i/themes/theme_42/${v}/css/Core.min.css`
];
const STYLE_CSS = {
    redwood: ["/i/libraries/oracle-fonts/oraclesans-apex.min.css", "/i/themes/theme_42/26.1/css/Redwood.min.css", "/i/themes/theme_42/26.1/css/Redwood-Theme.min.css"],
    vita: ["/i/themes/theme_42/26.1/css/Vita.min.css"],
    "vita-dark": ["/i/themes/theme_42/26.1/css/Vita-Dark.min.css"]
};

/**
 * opts: { side: tpl|null, top: tpl|null, bar: tpl, sideClasses, topClasses, barClasses, current, dir, style, hash }
 */
export function renderPage(opts) {
    const pt = utPage("standard").props;
    const position = opts.top ? "top" : "side";
    const navTpl = opts.top || opts.side;
    const nav = appSubst(renderList(navTpl, menuEntries(opts.current || "dashboard", opts.menu), { classes: position === "top" ? opts.topClasses || [] : opts.sideClasses || [] }), {});
    const sub = t => {
        const bar = appSubst(renderList(opts.bar, barEntries(opts.barList), { classes: opts.barClasses || [], staticId: "L_NAVBAR" }), {});
        return appSubst(t, {}).replace("#LOGO#", `<span class="apex-logo-text">${APP_TITLE}</span>`)
            .replace(/#HOME_LINK#/g, "#").replace(/#AFTER_LOGO#|#BEFORE_NAVIGATION_BAR#|#AFTER_NAVIGATION_BAR#|#REGION_POSITION_0[24678]#/g, "")
            .replace("#NAVIGATION_BAR#", bar)
            .replace("#TOP_GLOBAL_NAVIGATION_LIST#", position === "top" ? nav : "")
            .replace("#SIDE_GLOBAL_NAVIGATION_LIST#", position === "side" ? nav : "")
            .replace("#REGION_POSITION_01#", opts.title ?? CONTENT).replace("#BODY#", opts.body || BODY).replace("#REGION_POSITION_05#", "")
            .replace(/#SUCCESS_MESSAGE#|#NOTIFICATION_MESSAGE#|#GLOBAL_NOTIFICATION#|#APP_VERSION#|#CUSTOMIZE#|#BUILT_WITH_LOVE_USING_APEX#|#REGION_POSITION_04#/g, "")
            .replace(/#FORM_OPEN#/g, '<form action="#" method="post" name="wwv_flow" id="wwvFlowForm" novalidate><input type="hidden" name="p_flow_id" value="100" id="pFlowId"><input type="hidden" name="p_flow_step_id" value="10" id="pFlowStepId"><input type="hidden" name="p_instance" value="1" id="pInstance"><input type="hidden" value="" id="pPageSubmissionId" name="p_page_submission_id">').replace(/#FORM_CLOSE#/g, "</form>");
    };
    const link = h => `<link rel="stylesheet" href="${h}" type="text/css">`;
    const tpls = [opts.side, opts.top, opts.bar].filter(Boolean);
    const genCss = tpls.map(t => t.props["css.inline"]).filter(Boolean).map(c => `<style>\n${c}\n</style>`).join("\n");
    const jsFiles = tpls.map(t => t.props["javaScript.fileUrls"]).flat().filter(Boolean)
        .map(u => u.replace("#APEX_FILES#", "/i/").replace("#MIN_DIRECTORY#", "minified/").replace("#MIN#", ".min").replace("?v=#APEX_VERSION#", ""));
    const onload = [navTpl, opts.bar].map(t => t.props["javaScript.executeWhenPageLoads"]).filter(Boolean).join("\n");
    const bodyClass = `apex-${position}-nav apex-icons-fontapex apex-theme-${opts.style || "redwood"}`;
    let header = sub(pt["page.header"])
        .replace("#APEX_CSS#", CSS().map(link).join("\n")).replace("#THEME_CSS#", "").replace("#TEMPLATE_CSS#", "")
        .replace("#THEME_STYLE_CSS#", (STYLE_CSS[opts.style || "redwood"]).map(link).join("\n"))
        .replace("#PAGE_CSS#", opts.pageCss ? `<style>\n${opts.pageCss}\n</style>` : "").replace(/#APPLICATION_CSS#|#FAVICONS#|#HEAD#/g, "")
        .replace("#PAGE_CSS_CLASSES#", bodyClass).replace(/#ONLOAD#/g, "")
        .replace("#RTL_CLASS#", opts.dir === "rtl" ? "u-RTL" : "").replace(/#TEXT_DIRECTION#/g, opts.dir === "rtl" ? 'dir="rtl"' : "")
        .replace("#TITLE#", "Dashboard");
    const footer = sub(pt["page.footer"])
        .replace("#DEVELOPER_TOOLBAR#", "")
        .replace("#APEX_JAVASCRIPT#", `<script>var apex_img_dir = "/i/", htmldb_Img_Dir = apex_img_dir;var apex = { env: { APP_ID: "100", APP_PAGE_ID: "10", APP_SESSION: "1", APP_USER: "nobody", APEX_FILES: "/i/", APEX_VERSION: "26.1.0" } };</script>
<script src="/i/libraries/apex/minified/desktop_all.min.js"></script>`)
        .replace("#GENERATED_CSS#", genCss)
        .replace("#THEME_JAVASCRIPT#", `<script src="/i/libraries/apex/minified/widget.stickyWidget.min.js"></script>\n<script src="/i/themes/theme_42/26.1/js/theme42.min.js"></script>`)
        .replace("#TEMPLATE_JAVASCRIPT#", jsFiles.map(u => `<script src="${u}"></script>`).join("\n"))
        .replace("#PAGE_JAVASCRIPT#", opts.pageFn ? `<script>\n${opts.pageFn}\n</script>` : "").replace(/#APPLICATION_JAVASCRIPT#/g, "")
        .replace("#GENERATED_JAVASCRIPT#", `<script>
apex.jQuery( function() {
  apex.page.init( this, function() {
    try {
${appSubst(onload, {})}
${opts.pageJs || ""}
${pt["javaScript.executeWhenPageLoads"]}
    } catch ( e ) { apex.debug.error( e ); }
  } );
} );
</script>`);
    return appSubst(header, {}) + sub(pt["page.body"]) + footer;
}
