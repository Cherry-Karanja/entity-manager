"use strict";
/**
 * Subtopic List Column Configurations
 */
exports.__esModule = true;
exports.SubtopicListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.SubtopicListConfig = {
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
            label: 'Subtopic Name',
            sortable: true,
            width: '35%'
        },
        {
            key: 'topic_name',
            label: 'Topic',
            sortable: true,
            filterable: true,
            width: '25%'
        },
        {
            key: 'content_type',
            label: 'Type',
            sortable: true,
            filterable: true,
            width: '15%',
            render: function (value) {
                if (!value)
                    return '-';
                var colors = {
                    lecture: 'bg-blue-100 text-blue-800',
                    practical: 'bg-green-100 text-green-800',
                    discussion: 'bg-purple-100 text-purple-800',
                    assessment: 'bg-red-100 text-red-800',
                    'self-study': 'bg-yellow-100 text-yellow-800'
                };
                return (React.createElement(badge_1.Badge, { variant: "outline", className: colors[value] || '' }, value.charAt(0).toUpperCase() + value.slice(1)));
            }
        },
        {
            key: 'duration_minutes',
            label: 'Duration',
            sortable: true,
            width: '12%',
            render: function (value) { return value ? value + " min" : '-'; }
        },
    ],
    defaultSort: { field: 'order', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search subtopics...',
    searchFields: ['name'],
    selectable: true,
    selectableKey: 'id',
    pagination: { defaultPageSize: 25, pageSizeOptions: [10, 25, 50, 100] }
};
