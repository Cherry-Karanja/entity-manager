/**
 * Programme Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Programme } from '../../types';
import { ProgrammeFormConfig } from './fields';
import { ProgrammeListConfig } from './list';
import { ProgrammeViewConfig } from './view';
import { ProgrammeActionsConfig } from './actions';
import { ProgrammeExporterConfig } from './export';

export const programmeConfig: EntityConfig<Programme> = {
  name: 'programme',
  label: 'Programme',
  labelPlural: 'Programmes',
  description: 'Manage academic programmes',
  
  list: ProgrammeListConfig,
  form: ProgrammeFormConfig,
  view: ProgrammeViewConfig,
  actions: ProgrammeActionsConfig,
  exporter: ProgrammeExporterConfig,
  
  onValidate: async (values: Partial<Programme>) => {
    const errors: Record<string, string> = {};
    if (!values.name?.trim()) errors.name = 'Programme name is required';
    if (!values.department) errors.department = 'Department is required';
    if (values.level !== undefined && (values.level < 0 || values.level > 10)) {
      errors.level = 'Level must be between 0 and 10';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/institution/programmes/',
  icon: 'GraduationCap',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { ProgrammeFormConfig, ProgrammeListConfig, ProgrammeViewConfig, ProgrammeActionsConfig, ProgrammeExporterConfig };
