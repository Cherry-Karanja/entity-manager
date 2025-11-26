"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.resourceLimitConfig = void 0;
var fields_1 = require("./fields");
__createBinding(exports, fields_1, "resourceLimitFields");
var list_1 = require("./list");
__createBinding(exports, list_1, "resourceLimitListConfig");
var view_1 = require("./view");
__createBinding(exports, view_1, "resourceLimitViewConfig");
var actions_1 = require("./actions");
__createBinding(exports, actions_1, "resourceLimitActionsConfig");
var export_1 = require("./export");
__createBinding(exports, export_1, "resourceLimitExportConfig");
/**
 * Canonical EntityConfig for Resource Limits
 * This mirrors the pattern used by the accounts module (e.g. userConfig)
 */
exports.resourceLimitConfig = {
    name: 'resource_limit',
    label: 'Resource Limit',
    labelPlural: 'Resource Limits',
    description: 'Limits for resource usage within timetables',
    list: resourceLimitListConfig,
    form: { fields: resourceLimitFields },
    view: resourceLimitViewConfig,
    actions: resourceLimitActionsConfig,
    exporter: resourceLimitExportConfig,
    apiEndpoint: '/api/v1/timetabling/resource-limits',
    icon: 'Gauge',
    permissions: {
        create: true,
        read: true,
        update: true,
        "delete": true,
        "export": true
    },
    metadata: {
        category: 'scheduling',
        tags: ['resource', 'limits', 'timetabling']
    }
};
exports["default"] = exports.resourceLimitConfig;
