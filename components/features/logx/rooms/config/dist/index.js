"use strict";
/**
 * Room Configuration Index
 * Exports all room-related configurations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.roomConfig = void 0;
var fields_1 = require("./fields");
__createBinding(exports, fields_1, "roomFields");
var list_1 = require("./list");
__createBinding(exports, list_1, "roomColumns");
__createBinding(exports, list_1, "roomColumns", "roomListConfig");
var view_1 = require("./view");
__createBinding(exports, view_1, "roomViewConfig");
var actions_1 = require("./actions");
__createBinding(exports, actions_1, "roomActions");
__createBinding(exports, actions_1, "roomActions", "roomActionsConfig");
var export_1 = require("./export");
__createBinding(exports, export_1, "roomExportConfig");
var fields_2 = require("./fields");
var list_2 = require("./list");
var view_2 = require("./view");
var actions_2 = require("./actions");
var export_2 = require("./export");
exports.roomConfig = {
    name: 'room',
    label: 'Room',
    labelPlural: 'Rooms',
    description: 'Physical rooms and facilities',
    list: { columns: list_2.roomColumns },
    form: { fields: fields_2.roomFields },
    view: view_2.roomViewConfig,
    actions: actions_2.roomActions,
    exporter: export_2.roomExportConfig,
    apiEndpoint: '/api/v1/resources/rooms/',
    icon: 'DoorOpen',
    permissions: { create: true, read: true, update: true, "delete": true, "export": true },
    metadata: { category: 'scheduling', tags: ['rooms', 'resources'] }
};
exports["default"] = exports.roomConfig;
