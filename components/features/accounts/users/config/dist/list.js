"use strict";
/**
 * User List Column Configurations
 *
 * Defines columns for the user list view.
 */
exports.__esModule = true;
exports.UserListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.UserListConfig = {
    /** Column definitions */
    columns: [
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            width: '18%',
            // Keep custom render: composite display (email + username)
            render: function (value, entity) {
                var user = entity;
                return (React.createElement("div", { className: "flex flex-col" },
                    React.createElement("span", { className: "font-medium" }, value),
                    (user === null || user === void 0 ? void 0 : user.username) && (React.createElement("span", { className: "text-xs text-muted-foreground" },
                        "@",
                        user.username))));
            }
        },
        {
            key: 'full_name',
            label: 'Name',
            sortable: true,
            width: '15%',
            // Keep custom render: conditional icons based on user roles
            render: function (value, entity) {
                var user = entity;
                return (React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("span", { className: "font-medium" }, value),
                    (user === null || user === void 0 ? void 0 : user.is_superuser) && React.createElement(lucide_react_1.Shield, { className: "h-3 w-3 text-purple-600" }),
                    (user === null || user === void 0 ? void 0 : user.is_staff) && React.createElement(lucide_react_1.Shield, { className: "h-3 w-3 text-blue-600" })));
            }
        },
        {
            key: 'role_display',
            label: 'Role',
            sortable: true,
            filterable: true,
            width: '12%',
            type: 'text',
            formatter: function (value) { return value || 'No Role'; }
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
            filterable: true,
            width: '12%',
            type: 'text',
            formatter: function (value) { return value || '-'; }
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            filterable: true,
            width: '15%',
            type: 'boolean',
            // Keep custom render: complex multi-badge status display
            render: function (value, entity) {
                var user = entity;
                return (React.createElement("div", { className: "flex flex-col gap-1" },
                    React.createElement("div", { className: "flex items-center gap-1" }, value ? (React.createElement(badge_1.Badge, { variant: "default", className: "text-xs bg-green-600 text-white" },
                        React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }),
                        "Active")) : (React.createElement(badge_1.Badge, { variant: "secondary", className: "text-xs" },
                        React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                        "Inactive"))),
                    React.createElement("div", { className: "flex gap-1" },
                        !(user === null || user === void 0 ? void 0 : user.is_approved) && (React.createElement(badge_1.Badge, { variant: "outline", className: "text-xs bg-yellow-100 text-yellow-800 border-yellow-300" },
                            React.createElement(lucide_react_1.Clock, { className: "h-3 w-3 mr-1" }),
                            "Pending")),
                        (user === null || user === void 0 ? void 0 : user.account_locked_until) && new Date(user.account_locked_until) > new Date() && (React.createElement(badge_1.Badge, { variant: "destructive", className: "text-xs" },
                            React.createElement(lucide_react_1.Lock, { className: "h-3 w-3 mr-1" }),
                            "Locked")))));
            }
        },
        {
            key: 'is_verified',
            label: 'Verified',
            sortable: true,
            filterable: true,
            width: '8%',
            align: 'center',
            type: 'boolean'
        },
        {
            key: 'last_login',
            label: 'Last Login',
            sortable: true,
            width: '10%',
            type: 'date'
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            width: '10%',
            type: 'date'
        },
    ],
    /** View mode */
    view: 'table',
    /** Toolbar configuration */
    toolbar: {
        search: true,
        filters: true,
        viewSwitcher: true,
        columnSelector: true,
        refresh: true,
        "export": true,
        actions: []
    },
    selectable: true,
    multiSelect: true,
    pagination: true,
    paginationConfig: {
        page: 1,
        pageSize: 10
    },
    sortable: true,
    sortConfig: { field: 'created_at', direction: 'desc' },
    filterable: true,
    filterConfigs: [
        { field: 'is_active', operator: 'equals', value: true },
        { field: 'is_verified', operator: 'equals', value: true },
        { field: 'role_display', operator: 'in', value: [] },
        { field: 'department', operator: 'in', value: [] },
    ],
    searchable: true,
    searchPlaceholder: 'Search user ...',
    emptyMessage: 'No users found.',
    // Cast to any for incremental migration; EntityManager will supply context at runtime
    // actions: UserActionsConfig as any,
    className: '',
    hover: true,
    striped: true,
    bordered: true,
    titleField: 'full_name',
    subtitleField: 'email',
    imageField: 'profile_picture',
    dateField: 'created_at'
};
