"use strict";
exports.__esModule = true;
exports.timetableSettingsExportConfig = void 0;
exports.timetableSettingsExportConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'institution_name', label: 'Institution' },
        { key: 'max_lessons_per_day', label: 'Max Lessons/Day' },
        { key: 'max_consecutive_lessons', label: 'Max Consecutive' },
        { key: 'min_break_duration', label: 'Min Break (min)' },
        { key: 'allow_split_lessons', label: 'Allow Split', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'prefer_morning_classes', label: 'Prefer Morning', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'balance_daily_load', label: 'Balance Load', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'avoid_gaps', label: 'Avoid Gaps', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'respect_room_capacity', label: 'Room Capacity', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'algorithm_timeout', label: 'Timeout (s)' },
        { key: 'optimization_iterations', label: 'Iterations' },
        { key: 'is_default', label: 'Default', formatter: function (value) { return (value ? 'Yes' : 'No'); } },
        { key: 'created_at', label: 'Created', formatter: function (value) { return (value ? new Date(value).toLocaleDateString() : ''); } },
    ],
    options: { format: 'csv', filename: 'timetable-settings', includeHeaders: true }
};
