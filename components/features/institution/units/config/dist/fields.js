"use strict";
/**
 * Unit Field Configurations
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
exports.UnitFormConfig = void 0;
var client_1 = require("../../programmes/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.UnitFormConfig = {
    fields: [
        {
            name: 'name',
            label: 'Unit Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Introduction to Programming',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Unit name is required' },
                { type: 'maxLength', value: 255, message: 'Name is too long' },
            ],
            width: '50%'
        },
        {
            name: 'code',
            label: 'Unit Code',
            type: 'text',
            required: true,
            placeholder: 'e.g., CS101',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Unit code is required' },
                { type: 'maxLength', value: 20, message: 'Code is too long' },
            ],
            helpText: 'Unique identifier for this unit',
            width: '25%'
        },
        {
            name: 'credits',
            label: 'Credits',
            type: 'number',
            required: false,
            placeholder: '3',
            group: 'basic',
            validation: [
                { type: 'min', value: 0, message: 'Credits must be positive' },
                { type: 'max', value: 20, message: 'Credits cannot exceed 20' },
            ],
            helpText: 'Credit hours for this unit',
            width: '25%'
        },
        {
            name: 'programme',
            label: 'Programme',
            type: 'relation',
            required: true,
            group: 'associations',
            validation: [{ type: 'required', message: 'Programme is required' }],
            relationConfig: {
                entity: 'Programme',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['name', 'code'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_1.programmesApiClient.list({ search: search, pageSize: 50 })];
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
            name: 'level',
            label: 'Level/Year',
            type: 'number',
            required: false,
            placeholder: '1',
            group: 'associations',
            validation: [
                { type: 'min', value: 1, message: 'Level must be at least 1' },
                { type: 'max', value: 10, message: 'Level cannot exceed 10' },
            ],
            helpText: 'Year/Level when this unit is typically taken',
            width: '25%'
        },
        {
            name: 'term_number',
            label: 'Term Number',
            type: 'number',
            required: false,
            placeholder: '1',
            group: 'associations',
            validation: [
                { type: 'min', value: 1, message: 'Term must be at least 1' },
            ],
            helpText: 'Which term this unit is taught',
            width: '25%'
        },
        {
            name: 'is_active',
            label: 'Active',
            type: 'boolean',
            required: false,
            group: 'status',
            defaultValue: true,
            width: '50%'
        },
        {
            name: 'is_core',
            label: 'Core Unit',
            type: 'boolean',
            required: false,
            group: 'status',
            defaultValue: true,
            helpText: 'Is this a core/required unit?',
            width: '50%'
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'Unit description and objectives...',
            rows: 4,
            width: '100%'
        },
        {
            name: 'learning_outcomes',
            label: 'Learning Outcomes',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'Expected learning outcomes...',
            rows: 4,
            width: '100%'
        },
    ],
    fieldGroups: [
        { id: 'basic', title: 'Basic Information', collapsible: false },
        { id: 'associations', title: 'Programme & Scheduling', collapsible: true, defaultExpanded: true },
        { id: 'status', title: 'Status', collapsible: true, defaultExpanded: true },
        { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
    ],
    layout: 'vertical'
};
