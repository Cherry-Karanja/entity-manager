"use strict";
/**
 * Subtopic View Field Configurations
 */
exports.__esModule = true;
exports.SubtopicViewConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.SubtopicViewConfig = {
    fields: [
        { key: 'name', label: 'Subtopic Name' },
        { key: 'order', label: 'Order', render: function (entity) { var _a; return "#" + (((_a = entity) === null || _a === void 0 ? void 0 : _a.order) || '-'); } },
        { key: 'topic_name', label: 'Topic' },
        { key: 'duration_minutes', label: 'Duration', render: function (entity) {
                var _a;
                var mins = (_a = entity) === null || _a === void 0 ? void 0 : _a.duration_minutes;
                return mins ? mins + " minutes" : '-';
            } },
        { key: 'content_type', label: 'Content Type', render: function (entity) {
                var _a;
                var type = (_a = entity) === null || _a === void 0 ? void 0 : _a.content_type;
                if (!type)
                    return '-';
                var colors = {
                    lecture: 'bg-blue-100 text-blue-800',
                    practical: 'bg-green-100 text-green-800',
                    discussion: 'bg-purple-100 text-purple-800',
                    assessment: 'bg-red-100 text-red-800',
                    'self-study': 'bg-yellow-100 text-yellow-800'
                };
                return (React.createElement(badge_1.Badge, { variant: "outline", className: colors[type] || '' }, type.charAt(0).toUpperCase() + type.slice(1)));
            } },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'resources', label: 'Resources', type: 'text' },
        { key: 'created_at', label: 'Created At', type: 'datetime' },
        { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
    ],
    layout: 'grid',
    gridColumns: 2
};
