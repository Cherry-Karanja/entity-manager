"use strict";
/**
 * Unit View Field Configurations
 */
exports.__esModule = true;
exports.UnitViewConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.UnitViewConfig = {
    fields: [
        { key: 'name', label: 'Unit Name' },
        {
            key: 'code',
            label: 'Code',
            render: function (entity) {
                var _a;
                return (React.createElement("code", { className: "text-sm font-mono bg-muted px-2 py-1 rounded" }, (_a = entity === null || entity === void 0 ? void 0 : entity.code) !== null && _a !== void 0 ? _a : ''));
            }
        },
        { key: 'programme_name', label: 'Programme' },
        { key: 'credits', label: 'Credits', render: function (entity) {
                var credits = entity === null || entity === void 0 ? void 0 : entity.credits;
                return credits ? credits + " credit hours" : '-';
            } },
        { key: 'level', label: 'Level/Year', render: function (entity) {
                var level = entity === null || entity === void 0 ? void 0 : entity.level;
                return level ? "Year " + level : '-';
            } },
        { key: 'term_number', label: 'Term', render: function (entity) {
                var term = entity === null || entity === void 0 ? void 0 : entity.term_number;
                return term ? "Term " + term : '-';
            } },
        {
            key: 'is_core',
            label: 'Unit Type',
            render: function (entity) {
                var core = entity === null || entity === void 0 ? void 0 : entity.is_core;
                return (React.createElement(badge_1.Badge, { variant: core ? 'default' : 'outline' }, core ? 'Core Unit' : 'Elective'));
            }
        },
        {
            key: 'is_active',
            label: 'Status',
            render: function (entity) {
                var active = entity === null || entity === void 0 ? void 0 : entity.is_active;
                return (React.createElement(badge_1.Badge, { variant: active ? 'default' : 'secondary', className: active ? 'bg-green-600' : '' },
                    active ? React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }) : React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                    active ? 'Active' : 'Inactive'));
            }
        },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'learning_outcomes', label: 'Learning Outcomes', type: 'text' },
        { key: 'created_at', label: 'Created At', type: 'date' },
        { key: 'updated_at', label: 'Last Updated', type: 'date' },
    ],
    layout: 'grid',
    gridColumns: 2
};
