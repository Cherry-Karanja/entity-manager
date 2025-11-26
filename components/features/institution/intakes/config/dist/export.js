"use strict";
/**
 * Intake Export Configuration
 */
exports.__esModule = true;
exports.IntakeExporterConfig = void 0;
exports.IntakeExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'academic_year_name', label: 'Academic Year' },
        { key: 'start_date', label: 'Start Date' },
        { key: 'end_date', label: 'End Date' },
        { key: 'is_active', label: 'Active', formatter: function (v) { return v ? 'Yes' : 'No'; } },
        { key: 'created_at', label: 'Created At' },
    ],
    options: {
        format: 'csv',
        filename: 'intakes'
    },
    showFormatSelector: true
};
