/**
 * User Configuration Index
 * 
 * Main configuration file that exports all user management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { User } from '../../types';
import { UserFormConfig } from './form';
import { UserListConfig } from './list';
import { UserViewConfig } from './view';
import { UserActionsConfig } from './actions';
import { UserExporterConfig } from './export';

/**
 * Complete user entity configuration for the Entity Manager
 */
export const userConfig: EntityConfig<User> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'user',
  label: 'User',
  labelPlural: 'Users',
  description: 'Manage system users, roles, and permissions',

  // ===========================
  // List View Configuration
  // ===========================
  list: UserListConfig,

  // ===========================
  // Form Configuration
  // ===========================
  form: UserFormConfig,


  // ===========================
  // Detail View Configuration
  // ===========================
  view: UserViewConfig,

  // ===========================
  // Actions Configuration
  // ===========================
  actions: UserActionsConfig,

  // ===========================
  // Export Configuration
  // ===========================
  exporter: UserExporterConfig,

  // ===========================
  // Validation
  // ===========================
  onValidate: async (values: Partial<User>) => {
    const errors: Record<string, string> = {};

    // Basic validation
    if (!values.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email format';
    }

    if (!values.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!values.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }

    // Employee ID required only for create
    if (!values.id && !values.employee_id?.trim()) {
      errors.employee_id = 'Employee ID is required';
    }

    return errors;
  },

  // Api endpoint
  apiEndpoint: '/api/v1/accounts/users/',

  // icon
  icon: 'Users',

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
    color: 'blue',
    category: 'accounts',
    tags: ['users', 'accounts', 'authentication'],
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './form';
