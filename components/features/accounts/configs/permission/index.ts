// ===== PERMISSION CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { Permission, PermissionFormData } from '../../types'
import { permissionFormConfig } from './form'
import { permissionListConfig } from './list'
import { permissionViewConfig } from './view'
import { permissionActionsConfig } from './actions'

export const permissionConfig: EntityConfig<Permission, PermissionFormData> = {
  // Entity identification
  entityName: 'permission',
  entityNamePlural: 'Permissions',

  // API endpoints (moved to top level)
  endpoints: {
    list: '/api/v1/accounts/permissions',
    create: '/api/v1/accounts/permissions',
    read: '/api/v1/accounts/permissions/{id}',
    update: '/api/v1/accounts/permissions/{id}',
    delete: '/api/v1/accounts/permissions/{id}'
  },

  // UI configurations
  form: {
    ...permissionFormConfig,
    fields: [
      {
        name: 'name',
        label: 'Permission Name',
        type: 'text',
        required: true,
        placeholder: 'Enter permission name (e.g., Can view users)'
      },
      {
        name: 'codename',
        label: 'Codename',
        type: 'text',
        required: true,
        placeholder: 'Enter codename (e.g., view_user)'
      },
      {
        name: 'app_label',
        label: 'App Label',
        type: 'text',
        required: true,
        placeholder: 'Enter app label (e.g., accounts)'
      },
      {
        name: 'model',
        label: 'Model',
        type: 'text',
        required: true,
        placeholder: 'Enter model name (e.g., user)'
      }
    ]
  },
  list: {
    ...permissionListConfig,
    columns: permissionListConfig.columns,
    defaultSort: permissionListConfig.defaultSort
  },
  view: permissionViewConfig,
  actions: permissionActionsConfig,

  // Entity utilities
  // apiUtils: permissionApiUtils, // Removed as not part of EntityConfig

  // Additional configuration
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true
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