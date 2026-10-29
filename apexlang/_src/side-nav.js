// Modern Side Navigation - behaviour switched by template options; texts from text messages MODERN_NAV.* when defined
(function ($) {
    const body = document.body, nav$ = $("#t_TreeNav"), nav = nav$[0], has = c => body.classList.contains(c),
          msg = (k, d) => { const t = apex.lang.getMessage(k); return !t || t === k ? d : t; },
          text = el => el ? el.childNodes[0].textContent.replace(/\s*\[.*?\]\s*$/, "").trim() : "";
    if (!nav) { return; }

    // section headings: put them back on the drawn menu
    const decorate = () => (window.nsSections || []).forEach((s, i) => {
        const li = nav.querySelectorAll(":scope > ul > li.a-TreeView-node--topLevel")[i];
        if (li && s) { li.setAttribute("data-ns-section", s); }
    });
    // ... and bring the current page into view in a long menu
    const ready = () => {
        decorate();
        const box = document.getElementById("t_Body_nav"), row = nav.querySelector(".a-TreeView-row.is-selected");
        if (box && row && row.getBoundingClientRect().bottom > box.getBoundingClientRect().bottom) { box.scrollTop += row.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight / 2; }
    };
    nav$.on("treeviewcreate", ready);
    decorate();
    setTimeout(ready, 0);

    // menu search: every entry, sub-levels too, from the tree's data
    const input = $(".ns-Search input"), res = $("#ns_results");
    if (input.length) {
        const label = msg("MODERN_NAV.SEARCH", "Search menu");
        input.attr({ placeholder: label, "aria-label": label, "aria-controls": "ns_results" });
        input.next("kbd").text((/Mac|iP/.test(navigator.platform) ? "⌘" : "Ctrl ") + "K");
        let all = null;
        const items = () => {
            if (all) { return all; }
            all = [];
            const a = nav$.treeView("getNodeAdapter"),
                  walk = (n, path) => { for (let i = 0; i < (a.childCount(n) || 0); i++) {
                      const c = a.child(n, i), l = a.getLabel(c).replace(/\s*\[.*?\]\s*$/, ""), href = a.getLink(c);
                      if (href) { all.push({ l, href, path }); }
                      walk(c, path ? path + " / " + l : l);
                  } };
            walk(a.root(), "");
            return all;
        };
        const run = () => {
            const q = input.val().trim().toLowerCase();
            $(".ns-Search").toggleClass("has-text", !!q);
            body.classList.toggle("ns-Searching", !!q);
            if (!q) { res.empty(); return; }
            const hits = items().filter(x => (x.l + " " + x.path).toLowerCase().includes(q)).slice(0, 12);
            res.html(hits.length ? hits.map(x => '<li><a href="' + apex.util.escapeHTML(x.href) + '">' + apex.util.escapeHTML(x.l) +
                (x.path ? "<small>" + apex.util.escapeHTML(x.path) + "</small>" : "") + "</a></li>").join("")
                : '<li class="ns-None">' + apex.util.escapeHTML(msg("MODERN_NAV.NO_MATCH", "No matching pages")) + "</li>");
        };
        input.on("input", run).on("keydown", e => {
            if (e.key === "ArrowDown") { e.preventDefault(); res.find("a").first().trigger("focus"); }
            if (e.key === "Enter") { const a = res.find("a")[0]; if (a) { e.preventDefault(); a.click(); } }
            if (e.key === "Escape") { input.val(""); run(); }
        });
        res.on("keydown", "a", e => {
            const links = res.find("a"), i = links.index(e.target);
            if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = links[i + (e.key === "ArrowDown" ? 1 : -1)]; (n || input[0]).focus(); }
            if (e.key === "Escape") { input.trigger("focus"); }
        });
        const open = () => {
            if (has("js-navCollapsed") || !has("js-navExpanded")) { $("#t_Button_navControl").trigger("click"); }
            setTimeout(() => input.trigger("focus"), 120);
        };
        $(".ns-Search").on("click", () => { if (has("js-navCollapsed")) { open(); } });
        // Ctrl+K / Cmd+K anywhere, "/" when not typing; the navigation bar's search button sends "ns-search"
        $(document).on("keydown", e => {
            const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
            if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey) || e.key === "/" && !typing) { e.preventDefault(); open(); }
        }).on("ns-search", open);
        body.classList.add("ns-HasSearch");
    }

    // phone bottom bar: the first four top-level pages and a Menu button
    if (has("ns-Fx--tabbar")) {
        const links = [...nav.querySelectorAll(":scope > ul > li.a-TreeView-node--topLevel")].slice(0, 4).map(li => {
            const a = li.querySelector(".a-TreeView-label"), ic = li.querySelector(".a-TreeView-content .fa"),
                  cur = li.querySelector(".a-TreeView-content").matches(".is-selected, .is-current--top");
            return '<a href="' + apex.util.escapeHTML(a.getAttribute("href") || "#") + '"' + (cur ? ' aria-current="page"' : "") + '><span class="' +
                apex.util.escapeHTML(ic ? ic.className : "fa fa-file-o") + '" aria-hidden="true"></span><span>' + apex.util.escapeHTML(text(a)) + "</span></a>";
        }).join("");
        $('<nav class="ns-TabBar" aria-label="' + apex.util.escapeHTML(msg("MODERN_NAV.QUICK_LINKS", "Quick links")) + '">' + links +
          '<button type="button" aria-controls="t_Body_nav"><span class="fa fa-bars" aria-hidden="true"></span><span>' +
          apex.util.escapeHTML(msg("MODERN_NAV.MENU", "Menu")) + "</span></button></nav>").appendTo(body)
            .on("click", "button", () => $("#t_Button_navControl").trigger("click"));
    }
})(apex.jQuery);
