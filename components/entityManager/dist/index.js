"use strict";
/**
 * Entity Manager - Main Entry Point
 *
 * Complete modular entity management system with 5-layer architecture:
 * 1. Primitives - Zero-dependency types, hooks, and utilities
 * 2. Components - Standalone UI components (List, Form, View, Actions, Exporter)
 * 3. Composition - Builders, state management, and API integration
 * 4. Features - Optional enhancements (offline, realtime, optimistic, collaborative)
 * 5. Orchestration - Thin coordinator (~150 lines)
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
// ===========================
// Layer 5: Orchestration
// ===========================
__exportStar(require("./orchestrator/exports"), exports);
// ===========================
// Layer 3: Composition
// ===========================
__exportStar(require("./composition/exports"), exports);
// ===========================
// Layer 2: Components
// ===========================
// List component
var list_1 = require("./components/list");
__createBinding(exports, list_1, "EntityList");
// Form component
var form_1 = require("./components/form");
__createBinding(exports, form_1, "EntityForm");
// View component
var view_1 = require("./components/view");
__createBinding(exports, view_1, "EntityView");
// Actions component
var actions_1 = require("./components/actions");
__createBinding(exports, actions_1, "EntityActions");
// Exporter component
var exporter_1 = require("./components/exporter");
__createBinding(exports, exporter_1, "EntityExporter");
// Hooks
var useFilters_1 = require("./primitives/hooks/useFilters");
__createBinding(exports, useFilters_1, "useFilters");
var usePagination_1 = require("./primitives/hooks/usePagination");
__createBinding(exports, usePagination_1, "usePagination");
var useSelection_1 = require("./primitives/hooks/useSelection");
__createBinding(exports, useSelection_1, "useSelection");
var useSort_1 = require("./primitives/hooks/useSort");
__createBinding(exports, useSort_1, "useSort");
// Utilities
__exportStar(require("./primitives/utils/validation"), exports);
__exportStar(require("./primitives/utils/formatting"), exports);
