"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.virtualResourceConfig = void 0;
var fields_1 = require("./fields");
__createBinding(exports, fields_1, "virtualResourceFields");
var list_1 = require("./list");
__createBinding(exports, list_1, "virtualResourceColumns");
__createBinding(exports, list_1, "virtualResourceColumns", "virtualResourceListConfig");
var view_1 = require("./view");
__createBinding(exports, view_1, "virtualResourceViewConfig");
var actions_1 = require("./actions");
__createBinding(exports, actions_1, "virtualResourceActionsConfig");
var export_1 = require("./export");
__createBinding(exports, export_1, "virtualResourceExportConfig");
var fields_2 = require("./fields");
var list_2 = require("./list");
var view_2 = require("./view");
var actions_2 = require("./actions");
var export_2 = require("./export");
exports.virtualResourceConfig = {
    fields: fields_2.virtualResourceFields,
    columns: list_2.virtualResourceColumns,
    view: view_2.virtualResourceViewConfig,
    actions: actions_2.virtualResourceActionsConfig,
    "export": export_2.virtualResourceExportConfig
};
