"use strict";
/**
 * Unit Export Configuration
 */
exports.__esModule = true;
exports.UnitExporterConfig = void 0;
exports.UnitExporterConfig = {
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'programme_name', label: 'Programme' },
        { key: 'credits', label: 'Credits' },
        { key: 'level', label: 'Level' },
        { key: 'term_number', label: 'Term' },
        { key: 'is_core', label: 'Core Unit', formatter: function (v) { return v ? 'Yes' : 'No'; } },
        { key: 'is_active', label: 'Active', formatter: function (v) { return v ? 'Yes' : 'No'; } },
        { key: 'description', label: 'Description' },
        { key: 'created_at', label: 'Created At' },
    ],
    options: {
        format: 'csv',
        filename: 'units'
    },
    showFormatSelector: true
};
