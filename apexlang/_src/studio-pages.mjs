// Writes the Gallery (1), Designer (2) and How to Use (3) pages: node _src/studio-pages.mjs
import fs from "node:fs";
import { PRESETS, SIDE_DEFAULTS, BAR_DEFAULTS, TOP_DEFAULTS } from "./presets.mjs";
import { DESIGNS, TOP_DESIGNS, ACCENTS } from "./options.mjs";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");

const pageHead = (no, name, alias, title) => `page ${no} (
    name: ${name}
    alias: ${alias}
    title: ${title}
    appearance {
        pageTemplate: @/standard
        templateOptions: #DEFAULT#
    }
    navigation {
        cursorFocus: doNotFocusCursor
    }`;
const pageSec = `    security {
        authentication: public
        pageAccessProtection: argumentsMustHaveChecksum
        formAutoComplete: false
    }`;
const crumb = name => `    region breadcrumb (
        name: ${name}
        type: breadcrumb
        source {
            breadcrumb: @breadcrumb
        }
        layout {
            sequence: 10
            slot: breadcrumbBar
        }
        appearance {
            template: @/title-bar
            templateOptions: [
                #DEFAULT#
                t-BreadcrumbRegion--useBreadcrumbTitle
            ]
        }
        componentAppearance {
            breadcrumbTemplate: @/breadcrumb
            templateOptions: #DEFAULT#
        }
    )`;
const js = (fn, onload) => `    javaScript {${fn ? `
        functionAndGlobalVariableDeclaration:
            \`\`\`javascript-browser
${ind(fn, 12)}
            \`\`\`` : ""}
        executeWhenPageLoads:
            \`\`\`javascript-browser
${ind(onload, 12)}
            \`\`\`
    }`;
const cssBlock = css => `    css {
        inline:
            \`\`\`css
${ind(css, 12)}
            \`\`\`
    }`;
const staticRegion = (id, name, seq, html, template = "@/blank-with-attributes", extra = "") => `    region ${id} (
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
            slot: body${extra}
        }
        appearance {
            template: ${template}
            templateOptions: #DEFAULT#
        }
    )`;
const write = (file, s) => fs.writeFileSync(ROOT + "pages/" + file, s);

