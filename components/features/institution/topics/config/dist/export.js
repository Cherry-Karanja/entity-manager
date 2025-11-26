"use strict";
/**
 * Topic Export Configuration
 */
exports.__esModule = true;
exports.TopicExporterConfig = void 0;
exports.TopicExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'order', label: 'Order' },
        { key: 'unit_name', label: 'Unit' },
        { key: 'duration_hours', label: 'Duration (Hours)' },
        { key: 'weight', label: 'Weight (%)' },
        { key: 'subtopic_count', label: 'Subtopic Count' },
        { key: 'description', label: 'Description' },
        { key: 'created_at', label: 'Created At' },
    ],
    options: {
        format: 'csv',
        filename: 'topics'
    },
    showFormatSelector: true
};
