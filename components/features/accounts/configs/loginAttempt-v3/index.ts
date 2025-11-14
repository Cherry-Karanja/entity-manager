import { EntityManagerConfig } from '@/components/entityManager/types'
import { LoginAttemptEntity } from './types'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== LOGIN ATTEMPT ENTITY MANAGER CONFIGURATION (V3.0) =====

export const loginAttemptEntityConfig: EntityManagerConfig<LoginAttemptEntity> = {
  // Entity identification
  entityName: 'LoginAttempt',
  entityNamePlural: 'LoginAttempts',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/v1/accounts/login-attempts/',
    create: '/api/v1/accounts/login-attempts/', // Not used - read-only entity
    read: '/api/v1/accounts/login-attempts/:id/',
    update: '/api/v1/accounts/login-attempts/:id/', // Not used - read-only entity
    delete: '/api/v1/accounts/login-attempts/:id/', // Not used - read-only entity
    export: '/api/v1/accounts/login-attempts/export/',
    bulk: '/api/v1/accounts/login-attempts/bulk/',
  },
  
  // Component configurations
  list: listConfig,
  view: viewConfig,
  actions: actionsConfig,
  exporter: exporterConfig,
  // Note: No form config - this is a read-only entity
  
  // Global permissions (READ-ONLY ENTITY)
  permissions: {
    create: false, // Login attempts are logged automatically
    read: true,
    update: false, // Read-only - security audit trail
    delete: false, // Read-only - security audit trail
    export: true,
    import: false, // No import for security logs
    bulk: true, // Allow bulk actions like IP blocking
  },
  
  // Features
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: true,
    import: false, // No import for security logs
    bulk: true,
    audit: false,
    versioning: false,
  },
  
  // Lifecycle hooks
  hooks: {
    beforeFetch: async () => {
      console.log('Before fetch login attempts')
    },
    afterFetch: async (data) => {
      console.log('After fetch login attempts:', data.length)
      // Example: Add computed fields, format data, etc.
      return data
    },
    // No create/update/delete hooks - read-only entity
  },
  
  // Theme
  theme: 'light',
}

// Export individual configs for standalone component usage
export { listConfig } from './list'
export { viewConfig } from './view'
export { actionsConfig } from './actions'
export { exporterConfig } from './exporter'
export { loginAttemptFields } from './fields'
export type { LoginAttemptEntity } from './types'
