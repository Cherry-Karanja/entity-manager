"use strict";
/**
 * UserProfile List Configuration
 *
 * Defines columns and settings for the profile list view.
 */
exports.__esModule = true;
exports.profileListConfig = exports.profileColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var avatar_1 = require("@/components/ui/avatar");
exports.profileColumns = [
    {
        key: 'user_name',
        label: 'User',
        sortable: true,
        width: '25%',
        render: function (_value, profile) { return (React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                React.createElement(avatar_1.AvatarImage, { src: (profile === null || profile === void 0 ? void 0 : profile.avatar_url) || undefined, alt: profile === null || profile === void 0 ? void 0 : profile.user_name }),
                React.createElement(avatar_1.AvatarFallback, null,
                    React.createElement(lucide_react_1.User, { className: "h-5 w-5" }))),
            React.createElement("div", null,
                React.createElement("div", { className: "font-medium" }, (profile === null || profile === void 0 ? void 0 : profile.user_name) || 'Unknown User'),
                React.createElement("div", { className: "text-xs text-muted-foreground" }, profile === null || profile === void 0 ? void 0 : profile.user_email)))); }
    },
    {
        key: 'job_title',
        label: 'Job Title',
        sortable: true,
        width: '20%',
        render: function (_value, profile) { return (React.createElement("div", null,
            React.createElement("div", { className: "font-medium" }, (profile === null || profile === void 0 ? void 0 : profile.job_title) || '-'),
            (profile === null || profile === void 0 ? void 0 : profile.department) && (React.createElement("div", { className: "text-xs text-muted-foreground" }, profile.department)))); }
    },
    {
        key: 'phone_number',
        label: 'Contact',
        sortable: false,
        width: '15%',
        render: function (_value, profile) { return (React.createElement("span", { className: "text-sm" }, (profile === null || profile === void 0 ? void 0 : profile.phone_number) || '-')); }
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        width: '15%',
        render: function (_value, profile) {
            var _a, _b;
            var statusConfig = {
                approved: {
                    icon: lucide_react_1.CheckCircle,
                    label: 'Approved',
                    className: 'bg-green-600 text-white'
                },
                pending: {
                    icon: lucide_react_1.Clock,
                    label: 'Pending',
                    className: 'bg-yellow-600 text-white'
                },
                rejected: {
                    icon: lucide_react_1.XCircle,
                    label: 'Rejected',
                    className: 'bg-red-600 text-white'
                },
                suspended: {
                    icon: lucide_react_1.Ban,
                    label: 'Suspended',
                    className: 'bg-gray-600 text-white'
                }
            };
            var config = (_b = statusConfig[((_a = profile === null || profile === void 0 ? void 0 : profile.status) !== null && _a !== void 0 ? _a : 'pending')]) !== null && _b !== void 0 ? _b : {
                icon: lucide_react_1.Clock,
                label: 'Unknown',
                className: 'bg-gray-600 text-white'
            };
            var Icon = config.icon;
            return (React.createElement(badge_1.Badge, { variant: "default", className: config.className },
                React.createElement(Icon, { className: "h-3 w-3 mr-1" }),
                config.label));
        }
    },
    {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        type: 'date',
        width: '15%'
    },
    {
        key: 'approved_at',
        label: 'Approved',
        sortable: true,
        type: 'date',
        width: '10%',
        render: function (_value, profile) { return (React.createElement("span", { className: "text-sm" }, (profile === null || profile === void 0 ? void 0 : profile.approved_at) ? new Date(profile.approved_at).toLocaleDateString() : '-')); }
    },
];
exports.profileListConfig = {
    defaultView: 'grid',
    defaultPageSize: 20,
    enableSearch: true,
    enableFilters: true,
    enableExport: true,
    enableBulkActions: true
};
