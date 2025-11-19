/**
 * UserRole Configuration
 * 
 * Central configuration for the UserRole entity.
 */

import { EntityConfig } from '@/components/entityManager/primitives/types';
import { UserRole } from '../types';
import { roleFields } from './fields';
import { roleColumns, roleListConfig } from './list';
import { roleFormLayout, roleFormSections, roleFormMode } from './form';
import { roleViewFields, roleViewGroups } from './view';
import { roleActions, roleBulkActions } from './actions';

export const userRoleConfig: EntityConfig<UserRole> = {
  // Entity metadata
  name: 'UserRole',
  label: 'Role',
  labelPlural: 'Roles',
  icon: 'Shield',
  
  // Fields
  fields: roleFields,
  
  // List Configuration
  columns: roleColumns,
  listConfig: roleListConfig,
  
  // Form Configuration
  formLayout: roleFormLayout,
  formSections: roleFormSections,
  formMode: roleFormMode,
  
  // View Configuration
  viewFields: roleViewFields,
  viewGroups: roleViewGroups,
  
  // Actions - Temporarily disabled due to type mismatch
  // actions: roleActions,
  // bulkActions: roleBulkActions,
  
  // API Configuration
  apiEndpoint: '/api/accounts/roles',
  
  // Display Configuration
  displayField: 'display_name',
  searchFields: ['display_name', 'name', 'description'],
  defaultSort: { field: 'display_name', direction: 'asc' },
};

export * from './fields';
export * from './list';
export * from './form';
export * from './view';
// export * from './actions'; // Temporarily disabled - type mismatch
