// ===== USER ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { userFields } from './fields'
import { userListConfig } from './list'
import { userFormConfig } from './form'
import { userViewConfig } from './view'
import { userCustomActions } from './actions'
import { User, UserFormData } from '../../types'

export const userConfig: EntityConfig<User, UserFormData> = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'User',
  fields: userFields,
  endpoints: {
    list: '/api/v1/accounts/users/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  },
  listConfig: userListConfig,
  formConfig: userFormConfig,
  viewConfig: userViewConfig,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  },
  customActions: userCustomActions,
  bulkImport: {
    enabled: true,
    templateName: 'user_import_template',
    sampleData: [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'exam_officer'
      }
    ]
  }
}

export default userConfig