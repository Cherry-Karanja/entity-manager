/**
 * Intake Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Intake } from '../../types';
import { IntakeFormConfig } from './fields';
import { IntakeListConfig } from './list';
import { IntakeViewConfig } from './view';
import { IntakeActionsConfig } from './actions';
import { IntakeExporterConfig } from './export';

export const intakeConfig: EntityConfig<Intake> = {
  name: 'intake',
  label: 'Intake',
  labelPlural: 'Intakes',
  description: 'Manage student intakes and cohorts',
  
  list: IntakeListConfig,
  form: IntakeFormConfig,
  view: IntakeViewConfig,
  actions: IntakeActionsConfig,
  exporter: IntakeExporterConfig,
  
  onValidate: async (values: Partial<Intake>) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Intake name is required';
    if (!values.academic_year) errors.academic_year = 'Academic year is required';
    if (values.start_date && values.end_date && new Date(values.start_date) >= new Date(values.end_date)) {
      errors.end_date = 'End date must be after start date';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/institution/intakes/',
  icon: 'Users',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { IntakeFormConfig, IntakeListConfig, IntakeViewConfig, IntakeActionsConfig, IntakeExporterConfig };
