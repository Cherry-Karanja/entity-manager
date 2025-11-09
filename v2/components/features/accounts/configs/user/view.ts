// ===== USER VIEW CONFIGURATION =====

import { EntityViewConfig } from '@/components/entityManager/EntityView/types'

export const userViewConfig: EntityViewConfig = {
  mode: 'detail',
  layout: 'single',
  fieldGroups: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'User identification and contact details',
      fields: [
        { key: 'first_name', label: 'First Name', type: 'text' },
        { key: 'last_name', label: 'Last Name', type: 'text' },
        { key: 'full_name', label: 'Full Name', type: 'text', copyable: true },
        { key: 'email', label: 'Email', type: 'email', copyable: true },
        { key: 'username', label: 'Username', type: 'text', copyable: true },
        { key: 'employee_id', label: 'Employee ID', type: 'text', copyable: true }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'role-permissions',
      title: 'Role & Permissions',
      description: 'User role and permission information',
      fields: [
        { key: 'role_display', label: 'Role', type: 'badge', badge: true },
        { key: 'permissions', label: 'Permissions', type: 'tags' },
        { key: 'role_permissions', label: 'Role Permissions', type: 'tags' }
      ],
      layout: 'vertical',
      collapsible: true,
      collapsed: false
    },
    {
      id: 'account-status',
      title: 'Account Status',
      description: 'Account activation and verification status',
      fields: [
        { key: 'is_active', label: 'Active Status', type: 'boolean' },
        { key: 'is_approved', label: 'Approved', type: 'boolean' },
        { key: 'is_verified', label: 'Verified', type: 'boolean' },
        { key: 'must_change_password', label: 'Must Change Password', type: 'boolean' }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'security-info',
      title: 'Security Information',
      description: 'Security-related account information',
      fields: [
        { key: 'failed_login_attempts', label: 'Failed Login Attempts', type: 'number' },
        { key: 'account_locked_until', label: 'Account Locked Until', type: 'datetime' },
        { key: 'last_login_ip', label: 'Last Login IP', type: 'text', copyable: true }
      ],
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Additional contact and profile information',
      fields: [
        { key: 'phone_number', label: 'Phone Number', type: 'phone', copyable: true },
        { key: 'department', label: 'Department', type: 'text' }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: false
    },
    {
      id: 'timestamps',
      title: 'Account Timeline',
      description: 'Account creation and activity timestamps',
      fields: [
        { key: 'date_joined', label: 'Date Joined', type: 'datetime' },
        { key: 'last_login', label: 'Last Login', type: 'datetime' },
        { key: 'password_changed_at', label: 'Password Changed', type: 'datetime' },
        { key: 'created_at', label: 'Created At', type: 'datetime' },
        { key: 'updated_at', label: 'Updated At', type: 'datetime' }
      ],
      layout: 'grid',
      columns: 2,
      collapsible: true,
      collapsed: true
    }
  ],
  showHeader: true,
  showActions: true,
  showMetadata: true,
  compact: false
}