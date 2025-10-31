'use client'

import React from 'react'
import { EntityManager } from '../components/entityManager/manager/orchestrator'
import { EntityConfig, BaseEntity } from '../components/entityManager/manager/types'

// ===== USER TYPES =====

export interface User extends BaseEntity {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  user_type: 'admin' | 'tenant' | 'landlord' | 'caretaker' | 'property_manager'
  national_id: string
  date_joined: string
  updated_at: string
  is_active: boolean
  get_full_name: string
}

export interface UserFormData {
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  user_type: 'admin' | 'tenant' | 'landlord' | 'caretaker' | 'property_manager'
  national_id: string
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}

// ===== USER CONFIGURATION =====

export const userConfig: EntityConfig<User, UserFormData> = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'User Management',

  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      required: true,
      readOnly: true
    },
    {
      key: 'first_name',
      label: 'First Name',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 30,
      fieldType: 'input',
      placeholder: 'Enter first name'
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 30,
      fieldType: 'input',
      placeholder: 'Enter last name'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: {
        customValidate: (value: unknown) => {
          if (typeof value !== 'string') return 'Email must be a string'
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
          return true
        }
      },
      fieldType: 'input',
      placeholder: 'Enter email address'
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'string',
      required: false,
      fieldType: 'input',
      placeholder: 'Enter phone number'
    },
    {
      key: 'national_id',
      label: 'National ID',
      type: 'string',
      required: false,
      fieldType: 'input',
      placeholder: 'Enter national ID'
    },
    {
      key: 'user_type',
      label: 'User Type',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'manager', label: 'Manager' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' }
      ],
      fieldType: 'select',
      defaultValue: 'user'
    },
    {
      key: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: true,
      defaultValue: true,
      fieldType: 'switch'
    },
    {
      key: 'date_joined',
      label: 'Date Joined',
      type: 'date',
      required: false,
      readOnly: true
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
      required: false,
      readOnly: true
    },
    {
      key: 'get_full_name',
      label: 'Full Name',
      type: 'string',
      required: false,
      readOnly: true
    }
  ],

  endpoints: {
    list: '/user-manager/users/',
    create: '/user-manager/users/',
    update: '/user-manager/users/',
    delete: '/user-manager/users/'
  },

  listConfig: {
    columns: [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        width: 80,
        sortable: true
      },
      {
        id: 'firstName',
        header: 'First Name',
        accessorKey: 'first_name',
        sortable: true
      },
      {
        id: 'lastName',
        header: 'Last Name',
        accessorKey: 'last_name',
        sortable: true
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        sortable: true,
        filterable: true
      },
      {
        id: 'phoneNumber',
        header: 'Phone',
        accessorKey: 'phone_number',
        filterable: true
      },
      {
        id: 'userType',
        header: 'User Type',
        accessorKey: 'user_type',
        cell: (value: unknown) => {
          const roleValue = value as string
          return roleValue ? roleValue.charAt(0).toUpperCase() + roleValue.slice(1) : ''
        },
        filterable: true
      },
      {
        id: 'isActive',
        header: 'Active',
        accessorKey: 'is_active',
        cell: (value: unknown) => {
          return value ? 'Yes' : 'No'
        },
        filterable: true
      },
      {
        id: 'dateJoined',
        header: 'Date Joined',
        accessorKey: 'date_joined',
        cell: (value: unknown) => {
          if (!value) return ''
          return new Date(value as string).toLocaleDateString()
        },
        sortable: true
      }
    ],
    searchableFields: ['email', 'first_name', 'last_name', 'phone_number'],
    defaultSort: { field: 'date_joined', direction: 'desc' },
    pageSize: 10,
    allowBatchActions: true,
    allowExport: true
  },

  formConfig: {
    title: 'User Information',
    createTitle: 'Create New User',
    editTitle: 'Edit User',
    description: 'Manage user account information and permissions',
    submitLabel: 'Save User',
    cancelLabel: 'Cancel',
    layout: 'grid',
    columns: 2
  },

  viewConfig: {
    mode: 'detail',
    layout: 'single',
    fields: [
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'first_name', label: 'First Name', type: 'text' },
      { key: 'last_name', label: 'Last Name', type: 'text' },
      { key: 'phone_number', label: 'Phone', type: 'phone' },
      { key: 'user_type', label: 'Role', type: 'badge' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'hireDate', label: 'Hire Date', type: 'date' },
      { key: 'lastLogin', label: 'Last Login', type: 'datetime' },
      { key: 'isEmailVerified', label: 'Email Verified', type: 'boolean' },
      { key: 'isPhoneVerified', label: 'Phone Verified', type: 'boolean' }
    ],
    showHeader: true,
    showActions: true,
    showMetadata: true
  },

  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  },

  customActions: {
    item: [
      {
        id: 'view',
        label: 'View Details',
        type: 'default',
        actionType: 'immediate'
      },
      {
        id: 'edit',
        label: 'Edit User',
        type: 'default',
        actionType: 'immediate'
      },
      {
        id: 'reset-password',
        label: 'Reset Password',
        type: 'default',
        actionType: 'confirm',
        confirm: {
          title: 'Reset Password',
          content: 'Are you sure you want to reset this user\'s password? They will receive an email with reset instructions.',
          okText: 'Reset Password',
          cancelText: 'Cancel'
        },
        onExecute: async (item: unknown) => {
          console.log('Reset password for user:', item)
        }
      },
      {
        id: 'toggle-status',
        label: 'Toggle Status',
        type: 'default',
        actionType: 'immediate',
        onExecute: async (item: unknown) => {
          const user = item as User
          console.log('Toggle user active status:', user.id, 'to', !user.is_active)
        }
      },
      {
        id: 'delete',
        label: 'Delete User',
        type: 'default',
        danger: true,
        actionType: 'immediate'
      }
    ],
    bulk: [
      {
        id: 'bulk-activate',
        label: 'Activate Selected',
        type: 'default',
        actionType: 'bulk',
        onExecute: async (items: unknown) => {
          console.log('Activate users:', items)
        }
      },
      {
        id: 'bulk-deactivate',
        label: 'Deactivate Selected',
        type: 'default',
        actionType: 'bulk',
        onExecute: async (items: unknown) => {
          console.log('Deactivate users:', items)
        }
      },
      {
        id: 'bulk-delete',
        label: 'Delete Selected',
        type: 'default',
        danger: true,
        actionType: 'confirm',
        confirm: {
          title: 'Delete Users',
          content: 'Are you sure you want to delete the selected users? This action cannot be undone.',
          okText: 'Delete',
          cancelText: 'Cancel'
        },
        onExecute: async (items: unknown) => {
          console.log('Delete users:', items)
        }
      }
    ]
  },

  bulkImport: {
    enabled: true,
    templateName: 'user_import_template',
    sampleData: [
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_type: 'user',
        status: 'active',
        department: 'Engineering',
        position: 'Software Engineer'
      }
    ],
    allowInvalidImport: false,
    skipValidationOnImport: false
  }
}

// ===== USER MANAGEMENT COMPONENT =====

export interface UserManagementProps {
  className?: string
  initialMode?: 'list' | 'create' | 'edit' | 'view'
  initialUser?: User
}

export function UserManagement({
  className,
  initialMode = 'list',
  initialUser
}: UserManagementProps) {
  return (
    <div className={className}>
      <EntityManager<User, UserFormData>
        config={userConfig}
        initialMode={initialMode}
        initialData={initialUser}
        className="w-full"
      />
    </div>
  )
}

// ===== EXPORT DEFAULT =====

export default UserManagement
