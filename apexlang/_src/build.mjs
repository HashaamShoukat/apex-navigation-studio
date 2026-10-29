// Builds the Navigation Studio list templates and their option groups from _src:
//   node _src/build.mjs
// - side-nav.css / side-nav-pre.js / side-nav.js  -> list-templates/modern-side-navigation.apx
// - nav-bar.css / nav-bar.js                      -> list-templates/modern-navigation-bar.apx
// - top-nav.css / top-nav.js                      -> list-templates/modern-top-navigation.apx
// - the option tables below                       -> template options + template-option-groups.apx
// Field limits (APEXlang 26.1 metamodel): css.inline 32767 bytes; javaScript.executeWhenPageLoads, list.beforeEntries,
// list.afterEntries and every entry template 4000; option and group names 30. The build fails when a field is too big.
import fs from "node:fs";
import { SIDE, BAR, TOP } from "./options.mjs";
import { minify } from "terser";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const THEME = ROOT + "shared-components/themes/universal-theme/";
const SRC = ROOT + "_src/";
const bytes = s => Buffer.byteLength(s, "utf8");
const read = f => fs.readFileSync(SRC + f, "utf8").replace(/\r\n/g, "\n");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");

// light minification: no comments, no indentation - one statement / rule per line stays readable
export const minCss = css => css.replace(/\/\*[\s\S]*?\*\//g, "").split("\n").map(l => l.trim()).filter(Boolean).join("\n");
// JavaScript fields hold 4000 bytes, so the readable sources in _src are minified (npm install once, in _src)
export const minJs = async (js, head = "") => head + (await minify(js, { ecma: 2020, compress: true, mangle: true, format: { comments: false } })).code;

const LIMITS = [];
function field(name, value, max) {
    const b = bytes(value);
    LIMITS.push(`${name} ${b}/${max}`);
    if (b > max) { throw new Error(`${name} is ${b} bytes - the limit is ${max}`); }
    return value;
}
const block = (key, lang, value, n) => `${" ".repeat(n)}${key}:\n${" ".repeat(n + 4)}\`\`\`${lang}\n${ind(value, n + 4)}\n${" ".repeat(n + 4)}\`\`\``;

// ---------- template options and groups ----------
function options(def) {
    let out = "";
    for (const g of def.groups) {
        g.options.forEach(([css, name, help], i) => {
            if (bytes(name) > 30) { throw new Error("option name over 30 bytes: " + name); }
            out += `\n    templateOption ${css.replace(/^(ns|js)-/, "").replace(/--/g, "-").replace(/[A-Z]/g, c => "-" + c.toLowerCase()).replace(/^-/, "")} (\n        name: ${name}\n` +
                `        group: @list/${g.id}\n        sequence: ${(i + 1) * 10}\n        appearance {\n            cssClasses: ${css}\n        }\n` +
                (help ? `        help {\n            helpText: ${help}\n        }\n` : "") + (g.advanced ? `        advanced {\n            isAdvancedOption: true\n        }\n` : "") + `    )\n`;
        });
    }
    for (const [css, name, seq, help] of def.singles) {
        if (bytes(name) > 30) { throw new Error("option name over 30 bytes: " + name); }
        out += `\n    templateOption ${css.replace(/^(ns|js)-/, "").replace(/--/g, "-").replace(/[A-Z]/g, c => "-" + c.toLowerCase()).replace(/^-/, "")} (\n        name: ${name}\n        sequence: ${seq}\n` +
            `        appearance {\n            cssClasses: ${css}\n        }\n` + (help ? `        help {\n            helpText: ${help}\n        }\n` : "") + `    )\n`;
    }
    return out;
}
const groups = defs => defs.flatMap(d => d.groups).map(g => {
    for (const s of [g.name, g.nul || ""]) { if (bytes(s) > 30) { throw new Error("group name / null text over 30 bytes: " + s); } }
    return `templateOptionGroup ${g.id} (\n    templateType: list\n    name: ${g.name}\n    sequence: ${g.seq}\n` +
        (g.nul ? `    settings {\n        nullText: ${g.nul}\n    }\n` : "") + (g.help ? `    help {\n        helpText: ${g.help}\n    }\n` : "") +
        (g.advanced ? `    advanced {\n        isAdvancedOption: true\n    }\n` : "") + `)\n`;
}).join("\n");

// ---------- Modern Side Navigation (a copy of Universal Theme's Side Navigation Menu) ----------
const NODE = (cur, close) => `<li data-current="${cur}" data-id="#A01#" data-disabled="#A02#" data-icon="#ICON_CSS_CLASSES#" data-shortcut="#A05#" data-section="#A03#">
  <a href="#LINK#" class="u-DisplayNone" title="#A04#" target="#A06#" data-otel-label="#A10#" #LINK_ATTR#>#TEXT_ESC_SC#</a>
  <div class="a-TreeView-node a-TreeView-node--topLevel" aria-hidden="true">
    <div role="none" class="a-TreeView-row"></div>
    <div role="none" class="a-TreeView-content">
      <span class="fa #ICON_CSS_CLASSES#"></span>
      <span class="a-TreeView-label">#TEXT_ESC_SC#</span>
    </div>
  </div>${close ? "\n</li>" : ""}`;
const SUB = (cur, close) => `<li${cur ? ' data-current="true"' : ""} data-id="#A01#" data-disabled="#A02#" data-icon="#ICON_CSS_CLASSES#" data-shortcut="#A05#"><a href="#LINK#" title="#A04#" target="#A06#" data-otel-label="#A10#" #LINK_ATTR#>#TEXT_ESC_SC#</a>${close ? "</li>" : ""}`;
// Universal Theme's own pre-paint script (unchanged) - after ours, which may set the preview's collapsed / expanded state
const UT_PREPAINT = `(() => {
  const pref = "ORA_WWV_apex.toggleCore.nav.&APP_ID..preferenceForExpanded",
        nav  = document.getElementById('t_TreeNav').classList,
        body = document.getElementById('t_PageBody');
  if ( !sessionStorage.getItem( pref ) ) { sessionStorage.setItem( pref, !nav.contains('js-defaultCollapsed') ); }
  if ( nav.contains('js-navCollapsed--default') ) {
      body?.classList.add('js-navCollapsed--icons');
      if ( sessionStorage.getItem( pref ) === "false" ) { body?.classList.add('js-navCollapsed'); }
  }
  if ( sessionStorage.getItem( pref ) === "true" && window.matchMedia("(min-width: " + getComputedStyle(document.documentElement).getPropertyValue("--js-mq-lg") + ")").matches) { body?.classList.add('js-navExpanded'); }
  for (const label of document.querySelectorAll(".a-TreeView .a-TreeView-label")) {
      label.textContent = label.textContent.replaceAll(/\\[(.*?)\\]/ig, '');
  }
})();`;

async function sideTemplate() {
    const before = `<div class="t-Body-nav" id="t_Body_nav" role="navigation" aria-label="&"APP_TEXT$APEX.TEMPLATE.APPLICATION".">
  <div class="a-TreeView t-TreeNav #COMPONENT_CSS_CLASSES#" id="t_TreeNav" data-id="#PARENT_STATIC_ID#_tree" aria-label="&"APP_TEXT$APEX.TEMPLATE.MAIN_NAV_LABEL".">
    <ul>`;
    const after = `    </ul>
  </div>
</div>
<script #APEX_CSP_NONCE_ATTRIBUTE#>
${await minJs(read("side-nav-pre.js"), "/* Modern Side Navigation: source in Navigation Studio _src/side-nav-pre.js */\n")}
${UT_PREPAINT}
</script>`;
    const onload = "apex.jQuery('body').addClass('t-PageBody--leftNav');\n" + await minJs(read("side-nav.js"), "// Modern Side Navigation: source in Navigation Studio _src/side-nav.js\n");
    const css = minCss(read("side-nav.css"));
    field("side list.beforeEntries", before, 4000);
    field("side list.afterEntries", after, 4000);
    field("side executeWhenPageLoads", onload, 4000);
    field("side css.inline", css, 32767);
    return `listTemplate modern-side-navigation (
    name: Modern Side Navigation
    templateClass: verticalSidebarList
    templateOptions {
        default: [
${SIDE.defaults.map(c => "            " + c).join("\n")}
        ]
    }
    list {
${block("beforeEntries", "html", before, 8)}
${block("afterEntries", "html", after, 8)}
    }
    entry {
${block("current", "html", NODE(true, true), 8)}
${block("currentWithSublist", "html", NODE(true, false), 8)}
${block("noncurrent", "html", NODE(false, true), 8)}
${block("noncurrentWithSublist", "html", NODE(false, false), 8)}
    }
    sublist {
        beforeEntries: <ul class="u-DisplayNone">
        afterEntries: </ul></li>
    }
    sublistEntry {
        current: ${SUB(true, true)}
        currentWithSublist: ${SUB(true, false)}
        noncurrent: ${SUB(false, true)}
        noncurrentWithSublist: ${SUB(false, false)}
    }
    javaScript {
        fileUrls: #APEX_FILES#libraries/apex/#MIN_DIRECTORY#widget.treeView#MIN#.js?v=#APEX_VERSION#
${block("executeWhenPageLoads", "javascript-browser", onload, 8)}
    }
    css {
${block("inline", "css", css, 8)}
    }
    attributeDescriptions {
        a01: ID Attribute
        a02: Disabled (True/False)
        a03: Section Heading
        a04: Title Attribute (Used By Actions Only)
        a05: Shortcut Key
        a06: Link Target
        a10: OpenTelemetry Label
    }
    comments {
        comments: ${SIDE.comment}
    }
${options(SIDE)}
)
`;
}

fs.mkdirSync(THEME + "list-templates", { recursive: true });
fs.writeFileSync(THEME + "list-templates/modern-side-navigation.apx", await sideTemplate());
const extra = [];
extra.push(...await (await import("./build-bar-top.mjs")).build({ read, minCss, minJs, field, block, options, THEME, BAR, TOP }));
fs.writeFileSync(THEME + "template-option-groups.apx", groups([SIDE, ...extra]));
console.log(LIMITS.join("\n"));
