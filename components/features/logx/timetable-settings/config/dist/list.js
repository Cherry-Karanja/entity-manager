"use strict";
exports.__esModule = true;
exports.timetableSettingsColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.timetableSettingsColumns = [
    {
        key: "name",
        header: "Name",
        sortable: true,
        render: function (value, item) { return (React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("span", { className: "font-medium" }, value),
            (item === null || item === void 0 ? void 0 : item.is_default) && (React.createElement(lucide_react_1.Star, { className: "h-4 w-4 text-yellow-500 fill-yellow-500" })))); }
    },
    {
        key: "institution_name",
        header: "Institution",
        sortable: true
    },
    {
        key: "max_lessons_per_day",
        header: "Max Lessons/Day",
        sortable: true
    },
    {
        key: "max_consecutive_lessons",
        header: "Max Consecutive",
        sortable: true
    },
    {
        key: "min_break_duration",
        header: "Min Break (min)",
        sortable: true
    },
    {
        key: "balance_daily_load",
        header: "Balance Load",
        render: function (value) {
            return value ? (React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-green-500" })) : (React.createElement(lucide_react_1.X, { className: "h-4 w-4 text-gray-400" }));
        }
    },
    {
        key: "avoid_gaps",
        header: "Avoid Gaps",
        render: function (value) {
            return value ? (React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-green-500" })) : (React.createElement(lucide_react_1.X, { className: "h-4 w-4 text-gray-400" }));
        }
    },
    {
        key: "is_default",
        header: "Status",
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? "default" : "secondary" }, value ? "Default" : "Custom")); }
    },
];