// ---------- 1 Gallery ----------
const galleryFn = `// Ready-made looks of the Navigation Studio templates; thumbnails are app files gallery/<id>.jpg (made from the demo page).
var NS_PRESETS = ${JSON.stringify(PRESETS, null, 0).replace(/\},\{/g, "},\n    {")};`;
const galleryLoad = `(function ($) {
    var box = document.getElementById("nvs-gallery"), files = box.getAttribute("data-files"),
        app = box.getAttribute("data-app"), session = box.getAttribute("data-session"), designer = box.getAttribute("data-designer");
    function esc(s) { return apex.util.escapeHTML(String(s)); }
    function demo(p) { return "f?p=" + app + ":" + (p.pos === "top" ? "DEMO-TOP-NAV" : "DEMO-DASHBOARD") + ":" + session; }
    function look(p) { return "#look=" + encodeURIComponent(p.nav) + "&bar=" + encodeURIComponent(p.bar) + "&pos=" + p.pos + "&st=" + p.state; }
    function full(p) { return "#ns=" + encodeURIComponent(p.nav) + "&nb=" + encodeURIComponent(p.bar) + "&nsx=" + p.state; }
    box.innerHTML = NS_PRESETS.map(function (p) {
        return '<article class="nvs-Card" data-tags="' + esc(p.tags) + '">' +
            '<a class="nvs-Card-shot" href="' + esc(designer + look(p)) + '" aria-label="' + esc("Customize " + p.name) + '"><img src="' + esc(files + "gallery/" + p.id + ".jpg") + '" alt="" loading="lazy" width="640" height="400"></a>' +
            '<div class="nvs-Card-body"><h3 class="nvs-Card-title">' + esc(p.name) + '</h3><span class="nvs-Card-type">' + (p.pos === "top" ? "Top menu" : "Side menu") + (/collapsed/.test(p.tags) ? " - collapsed" : "") + '</span>' +
            '<div class="nvs-Card-actions"><a class="t-Button t-Button--small t-Button--hot" href="' + esc(designer + look(p)) + '"><span class="t-Button-label">Customize</span></a>' +
            '<a class="t-Button t-Button--small" target="_blank" rel="noopener" href="' + esc(demo(p) + full(p)) + '"><span class="t-Button-label">Full Screen</span></a></div></div></article>';
    }).join("");
    $(document).on("click", ".nvs-Filter button", function () {
        var f = this.getAttribute("data-f");
        $(".nvs-Filter button").attr("aria-pressed", "false");
        this.setAttribute("aria-pressed", "true");
        $(".nvs-Card").each(function () { this.hidden = !!f && (" " + this.getAttribute("data-tags") + " ").indexOf(" " + f + " ") < 0; });
    });
})(apex.jQuery);`;
const galleryCss = `.nvs-Hero { padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem); border-radius: 18px; color: #ffffff;
            background: radial-gradient(circle at 88% 20%, rgba(255,255,255,.16), transparent 40%), linear-gradient(120deg, #1e1b4b, #4338ca 55%, #7c3aed); }
.nvs-Hero h1 { margin: 0 0 .5rem; font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.1; }
.nvs-Hero p { max-width: 50rem; margin: 0 0 1.25rem; font-size: 1.0625rem; line-height: 1.6; opacity: .92; }
.nvs-Hero .t-Button { margin: 0 .5rem .5rem 0; }
.nvs-Hero .t-Button--hot { --a-button-background-color: #ffffff; --a-button-text-color: #312e81; --a-button-hover-background-color: #e0e7ff; --a-button-hover-text-color: #312e81; }
.nvs-Hero .nvs-Ghost { --a-button-background-color: transparent; --a-button-text-color: #ffffff; --a-button-hover-background-color: rgba(255,255,255,.14); --a-button-hover-text-color: #ffffff; border: 1px solid rgba(255,255,255,.6); }
.nvs-Filter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.5rem 0 1rem; }
.nvs-Filter button { padding: .375rem .95rem; border-radius: 999px; border: 1px solid var(--ut-component-border-color, #d0d5dd); background: var(--ut-component-background-color, #fff); color: inherit; font: inherit; font-size: .875rem; cursor: pointer; }
.nvs-Filter button[aria-pressed="true"] { background: #312e81; border-color: #312e81; color: #ffffff; }
.nvs-Filter button:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; }
.nvs-Grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: 1.25rem; }
.nvs-Card { display: flex; flex-direction: column; overflow: hidden; border-radius: 14px; border: 1px solid var(--ut-component-border-color, #e4e7ec); background: var(--ut-component-background-color, #fff);
            box-shadow: 0 1px 2px rgba(16,24,40,.05); transition: box-shadow .2s ease, transform .2s ease; }
.nvs-Card:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -18px rgba(16,24,40,.35); }
.nvs-Card[hidden] { display: none; }
.nvs-Card-shot { display: block; aspect-ratio: 16 / 10; overflow: hidden; background: #eef0f4; }
.nvs-Card-shot img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.nvs-Card:hover .nvs-Card-shot img { transform: scale(1.03); }
.nvs-Card-body { display: flex; flex-direction: column; gap: .5rem; padding: .875rem 1rem 1rem; }
.nvs-Card-title { margin: 0; font-size: 1rem; font-weight: 700; }
.nvs-Card-type { align-self: flex-start; padding: .1rem .55rem; border-radius: 999px; background: rgba(67,56,202,.1); color: #3730a3; font-size: .75rem; font-weight: 600; }
.nvs-Card-actions { display: flex; gap: .5rem; margin-top: .25rem; }
.nvs-Card-actions .t-Button { flex: 1; justify-content: center; }
@media (prefers-reduced-motion: reduce) { .nvs-Card, .nvs-Card-shot img { transition: none; } .nvs-Card:hover { transform: none; } .nvs-Card:hover .nvs-Card-shot img { transform: none; } }`;
const galleryHero = `<div class="nvs-Hero">
  <h1>Navigation menus for Oracle APEX</h1>
  <p>${DESIGNS.length} designs for the side navigation menu, ${TOP_DESIGNS.length} for the top menu, and a navigation bar that matches them - light and dark, collapsed icon rails, section headings, badges, menu search and a phone bottom bar. Every look is a template option. Pick one, fine-tune it in the Designer, copy the templates into your app.</p>
  <a class="t-Button t-Button--hot" href="f?p=&APP_ID.:DESIGNER:&APP_SESSION."><span class="t-Button-label">Open the Designer</span></a>
  <a class="t-Button nvs-Ghost" href="f?p=&APP_ID.:HOW-TO-USE:&APP_SESSION."><span class="t-Button-label">How to use it</span></a>
</div>
<div class="nvs-Filter" role="group" aria-label="Filter">
  <button type="button" data-f="" aria-pressed="true">All</button>
  <button type="button" data-f="side" aria-pressed="false">Side menu</button>
  <button type="button" data-f="top" aria-pressed="false">Top menu</button>
  <button type="button" data-f="light" aria-pressed="false">Light</button>
  <button type="button" data-f="dark" aria-pressed="false">Dark</button>
  <button type="button" data-f="collapsed" aria-pressed="false">Collapsed</button>
</div>`;
const gallery = [pageHead(1, "Gallery", "HOME", "Navigation Studio - Gallery"), js(galleryFn, galleryLoad), cssBlock(galleryCss), pageSec, "",
    staticRegion("hero", "Navigation Studio", 10, galleryHero), "",
    staticRegion("gallery", "Gallery", 20, `<div class="nvs-Grid" id="nvs-gallery" data-files="#APP_FILES#" data-app="&APP_ID." data-session="&APP_SESSION." data-designer="f?p=&APP_ID.:DESIGNER:&APP_SESSION."></div>`),
    "", ")", ""].join("\n");
