"use strict";
/**
 * UserSession List Configuration
 */
exports.__esModule = true;
exports.sessionColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var date_fns_1 = require("date-fns");
exports.sessionColumns = [
    {
        key: 'user_email',
        label: 'User',
        sortable: true,
        width: '20%',
        render: function (_value, session) { return (React.createElement("div", null,
            React.createElement("div", { className: "font-medium" }, session === null || session === void 0 ? void 0 : session.user_full_name),
            React.createElement("div", { className: "text-xs text-muted-foreground" }, session === null || session === void 0 ? void 0 : session.user_email))); }
    },
    {
        key: 'ip_address',
        label: 'IP Address',
        sortable: true,
        width: '15%',
        type: 'text'
    },
    {
        key: 'device_type',
        label: 'Device',
        sortable: true,
        width: '20%',
        render: function (_value, session) { return (React.createElement("div", null,
            React.createElement("div", { className: "text-sm" }, (session === null || session === void 0 ? void 0 : session.device_type) || 'Unknown'),
            React.createElement("div", { className: "text-xs text-muted-foreground" }, session === null || session === void 0 ? void 0 :
                session.browser,
                " \u2022 ", session === null || session === void 0 ? void 0 :
                session.device_os))); }
    },
    {
        key: 'is_active',
        label: 'Status',
        sortable: true,
        filterable: true,
        width: '10%',
        type: 'boolean',
        render: function (_value, session) { return (React.createElement(badge_1.Badge, { variant: (session === null || session === void 0 ? void 0 : session.is_active) ? 'default' : 'secondary' }, (session === null || session === void 0 ? void 0 : session.is_active) ? 'Active' : 'Expired')); }
    },
    {
        key: 'last_activity',
        label: 'Last Activity',
        sortable: true,
        width: '15%',
        type: 'date',
        render: function (_value, session) { return (React.createElement("span", { className: "text-sm" }, (session === null || session === void 0 ? void 0 : session.last_activity) ? date_fns_1.formatDistanceToNow(new Date(session.last_activity), { addSuffix: true }) : '-')); }
    },
    {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        width: '15%',
        type: 'date',
        render: function (_value, session) { return (React.createElement("span", { className: "text-sm" }, (session === null || session === void 0 ? void 0 : session.created_at) ? date_fns_1.formatDistanceToNow(new Date(session.created_at), { addSuffix: true }) : '-')); }
    },
];
