/**
 * UserRole Configuration Index
 * 
 * Main configuration file that exports all role management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { UserRoleFormConfig } from './form';
import { UserRoleListConfig } from './list';
import { UserRoleViewConfig } from './view';
import { UserRoleActionsConfig } from './actions';
import { UserRoleExporterConfig } from './export';

/**
 * Complete role entity configuration for the Entity Manager
 */
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
  list: UserRoleListConfig,

  // ===========================
  // Form Configuration
  // ===========================
  form: UserRoleFormConfig,

  // ===========================
  // Detail View Configuration
  // ===========================
  view: UserRoleViewConfig,

  // ===========================
  // Actions Configuration
  // ===========================
  actions: UserRoleActionsConfig,

  // ===========================
  // Export Configuration
  // ===========================
  exporter: UserRoleExporterConfig,

  // ===========================
  // Validation
  // ===========================
  onValidate: async (values: Partial<UserRole>) => {
    const errors: Record<string, string> = {};

    // Basic validation
    if (!values.name?.trim()) {
      errors.name = 'Role name is required';
    } else if (!/^[a-z_]+$/.test(values.name)) {
      errors.name = 'Role name must be lowercase letters and underscores only';
    }

    if (!values.display_name?.trim()) {
      errors.display_name = 'Display name is required';
    }

    return errors;
  },

  // Api endpoint
  apiEndpoint: '/api/v1/accounts/user-roles/',

  // icon
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

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './form';
export * from './export';
