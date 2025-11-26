"use strict";
/**
 * Unit List Column Configurations
 */
exports.__esModule = true;
exports.UnitListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.UnitListConfig = {
    columns: [
        {
            key: 'code',
            label: 'Code',
            sortable: true,
            width: '10%',
            render: function (value) { return React.createElement("code", { className: "text-sm font-mono bg-muted px-2 py-0.5 rounded" }, value); }
        },
        {
            key: 'name',
            label: 'Unit Name',
            sortable: true,
            width: '25%'
        },
        {
            key: 'programme_name',
            label: 'Programme',
            sortable: true,
            filterable: true,
            width: '20%'
        },
        {
            key: 'credits',
            label: 'Credits',
            sortable: true,
            width: '10%',
            render: function (value) { return value ? value + " cr" : '-'; }
        },
        {
            key: 'level',
            label: 'Level',
            sortable: true,
            filterable: true,
            width: '10%',
            render: function (value) { return value ? "Year " + value : '-'; }
        },
        {
            key: 'is_core',
            label: 'Type',
            sortable: true,
            filterable: true,
            width: '10%',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'outline' }, value ? 'Core' : 'Elective')); }
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            filterable: true,
            width: '10%',
            type: 'boolean',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary', className: value ? 'bg-green-600' : '' },
                value ? React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }) : React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                value ? 'Active' : 'Inactive')); }
        },
    ],
    defaultSort: { field: 'code', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search units...',
    searchFields: ['name', 'code'],
    selectable: true,
    selectableKey: 'id',
    pagination: { defaultPageSize: 20, pageSizeOptions: [10, 20, 50, 100] }
};
