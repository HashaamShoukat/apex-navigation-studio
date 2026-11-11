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
    // the menu bar draws itself again whenever it has to move entries into its overflow menu (also some time after the
    // page has loaded), so watch it rather than the window: adding a badge that is already there changes nothing
    if (e[0]) { new MutationObserver(badges).observe(e[0], { childList: true, subtree: true }); }
})(apex.jQuery);
