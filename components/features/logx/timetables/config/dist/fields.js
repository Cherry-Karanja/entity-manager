"use strict";
/**
 * Timetable Form Field Definitions
 *
 * Defines the form fields for creating and editing timetables.
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
exports.TimetableFormConfig = exports.timetableFields = void 0;
var client_1 = require("@/components/connectionManager/http/client");
var types_1 = require("../../types");
var lucide_react_1 = require("lucide-react");
exports.timetableFields = [
    // ===========================
    // Basic Information
    // ===========================
    {
        name: 'name',
        label: 'Timetable Name',
        type: 'text',
        required: true,
        placeholder: 'Enter timetable name',
        group: 'basic',
        validation: [
            { type: 'required', message: 'Timetable name is required' },
            { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
        ],
        helpText: 'A descriptive name for this timetable',
        width: '100%'
    },
    {
        name: 'term',
        label: 'Term',
        type: 'relation',
        required: true,
        placeholder: 'Select term',
        group: 'basic',
        relationConfig: {
            entity: 'terms',
            displayField: 'name',
            valueField: 'id',
            fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                var params, resp, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            params = search ? { params: { search: search } } : undefined;
                            return [4 /*yield*/, client_1.authApi.get('/api/v1/institution/terms/', params)];
                        case 1:
                            resp = _c.sent();
                            data = resp.data;
                            return [2 /*return*/, Array.isArray(data) ? data : (_b = (_a = data.results) !== null && _a !== void 0 ? _a : data.data) !== null && _b !== void 0 ? _b : []];
                    }
                });
            }); },
            searchFields: ['name']
        },
        width: '50%'
    },
    // ===========================
    // Schedule Period
    // ===========================
    {
        name: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        group: 'schedule',
        helpText: 'Start date of the timetable period',
        width: '50%'
    },
    {
        name: 'end_date',
        label: 'End Date',
        type: 'date',
        required: true,
        group: 'schedule',
        helpText: 'End date of the timetable period',
        width: '50%'
    },
    {
        name: 'working_days',
        label: 'Working Days',
        type: 'multiselect',
        required: true,
        group: 'schedule',
        options: Object.entries(types_1.DAY_OF_WEEK_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return ({
                value: value,
                label: label
            });
        }),
        defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        helpText: 'Days when classes can be scheduled',
        width: '100%'
    },
    // ===========================
    // Working Hours
    // ===========================
    {
        name: 'working_hours_start',
        label: 'Working Hours Start',
        type: 'time',
        required: true,
        defaultValue: '08:00',
        group: 'hours',
        helpText: 'Start time of working hours',
        width: '50%'
    },
    {
        name: 'working_hours_end',
        label: 'Working Hours End',
        type: 'time',
        required: true,
        defaultValue: '17:00',
        group: 'hours',
        helpText: 'End time of working hours',
        width: '50%'
    },
    // ===========================
    // Status
    // ===========================
    {
        name: 'is_active',
        label: 'Active',
        type: 'switch',
        required: false,
        group: 'status',
        defaultValue: false,
        helpText: 'Whether this timetable is currently active',
        width: '50%'
    },
    {
        name: 'version',
        label: 'Version',
        type: 'number',
        required: false,
        group: 'status',
        defaultValue: 1,
        disabled: true,
        helpText: 'Version number for regeneration tracking',
        width: '50%'
    },
];
exports.TimetableFormConfig = {
    fields: exports.timetableFields,
    layout: 'tabs',
    sections: [
        {
            id: 'basic',
            label: 'Basic Information',
            description: 'Timetable name and academic period',
            fields: ['name', 'academic_year', 'term'],
            icon: React.createElement(lucide_react_1.Calendar, { className: "h-4 w-4" }),
            order: 1
        },
        {
            id: 'schedule',
            label: 'Schedule Period',
            description: 'Date range and working days',
            fields: ['start_date', 'end_date', 'working_days'],
            icon: React.createElement(lucide_react_1.Calendar, { className: "h-4 w-4" }),
            order: 2
        },
        {
            id: 'hours',
            label: 'Working Hours',
            description: 'Daily time boundaries',
            fields: ['working_hours_start', 'working_hours_end'],
            icon: React.createElement(lucide_react_1.Clock, { className: "h-4 w-4" }),
            order: 3
        },
        {
            id: 'status',
            label: 'Status',
            description: 'Activation and version info',
            fields: ['is_active', 'version'],
            icon: React.createElement(lucide_react_1.Settings, { className: "h-4 w-4" }),
            order: 4
        },
    ],
    submitText: 'Save Timetable',
    cancelText: 'Cancel',
    showCancel: true,
    showReset: true
};
