"use strict";
exports.__esModule = true;
exports.UserExporterConfig = void 0;
exports.UserExporterConfig = {
    fields: [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'full_name',
            label: 'Full Name'
        },
        {
            key: 'first_name',
            label: 'First Name'
        },
        {
            key: 'last_name',
            label: 'Last Name'
        },
        {
            key: 'employee_id',
            label: 'Employee ID'
        },
        {
            key: 'role_display',
            label: 'Role'
        },
        {
            key: 'department',
            label: 'Department'
        },
        {
            key: 'phone_number',
            label: 'Phone'
        },
        {
            key: 'is_active',
            label: 'Active',
            formatter: function (value) { return value ? 'Yes' : 'No'; }
        },
        {
            key: 'is_approved',
            label: 'Approved',
            formatter: function (value) { return value ? 'Yes' : 'No'; }
        },
        {
            key: 'is_verified',
            label: 'Verified',
            formatter: function (value) { return value ? 'Yes' : 'No'; }
        },
        {
            key: 'is_staff',
            label: 'Staff',
            formatter: function (value) { return value ? 'Yes' : 'No'; }
        },
        {
            key: 'last_login',
            label: 'Last Login',
            formatter: function (value) { return value ? new Date(value).toLocaleString() : 'Never'; }
        },
        {
            key: 'created_at',
            label: 'Date Joined',
            formatter: function (value) { return new Date(value).toLocaleString(); }
        },
    ],
    options: {
        format: 'xlsx',
        filename: 'users_export',
        includeHeaders: true,
        // for json
        prettyPrint: true,
        dateFormat: 'MM/DD/YYYY HH:mm:ss',
        // for csv
        delimiter: ',',
        // for xlsx
        sheetName: 'Users'
    },
    buttonLabel: 'Export Users',
    showFormatSelector: true,
    showFieldSelector: true,
    className: 'btn btn-primary',
    disabled: false
};
