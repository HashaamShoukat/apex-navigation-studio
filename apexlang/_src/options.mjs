// Template options of the three Navigation Studio list templates. [css class, option name (<= 30 bytes), help]
// Group ids are the template option group static ids (template-option-groups.apx), referenced as @list/<id>.
export const ACCENTS = [["ocean", "Ocean"], ["indigo", "Indigo"], ["violet", "Violet"], ["emerald", "Emerald"], ["rose", "Rose"], ["amber", "Amber"],
                        ["slate", "Slate"], ["wine", "Wine"], ["tangerine", "Tangerine"], ["cyan", "Cyan"]];

export const DESIGNS = [
    ["clean", "Clean", "Quiet and light - muted entries, the current page as a tinted pill"],
    ["inset", "Inset", "Menu and header share one canvas, the content sits on a raised card"],
    ["floating", "Floating", "A detached rounded panel with small gaps"],
    ["midnight", "Midnight", "A dark menu with a glowing accent edge bar (always dark)"],
    ["rail", "Rail", "Collapsed, it shows a small label under every icon"],
    ["gradient", "Gradient", "The menu in the accent colours, the current page in white"],
    ["glass", "Glass", "Frosted panels over a soft colour wash"],
    ["soft", "Soft UI", "Neumorphic - entries rise on hover, the current page is pressed in"],
    ["bold", "Bold", "Neo-brutalist - ink outlines and a hard shadow"],
    ["outline", "Outline", "A documentation-style tree with guide lines"],
    ["editorial", "Editorial", "Paper colours, serif labels and fine rules"],
    ["terminal", "Terminal", "A console - monospace, a blinking cursor (always dark)"]
];

export const SIDE = {
    defaults: ["js-navCollapsed--default", "ns-Fx--tips", "ns-Fx--search", "ns-Fx--tabbar"],
    comment: "Modern Side Navigation (Navigation Studio) - a copy of Universal Theme's Side Navigation Menu with designs as template options: Design, Accent Color, Color Scheme, Header, Density, Badges, Width. Same markup and ids (t_TreeNav), so theme42.js and the keyboard work as in Universal Theme. List entry attribute 3 = a section heading above the entry; \"Label [5]\" shows a badge. Options: menu search (Ctrl+K), tooltips on the collapsed rail, a phone bottom bar. Optional text messages: MODERN_NAV.SEARCH, MODERN_NAV.NO_MATCH, MODERN_NAV.MENU, MODERN_NAV.QUICK_LINKS.",
    groups: [
        { id: "ns-design", name: "Design", seq: 5, nul: "Clean", help: "The overall look of the menu and the header bar. Accent Color, Color Scheme, Density and Badges still change it.",
          options: DESIGNS.slice(1).map(([id, name]) => ["ns-Design--" + id, name]) },
        { id: "ns-accent", name: "Accent Color", seq: 10, nul: "Theme Color", help: "The colour of the current page, badges and focus rings. Theme Color uses your theme style's primary colour.",
          options: ACCENTS.map(([id, name]) => ["ns-Accent--" + id, name]) },
        { id: "ns-scheme", name: "Color Scheme", seq: 20, nul: "Light", help: "Midnight and Terminal are always dark.",
          options: [["ns-Scheme--dark", "Dark"], ["ns-Scheme--auto", "Follow Device Setting"]] },
        { id: "ns-sub", name: "Sub-menus", seq: 25, nul: "Expand in Place", help: "How the sub-levels of an entry open. Flyout shows them in a panel beside the menu - on hover, on a tap on the arrow, or with the Right arrow key - also on the collapsed icon rail. Phones always expand in place.",
          options: [["ns-Sub--flyout", "Flyout"]] },
        { id: "ns-collapse", name: "Collapse Mode", seq: 30, help: "What the menu shows when it is collapsed on large screens. Phones always hide it.",
          options: [["js-navCollapsed--default", "Icons"], ["js-navCollapsed--hidden", "Hidden"]] },
        { id: "ns-header", name: "Header", seq: 40, nul: "Match the Menu", help: "Match the Menu colours the header bar like the menu. Keep Theme Header leaves it to your theme style.",
          options: [["ns-Header--theme", "Keep Theme Header"]] },
        { id: "ns-density", name: "Density", seq: 50, nul: "Comfortable", options: [["ns-Density--compact", "Compact"], ["ns-Density--spacious", "Spacious"]] },
        { id: "ns-badge", name: "Badges", seq: 60, nul: "Accent", help: "Badges come from labels like \"Inbox [12]\". Dot shows a dot without the number.",
          options: [["ns-Badge--soft", "Soft"], ["ns-Badge--red", "Red"], ["ns-Badge--dot", "Dot"]] },
        { id: "ns-width", name: "Width", seq: 70, nul: "Regular", advanced: true, options: [["ns-Width--narrow", "Narrow"], ["ns-Width--wide", "Wide"]] }
    ],
    singles: [
        ["js-defaultCollapsed", "Collapsed by Default", 100, "Load the menu collapsed. Users can still open it; their choice is remembered for the session."],
        ["ns-Fx--search", "Menu Search", 110, "A search field above the menu that finds every entry, sub-levels too. Ctrl+K (Cmd+K) or / opens it."],
        ["ns-Fx--tips", "Tooltips When Collapsed", 120, "Show the entry's name next to the icon when the menu is collapsed."],
        ["ns-Fx--tabbar", "Phone Bottom Bar", 130, "On phones: the first four entries and a Menu button in a bar at the bottom of the screen."],
        ["ns-Logo--none", "Hide Logo Mark", 140, "The design draws a small mark before the application name; this hides it."],
        ["js-hideDefaultIcon", "Hide Default Item Icon", 150, "Hide the default icon of entries without an icon when the menu is expanded."],
        ["js-addActions", "Add Actions", 160, "Add shortcuts for menu entries (attribute 5). actions.js must be on the page."]
    ]
};

