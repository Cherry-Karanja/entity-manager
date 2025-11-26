"use strict";
/**
 * Topic Field Configurations
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
exports.TopicFormConfig = void 0;
var client_1 = require("../../units/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.TopicFormConfig = {
    fields: [
        {
            name: 'name',
            label: 'Topic Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Variables and Data Types',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Topic name is required' },
                { type: 'maxLength', value: 255, message: 'Name is too long' },
            ],
            width: '70%'
        },
        {
            name: 'order',
            label: 'Order',
            type: 'number',
            required: false,
            placeholder: '1',
            group: 'basic',
            validation: [
                { type: 'min', value: 1, message: 'Order must be at least 1' },
            ],
            helpText: 'Display order within the unit',
            width: '30%'
        },
        {
            name: 'unit',
            label: 'Unit',
            type: 'relation',
            required: true,
            group: 'associations',
            validation: [{ type: 'required', message: 'Unit is required' }],
            relationConfig: {
                entity: 'Unit',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['name'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_1.unitsApiClient.list({ search: search, pageSize: 50 })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, responseUtils_1.getListData(response)];
                        }
                    });
                }); }
            },
            width: '100%'
        },
        {
            name: 'duration_hours',
            label: 'Duration (Hours)',
            type: 'number',
            required: false,
            placeholder: '2',
            group: 'scheduling',
            validation: [
                { type: 'min', value: 0.5, message: 'Duration must be at least 0.5 hours' },
            ],
            helpText: 'Estimated teaching hours',
            width: '50%'
        },
        {
            name: 'weight',
            label: 'Weight (%)',
            type: 'number',
            required: false,
            placeholder: '10',
            group: 'scheduling',
            validation: [
                { type: 'min', value: 0, message: 'Weight must be positive' },
                { type: 'max', value: 100, message: 'Weight cannot exceed 100%' },
            ],
            helpText: 'Percentage weight in unit assessment',
            width: '50%'
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'Topic description and coverage...',
            rows: 3,
            width: '100%'
        },
        {
            name: 'learning_objectives',
            label: 'Learning Objectives',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'What students will learn...',
            rows: 3,
            width: '100%'
        },
    ],
    fieldGroups: [
        { id: 'basic', title: 'Topic Information', collapsible: false },
        { id: 'associations', title: 'Unit Association', collapsible: true, defaultExpanded: true },
        { id: 'scheduling', title: 'Duration & Assessment', collapsible: true, defaultExpanded: true },
        { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
    ],
    layout: 'vertical'
};
