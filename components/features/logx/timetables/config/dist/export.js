"use strict";
/**
 * Timetable Exporter Configuration
 *
 * Defines export fields and options for timetables.
 */
exports.__esModule = true;
exports.timetableExportConfig = exports.TimetableExporterConfig = void 0;
var types_1 = require("../../types");
exports.TimetableExporterConfig = {
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
            formatter: function (value) {
                var _a;
                return ((_a = value) === null || _a === void 0 ? void 0 : _a.map(function (day) { return types_1.DAY_OF_WEEK_LABELS[day] || day; }).join(', ')) || '';
            }
        },
        { key: 'working_hours_start', label: 'Start Time' },
        { key: 'working_hours_end', label: 'End Time' },
        {
            key: 'version',
            label: 'Version',
            formatter: function (value) { return "v" + value; }
        },
        {
            key: 'is_active',
            label: 'Status',
            formatter: function (value) { return (value ? 'Active' : 'Inactive'); }
        },
        {
            key: 'created_at',
            label: 'Created At',
            formatter: function (value) { return value ? new Date(value).toLocaleString() : '-'; }
        },
        {
            key: 'updated_at',
            label: 'Updated At',
            formatter: function (value) { return value ? new Date(value).toLocaleString() : '-'; }
        },
    ],
    options: {
        format: 'xlsx',
        filename: 'timetables_export',
        includeHeaders: true,
        prettyPrint: true,
        dateFormat: 'MM/DD/YYYY HH:mm:ss',
        delimiter: ',',
        sheetName: 'Timetables'
    },
    buttonLabel: 'Export Timetables',
    showFormatSelector: true,
    showFieldSelector: true,
    className: 'btn btn-primary',
    disabled: false
};
// Legacy export for backward compatibility
exports.timetableExportConfig = exports.TimetableExporterConfig;
