// ===== USER ROLE HISTORY ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { UserRoleHistory, UserRoleHistoryFormData } from '../../types'
import { userRoleHistoryFields } from './fields'
import { userRoleHistoryListColumns } from './list'
import { userRoleHistoryViewConfig } from './view'

export const userRoleHistoryConfig: EntityConfig<UserRoleHistory, UserRoleHistoryFormData> = {
  name: 'userRoleHistory',
  namePlural: 'userRoleHistories',
  displayName: 'Role Change History',
  fields: userRoleHistoryFields,
  endpoints: {
    list: '/api/accounts/role-history/',
    create: '/api/accounts/role-history/',
    update: '/api/accounts/role-history/{id}/',
    delete: '/api/accounts/role-history/{id}/'
  },
  listConfig: {
    columns: userRoleHistoryListColumns,
    defaultSort: {
      field: 'created_at',
      direction: 'desc'
    },
    pageSize: 25,
    allowExport: true
  },
  viewConfig: userRoleHistoryViewConfig,
  permissions: {
    create: false,
    view: true,
    update: false,
    delete: false,
    export: true
  }
}

export default userRoleHistoryConfig
