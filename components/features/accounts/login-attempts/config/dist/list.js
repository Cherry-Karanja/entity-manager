"use strict";
/**
 * LoginAttempt List Configuration
 */
exports.__esModule = true;
exports.loginAttemptColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
exports.loginAttemptColumns = [
    {
        key: 'success',
        label: 'Result',
        render: function (value, attempt) { return (React.createElement("div", { className: "flex items-center gap-2" }, (attempt === null || attempt === void 0 ? void 0 : attempt.success) ? (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-500" }),
            React.createElement(badge_1.Badge, { variant: "default", className: "bg-green-500" }, "Success"))) : (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.XCircle, { className: "h-4 w-4 text-red-500" }),
            React.createElement(badge_1.Badge, { variant: "destructive" }, "Failed"))))); }
    },
    {
        key: 'email',
        label: 'Email',
        render: function (value, attempt) { return (React.createElement("div", null,
            React.createElement("div", { className: "font-medium" }, attempt === null || attempt === void 0 ? void 0 : attempt.email),
            (attempt === null || attempt === void 0 ? void 0 : attempt.user_full_name) && (React.createElement("div", { className: "text-xs text-muted-foreground" }, attempt.user_full_name)))); }
    },
    {
        key: 'ip_address',
        label: 'IP Address'
    },
    {
        key: 'device_type',
        label: 'Device',
        render: function (value, attempt) { return (React.createElement("div", null,
            React.createElement("div", { className: "text-sm" }, (attempt === null || attempt === void 0 ? void 0 : attempt.device_type) || 'Unknown'),
            React.createElement("div", { className: "text-xs text-muted-foreground" }, attempt === null || attempt === void 0 ? void 0 :
                attempt.browser,
                " \u2022 ", attempt === null || attempt === void 0 ? void 0 :
                attempt.device_os))); }
    },
    {
        key: 'failure_reason',
        label: 'Reason',
        render: function (value, attempt) { return ((attempt === null || attempt === void 0 ? void 0 : attempt.failure_reason) ? (React.createElement("span", { className: "text-sm text-red-600" }, attempt.failure_reason)) : (React.createElement("span", { className: "text-sm text-muted-foreground" }, "-"))); }
    },
    {
        key: 'created_at',
        label: 'Attempted',
        render: function (value, attempt) { return (React.createElement("span", { className: "text-sm" }, (attempt === null || attempt === void 0 ? void 0 : attempt.created_at) ? date_fns_1.formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true }) : '-')); }
    },
];
