"use strict";
exports.__esModule = true;
exports.classGroupScheduleViewConfig = void 0;
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
exports.classGroupScheduleViewConfig = {
    title: function (item) { return ((item === null || item === void 0 ? void 0 : item.class_group_name) || "Class") + " - " + ((item === null || item === void 0 ? void 0 : item.unit_name) || "Unit"); },
    subtitle: function (item) {
        return (item === null || item === void 0 ? void 0 : item.day_of_week) !== undefined
            ? types_1.DAY_OF_WEEK_LABELS[item.day_of_week] + " " + formatTime(item.start_time) + " - " + formatTime(item.end_time)
            : "";
    },
    fields: [],
    sections: [
        {
            id: "info",
            label: "Schedule Information",
            fields: [
                {
                    key: "timetable_name",
                    label: "Timetable"
                },
                {
                    key: "class_group_name",
                    label: "Class Group"
                },
                {
                    key: "unit_name",
                    label: "Unit"
                },
                {
                    key: "instructor_name",
                    label: "Instructor"
                },
            ]
        },
        {
            id: "location",
            label: "Location & Time",
            fields: [
                {
                    key: "room_name",
                    label: "Room"
                },
                {
                    key: "day_of_week",
                    label: "Day of Week",
                    render: function (value) {
                        return value !== undefined ? String(types_1.DAY_OF_WEEK_LABELS[value]) : "—";
                    }
                },
                {
                    key: "start_time",
                    label: "Start Time",
                    render: function (value) { return formatTime(value); }
                },
                {
                    key: "end_time",
                    label: "End Time",
                    render: function (value) { return formatTime(value); }
                },
            ]
        },
        {
            id: "status",
            label: "Status",
            fields: [
                {
                    key: "is_locked",
                    label: "Locked",
                    render: function (value) { return (value ? "Yes (Protected from regeneration)" : "No"); }
                },
                {
                    key: "notes",
                    label: "Notes"
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
