"use strict";
/**
 * Topic List Column Configurations
 */
exports.__esModule = true;
exports.TopicListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.TopicListConfig = {
    columns: [
        {
            key: 'order',
            label: '#',
            sortable: true,
            width: '8%',
            render: function (value) { return (React.createElement("span", { className: "text-muted-foreground font-mono" }, value || '-')); }
        },
        {
            key: 'name',
            label: 'Topic Name',
            sortable: true,
            width: '30%'
        },
        {
            key: 'unit_name',
            label: 'Unit',
            sortable: true,
            filterable: true,
            width: '22%'
        },
        {
            key: 'duration_hours',
            label: 'Duration',
            sortable: true,
            width: '12%',
            render: function (value) { return value ? value + "h" : '-'; }
        },
        {
            key: 'weight',
            label: 'Weight',
            sortable: true,
            width: '12%',
            render: function (value) { return value ? (React.createElement(badge_1.Badge, { variant: "outline" },
                value,
                "%")) : '-'; }
        },
        {
            key: 'subtopic_count',
            label: 'Subtopics',
            sortable: true,
            width: '12%',
            render: function (value) { return (React.createElement("span", { className: "text-muted-foreground" }, value || 0)); }
        },
    ],
    defaultSort: { field: 'order', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search topics...',
    searchFields: ['name'],
    selectable: true,
    selectableKey: 'id',
    pagination: { defaultPageSize: 25, pageSizeOptions: [10, 25, 50, 100] }
};
