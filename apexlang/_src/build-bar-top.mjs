// Part of build.mjs: Modern Navigation Bar and Modern Top Navigation
import fs from "node:fs";
export async function build({ read, minCss, minJs, cssFile, field, block, options, THEME, BAR, TOP }) {
    // ---------- Modern Navigation Bar (a copy of Universal Theme's Navigation Bar) ----------
    const A = `title="#A04#" target="#A06#" data-otel-label="#A10#" #LINK_ATTR#`;
    const LINK = (cur) => `<li class="t-NavigationBar-item${cur ? " is-active" : ""} #A02#"${cur ? ' aria-current="page"' : ""}>
  <a class="t-Button t-Button--icon t-Button--header t-Button--navBar" href="#LINK#" ${A}>
    <span class="t-Icon fa #ICON_CSS_CLASSES#" aria-hidden="true" #IMAGE_ATTR#></span><span class="t-Button-label">#TEXT_ESC_SC#</span><span class="t-Button-badge">#A01#</span>
  </a>
</li>`;
    const MENU = (cur) => `<li class="t-NavigationBar-item${cur ? " is-active" : ""} #A02#"${cur ? ' aria-current="page"' : ""}>
  <button class="t-Button t-Button--icon t-Button--header t-Button--navBar" type="button" id="#LIST_ITEM_ID#" data-menu="menu_#LIST_ITEM_ID#" title="#A04#">
    <span class="t-Icon fa #ICON_CSS_CLASSES#" aria-hidden="true" #IMAGE_ATTR#></span><span class="t-Button-label">#TEXT_ESC_SC#</span><span class="t-Button-badge">#A01#</span><span class="a-Icon icon-down-arrow" aria-hidden="true"></span>
  </button>`;
    const SUBE = cur => `<li class="#A02#" data-current="${cur}" data-icon="#ICON_CSS_CLASSES#"><a href="#LINK#" ${A}>#TEXT_ESC_SC#</a></li>`;
    const before = `${cssFile("nav-bar", minCss(read("nav-bar.css")))}<ul class="t-NavigationBar ns-Bar #COMPONENT_CSS_CLASSES#" id="#LIST_ID#">`;
    const after = `</ul>
<script #APEX_CSP_NONCE_ATTRIBUTE#>
${await minJs(read("nav-bar-pre.js"), "/* Modern Navigation Bar: source in Navigation Studio _src/nav-bar-pre.js */\n")}
</script>`;
    const onload = await minJs(read("nav-bar.js"), "// Modern Navigation Bar: source in Navigation Studio _src/nav-bar.js\n");
    field("bar list.beforeEntries", before, 4000);
    field("bar list.afterEntries", after, 4000);
    field("bar executeWhenPageLoads", onload, 4000);
    fs.writeFileSync(THEME + "list-templates/modern-navigation-bar.apx", `listTemplate modern-navigation-bar (
    name: Modern Navigation Bar
    templateClass: pullDownMenu
    templateOptions {
        default: [
${BAR.defaults.map(c => "            " + c).join("\n")}
        ]
    }
    list {
        beforeEntries: ${before}
${block("afterEntries", "html", after, 8)}
    }
    entry {
${block("current", "html", LINK(true), 8)}
${block("currentWithSublist", "html", MENU(true), 8)}
${block("noncurrent", "html", LINK(false), 8)}
${block("noncurrentWithSublist", "html", MENU(false), 8)}
    }
    sublist {
        beforeEntries: <div class="t-NavigationBar-menu u-DisplayNone" id="menu_#PARENT_LIST_ITEM_ID#"><ul>
        afterEntries: </ul></div></li>
    }
    sublistEntry {
        current: ${SUBE(true)}
        currentWithSublist: ${SUBE(true)}
        noncurrent: ${SUBE(false)}
        noncurrentWithSublist: ${SUBE(false)}
    }
    javaScript {
${block("executeWhenPageLoads", "javascript-browser", onload, 8)}
    }
    attributeDescriptions {
        a01: Badge Value
        a02: List Item CSS Classes
        a04: Title Attribute
        a06: Link Target
        a10: OpenTelemetry Label
    }
    comments {
        comments: ${BAR.comment}
    }
${options(BAR)}
)
`);
    const out = [BAR];
    if (TOP.groups.length) { out.push(TOP); await (await import("./build-top.mjs")).build({ read, minCss, minJs, cssFile, field, block, options, THEME, TOP }); }
    return out;
}
