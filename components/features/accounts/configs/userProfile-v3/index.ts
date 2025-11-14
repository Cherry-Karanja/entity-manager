import { EntityManagerConfig } from '@/components/entityManager/types'
import { UserProfileEntity } from './types'
import { formConfig } from './form'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== USER PROFILE ENTITY MANAGER CONFIGURATION (V3.0) =====

export const userProfileEntityConfig: EntityManagerConfig<UserProfileEntity> = {
  // Entity identification
  entityName: 'UserProfile',
  entityNamePlural: 'UserProfiles',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/v1/accounts/user-profiles/',
    create: '/api/v1/accounts/user-profiles/',
    read: '/api/v1/accounts/user-profiles/:id/',
    update: '/api/v1/accounts/user-profiles/:id/',
    delete: '/api/v1/accounts/user-profiles/:id/',
    export: '/api/v1/accounts/user-profiles/export/',
    import: '/api/v1/accounts/user-profiles/import/',
    bulk: '/api/v1/accounts/user-profiles/bulk/',
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
    audit: true,
    versioning: false,
  },
  
  // Lifecycle hooks
  hooks: {
    beforeCreate: async (data) => {
      console.log('Before create user profile:', data)
      // Example: Validate data, set defaults, etc.
      return data
    },
    afterCreate: async (data) => {
      console.log('After create user profile:', data)
      // Example: Send notification, audit log, etc.
    },
    beforeUpdate: async (data) => {
      console.log('Before update user profile:', data)
      return data
    },
    afterUpdate: async (data) => {
      console.log('After update user profile:', data)
      // Example: Notify user of changes, audit log, etc.
    },
    beforeDelete: async (id) => {
      console.log('Before delete user profile:', id)
      // Example: Check if profile has dependencies
      return true // Return false to prevent deletion
    },
    afterDelete: async (id) => {
      console.log('After delete user profile:', id)
      // Example: Cleanup related data, audit log, etc.
    },
    beforeFetch: async () => {
      console.log('Before fetch user profiles')
    },
    afterFetch: async (data) => {
      console.log('After fetch user profiles:', data.length)
      // Example: Transform data, add computed fields, etc.
      return data
    },
    validateCreate: async (data) => {
      // Example: Custom validation logic
      if (!data.user) {
        return 'User is required'
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
export { userProfileFields } from './fields'
export type { UserProfileEntity } from './types'
