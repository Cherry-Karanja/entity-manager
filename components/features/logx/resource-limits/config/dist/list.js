"use strict";
exports.__esModule = true;
exports.resourceLimitListConfig = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
exports.resourceLimitListConfig = {
    columns: [
        {
            key: "timetable_details",
            label: "Timetable",
            sortable: true,
            render: function (value) {
                if (value && typeof value === "object" && "name" in value) {
                    return value.name;
                }
                return "-";
            }
        },
        {
            key: "entity_type",
            label: "Entity Type",
            sortable: true,
            render: function (value) {
                var label = types_1.ENTITY_TYPE_LABELS[value] || value;
                var colorMap = {
                    teacher: "bg-purple-100 text-purple-800",
                    room: "bg-blue-100 text-blue-800",
                    class_group: "bg-green-100 text-green-800"
                };
                return (React.createElement(badge_1.Badge, { className: colorMap[value] || "bg-gray-100 text-gray-800" }, label));
            }
        },
        {
            key: "resource_type",
            label: "Resource Type",
            sortable: true,
            render: function (value) {
                var label = types_1.RESOURCE_TYPE_LABELS[value] || value;
                var colorMap = {
                    hours: "bg-orange-100 text-orange-800",
                    sessions: "bg-teal-100 text-teal-800"
                };
                return (React.createElement(badge_1.Badge, { className: colorMap[value] || "bg-gray-100 text-gray-800" }, label));
            }
        },
        {
            key: "max_value",
            label: "Max Value",
            sortable: true,
            render: function (value) { var _a; return ((_a = value) === null || _a === void 0 ? void 0 : _a.toString()) || "-"; }
        },
        {
            key: "period_type",
            label: "Period",
            sortable: true,
            render: function (value) {
                var label = types_1.PERIOD_TYPE_LABELS[value] || value;
                var colorMap = {
                    daily: "bg-cyan-100 text-cyan-800",
                    weekly: "bg-indigo-100 text-indigo-800"
                };
                return (React.createElement(badge_1.Badge, { className: colorMap[value] || "bg-gray-100 text-gray-800" }, label));
            }
        },
        {
            key: "is_active",
            label: "Status",
            sortable: true,
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? "default" : "secondary" }, value ? "Active" : "Inactive")); }
        },
    ],
    sortConfig: {
        field: "entity_type",
        direction: "asc"
    },
    searchableFields: ["entity_type", "resource_type", "period_type"],
    filters: [
        {
            key: "entity_type",
            label: "Entity Type",
            type: "select",
            options: Object.entries(types_1.ENTITY_TYPE_LABELS).map(function (_a) {
                var value = _a[0], label = _a[1];
                return ({
                    value: value,
                    label: label
                });
            })
        },
        {
            key: "resource_type",
            label: "Resource Type",
            type: "select",
            options: Object.entries(types_1.RESOURCE_TYPE_LABELS).map(function (_a) {
                var value = _a[0], label = _a[1];
                return ({
                    value: value,
                    label: label
                });
            })
        },
        {
            key: "period_type",
            label: "Period Type",
            type: "select",
            options: Object.entries(types_1.PERIOD_TYPE_LABELS).map(function (_a) {
                var value = _a[0], label = _a[1];
                return ({
                    value: value,
                    label: label
                });
            })
        },
        {
            key: "is_active",
            label: "Status",
            type: "select",
            options: [
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
            ]
        },
    ]
};
exports["default"] = exports.resourceLimitListConfig;
