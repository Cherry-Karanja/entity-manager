"use strict";
/**
 * Academic Year Export Configuration
 */
exports.__esModule = true;
exports.AcademicYearExporterConfig = void 0;
exports.AcademicYearExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'year', label: 'Year' },
        { key: 'is_active', label: 'Active', formatter: function (v) { return v ? 'Yes' : 'No'; } },
        { key: 'created_at', label: 'Created At' },
        { key: 'updated_at', label: 'Updated At' },
    ],
    options: {
        format: 'csv',
        filename: 'academic-years'
    },
    showFormatSelector: true
};
