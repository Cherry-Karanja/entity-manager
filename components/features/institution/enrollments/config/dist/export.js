"use strict";
/**
 * Enrollment Export Configuration
 */
exports.__esModule = true;
exports.EnrollmentExporterConfig = void 0;
exports.EnrollmentExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'trainee_name', label: 'Trainee' },
        { key: 'class_group_name', label: 'Class Group' },
        { key: 'enrollment_date', label: 'Enrollment Date' },
        { key: 'status', label: 'Status' },
        { key: 'grade', label: 'Grade' },
        { key: 'is_active', label: 'Active' },
        { key: 'notes', label: 'Notes' },
        { key: 'created_at', label: 'Created At' },
    ],
    options: {
        format: 'csv',
        filename: 'enrollments'
    },
    showFormatSelector: true
};
