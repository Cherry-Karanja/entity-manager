"use strict";
/**
 * ClassGroup Export Configuration
 */
exports.__esModule = true;
exports.ClassGroupExporterConfig = void 0;
exports.ClassGroupExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Class Name' },
        { key: 'programme_name', label: 'Programme' },
        { key: 'cirriculum_code', label: 'Curriculum', formatter: function (v) { return v || '-'; } },
        { key: 'intake_name', label: 'Intake', formatter: function (v) { return v || '-'; } },
        { key: 'year', label: 'Year', formatter: function (v) { return String(v || '-'); } },
        { key: 'term_number', label: 'Term', formatter: function (v) { return v ? "Term " + v : '-'; } },
        { key: 'suffix', label: 'Suffix', formatter: function (v) { return v || '-'; } },
        { key: 'total_trainees', label: 'Trainees', formatter: function (v) { return String(v || 0); } },
        { key: 'is_active', label: 'Active', formatter: function (v) { return v ? 'Yes' : 'No'; } },
        { key: 'created_at', label: 'Created At' },
    ],
    options: {
        format: 'csv',
        filename: 'class-groups'
    },
    showFormatSelector: true
};
