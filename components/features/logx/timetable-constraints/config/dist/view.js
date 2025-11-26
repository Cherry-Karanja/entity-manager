"use strict";
exports.__esModule = true;
exports.timetableConstraintViewConfig = void 0;
var types_1 = require("../../types");
var formatParameters = function (params) {
    if (!params)
        return "—";
    try {
        return JSON.stringify(params, null, 2);
    }
    catch (_a) {
        return "Invalid JSON";
    }
};
exports.timetableConstraintViewConfig = {
    fields: [],
    title: function (item) { return (item === null || item === void 0 ? void 0 : item.name) || "Timetable Constraint"; },
    subtitle: function (item) {
        return (item === null || item === void 0 ? void 0 : item.is_hard_constraint) ? "Hard Constraint (Must be satisfied)" : "Soft Constraint (Can be violated with penalty)";
    },
    sections: [
        {
            id: 'basic-information',
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
                    key: "constraint_type",
                    label: "Constraint Type",
                    render: function (value) {
                        return types_1.CONSTRAINT_TYPE_LABELS[value] || value;
                    }
                },
                {
                    key: "description",
                    label: "Description"
                },
            ]
        },
        {
            id: 'constraint-configuration',
            label: "Constraint Configuration",
            fields: [
                {
                    key: "is_hard_constraint",
                    label: "Constraint Level",
                    render: function (value) { return (value ? "Hard (Mandatory)" : "Soft (Preferred)"); }
                },
                {
                    key: "priority",
                    label: "Priority",
                    render: function (value) { return value + " (" + (Number(value) <= 3 ? "High" : Number(value) <= 6 ? "Medium" : "Low") + ")"; }
                },
                {
                    key: "weight",
                    label: "Weight"
                },
                {
                    key: "is_active",
                    label: "Status",
                    render: function (value) { return (value ? "Active" : "Inactive"); }
                },
            ]
        },
        {
            id: 'parameters',
            label: "Parameters",
            fields: [
                {
                    key: "parameters",
                    label: "Constraint Parameters",
                    render: function (value) { return (React.createElement("pre", { className: "bg-muted p-2 rounded text-sm overflow-auto max-h-48" }, formatParameters(value))); }
                },
            ]
        },
        {
            id: 'timestamps',
            label: "Timestamps",
            fields: [
                {
                    key: "created_at",
                    label: "Created",
                    render: function (value) {
                        return value ? new Date(value).toLocaleString() : "—";
                    }
                },
                {
                    key: "updated_at",
                    label: "Last Updated",
                    render: function (value) {
                        return value ? new Date(value).toLocaleString() : "—";
                    }
                },
            ]
        },
    ]
};
