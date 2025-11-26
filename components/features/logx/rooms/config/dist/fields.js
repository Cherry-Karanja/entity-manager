"use strict";
/**
 * Room Form Field Definitions
 * Defines the form fields for creating and editing rooms
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
exports.roomFields = void 0;
var client_1 = require("@/components/connectionManager/http/client");
var types_1 = require("../../types");
exports.roomFields = [
    {
        name: 'name',
        label: 'Room Name',
        type: 'text',
        required: true,
        placeholder: 'Enter room name',
        description: 'Name or number of the room',
        width: 'span 6'
    },
    {
        name: 'code',
        label: 'Room Code',
        type: 'text',
        required: true,
        placeholder: 'Enter unique room code',
        description: 'Unique identifier for the room',
        width: 'span 6'
    },
    {
        name: 'department',
        label: 'Department',
        type: 'relation',
        required: true,
        relationConfig: {
            entity: 'departments',
            displayField: 'name',
            valueField: 'id',
            fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                var q, resp, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            q = search ? { params: { search: search } } : undefined;
                            return [4 /*yield*/, client_1.authApi.get('/api/v1/institution/departments/', q)];
                        case 1:
                            resp = _c.sent();
                            data = resp.data;
                            return [2 /*return*/, Array.isArray(data) ? data : (_b = (_a = data.results) !== null && _a !== void 0 ? _a : data.data) !== null && _b !== void 0 ? _b : []];
                    }
                });
            }); },
            searchFields: ['name']
        },
        width: 'span 6'
    },
    {
        name: 'room_type',
        label: 'Room Type',
        type: 'select',
        required: true,
        options: Object.entries(types_1.ROOM_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return ({
                value: value,
                label: label
            });
        }),
        width: 'span 6'
    },
    {
        name: 'capacity',
        label: 'Capacity',
        type: 'number',
        required: true,
        placeholder: 'Enter maximum capacity',
        description: 'Maximum number of people the room can accommodate',
        validation: [
            { type: 'min', message: 'Capacity must be at least 1', value: 1 },
            { type: 'max', message: 'Capacity must be at most 1000', value: 1000 },
        ],
        width: 'span 4'
    },
    {
        name: 'building',
        label: 'Building',
        type: 'text',
        placeholder: 'Building name or identifier',
        width: 'span 4'
    },
    {
        name: 'floor',
        label: 'Floor',
        type: 'text',
        placeholder: 'Floor number or identifier',
        width: 'span 4'
    },
    {
        name: 'operating_hours_start',
        label: 'Operating Hours Start',
        type: 'time',
        placeholder: 'Start time',
        width: 'span 6'
    },
    {
        name: 'operating_hours_end',
        label: 'Operating Hours End',
        type: 'time',
        placeholder: 'End time',
        width: 'span 6'
    },
    {
        name: 'is_active',
        label: 'Active',
        type: 'switch',
        defaultValue: true,
        description: 'Whether the room is available for scheduling',
        width: 'span 4'
    },
    {
        name: 'allows_concurrent_bookings',
        label: 'Allow Concurrent Bookings',
        type: 'switch',
        defaultValue: false,
        description: 'Allow multiple bookings simultaneously',
        width: 'span 4'
    },
    {
        name: 'requires_approval',
        label: 'Requires Approval',
        type: 'switch',
        defaultValue: false,
        description: 'Bookings require approval before confirmation',
        width: 'span 4'
    },
    {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Additional notes about the room',
        width: 'span 12'
    },
];
