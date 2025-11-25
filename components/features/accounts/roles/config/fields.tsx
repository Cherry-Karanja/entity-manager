/**
 * UserRole Field Configurations
 * 
 * Defines all form fields for role management.
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { UserRole } from '../types';

export const roleFields: FormField<UserRole>[] = [
  {
    name: 'name',
    label: 'Role Name',
    type: 'text',
    required: true,
    placeholder: 'admin',
    group: 'basic',
    validation: [
      {
        type: 'required',
        message: 'Role name is required',
      },
      {
        type: 'pattern',
        value: '^[a-z_]+$',
        message: 'Role name must be lowercase letters and underscores only',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'Role name must be at least 2 characters',
      },
      {
        type: 'maxLength',
        value: 100,
        message: 'Role name must be less than 100 characters',
      },
    ],
    helpText: 'Unique identifier for the role (lowercase, underscores only)',
    width: '50%',
  },
  {
    name: 'display_name',
    label: 'Display Name',
    type: 'text',
    required: true,
    placeholder: 'Administrator',
    group: 'basic',
    validation: [
      {
        type: 'required',
        message: 'Display name is required',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'Display name must be at least 2 characters',
      },
      {
        type: 'maxLength',
        value: 100,
        message: 'Display name must be less than 100 characters',
      },
    ],
    helpText: 'Human-readable name for the role',
    width: '50%',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    placeholder: 'Describe the role and its responsibilities...',
    group: 'basic',
    rows: 4,
    validation: [
      {
        type: 'maxLength',
        value: 500,
        message: 'Description must be less than 500 characters',
      },
    ],
    helpText: 'Optional description of the role',
    width: '100%',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'checkbox',
    required: false,
    defaultValue: true,
    group: 'status',
    helpText: 'Whether this role is active and can be assigned to users',
    width: '50%',
  },
  {
    name: 'permissions',
    label: 'Permissions',
    type: 'custom',
    required: false,
    group: 'permissions',
    helpText: 'Select permissions for this role (grouped by app for easy management)',
    width: '100%',
    // Custom render function should be implemented in the actual form
    // render: ({ value, onChange }) => <PermissionSelector value={value} onChange={onChange} />,
  },
];

export const UserRoleFormConfig = {
  fields: roleFields,
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Role name and description',
      fields: ['name', 'display_name', 'description'],
    },
    {
      id: 'permissions',
      label: 'Permissions',
      description: 'Assign permissions to this role',
      fields: ['permissions'],
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Role activation status',
      fields: ['is_active'],
    },
  ],
};
