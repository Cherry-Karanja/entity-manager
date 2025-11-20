/**
 * UserProfile Configuration
 * 
 * Central configuration for the UserProfile entity.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { UserProfile } from '../types';
import { profileFields } from './fields';
import { profileColumns } from './list';
import { profileFormLayout, profileFormSections, profileFormMode } from './form';
import { profileViewFields } from './view';
import { profileActions, profileBulkActions } from './actions';

export const userProfileConfig: EntityConfig<UserProfile> = {
  // Entity metadata
  name: 'UserProfile',
  label: 'Profile',
  labelPlural: 'Profiles',
  icon: 'User',
  
  // Fields
  fields: profileFields,
  
  // List Configuration
  columns: profileColumns,
  
  // Form Configuration
  formLayout: profileFormLayout,
  formSections: profileFormSections,
  formMode: profileFormMode,
  
  // View Configuration
  viewFields: profileViewFields,
  
  // Actions - Temporarily disabled due to type mismatch
  actions: [],
  // actions: profileActions,
  // bulkActions: profileBulkActions,
  
  // Export Configuration
  exportFields: [],
  
  // API Configuration
  apiEndpoint: '/api/accounts/profiles',
  
  // Display Configuration
  displayField: 'user_name',
  searchableFields: ['user_name', 'user_email', 'bio', 'job_title', 'department'],
  defaultSort: { field: 'created_at', direction: 'desc' },
};

export * from './fields';
export * from './list';
export * from './form';
export * from './view';
// export * from './actions'; // Temporarily disabled - type mismatch
