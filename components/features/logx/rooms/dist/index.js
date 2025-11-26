"use strict";
/**
 * Rooms Feature Index
 * Main export file for rooms feature
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./config"), exports);
var config_1 = require("./config");
__createBinding(exports, config_1, "roomConfig");
// Re-export API client with expected name
var client_1 = require("./api/client");
__createBinding(exports, client_1, "roomsClient", "roomClient");