write("p00001-home.apx", gallery);

// ---------- 2 Designer ----------
const ACC = ACCENTS.map(([id, n]) => `${n};ns-Accent--${id}`).join(",");
const designerLoad = `// Designer: every choice is a template option (a CSS class) of Modern Side / Top Navigation or Modern Navigation Bar.
// The preview iframe shows the real demo page; the classes travel in its URL hash (#ns=<menu>&nb=<bar>&nsx=<state>).
(function ($) {
    var DEF = { side: "${SIDE_DEFAULTS}".split(" "), top: "${TOP_DEFAULTS}".split(" "), bar: "${BAR_DEFAULTS}".split(" ") };
    // t: side / top / nav (both menus) / bar
    var SELECTS = [
        { item: "P2_DESIGN", group: "Design", t: "side" }, { item: "P2_TOP_DESIGN", group: "Design", t: "top" },
        { item: "P2_ACCENT", group: "Accent Color", t: "nav" }, { item: "P2_SCHEME", group: "Color Scheme", t: "nav" },
        { item: "P2_COLLAPSE", group: "Collapse Mode", t: "side" }, { item: "P2_HEADER", group: "Header", t: "nav" },
        { item: "P2_DENSITY", group: "Density", t: "side" }, { item: "P2_BADGE", group: "Badges", t: "side" }, { item: "P2_WIDTH", group: "Width", t: "side" },
        { item: "P2_BAR_STYLE", group: "Style", t: "bar" }, { item: "P2_BAR_ACCENT", group: "Accent Color", t: "bar" }, { item: "P2_BAR_BADGE", group: "Badges", t: "bar" }
    ];
    var SWITCHES = [
        { item: "P2_SEARCH", css: "ns-Fx--search", label: "Menu Search", t: "side" }, { item: "P2_TIPS", css: "ns-Fx--tips", label: "Tooltips When Collapsed", t: "side" },
        { item: "P2_TABBAR", css: "ns-Fx--tabbar", label: "Phone Bottom Bar", t: "side" }, { item: "P2_COLLAPSED", css: "js-defaultCollapsed", label: "Collapsed by Default", t: "side" },
        { item: "P2_TABLIKE", css: "js-tabLike", label: "Behave Like Tabs", t: "top" }, { item: "P2_LOGO", css: "ns-Logo--none", label: "Hide Logo Mark", t: "nav" },
        { item: "P2_AVATAR", css: "ns-Bar--avatar", label: "User Avatar", t: "bar" }, { item: "P2_BAR_SEARCH", css: "ns-Bar--search", label: "Search Button", t: "bar" },
        { item: "P2_PULSE", css: "ns-Bar--pulse", label: "Pulsing Badges", t: "bar" }
    ];
    var frame = document.getElementById("nvd-frame"), app = frame.getAttribute("data-app"), session = frame.getAttribute("data-session"), lastReload = null;
    function esc(s) { return apex.util.escapeHTML(String(s)); }
    function pos() { return $v("P2_POSITION") === "TOP" ? "top" : "side"; }
    function on(t) { return t === "nav" || t === "bar" || t === pos(); }
    function pageUrl() { return "f?p=" + app + ":" + (pos() === "top" ? "DEMO-TOP-NAV" : "DEMO-DASHBOARD") + ":" + session; }

    // a look passed from the Gallery: #look=<menu classes>&bar=<bar classes>&pos=side|top&st=expanded|collapsed
    (function fromHash() {
        var h = location.hash, g = function (k) { var m = new RegExp("[#&]" + k + "=([^&]*)").exec(h); return m ? decodeURIComponent(m[1]) : null; };
        if (!g("look")) { return; }
        var nav = g("look").split(/\\s+/), bar = (g("bar") || "").split(/\\s+/);
        apex.item("P2_POSITION").setValue(g("pos") === "top" ? "TOP" : "SIDE", null, true);
        apex.item("P2_STATE").setValue(g("st") === "collapsed" ? "COLLAPSED" : "EXPANDED", null, true);
        var lp = g("pos") === "top" ? "top" : "side", mine = function (s) { return s.t === "nav" || s.t === "bar" || s.t === lp; };
        SELECTS.forEach(function (s) {
            if (!mine(s)) { return; }
            var cls = s.t === "bar" ? bar : nav, hit = $("#" + s.item + " option").filter(function () { return this.value && cls.indexOf(this.value) >= 0; }).first();
            if (hit.length || $("#" + s.item + " option[value='']").length) { apex.item(s.item).setValue(hit.length ? hit.val() : "", null, true); }
        });
        SWITCHES.filter(mine).forEach(function (s) { apex.item(s.item).setValue((s.t === "bar" ? bar : nav).indexOf(s.css) >= 0 ? "Y" : "N", null, true); });
    })();

    function chosen() {
        var p = pos(), nav = [], bar = [], rows = [];
        SELECTS.forEach(function (s) {
            if (!on(s.t)) { return; }
            var v = $v(s.item), text = $("#" + s.item + " option:selected").text();
            if (v) { (s.t === "bar" ? bar : nav).push(v); }
            rows.push({ t: s.t, group: s.group, option: text, isDefault: !v || DEF[p].indexOf(v) >= 0 });
        });
        SWITCHES.forEach(function (s) {
            if (!on(s.t)) { return; }
            var y = $v(s.item) === "Y";
            if (y) { (s.t === "bar" ? bar : nav).push(s.css); }
            rows.push({ t: s.t, group: s.label, option: y ? "On" : "Off", isDefault: y === (DEF[s.t === "bar" ? "bar" : p].indexOf(s.css) >= 0) });
        });
        return { pos: p, nav: nav, bar: bar, rows: rows };
    }
    // #DEFAULT# plus the extra options when every default is kept, otherwise the full list
    function optionList(all, defs) {
        var keep = defs.every(function (d) { return all.indexOf(d) >= 0; });
        return keep ? ["#DEFAULT#"].concat(all.filter(function (c) { return defs.indexOf(c) < 0; })) : all;
    }
    function relevance(c) {
        var d = $v("P2_DESIGN"), td = $v("P2_TOP_DESIGN"),
            alwaysDark = c.pos === "side" ? /midnight|terminal/.test(d) : /midnight/.test(td);
        var rules = [
            ["P2_SCHEME", alwaysDark, "always dark in this design"],
            ["P2_TIPS", c.pos === "side" && (/rail/.test(d) || $v("P2_COLLAPSE") === "js-navCollapsed--hidden"), /rail/.test(d) ? "Rail shows labels" : "the menu hides completely"],
            ["P2_BAR_SEARCH", c.pos === "top" || $v("P2_SEARCH") !== "Y", "needs Menu Search in the side menu"]
        ];
        rules.forEach(function (r) {
            var cont = $("#" + r[0] + "_CONTAINER");
            apex.item(r[0])[r[1] ? "disable" : "enable"]();
            cont.toggleClass("nvd-Off", r[1]).attr("data-why", r[1] ? r[2] : null);
        });
        SELECTS.concat(SWITCHES).forEach(function (s) { $("#" + s.item + "_CONTAINER").toggle(on(s.t)); });
        $("#P2_STATE_CONTAINER").toggle(c.pos === "side");
        $("#P2_TOP_DESIGN_CONTAINER").toggle(c.pos === "top");
    }
    function render() {
        var c = chosen(), want = pageUrl(), state = c.pos === "side" && $v("P2_STATE") === "COLLAPSED" ? "collapsed" : "expanded",
            hash = "#ns=" + encodeURIComponent(c.nav.join(" ")) + "&nb=" + encodeURIComponent(c.bar.join(" ")) + "&nsx=" + state,
            reloadKey = want + "|" + $v("P2_COLLAPSE");
        relevance(c);
        // a new page or Collapse Mode needs a fresh load; everything else follows the hash without a reload
        if (reloadKey !== lastReload) {
            var was = (frame.getAttribute("src") || "").split("#")[0];
            frame.setAttribute("src", want + hash);
            if (was === want) { try { frame.contentWindow.location.reload(); } catch (e) { /* cross-origin: ignore */ } }
        } else { try { frame.contentWindow.location.hash = hash; } catch (e) { frame.setAttribute("src", want + hash); } }
        lastReload = reloadKey;
        var navName = c.pos === "top" ? "Modern Top Navigation" : "Modern Side Navigation";
        $("#nvd-summary").html(["nav", "bar"].map(function (t) {
            return '<p class="nvd-H">' + esc(t === "bar" ? "Modern Navigation Bar" : navName) + '</p><dl class="nvd-List">' + c.rows.filter(function (r) { return (r.t === "bar") === (t === "bar"); }).map(function (r) {
                return "<dt>" + esc(r.group) + "</dt><dd" + (r.isDefault ? ' class="is-default"' : "") + ">" + esc(r.option) + "</dd>";
            }).join("") + "</dl>";
        }).join(""));
        var navList = optionList(c.nav, DEF[c.pos]), barList = optionList(c.bar, DEF.bar), arr = function (l) { return l.length === 1 ? " " + l[0] + "\\n" : " [\\n" + l.map(function (x) { return "        " + x + "\\n"; }).join("") + "    ]\\n"; };
        $("#nvd-code").text("navigationMenu {\\n" + (c.pos === "top" ? "    listPosition: top\\n" : "") + "    listTemplate: @" + (c.pos === "top" ? "modern-top-navigation" : "modern-side-navigation") + "\\n    templateOptions:" + arr(navList) +
            "    list: @navigation-menu\\n}\\nnavigationBar {\\n    list: @navigation-bar\\n    listTemplate: @modern-navigation-bar\\n    templateOptions:" + arr(barList) + "}");
        $("#nvd-where").html("<strong>Shared Components &gt; User Interface Attributes</strong>: Navigation Menu - Position <strong>" + (c.pos === "top" ? "Top" : "Side") + "</strong>, List Template <strong>" + navName +
            "</strong>; Navigation Bar - List Template <strong>Modern Navigation Bar</strong>. Tick the template options listed below, or paste the APEXlang into <code>application.apx</code>.");
    }

    $(SELECTS.concat(SWITCHES).map(function (s) { return "#" + s.item; }).concat(["#P2_POSITION", "#P2_STATE"]).join(",")).on("change", render);
    // Desktop: the page is laid out at 1280px (so the menu stays expanded) and scaled down to fit the preview
    function fit() {
        var stage = document.getElementById("nvd-stage"), desk = $v("P2_DEVICE") === "DESKTOP", s = Math.min(1, stage.clientWidth / 1280);
        stage.setAttribute("data-device", $v("P2_DEVICE"));
        frame.style.width = desk ? "1280px" : "";
        frame.style.height = desk ? (stage.clientHeight / s) + "px" : "";
        frame.style.transform = desk && s < 1 ? "scale(" + s + ")" : "";
    }
    $("#P2_DEVICE").on("change", fit);
    $(window).on("resize apexwindowresized", fit);
    fit();
    $(document).on("click", ".js-nvd-copy", function () {
        var t = $(this).attr("data-target");
        navigator.clipboard.writeText($("#" + t).text()).then(function () { apex.message.showPageSuccess("Copied."); });
    });
    $(document).on("click", ".js-nvd-open", function () { window.open(frame.getAttribute("src"), "_blank"); });
    render();
})(apex.jQuery);`;
const designerCss = `.nvd-Stage { display: flex; justify-content: center; align-items: center; height: min(80vh, 780px); min-height: 520px; overflow: hidden; border-radius: 12px;
             border: 1px solid var(--ut-component-border-color, #ddd); background: repeating-conic-gradient(rgba(0,0,0,.035) 0 25%, transparent 0 50%) 0 0 / 24px 24px; }
.nvd-Stage { position: relative; }
.nvd-Stage iframe { display: block; width: 100%; height: 100%; border: 0; background: #fff; transition: width .3s ease, border-radius .3s ease; }
.nvd-Stage[data-device="DESKTOP"] { display: block; }
.nvd-Stage[data-device="DESKTOP"] iframe { transform-origin: 0 0; transition: none; }
.nvd-Stage[data-device="TABLET"], .nvd-Stage[data-device="PHONE"] { padding: 16px 0; }
.nvd-Stage[data-device="TABLET"] iframe { width: 820px; max-width: calc(100% - 32px); border-radius: 20px; box-shadow: 0 0 0 12px #1f2329, 0 24px 48px -12px rgba(0,0,0,.45); }
.nvd-Stage[data-device="PHONE"] iframe { width: 390px; max-width: calc(100% - 32px); border-radius: 28px; box-shadow: 0 0 0 10px #1f2329, 0 24px 48px -12px rgba(0,0,0,.45); }
.nvd-List { display: grid; grid-template-columns: auto 1fr; gap: .375rem 1rem; margin: 0 0 1rem; font-size: .875rem; }
.nvd-List dt { opacity: .75; }
.nvd-List dd { margin: 0; font-weight: 600; }
.nvd-List dd.is-default::after { content: " (default)"; font-weight: 400; opacity: .7; }
.nvd-Code { margin: 0 0 1rem; padding: .875rem 1rem; overflow-x: auto; border-radius: 8px; background: #1f2329; color: #e6edf3; font-size: .8125rem; line-height: 1.5; white-space: pre-wrap; }
.nvd-Where { margin: 0 0 .75rem; padding: .625rem .875rem; border-radius: 8px; background: rgba(67,56,202,.08); font-size: .8125rem; line-height: 1.5; }
.nvd-H { margin: 1rem 0 .5rem; font-size: .875rem; font-weight: 700; }
.nvd-Off { opacity: .55; }
.nvd-Off[data-why]::after { content: attr(data-why); display: block; padding: 0 .75rem .25rem; font-size: .75rem; font-style: italic; }
@media (max-width: 640px) { .nvd-Stage { height: 72vh; min-height: 460px; } }`;
const sel = (name, label, seq, values, nul, def) => `    pageItem ${name} (
        type: selectList
        label {
            label: ${label}
            alignment: left
        }
        lov {
            type: staticValues
            staticValues: STATIC2:${values}${nul === false ? "\n            displayNullValue: false" : `\n            nullDisplayValue: ${nul}`}
        }
        layout {
            sequence: ${seq}
            region: @options
            slot: regionBody
            alignment: left
        }
        appearance {
            template: @/optional-floating
            templateOptions: #DEFAULT#
        }${def ? `
        default {
            type: static
            staticValue: ${def}
        }` : ""}
        sessionState {
            storage: request
        }
    )`;
