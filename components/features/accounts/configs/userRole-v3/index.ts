import { EntityManagerConfig } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'
import { formConfig } from './form'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== USER ROLE ENTITY MANAGER CONFIGURATION (V3.0) =====

export const userRoleEntityConfig: EntityManagerConfig<UserRoleEntity> = {
  // Entity identification
  entityName: 'UserRole',
  entityNamePlural: 'UserRoles',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/accounts/roles/',
    create: '/api/accounts/roles/',
    read: '/api/accounts/roles/:id/',
    update: '/api/accounts/roles/:id/',
    delete: '/api/accounts/roles/:id/',
    export: '/api/accounts/roles/export/',
    import: '/api/accounts/roles/import/',
    bulk: '/api/accounts/roles/bulk/',
  },
  
  // Component configurations
  list: listConfig,
  form: formConfig,
  view: viewConfig,
  actions: actionsConfig,
  exporter: exporterConfig,
  
  // Global permissions
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
    import: true,
    bulk: true,
  },
  
  // Features
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulk: true,
    audit: false,
    versioning: false,
  },
  
  // Lifecycle hooks
  hooks: {
    beforeCreate: async (data) => {
      console.log('Before create role:', data)
      // Example: Validate role name uniqueness, normalize data, etc.
      return data
    },
    afterCreate: async (data) => {
      console.log('After create role:', data)
      // Example: Audit log, send notifications, etc.
    },
    beforeUpdate: async (data) => {
      console.log('Before update role:', data)
      return data
    },
    afterUpdate: async (data) => {
      console.log('After update role:', data)
    },
    beforeDelete: async (id) => {
      console.log('Before delete role:', id)
      // Example: Check if role has assigned users
      return true // Return false to prevent deletion
    },
    afterDelete: async (id) => {
      console.log('After delete role:', id)
      // Example: Cleanup related data, audit log, etc.
    },
    beforeFetch: async () => {
      console.log('Before fetch roles')
    },
    afterFetch: async (data) => {
      console.log('After fetch roles:', data.length)
      // Example: Transform data, add computed fields, etc.
      return data
    },
    validateCreate: async (data) => {
      // Example: Custom validation logic
      if (!data.name) {
        return 'Role name is required'
      }
      if (!data.display_name) {
        return 'Display name is required'
      }
      return null // No error
    },
    validateUpdate: async () => {
      // Example: Custom validation logic
      return null
    },
  },
  
  // Theme
  theme: 'light',
}

// Export individual configs for standalone component usage
export { formConfig } from './form'
export { listConfig } from './list'
export { viewConfig } from './view'
export { actionsConfig } from './actions'
export { exporterConfig } from './exporter'
export { userRoleFields } from './fields'
export type { UserRoleEntity } from './types'
