"use strict";
exports.__esModule = true;
exports.virtualResourceExportConfig = void 0;
var types_1 = require("../../types");
var formatTime = function (time) {
    if (!time)
        return "";
    var _a = time.split(":"), hours = _a[0], minutes = _a[1];
    var hour = parseInt(hours);
    var ampm = hour >= 12 ? "PM" : "AM";
    var displayHour = hour % 12 || 12;
    return displayHour + ":" + minutes + " " + ampm;
};
exports.virtualResourceExportConfig = {
    options: {
        format: "csv",
        filename: "virtual-resources",
        includeHeaders: true
    },
    fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "timetable_name", label: "Timetable" },
        {
            key: "resource_type",
            label: "Type",
            formatter: function (value) {
                return types_1.RESOURCE_TYPE_LABELS[value] || String(value);
            }
        },
        { key: "capacity", label: "Capacity" },
        {
            key: "availability_start",
            label: "Available From",
            formatter: function (value) { return formatTime(value); }
        },
        {
            key: "availability_end",
            label: "Available Until",
            formatter: function (value) { return formatTime(value); }
        },
        {
            key: "is_shared",
            label: "Shared",
            formatter: function (value) { return (value ? "Yes" : "No"); }
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
