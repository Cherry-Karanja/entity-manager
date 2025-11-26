"use strict";
/**
 * Programme Export Configuration
 */
exports.__esModule = true;
exports.ProgrammeExporterConfig = void 0;
exports.ProgrammeExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Programme Name' },
        { key: 'code', label: 'Code', formatter: function (v) { return v || '-'; } },
        { key: 'level', label: 'Level' },
        { key: 'department_name', label: 'Department' },
        { key: 'total_class_groups', label: 'Classes', formatter: function (v) { return String(v || 0); } },
        { key: 'total_trainees', label: 'Trainees', formatter: function (v) { return String(v || 0); } },
        { key: 'created_at', label: 'Created At' },
        { key: 'updated_at', label: 'Updated At' },
    ],
    options: {
        format: 'csv',
        filename: 'programmes'
    },
    showFormatSelector: true
};
