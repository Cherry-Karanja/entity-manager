/**
 * User Configuration Index
 * 
 * Main configuration file that exports all user management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { User } from '../../types';
import { userFields } from './fields';
import { userColumns } from './list';
import { userViewFields, userViewGroups } from './view';
import { userActions } from './actions';
import { userFormLayout, userFormSections } from './form';

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
  columns: userColumns,
  
  // ===========================
  // Form Configuration
  // ===========================
  fields: userFields,
  formLayout: userFormLayout,
  formSections: userFormSections,
  
  // ===========================
  // Detail View Configuration
  // ===========================
  viewFields: userViewFields,
  
  // ===========================
  // Actions Configuration
  // ===========================
  actions: userActions,
  
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
  
  // ===========================
  // Export Configuration
  // ===========================
  exportFields: [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'full_name',
      label: 'Full Name',
    },
    {
      key: 'first_name',
      label: 'First Name',
    },
    {
      key: 'last_name',
      label: 'Last Name',
    },
    {
      key: 'employee_id',
      label: 'Employee ID',
    },
    {
      key: 'role_display',
      label: 'Role',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'phone_number',
      label: 'Phone',
    },
    {
      key: 'is_active',
      label: 'Active',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_approved',
      label: 'Approved',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_verified',
      label: 'Verified',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'is_staff',
      label: 'Staff',
      formatter: (value: unknown) => (value as boolean) ? 'Yes' : 'No',
    },
    {
      key: 'last_login',
      label: 'Last Login',
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : 'Never',
    },
    {
      key: 'created_at',
      label: 'Date Joined',
      formatter: (value: unknown) => new Date(value as string).toLocaleString(),
    },
  ],
  
  // ===========================
  // Default Settings
  // ===========================
  defaultSort: {
    field: 'created_at',
    direction: 'desc',
  },
  
  defaultPageSize: 10,
  
  // ===========================
  // Search & Filter
  // ===========================
  searchableFields: ['email', 'first_name', 'last_name', 'employee_id'],
  
  filterableFields: ['role_display', 'department', 'is_active', 'is_approved', 'is_verified', 'is_staff'],
  
  // ===========================
  // Display Fields
  // ===========================
  titleField: 'full_name',
  subtitleField: 'email',
  imageField: 'profile_picture',
  dateField: 'created_at',
  
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
    icon: 'Users',
    color: 'blue',
    category: 'accounts',
    tags: ['users', 'accounts', 'authentication'],
    apiEndpoint: '/api/v1/accounts/users/',
    formLayout: userFormLayout,
    formSections: userFormSections,
    viewGroups: userViewGroups,
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './form';
