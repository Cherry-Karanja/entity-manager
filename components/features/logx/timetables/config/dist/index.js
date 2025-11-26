"use strict";
/**
 * Timetable Configuration Index
 * Exports all timetable-related configurations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.timetableConfig = void 0;
var fields_1 = require("./fields");
__createBinding(exports, fields_1, "timetableFields");
var list_1 = require("./list");
__createBinding(exports, list_1, "timetableColumns");
__createBinding(exports, list_1, "timetableColumns", "timetableListConfig");
var view_1 = require("./view");
__createBinding(exports, view_1, "timetableViewConfig");
var actions_1 = require("./actions");
__createBinding(exports, actions_1, "timetableActionsConfig");
var export_1 = require("./export");
__createBinding(exports, export_1, "timetableExportConfig");
var fields_2 = require("./fields");
var list_2 = require("./list");
var view_2 = require("./view");
var actions_2 = require("./actions");
var export_2 = require("./export");
exports.timetableConfig = {
    name: 'timetable',
    label: 'Timetable',
    labelPlural: 'Timetables',
    description: 'Academic timetables and schedules',
    list: { columns: list_2.timetableColumns },
    form: { fields: fields_2.timetableFields },
    view: view_2.timetableViewConfig,
    actions: actions_2.timetableActionsConfig,
    exporter: export_2.timetableExportConfig,
    apiEndpoint: '/api/v1/logx/timetabling/timetables/',
    icon: 'Calendar',
    permissions: { create: true, read: true, update: true, "delete": true, "export": true },
    metadata: { category: 'scheduling', tags: ['timetables'] }
};
exports["default"] = exports.timetableConfig;
