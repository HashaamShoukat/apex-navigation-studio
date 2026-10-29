// Ready-made looks for the Gallery. side / top = Modern Side / Top Navigation options, bar = Modern Navigation Bar options,
// state = how the side menu is shown in the thumbnail. Thumbnails: static files gallery/<id>.jpg (qa/thumbs.cjs).
export const SIDE_DEFAULTS = "js-navCollapsed--default ns-Fx--tips ns-Fx--search ns-Fx--tabbar";
export const BAR_DEFAULTS = "ns-Bar--avatar";
export const TOP_DEFAULTS = "js-tabLike";

export const PRESETS = [
    ["clean-indigo", "Clean", "side light", "ns-Accent--indigo", ""],
    ["inset-violet", "Inset", "side light", "ns-Design--inset ns-Accent--violet", "ns-Bar--segmented"],
    ["floating-ocean", "Floating", "side light", "ns-Design--floating ns-Accent--ocean", "ns-Bar--pills"],
    ["midnight-violet", "Midnight", "side dark", "ns-Design--midnight ns-Accent--violet", "ns-Bar--icons"],
    ["rail-emerald", "Rail", "side light collapsed", "ns-Design--rail ns-Accent--emerald", "ns-Bar--icons", "collapsed"],
    ["gradient-indigo", "Gradient", "side light", "ns-Design--gradient ns-Accent--indigo", ""],
    ["glass-violet", "Glass", "side light", "ns-Design--glass ns-Accent--violet", "ns-Bar--pills"],
    ["soft-indigo", "Soft UI", "side light", "ns-Design--soft ns-Accent--indigo", ""],
    ["bold-amber", "Bold", "side light", "ns-Design--bold ns-Accent--amber", "ns-Bar--outline ns-Bar--badgeRed"],
    ["outline-emerald", "Outline", "side light", "ns-Design--outline ns-Accent--emerald ns-Density--compact", ""],
    ["editorial", "Editorial", "side light", "ns-Design--editorial", "ns-Bar--icons"],
    ["terminal", "Terminal", "side dark", "ns-Design--terminal", "ns-Bar--badgeDot"],
    ["clean-dark-cyan", "Clean - Dark", "side dark", "ns-Accent--cyan ns-Scheme--dark", ""],
    ["midnight-rose-collapsed", "Midnight - Collapsed", "side dark collapsed", "ns-Design--midnight ns-Accent--rose", "ns-Bar--icons ns-Bar--pulse", "collapsed"],
    ["inset-dark-emerald", "Inset - Dark", "side dark", "ns-Design--inset ns-Accent--emerald ns-Scheme--dark", "ns-Bar--segmented"],
    ["gradient-tangerine", "Gradient - Tangerine", "side light", "ns-Design--gradient ns-Accent--tangerine", "ns-Bar--pills"],
    ["floating-dark-violet", "Floating - Dark, Compact", "side dark", "ns-Design--floating ns-Accent--violet ns-Scheme--dark ns-Density--compact", "ns-Bar--pills"],
    ["glass-ocean-collapsed", "Glass - Collapsed", "side light collapsed", "ns-Design--glass ns-Accent--ocean", "ns-Bar--pills", "collapsed"],
    ["floating-flyout", "Floating - Flyout", "side light flyout", "ns-Design--floating ns-Accent--indigo ns-Sub--flyout", "ns-Bar--pills"],
    ["midnight-flyout", "Midnight - Flyout", "side dark collapsed flyout", "ns-Design--midnight ns-Accent--cyan ns-Sub--flyout", "ns-Bar--icons", "collapsed"],
    ["top-underline-indigo", "Top - Underline", "top light", "ns-Accent--indigo", ""],
    ["top-pills-rose", "Top - Pills", "top light", "ns-Top--pills ns-Accent--rose", "ns-Bar--pills"],
    ["top-segmented-emerald", "Top - Segmented", "top light", "ns-Top--segmented ns-Accent--emerald", "ns-Bar--icons"],
    ["top-midnight-violet", "Top - Midnight", "top dark", "ns-Top--midnight ns-Accent--violet", ""],
    ["top-gradient-ocean", "Top - Gradient", "top light", "ns-Top--gradient ns-Accent--ocean", "ns-Bar--pills"],
    ["top-glass-violet", "Top - Glass", "top light", "ns-Top--glass ns-Accent--violet", "ns-Bar--pills"]
].map(([id, name, tags, cls, bar, state]) => {
    const top = tags.startsWith("top");
    return { id, name, tags, pos: top ? "top" : "side", state: state || "expanded",
             nav: ((top ? TOP_DEFAULTS : SIDE_DEFAULTS) + " " + cls).trim(), bar: (BAR_DEFAULTS + " " + bar).trim() };
});
