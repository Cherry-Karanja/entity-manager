// ===== PERMISSION CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { Permission, PermissionFormData } from '../../types'
import { permissionFormConfig } from './form'
import { permissionListConfig } from './list'
import { permissionViewConfig } from './view'

export const permissionConfig: EntityConfig<Permission, PermissionFormData> = {
  entityName: 'permission',
  entityNamePlural: 'Permissions',
  endpoints: {
    list: '/api/v1/accounts/permissions',
    create: '/api/v1/accounts/permissions',
    read: '/api/v1/accounts/permissions/{id}',
    update: '/api/v1/accounts/permissions/{id}',
    delete: '/api/v1/accounts/permissions/{id}'
  },
  list: permissionListConfig,
  form: permissionFormConfig,
  view: permissionViewConfig,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: false
  },
  features: {
    search: true,
    filter: true,
    sort: true,
    pagination: true,
    export: false,
    import: false
  }
}

export default permissionConfig