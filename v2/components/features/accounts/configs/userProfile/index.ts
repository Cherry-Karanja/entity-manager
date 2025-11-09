// ===== USER PROFILE ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { UserProfile, UserProfileFormData } from '../../types'
import { userProfileFields } from './fields'
import { userProfileListColumns, userProfileListConfig } from './list'
import { userProfileFormConfig } from './form'
import { userProfileViewConfig } from './view'
import { userProfileActionsConfig } from './actions'

export const userProfileConfig: EntityConfig<UserProfile, UserProfileFormData> = {
  // ===== ENTITY METADATA =====
  name: 'UserProfile',
  namePlural: 'UserProfiles',
  displayName: 'User Profile',

  // ===== API CONFIGURATION =====
  endpoints: {
    list: '/api/v1/accounts/user-profiles/',
    create: '/api/v1/accounts/user-profiles/',
    update: '/api/v1/accounts/user-profiles/{id}/',
    delete: '/api/v1/accounts/user-profiles/{id}/'
  },

  // ===== PERMISSIONS =====
  permissions: {
    view: true,
    create: true,
    update: true,
    delete: true,
    export: true
  },

  // ===== FIELD CONFIGURATIONS =====
  fields: userProfileFields,

  // ===== LIST CONFIGURATION =====
  listConfig: {
    columns: userProfileListColumns,
    searchableFields: ['user', 'job_title', 'department', 'bio'],
    defaultSort: { field: 'created_at', direction: 'desc' },
    pageSize: 20,
    allowBatchActions: true,
    allowExport: true
  },

  // ===== FORM CONFIGURATION =====
  // form: userProfileFormConfig,

  // ===== VIEW CONFIGURATION =====
  // view: userProfileViewConfig,

  // ===== ACTIONS CONFIGURATION =====
  // actions: userProfileActionsConfig,

  // ===== ENTITY BEHAVIOR =====
  // behavior: {
  //   readOnly: false,
  //   creatable: true,
  //   editable: true,
  //   deletable: true,
  //   bulkOperations: true,
  //   exportable: true,
  //   searchable: true,
  //   filterable: true,
  //   sortable: true,
  //   paginated: true
  // },

  // ===== VALIDATION RULES =====
  // validation: {
  //   // Profile validation rules
  // },

  // ===== HOOKS =====
  // hooks: {
  //   onListLoad: async (params: any) => {
  //     // Add default sorting by creation date
  //     return {
  //       ...params,
  //       sort: params.sort || { key: 'created_at', direction: 'desc' }
  //     }
  //   },

  //   onViewLoad: async (item: UserProfile) => {
  //     // Log profile access for audit
  //     console.log('Profile viewed:', item.id)
  //     return item
  //   },

  //   onActionExecute: async (actionKey: string, item: UserProfile) => {
  //     // Log profile actions
  //     console.log('Profile action:', actionKey, 'on profile:', item.id)
  //   }
  // },

  // ===== CUSTOM COMPONENTS =====
  // components: {
  //   // Custom components can be added here if needed
  // },

  // ===== NOTIFICATIONS =====
  // notifications: {
  //   onApprove: {
  //     title: 'Profile Approved',
  //     description: 'User profile has been approved successfully',
  //     type: 'success'
  //   },
  //   onReject: {
  //     title: 'Profile Rejected',
  //     description: 'User profile has been rejected',
  //     type: 'warning'
  //   },
  //   onBulkApprove: {
  //     title: 'Profiles Approved',
  //     description: '{count} user profiles have been approved',
  //     type: 'success'
  //   }
  // }
}

export default userProfileConfig
