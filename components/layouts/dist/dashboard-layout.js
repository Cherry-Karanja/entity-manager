"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.DashboardLayout = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var sidebar_1 = require("@/components/ui/sidebar");
var button_1 = require("@/components/ui/button");
var separator_1 = require("@/components/ui/separator");
var lucide_react_1 = require("lucide-react");
var command_1 = require("@/components/ui/command");
var utils_1 = require("@/lib/utils");
var http_1 = require("@/components/connectionManager/http");
var next_themes_1 = require("next-themes");
var theme_toggle_button_1 = require("@/components/ui/theme-toggle-button");
var sidebarItems = [
    {
        title: "Dashboard",
        icon: lucide_react_1.Home,
        href: "/dashboard"
    },
    {
        title: "Entities",
        icon: lucide_react_1.Database,
        href: "/dashboard/entities"
    },
    {
        title: "Accounts",
        icon: lucide_react_1.Users,
        items: [
            {
                title: "Users",
                href: "/dashboard/users",
                icon: lucide_react_1.User
            },
            {
                title: "Roles",
                href: "/dashboard/roles",
                icon: lucide_react_1.KeyRound
            },
            {
                title: "Permissions",
                href: "/dashboard/permissions",
                icon: lucide_react_1.Shield
            },
            {
                title: "Profiles",
                href: "/dashboard/profiles",
                icon: lucide_react_1.UserCircle
            },
            {
                title: "Sessions",
                href: "/dashboard/sessions",
                icon: lucide_react_1.Clock
            },
            {
                title: "Login Attempts",
                href: "/dashboard/login-attempts",
                icon: lucide_react_1.ShieldAlert
            },
        ]
    },
    {
        title: "Institution",
        icon: lucide_react_1.Building2,
        items: [
            {
                title: "Departments",
                href: "/dashboard/departments",
                icon: lucide_react_1.Building2
            },
            {
                title: "Programmes",
                href: "/dashboard/programmes",
                icon: lucide_react_1.GraduationCap
            },
            {
                title: "Class Groups",
                href: "/dashboard/class-groups",
                icon: lucide_react_1.Users
            },
            {
                title: "Academic Years",
                href: "/dashboard/academic-years",
                icon: lucide_react_1.Calendar
            },
            {
                title: "Terms",
                href: "/dashboard/terms",
                icon: lucide_react_1.CalendarDays
            },
            {
                title: "Intakes",
                href: "/dashboard/intakes",
                icon: lucide_react_1.UserPlus
            },
        ]
    },
    {
        title: "Academics",
        icon: lucide_react_1.BookOpen,
        items: [
            {
                title: "Units",
                href: "/dashboard/units",
                icon: lucide_react_1.BookOpen
            },
            {
                title: "Topics",
                href: "/dashboard/topics",
                icon: lucide_react_1.FileText
            },
            {
                title: "Subtopics",
                href: "/dashboard/subtopics",
                icon: lucide_react_1.List
            },
            {
                title: "Enrollments",
                href: "/dashboard/enrollments",
                icon: lucide_react_1.UserCheck
            },
        ]
    },
    {
        title: "Scheduling",
        icon: lucide_react_1.CalendarClock,
        items: [
            {
                title: "Rooms",
                href: "/dashboard/rooms",
                icon: lucide_react_1.LayoutGrid
            },
            {
                title: "Timetables",
                href: "/dashboard/timetables",
                icon: lucide_react_1.CalendarClock
            },
            {
                title: "Schedules",
                href: "/dashboard/class-schedules",
                icon: lucide_react_1.Calendar
            },
            {
                title: "Settings",
                href: "/dashboard/timetable-settings",
                icon: lucide_react_1.Settings2
            },
            {
                title: "Constraints",
                href: "/dashboard/timetable-constraints",
                icon: lucide_react_1.AlertTriangle
            },
            {
                title: "Penalty Rules",
                href: "/dashboard/penalty-rules",
                icon: lucide_react_1.Scale
            },
            {
                title: "Virtual Resources",
                href: "/dashboard/virtual-resources",
                icon: lucide_react_1.Monitor
            },
            {
                title: "Resource Limits",
                href: "/dashboard/resource-limits",
                icon: lucide_react_1.Gauge
            },
        ]
    },
    {
        title: "Analytics",
        icon: lucide_react_1.BarChart3,
        href: "/dashboard/analytics"
    },
    {
        title: "Security",
        icon: lucide_react_1.Shield,
        href: "/dashboard/security"
    },
    {
        title: "Settings",
        icon: lucide_react_1.Settings,
        href: "/dashboard/settings"
    },
];
function DashboardLayout(_a) {
    var _b, _c;
    var children = _a.children, title = _a.title, subtitle = _a.subtitle, actions = _a.actions, _d = _a.breadcrumbs, breadcrumbs = _d === void 0 ? [] : _d, className = _a.className, user = _a.user;
    var _e = react_1.useState(false), open = _e[0], setOpen = _e[1];
    var _f = react_1.useState({
        Accounts: true,
        Institution: false,
        Academics: false,
        Scheduling: false
    }), expandedMenus = _f[0], setExpandedMenus = _f[1];
    var connectionStatus = http_1.useConnectionStatusColor();
    var _g = next_themes_1.useTheme(), theme = _g.theme, setTheme = _g.setTheme;
    var startTransition = theme_toggle_button_1.useThemeTransition().startTransition;
    var toggleMenu = function (menuTitle) {
        setExpandedMenus(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[menuTitle] = !prev[menuTitle], _a)));
        });
    };
    var handleThemeToggle = react_1["default"].useCallback(function () {
        startTransition(function () {
            setTheme(theme === 'light' ? 'dark' : 'light');
        });
    }, [theme, setTheme, startTransition]);
    react_1["default"].useEffect(function () {
        var down = function (e) {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(function (open) { return !open; });
            }
        };
        document.addEventListener("keydown", down);
        return function () { return document.removeEventListener("keydown", down); };
    }, []);
    return (react_1["default"].createElement(sidebar_1.SidebarProvider, null,
        react_1["default"].createElement("div", { className: "flex min-h-screen w-full overflow-auto" },
            react_1["default"].createElement(sidebar_1.Sidebar, null,
                react_1["default"].createElement(sidebar_1.SidebarHeader, { className: "border-b border-sidebar-border" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-2 px-4 py-2" },
                        react_1["default"].createElement("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground" },
                            react_1["default"].createElement(lucide_react_1.Database, { className: "h-4 w-4" })),
                        react_1["default"].createElement("div", { className: "flex flex-col" },
                            react_1["default"].createElement("span", { className: "text-sm font-semibold text-sidebar-foreground" }, "Entity Manager"),
                            react_1["default"].createElement("span", { className: "text-xs text-sidebar-foreground/70" }, "v2.0")))),
                react_1["default"].createElement(sidebar_1.SidebarContent, null,
                    react_1["default"].createElement(sidebar_1.SidebarMenu, null, sidebarItems.map(function (item) { return (react_1["default"].createElement(sidebar_1.SidebarMenuItem, { key: item.title },
                        item.items ? (
                        // Collapsible group for items with subitems
                        react_1["default"].createElement("div", { className: "py-1" },
                            react_1["default"].createElement("button", { onClick: function () { return toggleMenu(item.title); }, className: "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors" },
                                react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                    react_1["default"].createElement(item.icon, { className: "h-4 w-4" }),
                                    react_1["default"].createElement("span", null, item.title)),
                                expandedMenus[item.title] ? (react_1["default"].createElement(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-sidebar-foreground/70" })) : (react_1["default"].createElement(lucide_react_1.ChevronRight, { className: "h-4 w-4 text-sidebar-foreground/70" }))),
                            react_1["default"].createElement("div", { className: utils_1.cn("ml-4 space-y-1 overflow-hidden transition-all duration-200", expandedMenus[item.title] ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0") }, item.items.map(function (subItem) { return (react_1["default"].createElement(link_1["default"], { key: subItem.title, href: subItem.href, className: "flex items-center gap-2 px-4 py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors" },
                                subItem.icon && react_1["default"].createElement(subItem.icon, { className: "h-3.5 w-3.5" }),
                                react_1["default"].createElement("span", null, subItem.title))); })))) : (
                        // Regular menu button for items without subitems
                        react_1["default"].createElement(sidebar_1.SidebarMenuButton, { asChild: true },
                            react_1["default"].createElement(link_1["default"], { href: item.href, className: "flex items-center gap-3" },
                                react_1["default"].createElement(item.icon, { className: "h-4 w-4" }),
                                react_1["default"].createElement("span", null, item.title)))),
                        react_1["default"].createElement(separator_1.Separator, null))); }))),
                react_1["default"].createElement(sidebar_1.SidebarFooter, { className: "border-t border-sidebar-border" },
                    react_1["default"].createElement(link_1["default"], { href: "/dashboard/profile", className: "block px-4 py-2 hover:bg-sidebar-accent rounded-md transition-colors" },
                        react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                            react_1["default"].createElement("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium" },
                                ((_b = user === null || user === void 0 ? void 0 : user.first_name) === null || _b === void 0 ? void 0 : _b[0]) || 'U',
                                ((_c = user === null || user === void 0 ? void 0 : user.last_name) === null || _c === void 0 ? void 0 : _c[0]) || ''),
                            react_1["default"].createElement("div", { className: "flex flex-col flex-1 min-w-0" },
                                react_1["default"].createElement("span", { className: "text-sm font-medium text-sidebar-foreground truncate" }, user === null || user === void 0 ? void 0 :
                                    user.first_name,
                                    " ", user === null || user === void 0 ? void 0 :
                                    user.last_name),
                                react_1["default"].createElement("span", { className: "text-xs text-sidebar-foreground/70 truncate" }, user === null || user === void 0 ? void 0 : user.email)))))),
            react_1["default"].createElement(sidebar_1.SidebarInset, null,
                react_1["default"].createElement("header", { className: "sticky top-0 z-40 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60" },
                    react_1["default"].createElement("div", { className: "flex h-14 items-center gap-4 px-4" },
                        react_1["default"].createElement(sidebar_1.SidebarTrigger, { className: "-ml-1" }),
                        breadcrumbs.length > 0 && (react_1["default"].createElement("nav", { className: "flex items-center space-x-2 text-sm text-sidebar-foreground/70" }, breadcrumbs.map(function (breadcrumb, index) { return (react_1["default"].createElement(react_1["default"].Fragment, { key: index },
                            index > 0 && react_1["default"].createElement("span", null, "/"),
                            breadcrumb.href ? (react_1["default"].createElement(link_1["default"], { href: breadcrumb.href, className: "hover:text-sidebar-foreground transition-colors" }, breadcrumb.label)) : (react_1["default"].createElement("span", { className: "text-sidebar-foreground font-medium" }, breadcrumb.label)))); }))),
                        react_1["default"].createElement("div", { className: "ml-auto flex items-center gap-2" },
                            react_1["default"].createElement(button_1.Button, { variant: "outline", className: "relative h-8 w-full justify-start rounded-[0.5rem] bg-sidebar-accent text-sm font-normal text-sidebar-foreground shadow-none sm:pr-12 md:w-40 lg:w-64", onClick: function () { return setOpen(true); } },
                                react_1["default"].createElement(lucide_react_1.Search, { className: "mr-2 h-4 w-4" }),
                                react_1["default"].createElement("span", { className: "hidden lg:inline-flex" }, "Search..."),
                                react_1["default"].createElement("span", { className: "inline-flex lg:hidden" }, "Search"),
                                react_1["default"].createElement("kbd", { className: "pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex" },
                                    react_1["default"].createElement("span", { className: "text-xs" }, "\u2318"),
                                    "K")),
                            react_1["default"].createElement(button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8", asChild: true },
                                react_1["default"].createElement(link_1["default"], { href: "/dashboard/notifications" },
                                    react_1["default"].createElement(lucide_react_1.Bell, { className: "h-4 w-4" }))),
                            react_1["default"].createElement(button_1.Button, { variant: "ghost", size: "sm", className: "h-8 w-8", asChild: true },
                                react_1["default"].createElement(link_1["default"], { href: "/dashboard/profile" },
                                    react_1["default"].createElement(lucide_react_1.User, { className: "h-4 w-4" }))),
                            react_1["default"].createElement("div", { className: utils_1.cn("hidden sm:flex items-center gap-2 px-2 py-1 rounded-md border", connectionStatus.bgColor, connectionStatus.borderColor) },
                                react_1["default"].createElement("div", { className: utils_1.cn("h-2 w-2 rounded-full", connectionStatus.dotColor) }),
                                react_1["default"].createElement("span", { className: utils_1.cn("text-xs", connectionStatus.textColor) }, connectionStatus.status)),
                            react_1["default"].createElement(theme_toggle_button_1.ThemeToggleButton, { theme: theme, onClick: handleThemeToggle, variant: "circle", start: "bottom-right", className: "h-8 w-8" })))),
                (title || subtitle || actions) && (react_1["default"].createElement("div", { className: "border-b border-sidebar-border bg-sidebar/50 px-6 py-4" },
                    react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                        react_1["default"].createElement("div", null,
                            title && (react_1["default"].createElement("h1", { className: "text-2xl font-bold text-sidebar-foreground" }, title)),
                            subtitle && (react_1["default"].createElement("p", { className: "text-sm text-sidebar-foreground/70 mt-1" }, subtitle))),
                        actions && (react_1["default"].createElement("div", { className: "flex items-center gap-2" }, actions))))),
                react_1["default"].createElement("main", { className: utils_1.cn("flex-1 overflow-y-auto p-3", className) }, children))),
        react_1["default"].createElement(command_1.CommandDialog, { open: open, onOpenChange: setOpen },
            react_1["default"].createElement(command_1.CommandInput, { placeholder: "Type a command or search..." }),
            react_1["default"].createElement(command_1.CommandList, null,
                react_1["default"].createElement(command_1.CommandEmpty, null, "No results found."),
                react_1["default"].createElement(command_1.CommandGroup, { heading: "Navigation" },
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard'; } },
                        react_1["default"].createElement(lucide_react_1.Home, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Dashboard")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/entities'; } },
                        react_1["default"].createElement(lucide_react_1.Database, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Entities")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/users'; } },
                        react_1["default"].createElement(lucide_react_1.Users, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Users")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/roles'; } },
                        react_1["default"].createElement(lucide_react_1.UserCog, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Roles")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/profiles'; } },
                        react_1["default"].createElement(lucide_react_1.User, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Profiles")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/analytics'; } },
                        react_1["default"].createElement(lucide_react_1.BarChart3, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Analytics")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/security'; } },
                        react_1["default"].createElement(lucide_react_1.Shield, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Security")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/settings'; } },
                        react_1["default"].createElement(lucide_react_1.Settings, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Settings"))),
                react_1["default"].createElement(command_1.CommandSeparator, null),
                react_1["default"].createElement(command_1.CommandGroup, { heading: "Quick Actions" },
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/profile'; } },
                        react_1["default"].createElement(lucide_react_1.User, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "My Profile")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/notifications'; } },
                        react_1["default"].createElement(lucide_react_1.Bell, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Notifications")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/users'; } },
                        react_1["default"].createElement(lucide_react_1.Users, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Manage Users")),
                    react_1["default"].createElement(command_1.CommandItem, { onSelect: function () { setOpen(false); window.location.href = '/dashboard/roles'; } },
                        react_1["default"].createElement(lucide_react_1.UserCog, { className: "mr-2 h-4 w-4" }),
                        react_1["default"].createElement("span", null, "Manage Roles")))))));
}
exports.DashboardLayout = DashboardLayout;
