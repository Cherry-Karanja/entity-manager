/**
 * Department Configuration Index
 * 
 * Main configuration file that exports all department management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Department } from '../../types';
import { DepartmentFormConfig } from './fields';
import { DepartmentListConfig } from './list';
import { DepartmentViewConfig } from './view';
import { DepartmentActionsConfig } from './actions';
import { DepartmentExporterConfig } from './export';

/**
 * Complete department entity configuration for the Entity Manager
 */
export const departmentConfig: EntityConfig<Department> = {
  name: 'department',
  label: 'Department',
  labelPlural: 'Departments',
  description: 'Manage academic departments',
  
  list: DepartmentListConfig,
  form: DepartmentFormConfig,
  view: DepartmentViewConfig,
  actions: DepartmentActionsConfig,
  exporter: DepartmentExporterConfig,
  
  onValidate: async (values: Partial<Department>) => {
    const errors: Record<string, string> = {};
    
    if (!values.name?.trim()) {
      errors.name = 'Department name is required';
    } else if (values.name.length < 2) {
      errors.name = 'Department name must be at least 2 characters';
    }
    
    return errors;
  },

  apiEndpoint: '/api/v1/institution/departments/',
  icon: 'Building2',

  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
  },

  metadata: {
    createdAtField: 'created_at',
    updatedAtField: 'updated_at',
  },
};

export { DepartmentFormConfig, DepartmentListConfig, DepartmentViewConfig, DepartmentActionsConfig, DepartmentExporterConfig };
