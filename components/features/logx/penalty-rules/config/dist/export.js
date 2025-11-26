"use strict";
exports.__esModule = true;
exports.penaltyRuleExportConfig = void 0;
var types_1 = require("../../types");
exports.penaltyRuleExportConfig = {
    options: {
        format: "csv",
        filename: "penalty-rules",
        includeHeaders: true
    },
    fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "timetable_name", label: "Timetable" },
        {
            key: "violation_type",
            label: "Violation Type",
            formatter: function (value) {
                return types_1.VIOLATION_TYPE_LABELS[value] || String(value);
            }
        },
        { key: "base_penalty", label: "Base Penalty" },
        { key: "multiplier", label: "Multiplier" },
        {
            key: "max_penalty",
            label: "Max Penalty",
            formatter: function (value) { return (value ? String(value) : "No cap"); }
        },
        {
            key: "threshold",
            label: "Threshold",
            formatter: function (value) { return (value ? String(value) : "0"); }
        },
        {
            key: "is_active",
            label: "Active",
            formatter: function (value) { return (value ? "Yes" : "No"); }
        },
        { key: "description", label: "Description" },
        {
            key: "created_at",
            label: "Created",
            formatter: function (value) { return (value ? new Date(value).toLocaleDateString() : ""); }
        },
    ]
};
