// Part of build.mjs: Modern Top Navigation (a copy of Universal Theme's Top Navigation Menu)
import fs from "node:fs";
export async function build({ read, minCss, minJs, cssFile, field, block, options, THEME, TOP }) {
    const D = `data-id="#A01#" data-disabled="#A02#" data-hide="#A03#" data-shortcut="#A05#" data-icon="#ICON_CSS_CLASSES#"`,
          A = `href="#LINK#" title="#A04#" target="#A06#" data-otel-label="#A10#" #LINK_ATTR#`;
    const TOPE = (cur, close) => `<li class="a-MenuBar-item${cur ? " a-Menu--current" : ""}"${cur ? ' data-current="true"' : ""} ${D}><a class="a-MenuBar-label" ${A}>#TEXT_ESC_SC#</a>${close ? "</li>" : ""}`;
    const SUBE = (cur, close) => `<li${cur ? ' data-current="true"' : ""} ${D}><a ${A}>#TEXT_ESC_SC#</a>${close ? "</li>" : ""}`;
    const after = `</ul></div>
<script #APEX_CSP_NONCE_ATTRIBUTE#>
${await minJs(read("top-nav-pre.js"), "/* Modern Top Navigation: source in Navigation Studio _src/top-nav-pre.js */\n")}
</script>`;
    const onload = await minJs(read("top-nav.js"), "// Modern Top Navigation: source in Navigation Studio _src/top-nav.js\n");
    const before = `${cssFile("top-nav", minCss(read("top-nav.css")))}<div class="t-Header-nav-list #COMPONENT_CSS_CLASSES#" id="t_MenuNav"><ul>`;
    field("top list.beforeEntries", before, 4000);
    field("top list.afterEntries", after, 4000);
    field("top executeWhenPageLoads", onload, 4000);
    fs.writeFileSync(THEME + "list-templates/modern-top-navigation.apx", `listTemplate modern-top-navigation (
    name: Modern Top Navigation
    templateClass: pullDownMenu
    templateOptions {
        default: [
${TOP.defaults.map(c => "            " + c).join("\n")}
        ]
    }
    list {
        beforeEntries: ${before}
${block("afterEntries", "html", after, 8)}
    }
    entry {
        current: ${TOPE(true, true)}
        currentWithSublist: ${TOPE(true, false)}
        noncurrent: ${TOPE(false, true)}
        noncurrentWithSublist: ${TOPE(false, false)}
    }
    sublist {
        beforeEntries: <ul class="u-DisplayNone">
        afterEntries: </ul></li>
    }
    sublistEntry {
        current: ${SUBE(true, true)}
        currentWithSublist: ${SUBE(true, false)}
        noncurrent: ${SUBE(false, true)}
        noncurrentWithSublist: ${SUBE(false, false)}
    }
    javaScript {
${block("executeWhenPageLoads", "javascript-browser", onload, 8)}
    }
    attributeDescriptions {
        a01: Menu Item ID / Action Name
        a02: Disabled (True/False)
        a03: Hidden (True/False)
        a04: Title Attribute (Used By Actions Only)
        a05: Shortcut Key
        a06: Link Target
        a10: OpenTelemetry Label
    }
    comments {
        comments: ${TOP.comment}
    }
${options(TOP)}
)
`);
}