export const BAR = {
    defaults: ["ns-Bar--avatar"],
    comment: "Modern Navigation Bar (Navigation Studio) - a copy of Universal Theme's Navigation Bar. Takes the accent and header colours of Modern Side Navigation / Modern Top Navigation. List entry attribute 1 = badge value, attribute 2 = list item CSS classes (ns-User on the user entry shows the initials avatar; icon-only, no-icon as in Universal Theme). Optional text message MODERN_NAV.SEARCH.",
    groups: [
        { id: "ns-bar-style", name: "Style", seq: 5, nul: "Icon and Label", help: "Labels show from 640px up; phones show icons only.",
          options: [["ns-Bar--icons", "Icons Only"], ["ns-Bar--pills", "Pills"], ["ns-Bar--segmented", "Segmented"], ["ns-Bar--outline", "Outlined"]] },
        { id: "ns-bar-accent", name: "Accent Color", seq: 10, nul: "Match the Menu", help: "Match the Menu uses the accent of Modern Side / Top Navigation, or your theme colour.",
          options: ACCENTS.map(([id, name]) => ["ns-Accent--" + id, name]) },
        { id: "ns-bar-badge", name: "Badges", seq: 20, nul: "Accent", help: "Badges come from list entry attribute 1.",
          options: [["ns-Bar--badgeRed", "Red"], ["ns-Bar--badgeDot", "Dot"]] }
    ],
    singles: [
        ["ns-Bar--avatar", "User Avatar", 100, "The entry with list item CSS class ns-User (attribute 2) shows the initials of its label instead of the icon."],
        ["ns-Bar--search", "Search Button", 110, "A Search button that opens the menu search of Modern Side Navigation (when Menu Search is on). Shown only while the menu is collapsed or hidden - when it is expanded, its search field is already in view."],
        ["ns-Bar--pulse", "Pulsing Badges", 120, "A soft pulse around badges. Off for users who prefer reduced motion."],
        ["js-menu-callout", "Display Menu Callout", 130, "Display a callout arrow on the drop-down menus."]
    ]
};
export const TOP_DESIGNS = [
    ["underline", "Underline", "A clean bar, the current page underlined in the accent colour"],
    ["pills", "Pills", "The current page as a tinted pill"],
    ["segmented", "Segmented", "The entries in a rounded track, the current one raised"],
    ["midnight", "Midnight", "A dark bar with a glowing indicator (always dark)"],
    ["gradient", "Gradient", "The header in the accent colours, the current page in white"],
    ["glass", "Glass", "A frosted header over a soft colour wash"]
];
export const TOP = {
    defaults: ["js-tabLike"],
    comment: "Modern Top Navigation (Navigation Studio) - a copy of Universal Theme's Top Navigation Menu (same markup, id t_MenuNav and menu widget) with designs as template options: Design, Accent Color, Color Scheme, Header. \"Label [5]\" shows a badge on top-level entries.",
    groups: [
        { id: "ns-top-design", name: "Design", seq: 5, nul: "Underline", help: "The look of the header and the menu bar.",
          options: TOP_DESIGNS.slice(1).map(([id, name]) => ["ns-Top--" + id, name]) },
        { id: "ns-top-accent", name: "Accent Color", seq: 10, nul: "Theme Color", options: ACCENTS.map(([id, name]) => ["ns-Accent--" + id, name]) },
        { id: "ns-top-scheme", name: "Color Scheme", seq: 20, nul: "Light", help: "Midnight is always dark.",
          options: [["ns-Scheme--dark", "Dark"], ["ns-Scheme--auto", "Follow Device Setting"]] },
        { id: "ns-top-header", name: "Header", seq: 30, nul: "Match the Menu", options: [["ns-Header--theme", "Keep Theme Header"]] }
    ],
    singles: [
        ["js-tabLike", "Behave Like Tabs", 100, "Entries with sub-menus go to their page when clicked; the arrow opens the sub-menu."],
        ["js-showSubMenuIcons", "Show Sub Menu Icons", 110, "Show icons in the drop-down menus."],
        ["js-menu-callout", "Display Menu Callout", 120, "Display a callout arrow on the drop-down menus."],
        ["ns-Logo--none", "Hide Logo Mark", 130, "The design draws a small mark before the application name; this hides it."],
        ["js-addActions", "Add Actions", 140, "Add shortcuts for menu entries (attribute 5). actions.js must be on the page."]
    ]
};
