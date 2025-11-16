// ===== USER ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { userListConfig } from './list'
import { userFormConfig } from './form'
import { userViewConfig } from './view'
import { User, UserFormData } from '../../types'

export const userConfig: EntityConfig<User, UserFormData> = {
  entityName: 'User',
  entityNamePlural: 'Users',
  endpoints: {
    list: '/api/v1/accounts/users/',
    read: '/api/v1/accounts/users/{id}/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  },
  list: userListConfig,
  form: userFormConfig,
  view: userViewConfig,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  }
}

export default userConfig