const sw = (name, label, seq, def, newRow) => `    pageItem ${name} (
        type: switch
        label {
            label: ${label}
            alignment: left
        }
        layout {
            sequence: ${seq}
            region: @options
            slot: regionBody
            alignment: left${newRow ? "" : "\n            startNewRow: false"}
        }
        appearance {
            template: @/optional-floating
            templateOptions: #DEFAULT#
        }
        default {
            type: static
            staticValue: ${def}
        }
        sessionState {
            storage: request
        }
    )`;
const radio = (name, label, seq, values, def) => `    pageItem ${name} (
        type: radioGroup
        label {
            label: ${label}
            alignment: left
        }
        settings {
            noOfCols: ${values.split(",").length}
        }
        lov {
            type: staticValues
            staticValues: STATIC2:${values}
            displayNullValue: false
        }
        layout {
            sequence: ${seq}
            region: @preview
            slot: edit
        }
        appearance {
            template: @/hidden
            templateOptions: [
                #DEFAULT#
                t-Form-fieldContainer--radioButtonGroup
            ]
        }
        default {
            type: static
            staticValue: ${def}
        }
        sessionState {
            storage: request
        }
    )`;
const designer = [pageHead(2, "Designer", "DESIGNER", "Navigation Studio - Designer"), js(null, designerLoad), cssBlock(designerCss), pageSec, "", crumb("Designer"), "",
`    region options (
        name: Template Options
        type: staticContent
        layout {
            sequence: 20
            slot: body
            columnSpan: 4
        }
        appearance {
            template: @/standard
            templateOptions: #DEFAULT#
        }
    )`, "",
`    region preview (
        name: Live Preview
        type: staticContent
        source {
            htmlCode: <div class="nvd-Stage" id="nvd-stage" data-device="DESKTOP"><iframe id="nvd-frame" title="Navigation preview" data-app="&APP_ID." data-session="&APP_SESSION."></iframe></div>
        }
        layout {
            sequence: 30
            slot: body
            startNewRow: false
            columnSpan: 8
        }
        appearance {
            template: @/standard
            templateOptions: [
                #DEFAULT#
                t-Region--noPadding
            ]
        }
    )`, "",
`    region summary (
        name: Your Choice
        type: staticContent
        source {
            htmlCode:
                \`\`\`html
                <p class="nvd-Where" id="nvd-where"></p>
                <div id="nvd-summary"></div>
                <p class="nvd-H">APEXlang (application.apx)</p>
                <pre class="nvd-Code" id="nvd-code"></pre>
                <button type="button" class="t-Button t-Button--small t-Button--iconLeft js-nvd-copy" data-target="nvd-code"><span class="t-Icon fa fa-copy" aria-hidden="true"></span><span class="t-Button-label">Copy APEXlang</span></button>
                \`\`\`
        }
        layout {
            sequence: 10
            parentRegion: @options
            slot: subRegions
        }
        appearance {
            template: @/content-block
            templateOptions: [
                #DEFAULT#
                t-ContentBlock--h3
            ]
        }
    )`, "",
    sel("P2_POSITION", "Menu Position", 1, "Side Navigation;SIDE,Top Navigation;TOP", false, "SIDE"), "",
    sel("P2_DESIGN", "Design", 5, DESIGNS.slice(1).map(([id, n]) => `${n};ns-Design--${id}`).join(","), "Clean", ""), "",
    sel("P2_TOP_DESIGN", "Design", 6, TOP_DESIGNS.slice(1).map(([id, n]) => `${n};ns-Top--${id}`).join(","), "Underline", ""), "",
    sel("P2_ACCENT", "Accent Color", 10, ACC, "Theme Color", "ns-Accent--indigo"), "",
    sel("P2_SCHEME", "Color Scheme", 20, "Dark;ns-Scheme--dark,Follow Device Setting;ns-Scheme--auto", "Light", ""), "",
    sel("P2_COLLAPSE", "Collapse Mode", 30, "Icons;js-navCollapsed--default,Hidden;js-navCollapsed--hidden", false, "js-navCollapsed--default"), "",
    sel("P2_HEADER", "Header", 40, "Keep Theme Header;ns-Header--theme", "Match the Menu", ""), "",
    sel("P2_DENSITY", "Density", 50, "Compact;ns-Density--compact,Spacious;ns-Density--spacious", "Comfortable", ""), "",
    sel("P2_BADGE", "Badges", 60, "Soft;ns-Badge--soft,Red;ns-Badge--red,Dot;ns-Badge--dot", "Accent", ""), "",
    sel("P2_WIDTH", "Width", 70, "Narrow;ns-Width--narrow,Wide;ns-Width--wide", "Regular", ""), "",
    sw("P2_SEARCH", "Menu Search", 80, "Y", true), "",
    sw("P2_TIPS", "Tooltips When Collapsed", 81, "Y", false), "",
    sw("P2_TABBAR", "Phone Bottom Bar", 82, "Y", true), "",
    sw("P2_COLLAPSED", "Collapsed by Default", 83, "N", false), "",
    sw("P2_TABLIKE", "Behave Like Tabs", 84, "Y", true), "",
    sw("P2_LOGO", "Hide Logo Mark", 85, "N", true), "",
    sel("P2_BAR_STYLE", "Navigation Bar Style", 90, "Icons Only;ns-Bar--icons,Pills;ns-Bar--pills,Segmented;ns-Bar--segmented,Outlined;ns-Bar--outline", "Icon and Label", ""), "",
    sel("P2_BAR_ACCENT", "Navigation Bar Accent", 91, ACC, "Match the Menu", ""), "",
    sel("P2_BAR_BADGE", "Navigation Bar Badges", 92, "Red;ns-Bar--badgeRed,Dot;ns-Bar--badgeDot", "Accent", ""), "",
    sw("P2_AVATAR", "User Avatar", 93, "Y", true), "",
    sw("P2_BAR_SEARCH", "Search Button", 94, "Y", false), "",
    sw("P2_PULSE", "Pulsing Badges", 95, "N", true), "",
    radio("P2_DEVICE", "Preview On", 10, "Desktop;DESKTOP,Tablet;TABLET,Phone;PHONE", "DESKTOP"), "",
    radio("P2_STATE", "Menu", 15, "Expanded;EXPANDED,Collapsed;COLLAPSED", "EXPANDED"), "",
`    button open-full (
        buttonName: OPEN_FULL
        label: Open Full Page
        layout {
            sequence: 20
            region: @preview
            slot: edit
        }
        appearance {
            buttonTemplate: @/text-with-icon
            templateOptions: [
                #DEFAULT#
                t-Button--iconLeft
            ]
            cssClasses: js-nvd-open
            icon: fa-external-link
        }
        behavior {
            action: definedByDynamicAction
        }
    )`, "", ")", ""].join("\n");
