"use strict";
exports.__esModule = true;
exports.resourceLimitViewConfig = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
exports.resourceLimitViewConfig = {
    title: function (item) {
        var _a, _b, _c, _d;
        var entityLabel = types_1.ENTITY_TYPE_LABELS[(_a = item) === null || _a === void 0 ? void 0 : _a.entity_type] || ((_b = item) === null || _b === void 0 ? void 0 : _b.entity_type);
        var resourceLabel = types_1.RESOURCE_TYPE_LABELS[(_c = item) === null || _c === void 0 ? void 0 : _c.resource_type] || ((_d = item) === null || _d === void 0 ? void 0 : _d.resource_type);
        return entityLabel + " - " + resourceLabel + " Limit";
    },
    subtitle: function (item) {
        var _a, _b, _c;
        var periodLabel = types_1.PERIOD_TYPE_LABELS[(_a = item) === null || _a === void 0 ? void 0 : _a.period_type] || ((_b = item) === null || _b === void 0 ? void 0 : _b.period_type);
        return "Max: " + ((_c = item) === null || _c === void 0 ? void 0 : _c.max_value) + " " + periodLabel;
    },
    fields: [],
    sections: [
        {
            id: "basic_information",
            label: "Basic Information",
            fields: [
                {
                    key: "timetable_details",
                    label: "Timetable",
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
                    render: function (value) {
                        var label = types_1.RESOURCE_TYPE_LABELS[value] || value;
                        var colorMap = {
                            hours: "bg-orange-100 text-orange-800",
                            sessions: "bg-teal-100 text-teal-800"
                        };
                        return (React.createElement(badge_1.Badge, { className: colorMap[value] || "bg-gray-100 text-gray-800" }, label));
                    }
                },
            ]
        },
        {
            id: "limit_configuration",
            label: "Limit Configuration",
            fields: [
                {
                    key: "max_value",
                    label: "Maximum Value",
                    render: function (value) {
                        var _a;
                        return (React.createElement("span", { className: "text-lg font-semibold" }, ((_a = value) === null || _a === void 0 ? void 0 : _a.toString()) || "-"));
                    }
                },
                {
                    key: "period_type",
                    label: "Period Type",
                    render: function (value) {
                        var label = types_1.PERIOD_TYPE_LABELS[value] || value;
                        var colorMap = {
                            daily: "bg-cyan-100 text-cyan-800",
                            weekly: "bg-indigo-100 text-indigo-800"
                        };
                        return (React.createElement(badge_1.Badge, { className: colorMap[value] || "bg-gray-100 text-gray-800" }, label));
                    }
                },
            ]
        },
        {
            id: "status",
            label: "Status",
            fields: [
                {
                    key: "is_active",
                    label: "Active Status",
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? "default" : "secondary", className: value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800" }, value ? "Active" : "Inactive")); }
                },
                {
                    key: "created_at",
                    label: "Created At",
                    render: function (value) {
                        return value ? new Date(value).toLocaleString() : "-";
                    }
                },
                {
                    key: "updated_at",
                    label: "Updated At",
                    render: function (value) {
                        return value ? new Date(value).toLocaleString() : "-";
                    }
                },
            ]
        },
    ]
};
exports["default"] = exports.resourceLimitViewConfig;
