"use strict";
/**
 * Room Detail View Configuration
 * Defines the layout for viewing room details
 */
exports.__esModule = true;
exports.roomViewConfig = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.roomViewConfig = {
    fields: [],
    title: function (room) { return (room === null || room === void 0 ? void 0 : room.name) || ''; },
    subtitle: function (room) { return (room ? "Code: " + room.code : ''); },
    icon: React.createElement(lucide_react_1.LayoutGrid, null),
    sections: [
        {
            id: 'basic',
            label: 'Basic Information',
            icon: React.createElement(lucide_react_1.Building2, null),
            fields: [
                { key: 'code', label: 'Room Code' },
                { key: 'name', label: 'Room Name' },
                {
                    key: 'room_type',
                    label: 'Room Type',
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" }, types_1.ROOM_TYPE_LABELS[value] || String(value))); }
                },
                {
                    key: 'department_name',
                    label: 'Department',
                    render: function (value, row) { return value || "Department " + (row === null || row === void 0 ? void 0 : row.department); }
                },
            ]
        },
        {
            id: 'location',
            label: 'Location',
            icon: lucide_react_1.Building2,
            fields: [
                { key: 'building', label: 'Building' },
                { key: 'floor', label: 'Floor' },
            ]
        },
        {
            id: 'capacity',
            label: 'Capacity & Usage',
            icon: React.createElement(lucide_react_1.Users, null),
            fields: [
                {
                    key: 'capacity',
                    label: 'Capacity',
                    render: function (value) { return String(value) + " people"; }
                },
                {
                    key: 'allows_concurrent_bookings',
                    label: 'Concurrent Bookings',
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary' }, value ? 'Allowed' : 'Not Allowed')); }
                },
                {
                    key: 'requires_approval',
                    label: 'Requires Approval',
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'destructive' : 'secondary' }, value ? 'Yes' : 'No')); }
                },
            ]
        },
        {
            id: 'hours',
            label: 'Operating Hours',
            icon: React.createElement(lucide_react_1.Clock, null),
            fields: [
                {
                    key: 'operating_hours_start',
                    label: 'Start Time',
                    render: function (value) { return (value ? String(value) : 'Not set'); }
                },
                {
                    key: 'operating_hours_end',
                    label: 'End Time',
                    render: function (value) { return (value ? String(value) : 'Not set'); }
                },
            ]
        },
        {
            id: 'status',
            label: 'Status',
            icon: React.createElement(lucide_react_1.CheckCircle, null),
            fields: [
                {
                    key: 'is_active',
                    label: 'Status',
                    render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary' }, value ? 'Active' : 'Inactive')); }
                },
                { key: 'notes', label: 'Notes' },
            ]
        },
    ]
};
