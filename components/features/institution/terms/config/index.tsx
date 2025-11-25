/**
 * Term Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Term } from '../../types';
import { TermFormConfig } from './fields';
import { TermListConfig } from './list';
import { TermViewConfig } from './view';
import { TermActionsConfig } from './actions';
import { TermExporterConfig } from './export';

export const termConfig: EntityConfig<Term> = {
  name: 'term',
  label: 'Term',
  labelPlural: 'Terms',
  description: 'Manage academic terms/semesters',
  
  list: TermListConfig,
  form: TermFormConfig,
  view: TermViewConfig,
  actions: TermActionsConfig,
  exporter: TermExporterConfig,
  
  onValidate: async (values: Partial<Term>) => {
    const errors: Record<string, string> = {};
    if (!values.term_number) errors.term_number = 'Term number is required';
    if (!values.academic_year) errors.academic_year = 'Academic year is required';
    if (values.start_date && values.end_date && new Date(values.start_date) >= new Date(values.end_date)) {
      errors.end_date = 'End date must be after start date';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/institution/terms/',
  icon: 'BookOpen',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { TermFormConfig, TermListConfig, TermViewConfig, TermActionsConfig, TermExporterConfig };
