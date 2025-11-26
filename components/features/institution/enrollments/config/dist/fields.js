"use strict";
/**
 * Enrollment Field Configurations
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
exports.EnrollmentFormConfig = void 0;
var client_1 = require("@/components/features/accounts/users/api/client");
var client_2 = require("../../class-groups/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.EnrollmentFormConfig = {
    fields: [
        {
            name: 'trainee',
            label: 'Trainee',
            type: 'relation',
            required: true,
            group: 'enrollment',
            validation: [{ type: 'required', message: 'Trainee is required' }],
            relationConfig: {
                entity: 'User',
                displayField: 'full_name',
                valueField: 'id',
                searchFields: ['full_name', 'email'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_1.usersApiClient.list({ search: search, pageSize: 50 })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, responseUtils_1.getListData(response)];
                        }
                    });
                }); }
            },
            width: '50%'
        },
        {
            name: 'class_group',
            label: 'Class Group',
            type: 'relation',
            required: true,
            group: 'enrollment',
            validation: [{ type: 'required', message: 'Class group is required' }],
            relationConfig: {
                entity: 'ClassGroup',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['name'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_2.classGroupsApiClient.list({ search: search, pageSize: 50 })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, responseUtils_1.getListData(response)];
                        }
                    });
                }); }
            },
            width: '50%'
        },
        {
            name: 'enrollment_date',
            label: 'Enrollment Date',
            type: 'date',
            required: true,
            group: 'enrollment',
            validation: [{ type: 'required', message: 'Enrollment date is required' }],
            width: '50%'
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            group: 'enrollment',
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Withdrawn', value: 'withdrawn' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Deferred', value: 'deferred' },
            ],
            defaultValue: 'active',
            width: '50%'
        },
        {
            name: 'grade',
            label: 'Grade',
            type: 'text',
            required: false,
            group: 'academic',
            placeholder: 'e.g., A, B+, 85%',
            helpText: 'Final grade for this enrollment',
            width: '50%'
        },
        {
            name: 'is_active',
            label: 'Active',
            type: 'switch',
            required: false,
            group: 'academic',
            defaultValue: true,
            helpText: 'Whether this enrollment is currently active',
            width: '50%'
        },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
            required: false,
            group: 'additional',
            placeholder: 'Additional notes about the enrollment...',
            rows: 3,
            width: '100%'
        },
    ],
    fieldGroups: [
        { id: 'enrollment', title: 'Enrollment Details', collapsible: false },
        { id: 'academic', title: 'Academic Information', collapsible: true, defaultExpanded: true },
        { id: 'additional', title: 'Additional Information', collapsible: true, defaultExpanded: false },
    ],
    layout: 'vertical'
};
