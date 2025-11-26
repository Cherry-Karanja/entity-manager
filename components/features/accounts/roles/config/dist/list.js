"use strict";
/**
 * UserRole List Column Configurations
 *
 * Defines columns for the role list view.
 */
exports.__esModule = true;
exports.UserRoleListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var actions_1 = require("./actions");
exports.UserRoleListConfig = {
    /** Column definitions */
    columns: [
        {
            key: 'display_name',
            label: 'Role Name',
            sortable: true,
            width: '25%',
            // Keep custom render: composite display (display_name + name)
            render: function (value, entity) {
                var role = entity;
                return (React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.Shield, { className: "h-4 w-4 text-primary" }),
                    React.createElement("div", null,
                        React.createElement("div", { className: "font-medium" }, value),
                        React.createElement("div", { className: "text-xs text-muted-foreground" }, role.name))));
            }
        },
        {
            key: 'description',
            label: 'Description',
            sortable: false,
            width: '35%',
            type: 'text',
            formatter: function (value) { return value || 'No description'; }
        },
        {
            key: 'users_count',
            label: 'Users',
            sortable: true,
            width: '10%',
            // Keep custom render: badge display
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: "secondary" },
                value || 0,
                " users")); }
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            filterable: true,
            width: '15%',
            type: 'boolean',
            // Keep custom render: status badge with icon
            render: function (value) { return (value ? (React.createElement(badge_1.Badge, { variant: "default", className: "bg-green-600 text-white" },
                React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }),
                "Active")) : (React.createElement(badge_1.Badge, { variant: "secondary" },
                React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                "Inactive"))); }
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            width: '15%',
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
    sortConfig: { field: 'display_name', direction: 'asc' },
    filterable: true,
    filterConfigs: [
        { field: 'is_active', operator: 'equals', value: true },
    ],
    searchable: true,
    searchPlaceholder: 'Search roles...',
    emptyMessage: 'No roles found.',
    // Cast to any for incremental migration; context will be provided by EntityManager at runtime
    actions: actions_1.UserRoleActionsConfig,
    className: '',
    hover: true,
    striped: true,
    bordered: true,
    titleField: 'display_name',
    subtitleField: 'name',
    imageField: undefined,
    dateField: 'created_at'
};
