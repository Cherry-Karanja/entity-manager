/**
 * Unit Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Unit } from '../../types';
import { UnitFormConfig } from './fields';
import { UnitListConfig } from './list';
import { UnitViewConfig } from './view';
import { UnitActionsConfig } from './actions';
import { UnitExporterConfig } from './export';

export const unitConfig: EntityConfig<Unit> = {
  name: 'unit',
  label: 'Unit',
  labelPlural: 'Units',
  description: 'Manage course units/subjects',
  
  list: UnitListConfig,
  form: UnitFormConfig,
  view: UnitViewConfig,
  actions: UnitActionsConfig,
  exporter: UnitExporterConfig,
  
  onValidate: async (values: Partial<Unit>) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Unit name is required';
    if (!values.code) errors.code = 'Unit code is required';
    if (!values.programme) errors.programme = 'Programme is required';
    if (values.credits !== undefined && (values.credits < 0 || values.credits > 20)) {
      errors.credits = 'Credits must be between 0 and 20';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/academics/units/',
  icon: 'BookOpen',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { UnitFormConfig, UnitListConfig, UnitViewConfig, UnitActionsConfig, UnitExporterConfig };
