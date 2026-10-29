// Modern Navigation Bar - user avatar and search button; texts from text messages MODERN_NAV.* when defined
(function ($) {
    const msg = (k, d) => { const t = apex.lang.getMessage(k); return !t || t === k ? d : t; },
          esc = s => apex.util.escapeHTML(String(s));
    $(".ns-Bar").each(function () {
        const bar = $(this);
        // User Avatar: initials of the entry's label
        bar.find(".ns-User > .t-Button").each(function () {
            if (!bar.hasClass("ns-Bar--avatar") || $(this).find(".ns-Avatar").length) { return; }
            const name = $(this).find(".t-Button-label").text().trim(),
                  ini = name.split(/[\s._@-]+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
            $(this).find(".t-Icon").first().replaceWith('<span class="ns-Avatar" aria-hidden="true">' + esc(ini || "?") + "</span>");
        });
        // Search Button: shown when Modern Side Navigation has its menu search
        if (!bar.find(".ns-SearchItem").length) {
            const label = msg("MODERN_NAV.SEARCH", "Search menu");
            $('<li class="t-NavigationBar-item ns-SearchItem"><button type="button" class="t-Button t-Button--icon t-Button--header t-Button--navBar ns-SearchBtn" title="' + esc(label) + '">' +
              '<span class="t-Icon fa fa-search" aria-hidden="true"></span><span class="t-Button-label">' + esc(label) + "</span><kbd>" +
              (/Mac|iP/.test(navigator.platform) ? "⌘" : "Ctrl ") + "K</kbd></button></li>")
                .prependTo(bar).on("click", "button", () => $(document).trigger("ns-search"));
        }
    });
})(apex.jQuery);
