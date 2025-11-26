"use strict";
/**
 * Room List Column Definitions
 * Defines the columns displayed in the rooms list view
 */
exports.__esModule = true;
exports.roomColumns = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
exports.roomColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true,
        width: '100px'
    },
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '200px'
    },
    {
        key: 'department_name',
        label: 'Department',
        sortable: true,
        render: function (value, row) { return (value ? String(value) : "Department " + (row === null || row === void 0 ? void 0 : row.department)); }
    },
    {
        key: 'room_type',
        label: 'Type',
        sortable: true,
        render: function (value) {
            var _a;
            return (React.createElement(badge_1.Badge, { variant: "outline" }, String((_a = types_1.ROOM_TYPE_LABELS[value]) !== null && _a !== void 0 ? _a : value)));
        }
    },
    {
        key: 'capacity',
        label: 'Capacity',
        sortable: true,
        width: '100px',
        render: function (value) { return String(value) + " people"; }
    },
    {
        key: 'building',
        label: 'Location',
        render: function (value, row) {
            var parts = [];
            if (row === null || row === void 0 ? void 0 : row.building)
                parts.push(row.building);
            if (row === null || row === void 0 ? void 0 : row.floor)
                parts.push("Floor " + row.floor);
            return parts.length > 0 ? parts.join(', ') : '-';
        }
    },
    {
        key: 'is_active',
        label: 'Status',
        sortable: true,
        width: '100px',
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary' }, value ? 'Active' : 'Inactive')); }
    },
];
