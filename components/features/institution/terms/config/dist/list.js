"use strict";
/**
 * Term List Column Configurations
 */
exports.__esModule = true;
exports.TermListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.TermListConfig = {
    columns: [
        {
            key: 'name',
            label: 'Term',
            sortable: true,
            width: '15%'
        },
        {
            key: 'academic_year_name',
            label: 'Academic Year',
            sortable: true,
            width: '20%'
        },
        {
            key: 'start_date',
            label: 'Start Date',
            sortable: true,
            width: '20%',
            type: 'date'
        },
        {
            key: 'end_date',
            label: 'End Date',
            sortable: true,
            width: '20%',
            type: 'date'
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            filterable: true,
            width: '15%',
            type: 'boolean',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary', className: value ? 'bg-green-600' : '' },
                value ? React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }) : React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                value ? 'Active' : 'Inactive')); }
        },
    ],
    defaultSort: { field: 'term_number', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search terms...',
    searchFields: ['term_number', 'academic_year_name'],
    selectable: true,
    selectableKey: 'id',
    pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] }
};
