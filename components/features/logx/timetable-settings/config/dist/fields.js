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
exports.timetableSettingsFields = void 0;
var client_1 = require("@/components/connectionManager/http/client");
exports.timetableSettingsFields = [
    {
        name: "name",
        label: "Settings Name",
        type: "text",
        required: true,
        placeholder: "e.g., Default Settings",
        helpText: "A unique name for this settings configuration"
    },
    {
        name: "institution",
        label: "Institution",
        type: "select",
        required: true,
        placeholder: "Select institution",
        helpText: "The institution these settings apply to",
        relationConfig: {
            entity: 'institutions',
            displayField: 'name',
            valueField: 'id',
            fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                var params, resp, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            params = search ? { params: { search: search } } : undefined;
                            return [4 /*yield*/, client_1.authApi.get('/api/v1/institution/institutions/', params)];
                        case 1:
                            resp = _c.sent();
                            data = resp.data;
                            return [2 /*return*/, Array.isArray(data) ? data : (_b = (_a = data.results) !== null && _a !== void 0 ? _a : data.data) !== null && _b !== void 0 ? _b : []];
                    }
                });
            }); },
            searchFields: ['name']
        }
    },
    {
        name: "max_lessons_per_day",
        label: "Max Lessons Per Day",
        type: "number",
        required: true,
        placeholder: "e.g., 8",
        helpText: "Maximum number of lessons a class can have per day"
    },
    {
        name: "max_consecutive_lessons",
        label: "Max Consecutive Lessons",
        type: "number",
        required: true,
        placeholder: "e.g., 3",
        helpText: "Maximum number of consecutive lessons without a break"
    },
    {
        name: "min_break_duration",
        label: "Min Break Duration (minutes)",
        type: "number",
        required: true,
        placeholder: "e.g., 15",
        helpText: "Minimum break duration between lesson blocks"
    },
    {
        name: "allow_split_lessons",
        label: "Allow Split Lessons",
        type: "checkbox",
        helpText: "Allow lessons to be split across non-consecutive periods"
    },
    {
        name: "prefer_morning_classes",
        label: "Prefer Morning Classes",
        type: "checkbox",
        helpText: "Schedule classes in the morning when possible"
    },
    {
        name: "balance_daily_load",
        label: "Balance Daily Load",
        type: "checkbox",
        helpText: "Distribute lessons evenly across days"
    },
    {
        name: "avoid_gaps",
        label: "Avoid Gaps",
        type: "checkbox",
        helpText: "Minimize free periods between lessons"
    },
    {
        name: "respect_room_capacity",
        label: "Respect Room Capacity",
        type: "checkbox",
        helpText: "Only assign rooms that can accommodate the class size"
    },
    {
        name: "algorithm_timeout",
        label: "Algorithm Timeout (seconds)",
        type: "number",
        placeholder: "e.g., 300",
        helpText: "Maximum time for the scheduling algorithm to run"
    },
    {
        name: "optimization_iterations",
        label: "Optimization Iterations",
        type: "number",
        placeholder: "e.g., 1000",
        helpText: "Number of iterations for optimization"
    },
    {
        name: "is_default",
        label: "Default Settings",
        type: "checkbox",
        helpText: "Use as default settings for new timetables"
    },
];
