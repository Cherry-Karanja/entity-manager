"use strict";
/**
 * ClassGroup Field Configurations
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
exports.ClassGroupFormConfig = void 0;
var client_1 = require("../../programmes/api/client");
var client_2 = require("../../intakes/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.ClassGroupFormConfig = {
    fields: [
        {
            name: 'name',
            label: 'Class Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., NNP/CAM5/25S2-M',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Class name is required' },
                { type: 'maxLength', value: 255, message: 'Name must be less than 255 characters' },
            ],
            helpText: 'Format: CURRICULUM/CODE/YYIT[-SUFFIX] e.g., NNP/CAM5/25S2-M',
            width: '50%'
        },
        {
            name: 'programme',
            label: 'Programme',
            type: 'relation',
            required: true,
            placeholder: 'Select programme',
            group: 'basic',
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
            name: 'auto_fill_fields',
            label: 'Auto-fill from Name',
            type: 'switch',
            required: false,
            group: 'basic',
            helpText: 'If enabled, intake, year, term, and suffix will be derived from the class name',
            defaultValue: true,
            width: '100%'
        },
        {
            name: 'cirriculum_code',
            label: 'Curriculum Code',
            type: 'text',
            required: false,
            placeholder: 'NNP',
            group: 'details',
            helpText: 'Curriculum code (auto-filled if auto-fill is enabled)',
            width: '25%'
        },
        {
            name: 'intake',
            label: 'Intake',
            type: 'relation',
            required: false,
            placeholder: 'Select intake',
            group: 'details',
            relationConfig: {
                entity: 'Intake',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['name'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_2.intakesApiClient.list({ search: search, pageSize: 50 })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, responseUtils_1.getListData(response)];
                        }
                    });
                }); }
            },
            helpText: 'Academic intake (auto-filled if auto-fill is enabled)',
            width: '25%'
        },
        {
            name: 'year',
            label: 'Year',
            type: 'number',
            required: false,
            placeholder: '2025',
            group: 'details',
            helpText: 'Full year (auto-filled if auto-fill is enabled)',
            width: '25%'
        },
        {
            name: 'term_number',
            label: 'Term Number',
            type: 'number',
            required: false,
            placeholder: '1',
            group: 'details',
            validation: [
                { type: 'min', value: 1, message: 'Term must be at least 1' },
                { type: 'max', value: 3, message: 'Term must be at most 3' },
            ],
            width: '25%'
        },
        {
            name: 'suffix',
            label: 'Suffix',
            type: 'select',
            required: false,
            placeholder: 'Select suffix',
            group: 'details',
            options: [
                { value: '', label: 'None' },
                { value: 'M', label: 'M - Modular' },
                { value: 'H', label: 'H - Harmonized' },
                { value: 'O', label: 'O - Other' },
            ],
            width: '25%'
        },
        {
            name: 'is_active',
            label: 'Active',
            type: 'switch',
            required: false,
            group: 'status',
            defaultValue: true,
            width: '25%'
        },
    ],
    layout: 'tabs',
    sections: [
        {
            id: 'basic',
            label: 'Basic Information',
            description: 'Core class details',
            fields: ['name', 'programme', 'auto_fill_fields'],
            order: 1
        },
        {
            id: 'details',
            label: 'Class Details',
            description: 'These are auto-filled if auto-fill is enabled',
            fields: ['cirriculum_code', 'intake', 'year', 'term_number', 'suffix'],
            order: 2
        },
        {
            id: 'status',
            label: 'Status',
            description: 'Class status',
            fields: ['is_active'],
            order: 3
        },
    ],
    submitText: 'Save Class Group',
    cancelText: 'Cancel',
    showCancel: true,
    showReset: true,
    disabled: false,
    className: 'class-group-form',
    validateOnChange: true,
    validateOnBlur: true,
    resetOnSubmit: false
};
