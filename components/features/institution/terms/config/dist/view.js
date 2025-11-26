"use strict";
/**
 * Term View Field Configurations
 */
exports.__esModule = true;
exports.TermViewConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
exports.TermViewConfig = {
    fields: [
        {
            key: 'term_number',
            label: 'Term Number',
            render: function (entity) { var _a; return React.createElement("span", { className: "font-medium text-lg" },
                "Term ", (_a = entity === null || entity === void 0 ? void 0 : entity.term_number) !== null && _a !== void 0 ? _a : '-'); }
        },
        { key: 'academic_year_name', label: 'Academic Year' },
        { key: 'start_date', label: 'Start Date', type: 'date' },
        { key: 'end_date', label: 'End Date', type: 'date' },
        {
            key: 'is_active',
            label: 'Status',
            render: function (entity) {
                var active = entity.is_active;
                return (React.createElement(badge_1.Badge, { variant: active ? 'default' : 'secondary', className: active ? 'bg-green-600' : '' },
                    active ? React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }) : React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                    active ? 'Active' : 'Inactive'));
            }
        },
        { key: 'created_at', label: 'Created At', type: 'date' },
        { key: 'updated_at', label: 'Last Updated', type: 'date' },
    ],
    layout: 'grid',
    gridColumns: 2
};
