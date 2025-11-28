"use strict";
/**
 * Class Group Schedule Configuration Index
 *
 * Main configuration file that exports all class group schedule management configurations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.classGroupScheduleFormConfig = exports.classGroupScheduleListConfig = exports.classGroupScheduleConfig = void 0;
// Import individual configs
var fields_1 = require("./fields");
var list_1 = require("./list");
var view_1 = require("./view");
var actions_1 = require("./actions");
var export_1 = require("./export");
/**
 * Complete class group schedule entity configuration for the Entity Manager
 */
exports.classGroupScheduleConfig = {
    // Basic Metadata
    name: 'classGroupSchedule',
    label: 'Class Schedule',
    labelPlural: 'Class Schedules',
    description: 'Scheduled classes for class groups',
    // List View Configuration
    list: list_1.ClassGroupScheduleListConfig,
    // Form Configuration
    form: fields_1.ClassGroupScheduleFormConfig,
    // Detail View Configuration
    view: view_1.classGroupScheduleViewConfig,
    // Actions Configuration
    actions: actions_1.classGroupScheduleActionsConfig,
    // Export Configuration
    exporter: export_1.classGroupScheduleExportConfig,
    // Api endpoint
    apiEndpoint: '/api/v1/timetabling/class-group-schedules/',
    // icon
    icon: 'CalendarDays',
    // Permissions
    permissions: {
        create: true,
        read: true,
        update: true,
        "delete": true,
        "export": true
    },
    // Additional Metadata
    metadata: {
        category: 'scheduling',
        tags: ['schedule', 'class', 'timetable']
    }
};
// Export individual configs
var fields_2 = require("./fields");
__createBinding(exports, fields_2, "classGroupScheduleFields");
__createBinding(exports, fields_2, "ClassGroupScheduleFormConfig");
var list_2 = require("./list");
__createBinding(exports, list_2, "classGroupScheduleColumns");
__createBinding(exports, list_2, "ClassGroupScheduleListConfig");
var view_2 = require("./view");
__createBinding(exports, view_2, "classGroupScheduleViewConfig");
var actions_2 = require("./actions");
__createBinding(exports, actions_2, "classGroupScheduleActionsConfig");
var export_2 = require("./export");
__createBinding(exports, export_2, "classGroupScheduleExportConfig");
// Backwards-compatible lower-cased exports used by other modules
exports.classGroupScheduleListConfig = list_1.ClassGroupScheduleListConfig;
exports.classGroupScheduleFormConfig = fields_1.ClassGroupScheduleFormConfig;
