"use strict";
/**
 * Timetable Detail View Configuration
 * Defines the layout for viewing timetable details
 */
exports.__esModule = true;
exports.timetableViewConfig = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.timetableViewConfig = {
    fields: [],
    title: function (timetable) { var _a; return (_a = timetable === null || timetable === void 0 ? void 0 : timetable.name) !== null && _a !== void 0 ? _a : ''; },
    subtitle: function (timetable) { var _a; return "Version " + ((_a = timetable === null || timetable === void 0 ? void 0 : timetable.version) !== null && _a !== void 0 ? _a : ''); },
    icon: lucide_react_1.CalendarClock,
    sections: [
        {
            id: 'basic-information',
            label: 'Basic Information',
            icon: lucide_react_1.Info,
            fields: [
                { key: 'name', label: 'Timetable Name' },
                {
                    key: 'academic_year_name',
                    label: 'Academic Year',
                    render: function (value, row) { return value || "Year " + (row === null || row === void 0 ? void 0 : row.academic_year); }
                },
                {
                    key: 'term_name',
                    label: 'Term',
                    render: function (value, row) { return value || "Term " + (row === null || row === void 0 ? void 0 : row.term); }
                },
                { key: 'version', label: 'Version', render: function (value) { return "v" + value; } },
            ]
        },
        {
            id: 'schedule-period',
            label: 'Schedule Period',
            icon: lucide_react_1.Calendar,
            fields: [
                {
                    key: 'start_date',
                    label: 'Start Date',
                    render: function (value) { return new Date(value).toLocaleDateString(); }
                },
                {
                    key: 'end_date',
                    label: 'End Date',
                    render: function (value) { return new Date(value).toLocaleDateString(); }
                },
                {
                    key: 'working_days',
                    label: 'Working Days',
                    render: function (value) { return (React.createElement("div", { className: "flex flex-wrap gap-1" }, value === null || value === void 0 ? void 0 : value.map(function (day) { return (React.createElement(badge_1.Badge, { key: day, variant: "outline" }, types_1.DAY_OF_WEEK_LABELS[day] || day)); }))); }
                },
            ]
        },
        {
            id: 'working-hours',
            label: 'Working Hours',
            icon: lucide_react_1.Clock,
            fields: [
                { key: 'working_hours_start', label: 'Start Time' },
                { key: 'working_hours_end', label: 'End Time' },
            ]
        },
        {
            id: 'status',
            label: 'Status',
            icon: lucide_react_1.Settings,
            fields: [
                {
                    key: 'is_active',
                    label: 'Status',
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary' }, value ? 'Active' : 'Inactive')); }
                },
                {
                    key: 'generation_task_id',
                    label: 'Last Generation Task',
                    render: function (value) { return value || 'No generation task'; }
                },
            ]
        },
    ]
};
