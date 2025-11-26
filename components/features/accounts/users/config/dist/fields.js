"use strict";
/**
 * User Field Configurations
 *
 * Defines all form fields for user management.
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
exports.userFields = void 0;
var client_1 = require("../../roles/api/client");
var responseUtils_1 = require("@/components/entityManager/composition/api/responseUtils");
exports.userFields = [
    // ===========================
    // Basic Information
    // ===========================
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'user@example.com',
        group: 'basic',
        validation: [
            {
                type: 'required',
                message: 'Email is required'
            },
            {
                type: 'email',
                message: 'Invalid email format'
            },
        ],
        width: '50%'
    },
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: false,
        placeholder: 'username',
        group: 'basic',
        validation: [
            {
                type: 'minLength',
                value: 3,
                message: 'Username must be at least 3 characters'
            },
            {
                type: 'maxLength',
                value: 150,
                message: 'Username must be less than 150 characters'
            },
        ],
        helpText: 'Unique username for login',
        width: '50%'
    },
    {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'John',
        group: 'basic',
        validation: [
            {
                type: 'required',
                message: 'First name is required'
            },
            {
                type: 'minLength',
                value: 2,
                message: 'First name must be at least 2 characters'
            },
            {
                type: 'maxLength',
                value: 150,
                message: 'First name must be less than 150 characters'
            },
        ],
        width: '25%'
    },
    {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Doe',
        group: 'basic',
        validation: [
            {
                type: 'required',
                message: 'Last name is required'
            },
            {
                type: 'minLength',
                value: 2,
                message: 'Last name must be at least 2 characters'
            },
            {
                type: 'maxLength',
                value: 150,
                message: 'Last name must be less than 150 characters'
            },
        ],
        width: '25%'
    },
    // ===========================
    // Password (Create Only)
    // ===========================
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: function (values) { return !values.id; },
        placeholder: '••••••••',
        group: 'authentication',
        visible: true,
        validation: [
            {
                type: 'minLength',
                value: 8,
                message: 'Password must be at least 8 characters'
            },
        ],
        width: '50%'
    },
    {
        name: 'password2',
        label: 'Confirm Password',
        type: 'password',
        required: function (values) { return !values.id; },
        placeholder: '••••••••',
        group: 'authentication',
        visible: function (values) { return !values.id; },
        validation: [
            {
                type: 'custom',
                validator: function (value, formValues) {
                    return value === formValues.password;
                },
                message: 'Passwords do not match'
            },
        ],
        width: '50%'
    },
    // ===========================
    // Role & Organization
    // ===========================
    {
        name: 'role_name',
        label: 'Role',
        type: 'relation',
        required: false,
        placeholder: 'Select Role ...',
        group: 'status',
        relationConfig: {
            entity: 'UserRole',
            displayField: 'description',
            valueField: 'name',
            searchFields: ['name', 'description'],
            fetchOptions: function (search) { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client_1.userRolesApiClient.list({ search: search, pageSize: 50 })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, responseUtils_1.getListData(response)];
                    }
                });
            }); }
        },
        width: '25%'
    },
    {
        name: 'employee_id',
        label: 'Employee ID',
        type: 'text',
        required: false,
        placeholder: 'EMP-001',
        group: 'organization',
        validation: [
            {
                type: 'maxLength',
                value: 50,
                message: 'Employee ID must be less than 50 characters'
            },
        ],
        width: '25%'
    },
    {
        name: 'department',
        label: 'Department',
        type: 'text',
        required: false,
        placeholder: 'IT Department',
        group: 'organization',
        validation: [
            {
                type: 'maxLength',
                value: 100,
                message: 'Department must be less than 100 characters'
            },
        ],
        width: '25%'
    },
    {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: '+1 (555) 123-4567',
        group: 'organization',
        validation: [
            {
                type: 'maxLength',
                value: 20,
                message: 'Phone number must be less than 20 characters'
            },
        ],
        width: '25%'
    },
    {
        name: 'job_title',
        label: 'Job Title',
        type: 'text',
        required: false,
        placeholder: 'Software Engineer',
        group: 'organization',
        validation: [
            {
                type: 'maxLength',
                value: 100,
                message: 'Job title must be less than 100 characters'
            },
        ],
        width: '25%'
    },
    {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: false,
        placeholder: 'City, Country',
        group: 'organization',
        validation: [
            {
                type: 'maxLength',
                value: 200,
                message: 'Location must be less than 200 characters'
            },
        ],
        width: '50%'
    },
    // ===========================
    // Status Fields (Edit Only)
    // ===========================
    {
        name: 'is_active',
        label: 'Active',
        type: 'switch',
        required: false,
        group: 'status',
        helpText: 'User can log in and access the system',
        width: '25%'
    },
    {
        name: 'is_approved',
        label: 'Approved',
        type: 'switch',
        required: false,
        group: 'status',
        helpText: 'User account has been approved',
        width: '25%'
    },
    {
        name: 'is_verified',
        label: 'Verified',
        type: 'switch',
        required: false,
        group: 'status',
        helpText: 'User email/identity has been verified',
        width: '25%'
    },
    {
        name: 'must_change_password',
        label: 'Require Password Change',
        type: 'switch',
        required: false,
        group: 'status',
        helpText: 'User must change password on next login',
        width: '25%'
    },
    {
        name: 'is_staff',
        label: 'Staff Status',
        type: 'switch',
        required: false,
        group: 'status',
        helpText: 'User has staff privileges',
        width: '25%'
    },
];
