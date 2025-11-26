"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.timetableSettingsActions = void 0;
var lucide_react_1 = require("lucide-react");
var client_1 = require("../api/client");
exports.timetableSettingsActions = [
    {
        id: "view",
        label: "View Details",
        actionType: "navigation",
        icon: React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" }),
        // navigation URL builder - update if your routes differ
        url: function (entity) { return "/dashboard/(scheduling)/timetable-settings/" + (entity === null || entity === void 0 ? void 0 : entity.id); },
        position: "row"
    },
    {
        id: "edit",
        label: "Edit Settings",
        actionType: "navigation",
        icon: React.createElement(lucide_react_1.Pencil, { className: "h-4 w-4" }),
        url: function (entity) { return "/dashboard/(scheduling)/timetable-settings/" + (entity === null || entity === void 0 ? void 0 : entity.id) + "/edit"; },
        position: "row"
    },
    {
        id: "set_default",
        label: "Set as Default",
        actionType: "immediate",
        icon: React.createElement(lucide_react_1.Star, { className: "h-4 w-4" }),
        position: "row",
        visible: function (entity) { return !(entity === null || entity === void 0 ? void 0 : entity.is_default); },
        handler: function (entity, context) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!entity)
                            return [2 /*return*/];
                        return [4 /*yield*/, client_1.timetableSettingsApi.update(entity.id, { is_default: true })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, ((_a = context === null || context === void 0 ? void 0 : context.refresh) === null || _a === void 0 ? void 0 : _a.call(context))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    },
    {
        id: "duplicate",
        label: "Duplicate Settings",
        actionType: "immediate",
        icon: React.createElement(lucide_react_1.Copy, { className: "h-4 w-4" }),
        position: "row",
        handler: function (entity, context) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _id, data;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!entity)
                            return [2 /*return*/];
                        _a = entity, _id = _a.id, data = __rest(_a, ["id"]);
                        return [4 /*yield*/, client_1.timetableSettingsApi.create(__assign(__assign({}, data), { name: entity.name + " (Copy)", is_default: false }))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, ((_b = context === null || context === void 0 ? void 0 : context.refresh) === null || _b === void 0 ? void 0 : _b.call(context))];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    },
    {
        id: "delete",
        label: "Delete Settings",
        actionType: "confirm",
        icon: React.createElement(lucide_react_1.Trash2, { className: "h-4 w-4" }),
        variant: "destructive",
        position: "row",
        visible: function (entity) { return !(entity === null || entity === void 0 ? void 0 : entity.is_default); },
        confirmMessage: function (entity) {
            return "Are you sure you want to delete \"" + (entity === null || entity === void 0 ? void 0 : entity.name) + "\"? This action cannot be undone.";
        },
        onConfirm: function (entity, context) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!entity)
                            return [2 /*return*/];
                        return [4 /*yield*/, client_1.timetableSettingsApi["delete"](entity.id)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, ((_a = context === null || context === void 0 ? void 0 : context.refresh) === null || _a === void 0 ? void 0 : _a.call(context))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    },
];
