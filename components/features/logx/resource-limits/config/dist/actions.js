"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.resourceLimitActionsConfig = void 0;
var lucide_react_1 = require("lucide-react");
/**
 * Canonical actions config for resource limits
 * Converted from legacy rowActions/bulkActions/handlers shape to canonical actions array.
 */
exports.resourceLimitActionsConfig = {
    actions: [
        {
            id: "checkLimit",
            label: "Check Limit",
            icon: lucide_react_1.Gauge,
            actionType: "immediate",
            variant: "outline",
            handler: function (entity, context) { return __awaiter(void 0, void 0, Promise, function () {
                var client;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!entity)
                                return [2 /*return*/];
                            client = (_d = (_b = (_a = context) === null || _a === void 0 ? void 0 : _a.customApi) !== null && _b !== void 0 ? _b : (_c = context) === null || _c === void 0 ? void 0 : _c.api) !== null && _d !== void 0 ? _d : undefined;
                            if (!(client === null || client === void 0 ? void 0 : client.checkLimit)) return [3 /*break*/, 2];
                            return [4 /*yield*/, client.checkLimit(entity.id)];
                        case 1:
                            _e.sent();
                            _e.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: "toggleActive",
            label: function (entity) { return ((entity === null || entity === void 0 ? void 0 : entity.is_active) ? "Deactivate" : "Activate"); },
            icon: lucide_react_1.ToggleRight,
            actionType: "confirm",
            variant: "outline",
            confirmMessage: function (entity) {
                return "Are you sure you want to " + ((entity === null || entity === void 0 ? void 0 : entity.is_active) ? "deactivate" : "activate") + " this resource limit?";
            },
            onConfirm: function (entity, context) { return __awaiter(void 0, void 0, Promise, function () {
                var apiClient, updatedResp, updated;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!entity)
                                return [2 /*return*/];
                            apiClient = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(apiClient === null || apiClient === void 0 ? void 0 : apiClient.update))
                                return [2 /*return*/];
                            return [4 /*yield*/, apiClient.update(entity.id, { is_active: !entity.is_active })];
                        case 1:
                            updatedResp = _e.sent();
                            updated = (_c = (_b = updatedResp) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : updatedResp;
                            return [4 /*yield*/, Promise.resolve((_d = context === null || context === void 0 ? void 0 : context.refresh) === null || _d === void 0 ? void 0 : _d.call(context))];
                        case 2:
                            _e.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: "bulkActivate",
            label: "Activate Selected",
            actionType: "bulk",
            variant: "default",
            confirmMessage: "Are you sure you want to activate the selected resource limits?",
            handler: function (items, context) { return __awaiter(void 0, void 0, Promise, function () {
                var apiClient;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiClient = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(apiClient === null || apiClient === void 0 ? void 0 : apiClient.update))
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all(items.map(function (item) { return apiClient.update(item.id, { is_active: true }); }))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Promise.resolve((_b = context === null || context === void 0 ? void 0 : context.refresh) === null || _b === void 0 ? void 0 : _b.call(context))];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: "bulkDeactivate",
            label: "Deactivate Selected",
            actionType: "bulk",
            variant: "secondary",
            confirmMessage: "Are you sure you want to deactivate the selected resource limits?",
            handler: function (items, context) { return __awaiter(void 0, void 0, Promise, function () {
                var apiClient;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiClient = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(apiClient === null || apiClient === void 0 ? void 0 : apiClient.update))
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all(items.map(function (item) { return apiClient.update(item.id, { is_active: false }); }))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Promise.resolve((_b = context === null || context === void 0 ? void 0 : context.refresh) === null || _b === void 0 ? void 0 : _b.call(context))];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: "bulkDelete",
            label: "Delete Selected",
            actionType: "bulk",
            variant: "destructive",
            confirmMessage: "Are you sure you want to delete the selected resource limits? This action cannot be undone.",
            handler: function (items, context) { return __awaiter(void 0, void 0, Promise, function () {
                var apiClient;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiClient = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(apiClient === null || apiClient === void 0 ? void 0 : apiClient["delete"]))
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all(items.map(function (item) { return apiClient["delete"](item.id); }))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Promise.resolve((_b = context === null || context === void 0 ? void 0 : context.refresh) === null || _b === void 0 ? void 0 : _b.call(context))];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
    ]
};
exports["default"] = exports.resourceLimitActionsConfig;
