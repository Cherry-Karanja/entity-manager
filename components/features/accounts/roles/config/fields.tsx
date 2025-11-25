/**
 * UserRole Field Configurations
 * 
 * Defines all form fields for role management.
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { UserRole } from '../types';
import { Permission } from '../../types';
import { PermissionSelector } from '../../permissions';

export const roleFields: FormField<UserRole>[] = [
  // ===========================
  // Basic Information
  // ===========================
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

  // ===========================
  // Status Fields
  // ===========================
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    required: false,
    group: 'status',
    helpText: 'Role is active and can be assigned to users',
    width: '50%',
  },

  // ===========================
  // Permissions
  // ===========================
  {
    name: 'permissions',
    label: 'Permissions',
    type: 'custom',
    required: false,
    group: 'permissions',
    helpText: 'Select permissions for this role (grouped by app for easy management)',
    width: '100%',
    render: (props) => {
      // Convert permission IDs to Permission objects for the selector
      const selectedPermissions: Permission[] = Array.isArray(props.value)
        ? props.value.map((id: string | number | Permission) => {
          // If it's already a Permission object, return it
          if (typeof id === 'object' && id !== null && 'id' in id) {
            return id as Permission;
          }
          // Otherwise, create a minimal Permission object
          // The PermissionSelector will handle loading full details
          return { id: typeof id === 'string' ? parseInt(id) : id } as Permission;
        })
        : [];

      return (
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onSelectionChange={(permissions: Permission[]) => {
            // Convert Permission objects to IDs for form storage
            const permissionIds = permissions.map(p => p.id);
            props.onChange?.(permissionIds);
          }}
          mode="select"
          className="w-full"
        />
      );
    },
  },
];
