"use strict";
exports.__esModule = true;
exports.timetableConstraintColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var types_1 = require("../../types");
var lucide_react_1 = require("lucide-react");
exports.timetableConstraintColumns = [
    {
        key: "name",
        header: "Name",
        sortable: true,
        render: function (value) { return React.createElement("span", { className: "font-medium" }, value); }
    },
    {
        key: "timetable_name",
        header: "Timetable",
        sortable: true
    },
    {
        key: "constraint_type",
        header: "Type",
        sortable: true,
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" }, types_1.CONSTRAINT_TYPE_LABELS[value] || value)); }
    },
    {
        key: "is_hard_constraint",
        header: "Constraint Level",
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? "destructive" : "secondary", className: "flex items-center gap-1 w-fit" }, value ? (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.ShieldAlert, { className: "h-3 w-3" }),
            "Hard")) : (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.Shield, { className: "h-3 w-3" }),
            "Soft")))); }
    },
    {
        key: "priority",
        header: "Priority",
        sortable: true
    },
    {
        key: "weight",
        header: "Weight",
        sortable: true
    },
    {
        key: "is_active",
        header: "Active",
        render: function (value) {
            return value ? (React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-green-500" })) : (React.createElement(lucide_react_1.X, { className: "h-4 w-4 text-gray-400" }));
        }
    },
];
