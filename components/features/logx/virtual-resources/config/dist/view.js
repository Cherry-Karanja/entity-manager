"use strict";
exports.__esModule = true;
exports.virtualResourceViewConfig = void 0;
var types_1 = require("../../types");
var formatTime = function (time) {
    if (!time)
        return "—";
    var _a = time.split(":"), hours = _a[0], minutes = _a[1];
    var hour = parseInt(hours);
    var ampm = hour >= 12 ? "PM" : "AM";
    var displayHour = hour % 12 || 12;
    return displayHour + ":" + minutes + " " + ampm;
};
exports.virtualResourceViewConfig = {
    title: function (item) { return (item === null || item === void 0 ? void 0 : item.name) || "Virtual Resource"; },
    subtitle: function (item) { return (item === null || item === void 0 ? void 0 : item.code) || ""; },
    fields: [],
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
                    key: "code",
                    label: "Code"
                },
                {
                    key: "timetable_name",
                    label: "Timetable"
                },
                {
                    key: "resource_type",
                    label: "Resource Type",
                    render: function (value) {
                        return types_1.RESOURCE_TYPE_LABELS[value] || String(value);
                    }
                },
                {
                    key: "description",
                    label: "Description"
                },
            ]
        },
        {
            id: "availability",
            label: "Capacity & Availability",
            fields: [
                {
                    key: "capacity",
                    label: "Capacity",
                    render: function (value) { return (value ? String(value) : "Not specified"); }
                },
                {
                    key: "availability_start",
                    label: "Available From",
                    render: function (value) { return formatTime(value); }
                },
                {
                    key: "availability_end",
                    label: "Available Until",
                    render: function (value) { return formatTime(value); }
                },
            ]
        },
        {
            id: "config",
            label: "Configuration",
            fields: [
                {
                    key: "is_shared",
                    label: "Shared Resource",
                    render: function (value) {
                        return value ? "Yes (Can be used by multiple schedules)" : "No (Exclusive use)";
                    }
                },
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
                    render: function (value) { return (value ? new Date(value).toLocaleString() : "—"); }
                },
            ]
        },
    ]
};
