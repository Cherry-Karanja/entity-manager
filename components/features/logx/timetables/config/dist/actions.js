"use strict";
/**
 * Timetable Action Configurations
 *
 * Defines actions available for timetable management.
 */
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
exports.timetableActionsConfig = exports.TimetableActionsConfig = void 0;
var client_1 = require("../api/client");
var lucide_react_1 = require("lucide-react");
exports.TimetableActionsConfig = {
    actions: [
        // ===========================
        // Single Item Actions
        // ===========================
        {
            id: 'view',
            label: 'View Schedule',
            icon: React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" }),
            actionType: 'navigation',
            position: 'row',
            url: function (timetable) { return "/dashboard/timetables/" + timetable.id + "/viewer"; }
        },
        {
            id: 'edit',
            label: 'Edit Schedule',
            icon: React.createElement(lucide_react_1.Edit, { className: "h-4 w-4" }),
            actionType: 'navigation',
            position: 'row',
            url: function (timetable) { return "/dashboard/timetables/" + timetable.id + "/editor"; }
        },
        {
            id: 'activate',
            label: 'Activate',
            icon: React.createElement(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'primary',
            position: 'row',
            visible: function (timetable) { return !(timetable === null || timetable === void 0 ? void 0 : timetable.is_active); },
            confirmMessage: function (timetable) {
                return "Are you sure you want to activate \"" + (timetable === null || timetable === void 0 ? void 0 : timetable.name) + "\"?";
            },
            confirmText: 'Activate',
            onConfirm: function (timetable, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!timetable || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, client_1.timetablesApiClient.update(timetable.id, { is_active: true })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Failed to activate timetable:', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'deactivate',
            label: 'Deactivate',
            icon: React.createElement(lucide_react_1.XCircle, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'secondary',
            position: 'row',
            visible: function (timetable) { return (timetable === null || timetable === void 0 ? void 0 : timetable.is_active) === true; },
            confirmMessage: function (timetable) {
                return "Are you sure you want to deactivate \"" + (timetable === null || timetable === void 0 ? void 0 : timetable.name) + "\"?";
            },
            confirmText: 'Deactivate',
            onConfirm: function (timetable, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!timetable || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, client_1.timetablesApiClient.update(timetable.id, { is_active: false })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_2 = _a.sent();
                            console.error('Failed to deactivate timetable:', error_2);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'regenerate',
            label: 'Regenerate',
            icon: React.createElement(lucide_react_1.RefreshCw, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'outline',
            position: 'row',
            confirmMessage: function (timetable) {
                return "Are you sure you want to regenerate \"" + (timetable === null || timetable === void 0 ? void 0 : timetable.name) + "\"? This will create new schedules based on current enrollments and constraints.";
            },
            confirmText: 'Regenerate',
            onConfirm: function (timetable, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!timetable)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, client_1.timetableActions.regenerateTimetable(timetable.id, { use_optimization: true })];
                        case 2:
                            _a.sent();
                            if (!(context === null || context === void 0 ? void 0 : context.refresh)) return [3 /*break*/, 4];
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_3 = _a.sent();
                            console.error('Failed to regenerate timetable:', error_3);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'destructive',
            position: 'row',
            confirmMessage: function (timetable) {
                return "Are you sure you want to delete \"" + (timetable === null || timetable === void 0 ? void 0 : timetable.name) + "\"? This will also delete all associated schedules and cannot be undone.";
            },
            confirmText: 'Delete',
            onConfirm: function (timetable, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!timetable || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, client_1.timetablesApiClient["delete"](timetable.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_4 = _a.sent();
                            console.error('Failed to delete timetable:', error_4);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        // ===========================
        // Bulk Actions
        // ===========================
        {
            id: 'bulkActivate',
            label: 'Activate Selected',
            icon: React.createElement(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
            actionType: 'bulk',
            variant: 'primary',
            position: 'toolbar',
            confirmBulk: true,
            bulkConfirmMessage: function (count) {
                return "Are you sure you want to activate " + count + " timetable(s)?";
            },
            handler: function (timetables, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, Promise.all(timetables.map(function (t) { return client_1.timetablesApiClient.update(t.id, { is_active: true }); }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_5 = _a.sent();
                            console.error('Failed to bulk activate:', error_5);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'bulkDeactivate',
            label: 'Deactivate Selected',
            icon: React.createElement(lucide_react_1.XCircle, { className: "h-4 w-4" }),
            actionType: 'bulk',
            variant: 'secondary',
            position: 'toolbar',
            confirmBulk: true,
            bulkConfirmMessage: function (count) {
                return "Are you sure you want to deactivate " + count + " timetable(s)?";
            },
            handler: function (timetables, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, Promise.all(timetables.map(function (t) { return client_1.timetablesApiClient.update(t.id, { is_active: false }); }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_6 = _a.sent();
                            console.error('Failed to bulk deactivate:', error_6);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'bulkDelete',
            label: 'Delete Selected',
            icon: React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
            actionType: 'bulk',
            variant: 'destructive',
            position: 'toolbar',
            confirmBulk: true,
            bulkConfirmMessage: function (count) {
                return "Are you sure you want to delete " + count + " timetable(s)? This action cannot be undone.";
            },
            handler: function (timetables, context) { return __awaiter(void 0, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, Promise.all(timetables.map(function (t) { return client_1.timetablesApiClient["delete"](t.id); }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_7 = _a.sent();
                            console.error('Failed to bulk delete:', error_7);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        },
        // ===========================
        // Global Actions
        // ===========================
        {
            id: 'exportTimetables',
            label: 'Export',
            icon: React.createElement(lucide_react_1.Download, { className: "h-4 w-4" }),
            actionType: 'download',
            variant: 'secondary',
            position: 'toolbar',
            handler: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('Exporting timetables');
                    return [2 /*return*/];
                });
            }); }
        },
    ],
    mode: 'dropdown',
    className: ''
};
// Legacy export for backward compatibility
exports.timetableActionsConfig = exports.TimetableActionsConfig;
