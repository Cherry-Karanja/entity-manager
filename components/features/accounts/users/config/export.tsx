import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const UserExporterConfig: EntityExporterConfig = {
    fields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'full_name',
      label: 'Full Name',
    },
    {
      key: 'first_name',
      label: 'First Name',
    },
    {
      key: 'last_name',
      label: 'Last Name',
    },
    {
      key: 'employee_id',
      label: 'Employee ID',
    },
    {
      key: 'role_display',
      label: 'Role',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'phone_number',
      label: 'Phone',
    },
    {
      key: 'is_active',
      label: 'Active',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_approved',
      label: 'Approved',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_verified',
      label: 'Verified',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_staff',
      label: 'Staff',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'last_login',
      label: 'Last Login',
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : 'Never',
    },
    {
      key: 'created_at',
      label: 'Date Joined',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
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
        sheetName: 'Users',
    },

    buttonLabel: 'Export Users',
    showFormatSelector: true,
    showFieldSelector: true,
    className: 'btn btn-primary',
    disabled: false,
};
