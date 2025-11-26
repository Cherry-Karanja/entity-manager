"use strict";
/**
 * Subtopic Field Configurations
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
exports.SubtopicFormConfig = void 0;
var client_1 = require("../../topics/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.SubtopicFormConfig = {
    fields: [
        {
            name: 'name',
            label: 'Subtopic Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Integer data types',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Subtopic name is required' },
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
            helpText: 'Display order within the topic',
            width: '30%'
        },
        {
            name: 'topic',
            label: 'Topic',
            type: 'relation',
            required: true,
            group: 'associations',
            validation: [{ type: 'required', message: 'Topic is required' }],
            relationConfig: {
                entity: 'Topic',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['name'],
                fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client_1.topicsApiClient.list({ search: search, pageSize: 50 })];
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
            name: 'duration_minutes',
            label: 'Duration (Minutes)',
            type: 'number',
            required: false,
            placeholder: '30',
            group: 'scheduling',
            validation: [
                { type: 'min', value: 5, message: 'Duration must be at least 5 minutes' },
            ],
            helpText: 'Estimated teaching time in minutes',
            width: '50%'
        },
        {
            name: 'content_type',
            label: 'Content Type',
            type: 'select',
            required: false,
            group: 'scheduling',
            options: [
                { label: 'Lecture', value: 'lecture' },
                { label: 'Practical', value: 'practical' },
                { label: 'Discussion', value: 'discussion' },
                { label: 'Assessment', value: 'assessment' },
                { label: 'Self-Study', value: 'self-study' },
            ],
            width: '50%'
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'Subtopic description and key points...',
            rows: 3,
            width: '100%'
        },
        {
            name: 'resources',
            label: 'Resources / References',
            type: 'textarea',
            required: false,
            group: 'details',
            placeholder: 'List of learning resources, links, etc...',
            rows: 3,
            width: '100%'
        },
    ],
    fieldGroups: [
        { id: 'basic', title: 'Subtopic Information', collapsible: false },
        { id: 'associations', title: 'Topic Association', collapsible: true, defaultExpanded: true },
        { id: 'scheduling', title: 'Duration & Type', collapsible: true, defaultExpanded: true },
        { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
    ],
    layout: 'vertical'
};
