"use strict";
/**
 * Timetable List Column Definitions
 * Defines the columns displayed in the timetables list view
 */
exports.__esModule = true;
exports.timetableColumns = void 0;
var types_1 = require("../../types");
var badge_1 = require("@/components/ui/badge");
exports.timetableColumns = [
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '200px'
    },
    // {
    //   key: 'academic_year_name',
    //   label: 'Academic Year',
    //   sortable: true,
    //   render: (value: any, row?: Timetable) => (value as string) || `Year ${row?.academic_year}`,
    // },
    // {
    //   key: 'term_name',
    //   label: 'Term',
    //   sortable: true,
    //   render: (value: any, row?: Timetable) => (value as string) || `Term ${row?.term}`,
    // },
    {
        key: 'start_date',
        label: 'Start Date',
        sortable: true,
        render: function (value) { return new Date(value).toLocaleDateString(); }
    },
    {
        key: 'end_date',
        label: 'End Date',
        sortable: true,
        render: function (value) { return new Date(value).toLocaleDateString(); }
    },
    {
        key: 'working_days',
        label: 'Working Days',
        render: function (value) {
            var _a, _b;
            return (React.createElement("div", { className: "flex flex-wrap gap-1" }, (_a = value) === null || _a === void 0 ? void 0 :
                _a.slice(0, 3).map(function (day) {
                    var _a;
                    return (React.createElement(badge_1.Badge, { key: day, variant: "outline", className: "text-xs" }, ((_a = types_1.DAY_OF_WEEK_LABELS[day]) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || day));
                }),
                ((_b = value) === null || _b === void 0 ? void 0 : _b.length) > 3 && (React.createElement(badge_1.Badge, { variant: "outline", className: "text-xs" },
                    "+",
                    value.length - 3))));
        }
    },
    {
        key: 'version',
        label: 'Version',
        sortable: true,
        width: '80px',
        render: function (value) { return "v" + value; }
    },
    {
        key: 'is_active',
        label: 'Status',
        sortable: true,
        width: '100px',
        render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary' }, value ? 'Active' : 'Inactive')); }
    },
];
