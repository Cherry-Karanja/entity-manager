"use strict";
/**
 * Programme List Column Configurations
 */
exports.__esModule = true;
exports.ProgrammeListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
exports.ProgrammeListConfig = {
    columns: [
        {
            key: 'name',
            label: 'Programme',
            sortable: true,
            width: '30%',
            render: function (value, entity) {
                var prog = entity;
                return (React.createElement("div", { className: "flex flex-col" },
                    React.createElement("span", { className: "font-medium" }, value),
                    (prog === null || prog === void 0 ? void 0 : prog.code) && (React.createElement("span", { className: "text-xs text-muted-foreground" }, prog.code))));
            }
        },
        {
            key: 'department_name',
            label: 'Department',
            sortable: true,
            filterable: true,
            width: '25%',
            type: 'text'
        },
        {
            key: 'level',
            label: 'Level',
            sortable: true,
            filterable: true,
            width: '10%',
            type: 'number',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" },
                "Level ",
                value)); }
        },
        {
            key: 'total_class_groups',
            label: 'Classes',
            sortable: true,
            width: '15%',
            type: 'number',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: "secondary" }, value || 0)); }
        },
        {
            key: 'total_trainees',
            label: 'Trainees',
            sortable: true,
            width: '15%',
            type: 'number',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: "outline" }, value || 0)); }
        },
    ],
    defaultSort: { field: 'name', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search programmes...',
    searchFields: ['name', 'code', 'department_name'],
    selectable: true,
    selectableKey: 'id',
    pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50, 100] }
};
