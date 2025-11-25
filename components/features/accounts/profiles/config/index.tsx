/**
 * UserProfile Configuration
 * 
 * Central configuration for the UserProfile entity.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { UserProfile } from '../types';
import { UserProfileFormConfig } from './fields';
import { profileColumns } from './list';
import { profileViewFields } from './view';
import { UserProfileActionsConfig } from './actions';

export const userProfileConfig: EntityConfig<UserProfile> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'userProfile',
  label: 'Profile',
  labelPlural: 'Profiles',
  description: 'Manage user profiles and preferences',
  
  // ===========================
  // List View Configuration
  // ===========================
  list: {
    columns: profileColumns,
    sortConfig: { field: 'created_at', direction: 'desc' },
    searchable: true,
    searchPlaceholder: 'Search by name, email, bio, job title or department...',
  },
  
  // ===========================
  // Form Configuration
  // ===========================
  form: UserProfileFormConfig,
  
  // ===========================
  // Detail View Configuration
  // ===========================
  view: {
    fields: profileViewFields,
  },
  
  // ===========================
  // Actions Configuration
  // ===========================
  actions: UserProfileActionsConfig,
  
  // ===========================
  // Exporter Configuration
  // ===========================
  exporter: {
    fields: [],
  },
  
  // ===========================
  // API Configuration
  // ===========================
  apiEndpoint: '/api/v1/accounts/user-profiles/',
  
  // ===========================
  // Icon
  // ===========================
  icon: 'User',
  
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
    color: 'purple',
    category: 'accounts',
    tags: ['profiles', 'accounts', 'users'],
  },
};

export * from './fields';
export * from './list';
export * from './form';
export * from './view';
export * from './actions';
