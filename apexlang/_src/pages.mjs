// Writes the demo pages (10-19), lists.apx and breadcrumbs.apx: node _src/pages.mjs
// The demo pages override the navigation menu (page level) with the long demo menu; page 19 shows it as a top menu.
import fs from "node:fs";
import { DEMO_PAGES, DEMO_MENU, DEMO_BAR, DEMO_USER } from "./demo.mjs";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");
const sq = s => "'" + s.replace(/'/g, "''") + "'";

// ---------- lists ----------
const target = e => e.url ? `            target: {\n                type: url\n                url: ${e.url}\n            }`
    : `            target: {\n                page: ${e.page}${e.request ? `\n                request: ${e.request}` : ""}\n            }`;
let seq = 0;
function entry(e, parent, i) {
    const attrs = [e.section && `            3: ${e.section}`, e.badge && `            1: ${e.badge}`, e.css && `            2: ${e.css}`].filter(Boolean);
    return `    entry ${e.id} (
        label: ${e.label}${e.icon ? `
        icon {
            imageIconCssClasses: ${e.icon}
        }` : ""}
        layout {
            sequence: ${(i + 1) * 10}${parent ? `\n            parentEntry: @${parent}` : ""}
        }${e.cond ? `
        serverSideCondition {
            type: expression
            plsqlExpression: ${e.cond}
        }` : ""}${e.page ? `
        isCurrent {
            type: expression
            plsqlExpression: :APP_PAGE_ID = ${e.page} and ${e.request ? ":REQUEST = " + sq(e.request) : "(:REQUEST is null or :REQUEST not in ('ACTIVE','ARCHIVED','TEMPLATES','INVOICES','PRODUCTS','SALES','FINANCE','TEAM','WEEKLY','MONTHLY','ANALYTICS','FILES','INTEGRATIONS','PROFILE','SECURITY','BILLING','HELP'))"}
        }` : ""}
        link {
${target(e)}
        }${attrs.length ? `
        userDefinedAttributes {
${attrs.join("\n")}
        }` : ""}
    )
`;
}
const flat = (list, parent) => list.flatMap((e, i) => [entry(e, parent, i), ...(e.children ? flat(e.children, e.id) : [])]);

const STUDIO_MENU = [
    { id: "home", label: "Gallery", icon: "fa-th-large", page: 1, section: "Navigation Studio" },
    { id: "designer", label: "Designer", icon: "fa-paint-brush", page: 2 },
    { id: "how-to-use", label: "How to Use", icon: "fa-book", page: 3 },
    { id: "demo-side", label: "Side Menu Demo", icon: "fa-columns", page: 10, section: "Demos" },
    { id: "demo-top", label: "Top Menu Demo", icon: "fa-window-maximize", page: 19 }
];
const studioEntry = (e, i) => entry({ ...e, request: null }, null, i).replace(/        isCurrent \{[\s\S]*?\n        \}\n/, "");
const BAR = [
    { id: "github", label: "GitHub", icon: "fa-github", url: "https://github.com/HashaamShoukat/apex-navigation-studio", cond: ":APP_PAGE_ID < 10" },
    ...DEMO_BAR.map(e => ({ ...e, cond: ":APP_PAGE_ID >= 10", url: e.children ? null : "#", page: e.children ? 10 : null }))
];
const barEntries = BAR.flatMap((e, i) => [
    entry({ ...e, page: e.page }, null, i).replace(/        isCurrent \{[\s\S]*?\n        \}\n/, ""),
    ...(e.children || []).map((c, j) => entry({ ...c, url: c.id === "nb-signout" ? null : "#", page: c.id === "nb-signout" ? 1 : null, cond: null }, e.id, j).replace(/        isCurrent \{[\s\S]*?\n        \}\n/, ""))
]);
fs.writeFileSync(ROOT + "shared-components/lists.apx",
    `list navigation-bar (\n    name: Navigation Bar\n\n${barEntries.join("\n")}\n)\n\n` +
    `list navigation-menu (\n    name: Navigation Menu\n\n${STUDIO_MENU.map(studioEntry).join("\n")}\n)\n\n` +
    `list demo-menu (\n    name: Demo Menu\n\n${flat(DEMO_MENU).join("\n")}\n)\n`);

// ---------- breadcrumbs ----------
const crumbs = [["home", "Gallery", 1, null], ["designer", "Designer", 2, "home"], ["how-to-use", "How to Use", 3, "home"]];
fs.writeFileSync(ROOT + "shared-components/breadcrumbs.apx", `breadcrumb breadcrumb (\n    name: Breadcrumb\n\n` + crumbs.map(([id, name, page, parent], i) => `    entry ${id} (
        name: ${name}
        pageNumber: ${page}
        execution {
            sequence: ${(i + 1) * 10}
        }${parent ? `
        appearance {
            parentEntry: @${parent}
        }` : `
        link {
            target: {
                page: ${page}
            }
        }`}
    )
`).join("\n") + ")\n");

// ---------- demo pages ----------
export const DEMO_SIDE = ["js-navCollapsed--default", "ns-Fx--tips", "ns-Fx--search", "ns-Fx--tabbar", "ns-Accent--indigo"];
const KPIS = [["Open orders", "128", "+12% this week"], ["Revenue", "48,290", "+4.1% this month"], ["Tasks due", "17", "5 overdue"], ["New customers", "36", "+9 since Monday"]];
const ORDERS = [["#10482", "Lena Fischer", "Shipped", "1,240.00"], ["#10481", "Omar Haddad", "Processing", "312.50"], ["#10480", "Priya Nair", "Shipped", "89.90"],
                ["#10479", "Jonas Berg", "Cancelled", "0.00"], ["#10478", "Maya Chen", "Delivered", "2,018.00"], ["#10477", "Tom Evans", "Delivered", "455.10"]];
const region = (id, name, seq, html, { slot = "body", template = "@/standard", span, newRow = true, opts = [] } = {}) => `    region ${id} (
        name: ${name}
        type: staticContent
        source {
            htmlCode:
                \`\`\`html
${ind(html, 16)}
                \`\`\`
        }
        layout {
            sequence: ${seq}
            slot: ${slot}${newRow ? "" : "\n            startNewRow: false"}${span ? `\n            columnSpan: ${span}` : ""}
        }
        appearance {
            template: ${template}
            templateOptions: ${opts.length ? `[\n                #DEFAULT#\n${opts.map(o => "                " + o).join("\n")}\n            ]` : "#DEFAULT#"}
        }
    )
