// ===== USER ROLE HISTORY ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { UserRoleHistory, UserRoleHistoryFormData } from '../../types'
import { userRoleHistoryFields } from './fields'
import { userRoleHistoryListColumns } from './list'
import { userRoleHistoryFormConfig } from './form'
import { userRoleHistoryViewConfig } from './view'

export const userRoleHistoryConfig: EntityConfig<UserRoleHistory, UserRoleHistoryFormData> = {
  entityName: 'UserRoleHistory',
  entityNamePlural: 'userRoleHistories',
  endpoints: {
    list: '/api/accounts/role-history/',
    read: '/api/accounts/role-history/{id}/',
    create: '/api/accounts/role-history/',
    update: '/api/accounts/role-history/{id}/',
    delete: '/api/accounts/role-history/{id}/'
  },
  list: {
    columns: userRoleHistoryListColumns,
    defaultSort: [{ field: 'created_at', direction: 'desc' }]
  },
  form: userRoleHistoryFormConfig as any,
  view: userRoleHistoryViewConfig as any,
  permissions: {
    create: false,
    view: true,
    update: false,
    delete: false,
    export: true
  }
}

export default userRoleHistoryConfig
