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
exports.timetableConstraintFields = void 0;
var types_1 = require("../../types");
var client_1 = require("../../timetables/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.timetableConstraintFields = [
    {
        name: "name",
        label: "Constraint Name",
        type: "text",
        required: true,
        placeholder: "e.g., No Back-to-Back Classes for Teachers",
        helpText: "A descriptive name for this constraint"
    },
    {
        name: "timetable",
        label: "Timetable",
        type: "relation",
        required: true,
        placeholder: "Select timetable",
        helpText: "The timetable this constraint applies to",
        relationConfig: {
            entity: 'Timetable',
            displayField: 'name',
            valueField: 'id',
            searchFields: ['name'],
            fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client_1.timetablesClient.list({ search: search, pageSize: 50 })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, responseUtils_1.getListData(response)];
                    }
                });
            }); }
        }
    },
    {
        name: "constraint_type",
        label: "Constraint Type",
        type: "select",
        required: true,
        placeholder: "Select constraint type",
        helpText: "The type of scheduling constraint",
        options: Object.entries(types_1.CONSTRAINT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return ({
                value: value,
                label: label
            });
        })
    },
    {
        name: "priority",
        label: "Priority",
        type: "number",
        required: true,
        placeholder: "e.g., 1 (highest)",
        helpText: "Priority level (1 = highest, lower numbers are processed first)"
    },
    {
        name: "weight",
        label: "Weight",
        type: "number",
        required: true,
        placeholder: "e.g., 100",
        helpText: "Weight used in penalty calculations for violations"
    },
    {
        name: "is_hard_constraint",
        label: "Hard Constraint",
        type: "checkbox",
        helpText: "Hard constraints must be satisfied; soft constraints can be violated with penalties"
    },
    {
        name: "is_active",
        label: "Active",
        type: "checkbox",
        helpText: "Only active constraints are applied during scheduling"
    },
    {
        name: "parameters",
        label: "Parameters (JSON)",
        type: "textarea",
        placeholder: '{"max_hours": 6, "excluded_days": [0, 6]}',
        helpText: "Constraint-specific parameters in JSON format"
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe what this constraint enforces...",
        helpText: "Detailed explanation of the constraint"
    },
];
