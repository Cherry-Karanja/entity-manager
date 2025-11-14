/**
 * Example: User Entity Configuration (Unified Approach)
 * 
 * This example demonstrates how to create a complete entity configuration
 * using the new unified approach. This replaces the old approach that required
 * 5-6 separate files (fields.ts, form.ts, list.ts, view.ts, actions.ts, index.ts).
 */

import { 
  createEntityConfig, 
  createField, 
  createAction,
  commonFields, 
  commonActions
} from '../index'

// Example types (would be in separate types file)
interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role_name: string
  is_active: boolean
  created_at: string
}

interface UserFormData {
  email: string
  first_name: string
  last_name: string
  role_name: string
  is_active: boolean
}

/**
 * Complete user entity configuration in a single file
 */
export const userConfig = createEntityConfig<User, UserFormData>('User', 'Users')
  .displayName('User Management')
  .endpoints({
    list: '/api/v1/accounts/users/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  })
  .permissions({
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  })
  .listConfig({
    defaultFields: ['email', 'first_name', 'last_name', 'role_name', 'is_active'],
    searchableFields: ['email', 'first_name', 'last_name'],
    pageSize: 20,
    selectable: true,
    exportable: true
  })
  .formConfig({
    layout: 'grid',
    columns: 2,
    submitLabel: 'Save User'
  })
  .build()

// Define fields
userConfig.fields = [
  commonFields.id().build(),
  commonFields.email().sortable().build(),
  commonFields.name('first_name', 'First Name').build(),
  commonFields.name('last_name', 'Last Name').build(),
  
  createField<User, UserFormData>('role_name', 'Role', 'select')
    .required()
    .relationship({
      entity: 'user-role',
      displayField: 'display_name',
      endpoint: '/api/v1/accounts/user-roles/'
    })
    .build(),
  
  commonFields.isActive().build(),
  commonFields.createdAt().build()
]

// Define actions
userConfig.actions = [
  commonActions.view<User>().build(),
  commonActions.edit<User>().build(),
  commonActions.delete<User>().build()
]
