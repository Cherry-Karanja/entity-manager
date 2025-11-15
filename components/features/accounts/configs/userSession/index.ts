// ===== USER SESSION ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { UserSession, UserSessionFormData } from '../../types'
import { userSessionFields } from './fields'
import { userSessionListColumns } from './list'
import { userSessionFormConfig } from './form'
import { userSessionViewConfig } from './view'
import { userSessionItemActions, userSessionBulkActions } from './actions'

export const userSessionConfig: EntityConfig<UserSession, UserSessionFormData> = {
  // ===== ENTITY METADATA =====
  entityName: 'UserSession',
  entityNamePlural: 'UserSessions',

  // ===== API CONFIGURATION =====
  endpoints: {
    list: '/api/v1/accounts/user-sessions/',
    read: '/api/v1/accounts/user-sessions/{id}/',
    create: '/api/v1/accounts/user-sessions/',
    update: '/api/v1/accounts/user-sessions/{id}/',
    delete: '/api/v1/accounts/user-sessions/{id}/'
  },

  // ===== LIST CONFIGURATION =====
  list: {
    columns: userSessionListColumns,
    searchFields: ['user', 'ip_address', 'user_agent'],
    defaultSort: [{ field: 'last_activity', direction: 'desc' }]
  },

  // ===== FORM CONFIGURATION =====
  form: userSessionFormConfig as any,

  // ===== VIEW CONFIGURATION =====
  view: userSessionViewConfig as any,

  // ===== PERMISSIONS =====
  permissions: {
    create: false, // Read-only entity
    view: true,
    update: false, // Read-only entity
    delete: false, // Read-only entity
    export: true
  }
}

export default userSessionConfig
