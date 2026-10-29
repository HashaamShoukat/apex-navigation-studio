// Modern Top Navigation - Universal Theme's menu bar (unchanged) plus badges
(function ($) {
    const e = $("#t_MenuNav", apex.gPageContext$);
    if (e.hasClass("js-addActions")) { apex.actions.addFromMarkup(e); }
    e.menu({
        behaveLikeTabs: e.hasClass("js-tabLike"),
        menubarShowSubMenuIcon: e.hasClass("js-showSubMenuIcons") || null,
        menubar: true,
        menubarOverflow: true,
        callout: e.hasClass("js-menu-callout")
    });
    // badges: put "[12]" back as a badge after the menu bar is drawn (and redrawn when it overflows)
    const badges = () => e.find(".a-MenuBar-item").not(".a-MenuBar-item--overflow").each(function (i) {
        const b = (window.nsTopBadges || [])[i], lab = $(this).children(".a-MenuBar-label");
        if (b && !lab.children(".ns-TopBadge").length) { lab.append($('<span class="ns-TopBadge"></span>').text(b)); }
    });
    badges();
    e.menu("resize");
    badges();
    $(window).on("apexwindowresized", () => setTimeout(badges, 0));
})(apex.jQuery);
