"use strict";
/**
 * Timetable List Column Configurations
 *
 * Defines columns for the timetable list view.
 */
exports.__esModule = true;
exports.timetableListConfig = exports.timetableColumns = exports.TimetableListConfig = void 0;
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var GenerationStatusDisplay_1 = require("../components/GenerationStatusDisplay");
// navigation is handled by the consuming component; avoid calling hooks in config modules
exports.TimetableListConfig = {
    columns: [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            width: '20%',
            type: 'text'
        },
        {
            key: 'academic_year_name',
            label: 'Academic Year',
            sortable: true,
            filterable: true,
            width: '12%',
            type: 'text',
            formatter: function (value, entity) { return value || "Year " + (entity === null || entity === void 0 ? void 0 : entity.academic_year); }
        },
        {
            key: 'term_name',
            label: 'Term',
            sortable: true,
            filterable: true,
            width: '10%',
            type: 'text',
            formatter: function (value, entity) { return value || "Term " + (entity === null || entity === void 0 ? void 0 : entity.term); }
        },
        {
            key: 'start_date',
            label: 'Start Date',
            sortable: true,
            width: '12%',
            type: 'date'
        },
        {
            key: 'end_date',
            label: 'End Date',
            sortable: true,
            width: '12%',
            type: 'date'
        },
        {
            key: 'generation_status',
            label: 'Generation Status',
            width: '15%',
            align: 'center',
            render: function (value) {
                var status = value || 'pending';
                return (React.createElement(GenerationStatusDisplay_1.GenerationStatusBadge, { status: status, isGenerating: status === 'in_progress' }));
            }
        },
        {
            key: 'version',
            label: 'Version',
            sortable: true,
            width: '8%',
            align: 'center',
            type: 'number',
            formatter: function (value) { return "v" + value; }
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            filterable: true,
            width: '10%',
            type: 'boolean',
            render: function (value) { return (React.createElement(badge_1.Badge, { variant: value ? 'default' : 'secondary', className: value ? 'bg-green-600' : '' },
                value ? React.createElement(lucide_react_1.CheckCircle, { className: "h-3 w-3 mr-1" }) : React.createElement(lucide_react_1.XCircle, { className: "h-3 w-3 mr-1" }),
                value ? 'Active' : 'Inactive')); }
        },
    ],
    view: 'table',
    toolbar: {
        search: true,
        filters: true,
        viewSwitcher: true,
        columnSelector: true,
        refresh: true,
        "export": true
    },
    selectable: true,
    multiSelect: true,
    pagination: true,
    paginationConfig: {
        page: 1,
        pageSize: 10
    },
    sortable: true,
    sortConfig: { field: 'created_at', direction: 'desc' },
    filterable: true,
    filterConfigs: [
        { field: 'is_active', operator: 'equals', value: true },
        { field: 'academic_year', operator: 'in', value: [] },
        { field: 'term', operator: 'in', value: [] },
    ],
    searchable: true,
    searchPlaceholder: 'Search timetables...',
    emptyMessage: 'No timetables found.',
    hover: true,
    striped: true,
    bordered: true,
    titleField: 'name',
    subtitleField: 'academic_year_name',
    dateField: 'created_at',
    onRowClick: function (timetable) {
        // Avoid React hooks in configuration files - perform navigation using window when running in browser
        if (typeof window !== 'undefined') {
            // Navigate to viewer if generation is complete, otherwise to detail page
            var destination = timetable.generation_status === 'completed'
                ? "/dashboard/timetables/" + timetable.id + "/viewer"
                : "/dashboard/timetables/" + timetable.id;
            window.location.href = destination;
        }
    }
};
// Legacy exports for backward compatibility
exports.timetableColumns = exports.TimetableListConfig.columns;
exports.timetableListConfig = exports.TimetableListConfig;
