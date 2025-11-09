// ===== USER SESSION ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { UserSession, UserSessionFormData } from '../../types'
import { userSessionFields } from './fields'
import { userSessionListColumns } from './list'
import { userSessionViewConfig } from './view'
import { userSessionItemActions, userSessionBulkActions } from './actions'

export const userSessionConfig: EntityConfig<UserSession, UserSessionFormData> = {
  // ===== ENTITY METADATA =====
  name: 'UserSession',
  namePlural: 'UserSessions',
  displayName: 'User Session',
  fields: userSessionFields,

  // ===== API CONFIGURATION =====
  endpoints: {
    list: '/api/v1/accounts/user-sessions/',
    create: '/api/v1/accounts/user-sessions/',
    update: '/api/v1/accounts/user-sessions/{id}/',
    delete: '/api/v1/accounts/user-sessions/{id}/'
  },

  // ===== LIST CONFIGURATION =====
  listConfig: {
    columns: userSessionListColumns,
    searchableFields: ['user', 'ip_address', 'user_agent'],
    defaultSort: { field: 'last_activity', direction: 'desc' },
    pageSize: 20,
    allowBatchActions: true,
    allowExport: true
  },

  // ===== VIEW CONFIGURATION =====
  viewConfig: userSessionViewConfig,

  // ===== PERMISSIONS =====
  permissions: {
    create: false, // Read-only entity
    view: true,
    update: false, // Read-only entity
    delete: false, // Read-only entity
    export: true
  },

  // ===== CUSTOM ACTIONS =====
  customActions: {
    item: userSessionItemActions,
    bulk: userSessionBulkActions
  }
}

export default userSessionConfig
