"use strict";
exports.__esModule = true;
exports.classGroupScheduleExportConfig = void 0;
var types_1 = require("../../types");
var formatTime = function (time) {
    if (!time)
        return "";
    var _a = time.split(":"), hours = _a[0], minutes = _a[1];
    var hour = parseInt(hours);
    var ampm = hour >= 12 ? "PM" : "AM";
    var displayHour = ((hour + 11) % 12) + 1;
    return displayHour + ":" + minutes + " " + ampm;
};
exports.classGroupScheduleExportConfig = {
    options: {
        format: "csv",
        filename: "class-group-schedules",
        includeHeaders: true
    },
    fields: [
        { key: "id", label: "ID" },
        { key: "timetable_name", label: "Timetable" },
        { key: "class_group_name", label: "Class Group" },
        { key: "unit_name", label: "Unit" },
        { key: "instructor_name", label: "Instructor" },
        { key: "room_name", label: "Room" },
        {
            key: "day_of_week",
            label: "Day",
            formatter: function (value) {
                return value !== undefined ? String(types_1.DAY_OF_WEEK_LABELS[value]) : "";
            }
        },
        {
            key: "start_time",
            label: "Start Time",
            formatter: function (value) { return formatTime(value); }
        },
        {
            key: "end_time",
            label: "End Time",
            formatter: function (value) { return formatTime(value); }
        },
        {
            key: "is_locked",
            label: "Locked",
            formatter: function (value) { return (value ? "Yes" : "No"); }
        },
        { key: "notes", label: "Notes" },
        {
            key: "created_at",
            label: "Created",
            formatter: function (value) { return (value ? new Date(value).toLocaleDateString() : ""); }
        },
    ]
};