`;
const titleBar = name => `<div class="t-BreadcrumbRegion t-BreadcrumbRegion--showBreadcrumb t-BreadcrumbRegion--useBreadcrumbTitle">
  <div class="t-BreadcrumbRegion-body"><div class="t-BreadcrumbRegion-breadcrumb">
    <ul class="t-Breadcrumb"><li class="t-Breadcrumb-item"><a href="f?p=&APP_ID.:DEMO-DASHBOARD:&APP_SESSION.">Workspace</a></li><li class="t-Breadcrumb-item is-active"><h1 class="t-Breadcrumb-label">${name}</h1></li></ul>
  </div></div>
</div>`;
for (const d of DEMO_PAGES) {
    const top = d.page === 19, dash = d.page === 10 || top;
    let body = region("title", d.name, 10, titleBar(top ? "Dashboard" : d.name), { slot: "breadcrumbBar", template: "@/blank-with-attributes" });
    if (dash) {
        KPIS.forEach(([t, v, s], i) => { body += "\n" + region("kpi-" + (i + 1), t, 20 + i, `<div class="nvx-Kpi"><span>${t}</span><strong>${v}</strong><small>${s}</small></div>`, { span: 3, newRow: i === 0, opts: ["t-Region--hideHeader js-addHiddenHeadingRoleDesc"] }); });
        body += "\n" + region("orders", "Recent orders", 40, `<table class="t-Report-report nvx-Table"><thead><tr><th class="t-Report-colHead">Order</th><th class="t-Report-colHead">Customer</th><th class="t-Report-colHead">Status</th><th class="t-Report-colHead">Total</th></tr></thead><tbody>
${ORDERS.map(r => `<tr>${r.map(c => `<td class="t-Report-cell">${c}</td>`).join("")}</tr>`).join("\n")}
</tbody></table>`);
        body += "\n" + region("activity", "Activity", 50, `<p>Lena Fischer updated the delivery address of order #10482. Omar Haddad added two items to the spring catalogue. The weekly sales report is ready to download.</p>
<p>This is a demo page of Navigation Studio: everything on it is invented. Open the Designer to try the menu looks.</p>`);
    } else {
        body += "\n" + region("about", d.name, 20, `<p>A demo page for the <strong>${d.name}</strong> entry of the demo menu. Try the sub-levels of Projects, Reports and Settings, the badges on Inbox, Tasks and Orders, the section headings, the menu search (Ctrl+K) and the collapsed menu.</p>
<p><a href="f?p=&APP_ID.:DESIGNER:&APP_SESSION.">Open the Designer</a> to change the look.</p>`);
    }
    const apx = `page ${d.page} (
    name: ${d.name}
    alias: ${d.alias}
    title: ${d.name}
    appearance {
        pageTemplate: @/standard
        templateOptions: #DEFAULT#
    }
    navigationMenu {
        overrideUserInterfaceLevel: true
        list: @demo-menu
        listPosition: ${top ? "top" : "side"}
        listTemplate: @${top ? "modern-top-navigation" : "modern-side-navigation"}
        templateOptions: [
            #DEFAULT#
${(top ? ["js-tabLike", "ns-Accent--indigo"] : DEMO_SIDE.slice(4)).map(c => "            " + c).join("\n")}
        ]
    }
    navigation {
        cursorFocus: doNotFocusCursor
    }
    css {
        inline:
            \`\`\`css
            .nvx-Kpi { display: flex; flex-direction: column; gap: .125rem; }
            .nvx-Kpi span { font-size: .8125rem; opacity: .75; }
            .nvx-Kpi strong { font-size: 1.75rem; font-weight: 700; line-height: 1.2; }
            .nvx-Kpi small { font-size: .75rem; opacity: .7; }
            .nvx-Table { width: 100%; }
            \`\`\`
    }
    security {
        authentication: public
        pageAccessProtection: unrestricted
        formAutoComplete: false
    }

${body}
)
`;
    fs.writeFileSync(`${ROOT}pages/p${String(d.page).padStart(5, "0")}-${d.alias.toLowerCase()}.apx`, apx);
}
console.log("lists, breadcrumbs and", DEMO_PAGES.length, "demo pages written");
