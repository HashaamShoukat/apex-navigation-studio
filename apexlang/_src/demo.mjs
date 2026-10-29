// Demo data shared by the APEX demo pages (lists.apx, demo pages) and the QA harness.
// All names are invented.
export const APP_TITLE = "Harbor";
export const DEMO_USER = "Sam Taylor";

// Demo pages: every menu entry points to one of these, so "current" works like in a real app.
export const DEMO_PAGES = [
    { page: 10, alias: "DEMO-DASHBOARD", name: "Dashboard", icon: "fa-home" },
    { page: 11, alias: "DEMO-INBOX", name: "Inbox", icon: "fa-inbox" },
    { page: 12, alias: "DEMO-CALENDAR", name: "Calendar", icon: "fa-calendar-o" },
    { page: 13, alias: "DEMO-PROJECTS", name: "Projects", icon: "fa-folder-o" },
    { page: 14, alias: "DEMO-TASKS", name: "Tasks", icon: "fa-check-square-o" },
    { page: 15, alias: "DEMO-CUSTOMERS", name: "Customers", icon: "fa-users" },
    { page: 16, alias: "DEMO-ORDERS", name: "Orders", icon: "fa-shopping-cart" },
    { page: 17, alias: "DEMO-REPORTS", name: "Reports", icon: "fa-bar-chart" },
    { page: 18, alias: "DEMO-SETTINGS", name: "Settings", icon: "fa-gear" },
    { page: 19, alias: "DEMO-TOP-NAV", name: "Top Navigation", icon: "fa-window-maximize" }
];

// The side menu: label "[n]" makes a badge (Universal Theme), section = list entry attribute 3 (a heading above the entry).
export const DEMO_MENU = [
    { id: "dashboard", label: "Dashboard", icon: "fa-home", page: 10, section: "Workspace" },
    { id: "inbox", label: "Inbox [12]", icon: "fa-inbox", page: 11 },
    { id: "calendar", label: "Calendar", icon: "fa-calendar-o", page: 12 },
    { id: "projects", label: "Projects", icon: "fa-folder-o", page: 13, children: [
        { id: "projects-active", label: "Active", page: 13, request: "ACTIVE" },
        { id: "projects-archived", label: "Archived", page: 13, request: "ARCHIVED" },
        { id: "projects-templates", label: "Templates", page: 13, request: "TEMPLATES" }
    ] },
    { id: "tasks", label: "Tasks [5]", icon: "fa-check-square-o", page: 14 },
    { id: "customers", label: "Customers", icon: "fa-users", page: 15, section: "Sales" },
    { id: "orders", label: "Orders [3]", icon: "fa-shopping-cart", page: 16 },
    { id: "invoices", label: "Invoices", icon: "fa-file-text-o", page: 16, request: "INVOICES" },
    { id: "products", label: "Products", icon: "fa-cube", page: 16, request: "PRODUCTS" },
    { id: "reports", label: "Reports", icon: "fa-bar-chart", page: 17, section: "Insights", children: [
        { id: "reports-sales", label: "Sales", page: 17, request: "SALES" },
        { id: "reports-finance", label: "Finance", page: 17, request: "FINANCE" },
        { id: "reports-team", label: "Team", page: 17, request: "TEAM", children: [
            { id: "reports-weekly", label: "Weekly", page: 17, request: "WEEKLY" },
            { id: "reports-monthly", label: "Monthly", page: 17, request: "MONTHLY" }
        ] }
    ] },
    { id: "analytics", label: "Analytics", icon: "fa-line-chart", page: 17, request: "ANALYTICS" },
    { id: "files", label: "Files", icon: "fa-files-o", page: 13, request: "FILES" },
    { id: "team", label: "Team", icon: "fa-user-circle-o", page: 18, request: "TEAM", section: "Admin" },
    { id: "integrations", label: "Integrations", icon: "fa-plug", page: 18, request: "INTEGRATIONS" },
    { id: "settings", label: "Settings", icon: "fa-gear", page: 18, children: [
        { id: "settings-profile", label: "Profile", page: 18, request: "PROFILE" },
        { id: "settings-security", label: "Security", page: 18, request: "SECURITY" },
        { id: "settings-billing", label: "Billing", page: 18, request: "BILLING" }
    ] },
    { id: "help", label: "Help Center", icon: "fa-question-circle-o", page: 18, request: "HELP" }
];

// The navigation bar: badge = attribute 1, ns-User on attribute 2 shows the initials avatar.
export const DEMO_BAR = [
    { id: "nb-notifications", label: "Notifications", icon: "fa-bell-o", badge: "4", url: "#" },
    { id: "nb-help", label: "Help", icon: "fa-question-circle-o", url: "#" },
    { id: "nb-user", label: DEMO_USER, icon: "fa-user", css: "ns-User", children: [
        { id: "nb-profile", label: "Profile", icon: "fa-user", url: "#" },
        { id: "nb-settings", label: "Settings", icon: "fa-gear", url: "#" },
        { id: "nb-signout", label: "Sign Out", icon: "fa-sign-out", url: "#" }
    ] }
];
