"use strict";
/**
 * Timetable Export Configuration
 * Defines export fields for timetables
 */
exports.__esModule = true;
exports.timetableExportConfig = void 0;
var types_1 = require("../../types");
exports.timetableExportConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'academic_year_name', label: 'Academic Year' },
        { key: 'term_name', label: 'Term' },
        { key: 'start_date', label: 'Start Date' },
        { key: 'end_date', label: 'End Date' },
        {
            key: 'working_days',
            label: 'Working Days',
            formatter: function (value) { var _a; return (_a = value) === null || _a === void 0 ? void 0 : _a.map(function (day) { return types_1.DAY_OF_WEEK_LABELS[day] || day; }).join(', '); }
        },
        { key: 'working_hours_start', label: 'Start Time' },
        { key: 'working_hours_end', label: 'End Time' },
        { key: 'version', label: 'Version' },
        {
            key: 'is_active',
            label: 'Status',
            formatter: function (value) { return (value ? 'Active' : 'Inactive'); }
        },
        { key: 'created_at', label: 'Created At' },
        { key: 'updated_at', label: 'Updated At' },
    ],
    options: {
        format: 'xlsx',
        filename: 'timetables',
        includeHeaders: true,
        prettyPrint: true
    }
};
