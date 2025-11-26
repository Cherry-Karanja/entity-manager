"use strict";
/**
 * Programme View Field Configurations
 */
exports.__esModule = true;
exports.ProgrammeViewConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.ProgrammeViewConfig = {
    fields: [
        {
            key: 'name',
            label: 'Programme Name',
            render: function (entity) {
                var _a;
                return (React.createElement("span", { className: "font-medium text-lg" }, (_a = entity) === null || _a === void 0 ? void 0 : _a.name));
            }
        },
        {
            key: 'code',
            label: 'Programme Code',
            type: 'text',
            formatter: function (value) { return value || '-'; }
        },
        {
            key: 'level',
            label: 'Level',
            render: function (entity) {
                var _a;
                return (React.createElement(badge_1.Badge, { variant: "outline" },
                    "Level ", (_a = entity) === null || _a === void 0 ? void 0 :
                    _a.level));
            }
        },
        {
            key: 'department_name',
            label: 'Department',
            type: 'text'
        },
        {
            key: 'total_class_groups',
            label: 'Total Classes',
            type: 'number',
            render: function (entity) {
                var _a;
                return (React.createElement(badge_1.Badge, { variant: "secondary" }, ((_a = entity) === null || _a === void 0 ? void 0 : _a.total_class_groups) || 0));
            }
        },
        {
            key: 'total_trainees',
            label: 'Total Trainees',
            type: 'number',
            render: function (entity) {
                var _a;
                return (React.createElement(badge_1.Badge, { variant: "outline" }, ((_a = entity) === null || _a === void 0 ? void 0 : _a.total_trainees) || 0));
            }
        },
        { key: 'created_at', label: 'Created At', type: 'datetime' },
        { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
    ],
    layout: 'grid',
    gridColumns: 2
};
