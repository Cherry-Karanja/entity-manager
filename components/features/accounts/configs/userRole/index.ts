// ===== USER ROLE ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { userRoleFields } from './fields'
import { userRoleListConfig } from './list'
import { userRoleFormConfig } from './form'
import { userRoleViewConfig } from './view'
import { userRoleActionsConfig } from './actions'
import { UserRole, UserRoleFormData } from '../../types'

export const userRoleConfig: EntityConfig<UserRole, UserRoleFormData> = {
  name: 'UserRole',
  namePlural: 'UserRoles',
  displayName: 'User Role',
  fields: userRoleFields as any,
  endpoints: {
    list: '/api/accounts/roles/',
    create: '/api/accounts/roles/',
    update: '/api/accounts/roles/{id}/',
    delete: '/api/accounts/roles/{id}/'
  },
  listConfig: userRoleListConfig,
  formConfig: userRoleFormConfig,
  viewConfig: userRoleViewConfig as any,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  },
  customActions: userRoleActionsConfig as any
}

export default userRoleConfig