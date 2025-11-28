"use client";
"use strict";
exports.__esModule = true;
exports.usePageActions = void 0;
var dashboard_layout_1 = require("@/components/layouts/dashboard-layout");
var protected_route_1 = require("@/components/auth/lib/protected-route");
var auth_context_1 = require("@/components/auth/contexts/auth-context");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var PageActionsContext = react_1.createContext(undefined);
exports.usePageActions = function () {
    var context = react_1.useContext(PageActionsContext);
    if (!context) {
        throw new Error('usePageActions must be used within DashboardLayoutWrapper');
    }
    return context;
};
var generateBreadcrumbs = function (pathname) {
    var segments = pathname.split('/').filter(Boolean);
    // If path is long, collapse middle segments to an ellipsis for readability
    if (segments.length > 4) {
        var first = segments[0];
        var lastTwo = segments.slice(-2);
        var crumbs_1 = [];
        crumbs_1.push({ label: first.charAt(0).toUpperCase() + first.slice(1).replace(/-/g, ' '), href: '/' + first });
        crumbs_1.push({ label: '…' });
        lastTwo.forEach(function (segment, i) {
            var href = '/' + segments.slice(0, segments.length - 2 + i + 1).join('/');
            crumbs_1.push({ label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '), href: href });
        });
        return crumbs_1;
    }
    return segments.map(function (segment, index) {
        var href = '/' + segments.slice(0, index + 1).join('/');
        var label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        return { label: label, href: href };
    });
};
function DashboardLayoutWrapper(_a) {
    var children = _a.children;
    var user = auth_context_1.useAuth().user;
    var pathname = navigation_1.usePathname();
    var _b = react_1.useState(null), pageActions = _b[0], setPageActions = _b[1];
    var breadcrumbs = generateBreadcrumbs(pathname);
    return (react_1["default"].createElement(protected_route_1.ProtectedRoute, null,
        react_1["default"].createElement(PageActionsContext.Provider, { value: { setPageActions: setPageActions } },
            react_1["default"].createElement(dashboard_layout_1.DashboardLayout, { title: "Dashboard", subtitle: "Welcome back! Here's an overview of your entity management system.", breadcrumbs: breadcrumbs, user: {
                    first_name: (user === null || user === void 0 ? void 0 : user.first_name) || "John",
                    last_name: (user === null || user === void 0 ? void 0 : user.last_name) || "Doe",
                    email: (user === null || user === void 0 ? void 0 : user.email) || "john.doe@entitymanager.com"
                }, actions: pageActions }, children))));
}
exports["default"] = DashboardLayoutWrapper;
