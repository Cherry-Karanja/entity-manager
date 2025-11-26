"use strict";
/**
 * Enrollment Action Configurations
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
exports.EnrollmentActionsConfig = void 0;
var lucide_react_1 = require("lucide-react");
var client_1 = require("../api/client");
exports.EnrollmentActionsConfig = {
    actions: [
        {
            id: 'activate',
            label: 'Activate',
            icon: React.createElement(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
            actionType: 'immediate',
            variant: 'default',
            position: 'row',
            visible: function (enrollment) { return !(enrollment === null || enrollment === void 0 ? void 0 : enrollment.is_active); },
            handler: function (enrollment, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!enrollment || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, client_1.enrollmentActions.activate(enrollment.id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'deactivate',
            label: 'Deactivate',
            icon: React.createElement(lucide_react_1.XCircle, { className: "h-4 w-4" }),
            actionType: 'immediate',
            variant: 'secondary',
            position: 'row',
            visible: function (enrollment) { return (enrollment === null || enrollment === void 0 ? void 0 : enrollment.is_active) === true; },
            handler: function (enrollment, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!enrollment || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, client_1.enrollmentActions.deactivate(enrollment.id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'update-grade',
            label: 'Update Grade',
            icon: React.createElement(lucide_react_1.GraduationCap, { className: "h-4 w-4" }),
            actionType: 'modal',
            variant: 'outline',
            position: 'row',
            visible: function (enrollment) { return (enrollment === null || enrollment === void 0 ? void 0 : enrollment.is_active) === true || (enrollment === null || enrollment === void 0 ? void 0 : enrollment.status) === 'completed'; }
        },
        {
            id: 'withdraw',
            label: 'Withdraw',
            icon: React.createElement(lucide_react_1.UserMinus, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'destructive',
            position: 'row',
            visible: function (enrollment) { return (enrollment === null || enrollment === void 0 ? void 0 : enrollment.is_active) === true; },
            confirmMessage: function (enrollment) { return "Withdraw \"" + (enrollment === null || enrollment === void 0 ? void 0 : enrollment.trainee_name) + "\" from this class?"; },
            confirmText: 'Withdraw',
            onConfirm: function (enrollment, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!enrollment || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, client_1.enrollmentActions.withdraw(enrollment.id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
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
            confirmMessage: function (enrollment) { return "Delete enrollment for \"" + (enrollment === null || enrollment === void 0 ? void 0 : enrollment.trainee_name) + "\"?"; },
            confirmText: 'Delete',
            onConfirm: function (enrollment, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!enrollment || !(context === null || context === void 0 ? void 0 : context["delete"]) || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, context["delete"](enrollment.id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
    ],
    bulk: [
        {
            id: 'bulk-activate',
            label: 'Activate Selected',
            icon: React.createElement(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
            actionType: 'immediate',
            variant: 'default',
            handler: function (items, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(items === null || items === void 0 ? void 0 : items.length) || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.all(items.map(function (e) { return client_1.enrollmentActions.activate(e.id); }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
        {
            id: 'bulk-delete',
            label: 'Delete Selected',
            icon: React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
            actionType: 'confirm',
            variant: 'destructive',
            confirmMessage: function (items) { return "Delete " + ((items === null || items === void 0 ? void 0 : items.length) || 0) + " enrollments?"; },
            confirmText: 'Delete All',
            onConfirm: function (items, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(items === null || items === void 0 ? void 0 : items.length) || !(context === null || context === void 0 ? void 0 : context.bulkDelete) || !(context === null || context === void 0 ? void 0 : context.refresh))
                                return [2 /*return*/];
                            return [4 /*yield*/, context.bulkDelete(items.map(function (e) { return e.id; }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, context.refresh()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        },
    ]
};
