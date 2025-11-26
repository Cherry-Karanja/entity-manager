"use strict";
/**
 * User Form Configuration
 *
 * Defines form layout, sections, and behavior settings for user management.
 */
exports.__esModule = true;
exports.userFormSubmitText = exports.userFormFields = exports.userFormSections = exports.userFormLayout = exports.UserFormConfig = void 0;
var lucide_react_1 = require("lucide-react");
var fields_1 = require("./fields");
exports.UserFormConfig = {
    /** Form fields */
    fields: fields_1.userFields,
    /** Layout configuration */
    layout: 'tabs',
    /** Form sections */
    sections: [
        {
            id: 'basic',
            label: 'Basic Information',
            description: 'Core user details and contact information',
            fields: ['email', 'username', 'first_name', 'last_name'],
            icon: React.createElement(lucide_react_1.User, { className: "h-4 w-4" }),
            order: 1
        },
        {
            id: 'authentication',
            label: 'Authentication',
            description: 'Password and security settings',
            fields: ['password', 'password2'],
            icon: React.createElement(lucide_react_1.Lock, { className: "h-4 w-4" }),
            order: 2
        },
        {
            id: 'organization',
            label: 'Organization',
            description: 'Department and organizational details',
            fields: ['employee_id', 'department', 'job_title', 'phone_number', 'location'],
            icon: React.createElement(lucide_react_1.Building2, { className: "h-4 w-4" }),
            order: 3
        },
        {
            id: 'status',
            label: 'Status & Permissions',
            description: 'Account status, role and access control',
            fields: ['role_name', 'is_active', 'is_approved', 'is_verified', 'is_staff', 'must_change_password'],
            icon: React.createElement(lucide_react_1.Shield, { className: "h-4 w-4" }),
            order: 4
        },
    ],
    /** Form behavior settings */
    submitText: 'Save User',
    cancelText: 'Cancel',
    showCancel: true,
    showReset: true,
    disabled: true,
    className: 'user-form',
    validateOnChange: true,
    validateOnBlur: true,
    resetOnSubmit: true
};
// Backwards-compatibility named exports (legacy barrels expect these)
exports.userFormLayout = exports.UserFormConfig.layout;
exports.userFormSections = exports.UserFormConfig.sections;
exports.userFormFields = exports.UserFormConfig.fields;
exports.userFormSubmitText = exports.UserFormConfig.submitText;
