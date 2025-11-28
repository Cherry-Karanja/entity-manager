"use strict";
exports.__esModule = true;
exports.ClassGroupScheduleListConfig = exports.classGroupScheduleColumns = void 0;
var badge_1 = require("@/components/ui/badge");
var types_1 = require("../../types");
var lucide_react_1 = require("lucide-react");
exports.classGroupScheduleColumns = [
    {
        key: "class_group_name",
        label: "Class Group",
        sortable: true,
        render: function (value, row, index) { return React.createElement("span", { className: "font-medium" }, value || "—"); }
    },
    {
        key: "unit_name",
        label: "Unit",
        sortable: true
    },
    {
        key: "instructor_name",
        label: "Instructor",
        sortable: true
    },
    {
        key: "room_name",
        label: "Room",
        sortable: true
    },
    {
        key: "day_of_week",
        label: "Day",
        sortable: true,
        render: function (value, row, index) { return (React.createElement(badge_1.Badge, { variant: "outline" }, String(types_1.DAY_OF_WEEK_LABELS[value] || value))); }
    },
    {
        key: "start_time",
        label: "Start Time",
        sortable: true,
        render: function (value, row, index) {
            if (!value)
                return "—";
            var _a = value.split(":"), hours = _a[0], minutes = _a[1];
            var hour = parseInt(hours);
            var ampm = hour >= 12 ? "PM" : "AM";
            var displayHour = hour % 12 || 12;
            return displayHour + ":" + minutes + " " + ampm;
        }
    },
    {
        key: "end_time",
        label: "End Time",
        sortable: true,
        render: function (value, row, index) {
            if (!value)
                return "—";
            var _a = value.split(":"), hours = _a[0], minutes = _a[1];
            var hour = parseInt(hours);
            var ampm = hour >= 12 ? "PM" : "AM";
            var displayHour = hour % 12 || 12;
            return displayHour + ":" + minutes + " " + ampm;
        }
    },
    {
        key: "is_locked",
        label: "Status",
        render: function (value, row, index) { return (React.createElement(badge_1.Badge, { variant: value ? "default" : "secondary", className: "flex items-center gap-1 w-fit" }, value ? (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.Lock, { className: "h-3 w-3" }),
            "Locked")) : (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.Unlock, { className: "h-3 w-3" }),
            "Unlocked")))); }
    },
];
exports.ClassGroupScheduleListConfig = {
    columns: exports.classGroupScheduleColumns,
    view: 'table',
    toolbar: {
        search: true,
        filters: true,
        viewSwitcher: false,
        columnSelector: true,
        refresh: true,
        "export": true,
        actions: []
    },
    selectable: true,
    multiSelect: false,
    pagination: true,
    paginationConfig: { page: 1, pageSize: 10 },
    sortable: true,
    sortConfig: { field: 'day_of_week', direction: 'asc' },
    filterable: true,
    searchable: true,
    emptyMessage: 'No class schedules found.',
    className: '',
    hover: true,
    striped: false,
    bordered: true,
    titleField: 'class_group_name',
    subtitleField: 'unit_name',
    dateField: 'start_time'
};
