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
exports.classGroupScheduleActionsConfig = void 0;
var lucide_react_1 = require("lucide-react");
exports.classGroupScheduleActionsConfig = {
    actions: [
        {
            id: "view",
            label: "View Details",
            icon: React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" }),
            actionType: "navigation",
            position: "row"
        },
        {
            id: "edit",
            label: "Edit Schedule",
            icon: React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4" }),
            actionType: "navigation",
            position: "row"
        },
        {
            id: "toggle_lock",
            label: function (item) { return ((item === null || item === void 0 ? void 0 : item.is_locked) ? "Unlock Schedule" : "Lock Schedule"); },
            icon: function (item) {
                return (item === null || item === void 0 ? void 0 : item.is_locked) ? (React.createElement(lucide_react_1.Unlock, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.Lock, { className: "h-4 w-4" }));
            },
            actionType: "confirm",
            variant: "outline",
            position: "row",
            confirmMessage: function (item) {
                return "Are you sure you want to " + ((item === null || item === void 0 ? void 0 : item.is_locked) ? "unlock" : "lock") + " the schedule for \"" + (item === null || item === void 0 ? void 0 : item.class_group_name) + " - " + (item === null || item === void 0 ? void 0 : item.unit_name) + "\"?";
            },
            onConfirm: function (item, context) { return __awaiter(void 0, void 0, Promise, function () {
                var api;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!item)
                                return [2 /*return*/];
                            api = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(api === null || api === void 0 ? void 0 : api.update))
                                return [2 /*return*/];
                            return [4 /*yield*/, api.update(item.id, { is_locked: !item.is_locked })];
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
            id: "check_conflicts",
            label: "Check Conflicts",
            icon: React.createElement(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }),
            actionType: "custom",
            position: "row",
            handler: function (item, context) { return __awaiter(void 0, void 0, Promise, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, ((_b = (_a = context) === null || _a === void 0 ? void 0 : _a.showDialog) === null || _b === void 0 ? void 0 : _b.call(_a, {
                                title: "Conflict Analysis",
                                content: "Checking conflicts for schedule: " + (item === null || item === void 0 ? void 0 : item.class_group_name) + " - " + (item === null || item === void 0 ? void 0 : item.unit_name)
                            }))];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: "delete",
            label: "Delete Schedule",
            icon: React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
            actionType: "confirm",
            variant: "destructive",
            position: "row",
            confirmMessage: function (item) {
                return "Are you sure you want to delete the schedule for \"" + (item === null || item === void 0 ? void 0 : item.class_group_name) + " - " + (item === null || item === void 0 ? void 0 : item.unit_name) + "\"? This action cannot be undone.";
            },
            onConfirm: function (item, context) { return __awaiter(void 0, void 0, Promise, function () {
                var api;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!item)
                                return [2 /*return*/];
                            api = (_a = context) === null || _a === void 0 ? void 0 : _a.api;
                            if (!(api === null || api === void 0 ? void 0 : api["delete"]))
                                return [2 /*return*/];
                            return [4 /*yield*/, api["delete"](item.id)];
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
exports["default"] = exports.classGroupScheduleActionsConfig;
