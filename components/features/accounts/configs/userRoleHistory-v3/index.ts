import { EntityManagerConfig } from '@/components/entityManager/types'
import { UserRoleHistoryEntity } from './types'
import { listConfig } from './list'
import { viewConfig } from './view'
import { actionsConfig } from './actions'
import { exporterConfig } from './exporter'

// ===== USER ROLE HISTORY ENTITY MANAGER CONFIGURATION (V3.0) =====

export const userRoleHistoryEntityConfig: EntityManagerConfig<UserRoleHistoryEntity> = {
  // Entity identification
  entityName: 'UserRoleHistory',
  entityNamePlural: 'User Role History',
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: {
    list: '/api/accounts/role-history/',
    create: '/api/accounts/role-history/', // Not used (read-only)
    read: '/api/accounts/role-history/:id/',
    update: '/api/accounts/role-history/:id/', // Not used (read-only)
    delete: '/api/accounts/role-history/:id/', // Not used (read-only)
    export: '/api/accounts/role-history/export/',
    import: '/api/accounts/role-history/import/', // Not used (read-only)
    bulk: '/api/accounts/role-history/bulk/', // Not used (read-only)
  },
  
  // Component configurations
  list: listConfig,
  form: undefined, // No form needed - read-only audit log
  view: viewConfig,
  actions: actionsConfig,
  exporter: exporterConfig,
  
  // Global permissions (READ-ONLY)
  permissions: {
    create: false,  // Read-only audit log
    read: true,     // Can view records
    update: false,  // Read-only audit log
    delete: false,  // Read-only audit log
    export: true,   // Can export for reporting
    import: false,  // Read-only audit log
    bulk: false,    // Read-only audit log
  },
  
  // Features
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: true,
    import: false,  // Read-only
    bulk: false,    // Read-only
    audit: false,   // This IS the audit log
    versioning: false,
  },
  
  // Lifecycle hooks
  hooks: {
    beforeFetch: async () => {
      console.log('Before fetch role history')
    },
    afterFetch: async (data) => {
      console.log('After fetch role history:', data.length)
      // Transform data, add computed fields, etc.
      return data
    },
    // No create/update/delete hooks since this is read-only
  },
  
  // Theme
  theme: 'light',
}

// Export individual configs for standalone component usage
export { listConfig } from './list'
export { viewConfig } from './view'
export { actionsConfig } from './actions'
export { exporterConfig } from './exporter'
export { userRoleHistoryFields } from './fields'
export type { UserRoleHistoryEntity } from './types'
