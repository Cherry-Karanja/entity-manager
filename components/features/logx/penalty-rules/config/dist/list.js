"use strict";
exports.__esModule = true;
exports.penaltyRuleColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var types_1 = require("../../types");
var lucide_react_1 = require("lucide-react");
exports.penaltyRuleColumns = [
    {
        key: "name",
        label: "Name",
        sortable: true,
        render: function (value) { return React.createElement("span", { className: "font-medium" }, String(value)); }
    },
    {
        key: "timetable_name",
        label: "Timetable",
        sortable: true
    },
    {
        key: "violation_type",
        label: "Violation Type",
        sortable: true,
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" }, types_1.VIOLATION_TYPE_LABELS[value] || String(value))); }
    },
    {
        key: "base_penalty",
        label: "Base Penalty",
        sortable: true
    },
    {
        key: "multiplier",
        label: "Multiplier",
        sortable: true,
        render: function (value) { return "\u00D7" + String(value); }
    },
    {
        key: "max_penalty",
        label: "Max Penalty",
        sortable: true,
        render: function (value) { return (value ? String(value) : "No cap"); }
    },
    {
        key: "threshold",
        label: "Threshold",
        sortable: true,
        render: function (value) { return (value ? String(value) + " violations" : "Immediate"); }
    },
    {
        key: "is_active",
        label: "Active",
        render: function (value) {
            return value ? (React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-green-500" })) : (React.createElement(lucide_react_1.X, { className: "h-4 w-4 text-gray-400" }));
        }
    },
];
