import { EntityManagerConfig } from '@/components/entityManager/types'
import { UserSessionEntity } from './types'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== USER SESSION ENTITY MANAGER CONFIGURATION (V3.0) =====

export const userSessionEntityConfig: EntityManagerConfig<UserSessionEntity> = {
  // Entity identification
  entityName: 'UserSession',
  entityNamePlural: 'UserSessions',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/v1/accounts/user-sessions/',
    create: '/api/v1/accounts/user-sessions/', // Not used (read-only)
    read: '/api/v1/accounts/user-sessions/:id/',
    update: '/api/v1/accounts/user-sessions/:id/', // Not used (read-only)
    delete: '/api/v1/accounts/user-sessions/:id/', // Used for session termination
    export: '/api/v1/accounts/user-sessions/export/',
    import: '/api/v1/accounts/user-sessions/import/', // Not used (read-only)
    bulk: '/api/v1/accounts/user-sessions/bulk/',
  },
  
  // Component configurations
  list: listConfig,
  // No form config - read-only entity
  view: viewConfig,
  actions: actionsConfig,
  exporter: exporterConfig,
  
  // Global permissions
  permissions: {
    create: false, // Read-only entity
    read: true,
    update: false, // Read-only entity
    delete: true, // Can terminate/revoke sessions
    export: true,
    import: false, // Read-only entity
    bulk: true, // For bulk termination
  },
  
  // Features
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: true,
    import: false, // Read-only entity
    bulk: true, // Bulk termination
    audit: false,
    versioning: false,
  },
  
  // Lifecycle hooks
  hooks: {
    beforeCreate: async (data) => {
      // Not used - read-only entity
      console.log('Before create session:', data)
      return data
    },
    afterCreate: async (data) => {
      // Not used - read-only entity
      console.log('After create session:', data)
    },
    beforeUpdate: async (data) => {
      // Not used - read-only entity
      console.log('Before update session:', data)
      return data
    },
    afterUpdate: async (data) => {
      // Not used - read-only entity
      console.log('After update session:', data)
    },
    beforeDelete: async (id) => {
      console.log('Before terminate session:', id)
      // Could add validation to prevent terminating certain sessions
      return true
    },
    afterDelete: async (id) => {
      console.log('After terminate session:', id)
      // Example: Log termination, notify user, etc.
    },
    beforeFetch: async () => {
      console.log('Before fetch sessions')
    },
    afterFetch: async (data) => {
      console.log('After fetch sessions:', data.length)
      // Example: Transform data, add computed fields, etc.
      return data
    },
    validateCreate: async () => {
      // Not used - read-only entity
      return null
    },
    validateUpdate: async () => {
      // Not used - read-only entity
      return null
    },
  },
  
  // Theme
  theme: 'light',
}

// Export individual configs for standalone component usage
export { listConfig } from './list'
export { viewConfig } from './view'
export { actionsConfig } from './actions'
export { exporterConfig } from './exporter'
export { userSessionFields } from './fields'
export type { UserSessionEntity } from './types'