write("p00002-designer.apx", designer);

// ---------- 3 How to Use ----------
const howCss = `.nvs-Doc { max-width: 60rem; line-height: 1.7; }
.nvs-Doc h3 { margin: 1.75rem 0 .5rem; font-size: 1.125rem; }
.nvs-Doc h3:first-child { margin-top: 0; }
.nvs-Doc ol, .nvs-Doc ul { padding-inline-start: 1.25rem; margin: .25rem 0 .75rem; }
.nvs-Doc li { margin: .2rem 0; }
.nvs-Doc pre { margin: .5rem 0 1rem; padding: .875rem 1rem; overflow-x: auto; border-radius: 8px; background: #1f2329; color: #e6edf3; font-size: .8125rem; line-height: 1.55; }
.nvs-Doc p code, .nvs-Doc li code, .nvs-Doc td code { padding: .05rem .35rem; border-radius: 4px; background: rgba(127,127,127,.14); font-size: .8125rem; }
.nvs-Doc table { width: 100%; border-collapse: collapse; margin: .5rem 0 1rem; font-size: .875rem; }
.nvs-Doc th, .nvs-Doc td { padding: .45rem .6rem; border-bottom: 1px solid var(--ut-component-border-color, #e4e7ec); text-align: left; vertical-align: top; }
.nvs-Doc th { font-weight: 700; opacity: .8; }
.nvs-Doc td:first-child { font-weight: 600; white-space: nowrap; }`;
const howHtml = `<div class="nvs-Doc">
<h3>1. Get Navigation Studio into your workspace</h3>
<ol>
  <li>Download <code>navigation-studio.sql</code> from <a href="https://github.com/HashaamShoukat/apex-navigation-studio" target="_blank" rel="noopener">GitHub</a>.</li>
  <li><strong>App Builder &gt; Import</strong>, install it with any application ID. No database objects; APEX 26.1 or later.</li>
</ol>

<h3>2. Copy the templates into your application</h3>
<p>In <em>your</em> application: <strong>Shared Components &gt; Templates &gt; Create &gt; List &gt; As a Copy of an Existing Template</strong>, copy from <strong>Navigation Studio</strong> and pick the ones you need (tick <em>Subscribe</em> for later updates):</p>
<table>
  <tr><th>Template</th><th>Use it for</th></tr>
  <tr><td>Modern Side Navigation</td><td>The side navigation menu (a copy of Universal Theme's Side Navigation Menu).</td></tr>
  <tr><td>Modern Top Navigation</td><td>The top navigation menu (a copy of Top Navigation Menu).</td></tr>
  <tr><td>Modern Navigation Bar</td><td>The navigation bar - user menu, notifications, help. It takes the colours of the menu templates.</td></tr>
</table>

<h3>3. Switch your application to them</h3>
<ol>
  <li><strong>Shared Components &gt; User Interface Attributes &gt; Navigation Menu</strong>: List Template = <strong>Modern Side Navigation</strong> (or Modern Top Navigation with Position = Top), then the <strong>Template Options</strong> you chose in the Designer.</li>
  <li><strong>Navigation Bar</strong>: List Template = <strong>Modern Navigation Bar</strong> and its Template Options.</li>
</ol>
<p>The Designer gives you the options and the same settings as APEXlang for <code>application.apx</code>. Nothing else changes: the templates keep Universal Theme's markup and ids, so the collapse button, keyboard, remembered state and phone overlay work as before.</p>

<h3>4. Make the most of the list</h3>
<table>
  <tr><th>In the list</th><th>What it does</th></tr>
  <tr><td>Label <code>Inbox [12]</code></td><td>A badge with 12 (side and top menu; Universal Theme's own syntax). Use a substitution for a live count: <code>Inbox [&amp;P0_UNREAD.]</code>.</td></tr>
  <tr><td>Attribute 3</td><td>Side menu: a section heading above the entry, e.g. <em>Reports</em>. A divider line when the menu is collapsed.</td></tr>
  <tr><td>Navigation bar: Attribute 1</td><td>The badge value of a navigation bar entry.</td></tr>
  <tr><td>Navigation bar: Attribute 2</td><td>List item CSS classes. <code>ns-User</code> shows the initials of the label in a round avatar (option User Avatar); <code>icon-only</code> and <code>no-icon</code> work as in Universal Theme.</td></tr>
</table>

<h3>5. What the options do</h3>
<ul>
  <li><strong>Menu Search</strong> - a field above the side menu that finds every entry, sub-levels too. <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>Cmd</kbd>+<kbd>K</kbd>) or <kbd>/</kbd> opens it; the navigation bar's <em>Search Button</em> opens it too.</li>
  <li><strong>Tooltips When Collapsed</strong> - the entry's name next to the icon on the collapsed rail (mouse and keyboard).</li>
  <li><strong>Phone Bottom Bar</strong> - on phones the first four entries and a Menu button sit in a bar at the bottom, in reach of the thumb.</li>
  <li><strong>Header: Match the Menu</strong> - the header bar takes the menu's colours; <em>Keep Theme Header</em> leaves it to your theme style.</li>
  <li><strong>Color Scheme</strong> - the menu and header only; your theme style keeps the content. Midnight and Terminal are always dark.</li>
</ul>
<p>Texts can be translated with the text messages <code>MODERN_NAV.SEARCH</code>, <code>MODERN_NAV.NO_MATCH</code>, <code>MODERN_NAV.MENU</code> and <code>MODERN_NAV.QUICK_LINKS</code>.</p>

<h3>6. Good to know</h3>
<ul>
  <li>Each template is self-contained: its CSS (Cascading Style Sheet &gt; Inline) and JavaScript travel with it. Keep the small script in <em>After List Entries</em>: it applies the look before the menu is drawn.</li>
  <li>The source is generated from <code>apexlang/_src</code> on GitHub - edit there and run <code>node _src/build.mjs</code> rather than editing the minified JavaScript in the template.</li>
  <li>Users who prefer reduced motion get no animations; Windows high-contrast mode is respected.</li>
</ul>
</div>`;
const how = [pageHead(3, "How to Use", "HOW-TO-USE", "Navigation Studio - How to Use"), cssBlock(howCss), pageSec, "", crumb("How to Use"), "",
    staticRegion("guide", "Use Navigation Studio in Your Own App", 20, howHtml, "@/standard"), "", ")", ""].join("\n");
write("p00003-how-to-use.apx", how);
console.log("gallery, designer, how-to written;", PRESETS.length, "presets");
