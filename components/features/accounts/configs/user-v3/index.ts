import { EntityManagerConfig } from '@/components/entityManager/types'
import { UserEntity } from './types'
import { formConfig } from './form'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== USER ENTITY MANAGER CONFIGURATION (V3.0) =====

export const userEntityConfig: EntityManagerConfig<UserEntity> = {
  // Entity identification
  entityName: 'User',
  entityNamePlural: 'Users',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/users',
    create: '/api/users',
    read: '/api/users/:id',
    update: '/api/users/:id',
    delete: '/api/users/:id',
    export: '/api/users/export',
    import: '/api/users/import',
    bulk: '/api/users/bulk',
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
      console.log('Before create user:', data)
      // Example: Hash password, validate data, etc.
      return data
    },
    afterCreate: async (data) => {
      console.log('After create user:', data)
      // Example: Send welcome email, audit log, etc.
    },
    beforeUpdate: async (data) => {
      console.log('Before update user:', data)
      return data
    },
    afterUpdate: async (data) => {
      console.log('After update user:', data)
    },
    beforeDelete: async (id) => {
      console.log('Before delete user:', id)
      // Example: Check if user has dependencies
      return true // Return false to prevent deletion
    },
    afterDelete: async (id) => {
      console.log('After delete user:', id)
      // Example: Cleanup related data, audit log, etc.
    },
    beforeFetch: async () => {
      console.log('Before fetch users')
    },
    afterFetch: async (data) => {
      console.log('After fetch users:', data.length)
      // Example: Transform data, add computed fields, etc.
      return data
    },
    validateCreate: async (data) => {
      // Example: Custom validation logic
      if (!data.email) {
        return 'Email is required'
      }
      return null // No error
    },
    validateUpdate: async (data) => {
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
export { userFields } from './fields'
export type { UserEntity } from './types'
