"use strict";
/**
 * Room Export Configuration
 * Defines export fields for rooms
 */
exports.__esModule = true;
exports.roomExportConfig = void 0;
var types_1 = require("../../types");
exports.roomExportConfig = {
    options: {
        format: 'csv',
        filename: 'rooms',
        includeHeaders: true
    },
    fields: [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'department_name', label: 'Department' },
        {
            key: 'room_type',
            label: 'Type',
            formatter: function (value) { return types_1.ROOM_TYPE_LABELS[value] || String(value); }
        },
        { key: 'capacity', label: 'Capacity' },
        { key: 'building', label: 'Building' },
        { key: 'floor', label: 'Floor' },
        { key: 'operating_hours_start', label: 'Operating Hours Start' },
        { key: 'operating_hours_end', label: 'Operating Hours End' },
        {
            key: 'is_active',
            label: 'Status',
            formatter: function (value) { return (value ? 'Active' : 'Inactive'); }
        },
        {
            key: 'allows_concurrent_bookings',
            label: 'Concurrent Bookings',
            formatter: function (value) { return (value ? 'Yes' : 'No'); }
        },
        {
            key: 'requires_approval',
            label: 'Requires Approval',
            formatter: function (value) { return (value ? 'Yes' : 'No'); }
        },
        { key: 'notes', label: 'Notes' },
        { key: 'created_at', label: 'Created At' },
        { key: 'updated_at', label: 'Updated At' },
    ]
};
