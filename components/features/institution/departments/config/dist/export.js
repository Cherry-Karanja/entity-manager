"use strict";
/**
 * Department Export Configuration
 *
 * Defines export fields for department data.
 */
exports.__esModule = true;
exports.DepartmentExporterConfig = void 0;
exports.DepartmentExporterConfig = {
    fields: [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'name',
            label: 'Department Name'
        },
        {
            key: 'hod_name',
            label: 'Head of Department',
            formatter: function (value) { return value || 'Not Assigned'; }
        },
        {
            key: 'hod_email',
            label: 'HOD Email',
            formatter: function (value) { return value || '-'; }
        },
        {
            key: 'total_programmes',
            label: 'Programmes',
            formatter: function (value) { return String(value || 0); }
        },
        {
            key: 'total_class_groups',
            label: 'Classes',
            formatter: function (value) { return String(value || 0); }
        },
        {
            key: 'total_trainers',
            label: 'Trainers',
            formatter: function (value) { return String(value || 0); }
        },
        {
            key: 'total_trainees',
            label: 'Trainees',
            formatter: function (value) { return String(value || 0); }
        },
        {
            key: 'created_at',
            label: 'Created At'
        },
        {
            key: 'updated_at',
            label: 'Updated At'
        },
    ],
    options: {
        format: 'csv',
        filename: 'departments'
    },
    showFormatSelector: true
};
