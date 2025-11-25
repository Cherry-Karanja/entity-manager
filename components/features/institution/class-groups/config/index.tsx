/**
 * ClassGroup Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';
import { ClassGroupFormConfig } from './fields';
import { ClassGroupListConfig } from './list';
import { ClassGroupViewConfig } from './view';
import { ClassGroupActionsConfig } from './actions';
import { ClassGroupExporterConfig } from './export';

export const classGroupConfig: EntityConfig<ClassGroup> = {
  name: 'classGroup',
  label: 'Class',
  labelPlural: 'Classes',
  description: 'Manage class groups',
  
  list: ClassGroupListConfig,
  form: ClassGroupFormConfig,
  view: ClassGroupViewConfig,
  actions: ClassGroupActionsConfig,
  exporter: ClassGroupExporterConfig,
  
  onValidate: async (values: Partial<ClassGroup>) => {
    const errors: Record<string, string> = {};
    if (!values.name?.trim()) errors.name = 'Class name is required';
    if (!values.programme) errors.programme = 'Programme is required';
    return errors;
  },

  apiEndpoint: '/api/v1/institution/class-groups/',
  icon: 'Users',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { ClassGroupFormConfig, ClassGroupListConfig, ClassGroupViewConfig, ClassGroupActionsConfig, ClassGroupExporterConfig };
