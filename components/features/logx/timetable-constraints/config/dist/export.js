"use strict";
exports.__esModule = true;
exports.timetableConstraintExportConfig = void 0;
var types_1 = require("../../types");
exports.timetableConstraintExportConfig = {
    fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "timetable_name", label: "Timetable" },
        {
            key: "constraint_type",
            label: "Type",
            formatter: function (value) {
                return types_1.CONSTRAINT_TYPE_LABELS[value] || String(value);
            }
        },
        {
            key: "is_hard_constraint",
            label: "Constraint Level",
            formatter: function (value) { return (value ? "Hard" : "Soft"); }
        },
        { key: "priority", label: "Priority" },
        { key: "weight", label: "Weight" },
        {
            key: "is_active",
            label: "Active",
            formatter: function (value) { return (value ? "Yes" : "No"); }
        },
        {
            key: "parameters",
            label: "Parameters",
            formatter: function (value) {
                if (!value)
                    return "";
                try {
                    return JSON.stringify(value);
                }
                catch (_a) {
                    return "";
                }
            }
        },
        { key: "description", label: "Description" },
        {
            key: "created_at",
            label: "Created",
            formatter: function (value) { return (value ? new Date(value).toLocaleDateString() : ""); }
        },
    ],
    options: { format: 'csv', filename: "timetable-constraints" }
};
