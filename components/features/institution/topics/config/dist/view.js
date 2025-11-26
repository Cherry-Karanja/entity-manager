"use strict";
/**
 * Topic View Field Configurations
 */
exports.__esModule = true;
exports.TopicViewConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.TopicViewConfig = {
    fields: [
        { key: 'name', label: 'Topic Name' },
        { key: 'order', label: 'Order', render: function (entity) { var _a; return "#" + ((_a = entity === null || entity === void 0 ? void 0 : entity.order) !== null && _a !== void 0 ? _a : '-'); } },
        { key: 'unit_name', label: 'Unit' },
        { key: 'duration_hours', label: 'Duration', render: function (entity) {
                var hours = entity === null || entity === void 0 ? void 0 : entity.duration_hours;
                return hours ? hours + " hours" : '-';
            } },
        { key: 'weight', label: 'Assessment Weight', render: function (entity) {
                var weight = entity === null || entity === void 0 ? void 0 : entity.weight;
                return weight ? React.createElement(badge_1.Badge, { variant: "outline" },
                    weight,
                    "%") : '-';
            } },
        { key: 'subtopic_count', label: 'Subtopics', render: function (entity) {
                var _a, _b, _c, _d;
                var count = (_d = (_b = (_a = entity) === null || _a === void 0 ? void 0 : _a.subtopic_count) !== null && _b !== void 0 ? _b : (_c = entity) === null || _c === void 0 ? void 0 : _c.subtopics_count) !== null && _d !== void 0 ? _d : 0;
                return count + " subtopic(s)";
            } },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'learning_objectives', label: 'Learning Objectives', type: 'text' },
        { key: 'created_at', label: 'Created At', type: 'date' },
        { key: 'updated_at', label: 'Last Updated', type: 'date' },
    ],
    layout: 'grid',
    gridColumns: 2
};
