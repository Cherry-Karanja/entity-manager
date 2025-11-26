"use strict";
exports.__esModule = true;
exports.timetableSettingsViewConfig = void 0;
exports.timetableSettingsViewConfig = {
    fields: [],
    title: function (item) { return (item === null || item === void 0 ? void 0 : item.name) || "Timetable Settings"; },
    subtitle: function (item) { return ((item === null || item === void 0 ? void 0 : item.is_default) ? "Default Settings" : "Custom Settings"); },
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
                    key: "institution_name",
                    label: "Institution"
                },
                {
                    key: "is_default",
                    label: "Default Settings",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
            ]
        },
        {
            id: 'lesson-constraints',
            label: "Lesson Constraints",
            fields: [
                {
                    key: "max_lessons_per_day",
                    label: "Max Lessons Per Day"
                },
                {
                    key: "max_consecutive_lessons",
                    label: "Max Consecutive Lessons"
                },
                {
                    key: "min_break_duration",
                    label: "Minimum Break Duration",
                    render: function (value) { return (value ? value + " minutes" : "—"); }
                },
                {
                    key: "allow_split_lessons",
                    label: "Allow Split Lessons",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
            ]
        },
        {
            id: 'scheduling-preferences',
            label: "Scheduling Preferences",
            fields: [
                {
                    key: "prefer_morning_classes",
                    label: "Prefer Morning Classes",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
                {
                    key: "balance_daily_load",
                    label: "Balance Daily Load",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
                {
                    key: "avoid_gaps",
                    label: "Avoid Gaps",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
                {
                    key: "respect_room_capacity",
                    label: "Respect Room Capacity",
                    render: function (value) { return (value ? "Yes" : "No"); }
                },
            ]
        },
        {
            id: 'algorithm-settings',
            label: "Algorithm Settings",
            fields: [
                {
                    key: "algorithm_timeout",
                    label: "Algorithm Timeout",
                    render: function (value) { return (value ? value + " seconds" : "—"); }
                },
                {
                    key: "optimization_iterations",
                    label: "Optimization Iterations"
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
