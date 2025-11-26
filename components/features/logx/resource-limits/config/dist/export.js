"use strict";
exports.__esModule = true;
exports.resourceLimitExportConfig = void 0;
var types_1 = require("../../types");
exports.resourceLimitExportConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        {
            key: 'timetable_details',
            label: 'Timetable',
            formatter: function (value) {
                if (value && typeof value === 'object' && 'name' in value) {
                    return value.name;
                }
                return '-';
            }
        },
        {
            key: 'entity_type',
            label: 'Entity Type',
            formatter: function (value) {
                return types_1.ENTITY_TYPE_LABELS[value] || value;
            }
        },
        {
            key: 'resource_type',
            label: 'Resource Type',
            formatter: function (value) {
                return types_1.RESOURCE_TYPE_LABELS[value] || value;
            }
        },
        { key: 'max_value', label: 'Maximum Value' },
        {
            key: 'period_type',
            label: 'Period Type',
            formatter: function (value) {
                return types_1.PERIOD_TYPE_LABELS[value] || value;
            }
        },
        { key: 'is_active', label: 'Status', formatter: function (value) { return (value ? 'Active' : 'Inactive'); } },
        { key: 'created_at', label: 'Created At', formatter: function (value) { return (value ? new Date(value).toLocaleString() : '-'); } },
        { key: 'updated_at', label: 'Updated At', formatter: function (value) { return (value ? new Date(value).toLocaleString() : '-'); } },
    ],
    options: { format: 'csv', filename: 'resource-limits', includeHeaders: true },
    // defaultColumns is a feature-specific hint for UI; keep as metadata
    // @ts-ignore
    defaultColumns: [
        'timetable_details',
        'entity_type',
        'resource_type',
        'max_value',
        'period_type',
        'is_active',
    ]
};
exports["default"] = exports.resourceLimitExportConfig;
