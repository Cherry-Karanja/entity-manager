"use strict";
exports.__esModule = true;
exports.virtualResourceColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var types_1 = require("../../types");
var lucide_react_1 = require("lucide-react");
exports.virtualResourceColumns = [
    {
        key: "name",
        label: "Name",
        sortable: true,
        render: function (value) { return React.createElement("span", { className: "font-medium" }, String(value)); }
    },
    {
        key: "code",
        label: "Code",
        sortable: true,
        render: function (value) { return (React.createElement("code", { className: "bg-muted px-2 py-0.5 rounded text-sm" }, String(value))); }
    },
    {
        key: "timetable_name",
        label: "Timetable",
        sortable: true
    },
    {
        key: "resource_type",
        label: "Type",
        sortable: true,
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" }, types_1.RESOURCE_TYPE_LABELS[value] || String(value))); }
    },
    {
        key: "capacity",
        label: "Capacity",
        sortable: true,
        render: function (value) { return (value ? String(value) : "—"); }
    },
    {
        key: "is_shared",
        label: "Shared",
        render: function (value) {
            return value ? (React.createElement(lucide_react_1.Share2, { className: "h-4 w-4 text-blue-500" })) : (React.createElement(lucide_react_1.X, { className: "h-4 w-4 text-gray-400" }));
        }
    },
    {
        key: "is_active",
        label: "Status",
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? "default" : "secondary" }, value ? "Active" : "Inactive")); }
    },
];
