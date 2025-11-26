"use strict";
exports.__esModule = true;
exports.penaltyRuleViewConfig = void 0;
var types_1 = require("../../types");
exports.penaltyRuleViewConfig = {
    fields: [],
    title: function (item) { return (item === null || item === void 0 ? void 0 : item.name) || "Penalty Rule"; },
    subtitle: function (item) {
        return (item === null || item === void 0 ? void 0 : item.violation_type) ? types_1.VIOLATION_TYPE_LABELS[item.violation_type]
            : '';
    },
    sections: [
        {
            id: "basic",
            label: "Basic Information",
            fields: [
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "timetable_name",
                    label: "Timetable"
                },
                {
                    key: "violation_type",
                    label: "Violation Type",
                    render: function (value) {
                        return types_1.VIOLATION_TYPE_LABELS[value] || String(value);
                    }
                },
                {
                    key: "description",
                    label: "Description"
                },
            ]
        },
        {
            id: "penalty",
            label: "Penalty Configuration",
            fields: [
                {
                    key: "base_penalty",
                    label: "Base Penalty"
                },
                {
                    key: "multiplier",
                    label: "Multiplier",
                    render: function (value) { return "\u00D7" + String(value); }
                },
                {
                    key: "max_penalty",
                    label: "Maximum Penalty",
                    render: function (value) { return (value ? String(value) : "No cap"); }
                },
                {
                    key: "threshold",
                    label: "Threshold",
                    render: function (value) {
                        return value ? String(value) + " violations before penalty applies" : "Penalty applies immediately";
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
                    label: "Status",
                    render: function (value) { return (value ? "Active" : "Inactive"); }
                },
            ]
        },
        {
            id: "timestamps",
            label: "Timestamps",
            fields: [
                {
                    key: "created_at",
                    label: "Created",
                    render: function (value) { return (value ? new Date(value).toLocaleString() : "—"); }
                },
                {
                    key: "updated_at",
                    label: "Last Updated",
                    render: function (value) { return (value ? new Date(value).toLocaleDateString() : "—"); }
                },
            ]
        },
    ]
};
