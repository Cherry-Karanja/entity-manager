// ===== USER ROLE ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { userRoleFields } from './fields'
import { userRoleListConfig } from './list'
import { userRoleFormConfig } from './form'
import { userRoleViewConfig } from './view'
import { userRoleActionsConfig } from './actions'
import { UserRole, UserRoleFormData } from '../../types'

export const userRoleConfig: EntityConfig<UserRole, UserRoleFormData> = {
  entityName: 'UserRole',
  entityNamePlural: 'UserRoles',
  endpoints: {
    list: '/api/accounts/roles/',
    read: '/api/accounts/roles/{id}/',
    create: '/api/accounts/roles/',
    update: '/api/accounts/roles/{id}/',
    delete: '/api/accounts/roles/{id}/'
  },
  list: userRoleListConfig,
  form: userRoleFormConfig as any,
  view: userRoleViewConfig as any,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  }
}

export default userRoleConfig