"use strict";
/**
 * Programme Field Configurations
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
exports.ProgrammeFormConfig = void 0;
var client_1 = require("@/components/connectionManager/http/client");
exports.ProgrammeFormConfig = {
    fields: [
        {
            name: 'name',
            label: 'Programme Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Computer Science',
            group: 'basic',
            validation: [
                { type: 'required', message: 'Programme name is required' },
                { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
                { type: 'maxLength', value: 255, message: 'Name must be less than 255 characters' },
            ],
            width: '50%'
        },
        {
            name: 'code',
            label: 'Programme Code',
            type: 'text',
            required: false,
            placeholder: 'e.g., CS101',
            group: 'basic',
            validation: [
                { type: 'maxLength', value: 20, message: 'Code must be less than 20 characters' },
            ],
            helpText: 'Unique programme code identifier',
            width: '25%'
        },
        {
            name: 'level',
            label: 'Level',
            type: 'number',
            required: true,
            placeholder: '1',
            group: 'basic',
            validation: [
                { type: 'min', value: 0, message: 'Level must be at least 0' },
                { type: 'max', value: 10, message: 'Level must be at most 10' },
            ],
            helpText: 'Programme level (1-10)',
            width: '25%'
        },
        {
            name: 'department',
            label: 'Department',
            type: 'relation',
            required: true,
            placeholder: 'Select department',
            group: 'basic',
            relationConfig: {
                entity: 'departments',
                displayField: 'name',
                valueField: 'id',
                searchFields: ['search'],
                fetchOptions: function (query) { return __awaiter(void 0, void 0, void 0, function () {
                    var params, resp, data;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                params = query ? { params: { search: query } } : undefined;
                                return [4 /*yield*/, client_1.authApi.get('/api/v1/institution/departments/', params)];
                            case 1:
                                resp = _c.sent();
                                data = resp.data;
                                return [2 /*return*/, (Array.isArray(data) ? data : (_b = (_a = data.results) !== null && _a !== void 0 ? _a : data.data) !== null && _b !== void 0 ? _b : [])];
                        }
                    });
                }); }
            },
            width: '100%'
        },
    ],
    fieldGroups: [
        {
            id: 'basic',
            title: 'Programme Information',
            description: 'Basic programme details',
            collapsible: false
        },
    ],
    layout: 'vertical'
};
