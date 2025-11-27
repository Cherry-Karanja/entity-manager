"use strict";
/**
 * Timetables Feature Index
 * Main export file for timetables feature
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
var client_1 = require("./api/client");
__createBinding(exports, client_1, "timetablesApiClient");
__createBinding(exports, client_1, "timetablesClient");
__createBinding(exports, client_1, "timetableActions");
var config_1 = require("./config");
__createBinding(exports, config_1, "timetableConfig");
__createBinding(exports, config_1, "timetableFields");
__createBinding(exports, config_1, "TimetableFormConfig");
__createBinding(exports, config_1, "TimetableListConfig");
__createBinding(exports, config_1, "timetableListConfig");
__createBinding(exports, config_1, "timetableColumns");
__createBinding(exports, config_1, "TimetableViewConfig");
__createBinding(exports, config_1, "timetableViewConfig");
__createBinding(exports, config_1, "timetableViewFields");
__createBinding(exports, config_1, "timetableViewGroups");
__createBinding(exports, config_1, "TimetableActionsConfig");
__createBinding(exports, config_1, "timetableActionsConfig");
__createBinding(exports, config_1, "TimetableExporterConfig");
__createBinding(exports, config_1, "timetableExportConfig");
// Export ScheduleEditor component for interactive timetable editing
var ScheduleEditor_1 = require("./components/ScheduleEditor");
__createBinding(exports, ScheduleEditor_1, "default", "ScheduleEditor");
// Re-export API client with expected name for backward compatibility
var client_2 = require("./api/client");
__createBinding(exports, client_2, "timetablesApiClient", "timetableClient");
