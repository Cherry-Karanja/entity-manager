/**
 * UserRole Configuration
 * 
 * Central configuration for the UserRole entity.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { UserRoleFormConfig } from './fields';
import { roleColumns } from './list';
import { roleViewFields } from './view';
import { UserRoleActionsConfig } from './actions';

export const userRoleConfig: EntityConfig<UserRole> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'userRole',
  label: 'Role',
  labelPlural: 'Roles',
  description: 'Manage user roles and permissions',
  
  // ===========================
  // List View Configuration
  // ===========================
  list: {
    columns: roleColumns,
    sortConfig: { field: 'display_name', direction: 'asc' },
    searchable: true,
    searchPlaceholder: 'Search by name or description...',
  },
  
  // ===========================
  // Form Configuration
  // ===========================
  form: UserRoleFormConfig,
  
  // ===========================
  // Detail View Configuration
  // ===========================
  view: {
    fields: roleViewFields,
  },
  
  // ===========================
  // Actions Configuration
  // ===========================
  actions: UserRoleActionsConfig,
  
  // ===========================
  // Exporter Configuration
  // ===========================
  exporter: {
    fields: [],
  },
  
  // ===========================
  // API Configuration
  // ===========================
  apiEndpoint: '/api/v1/accounts/user-roles/',
  
  // ===========================
  // Icon
  // ===========================
  icon: 'Shield',
  
  // ===========================
  // Permissions
  // ===========================
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
  },
  
  // ===========================
  // Additional Metadata
  // ===========================
  metadata: {
    color: 'indigo',
    category: 'accounts',
    tags: ['roles', 'permissions', 'access-control'],
  },
};

export * from './fields';
export * from './list';
export * from './form';
export * from './view';
export * from './actions';
