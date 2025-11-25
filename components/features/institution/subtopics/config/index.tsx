/**
 * Subtopic Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Subtopic } from '../../types';
import { SubtopicFormConfig } from './fields';
import { SubtopicListConfig } from './list';
import { SubtopicViewConfig } from './view';
import { SubtopicActionsConfig } from './actions';
import { SubtopicExporterConfig } from './export';

export const subtopicConfig: EntityConfig<Subtopic> = {
  name: 'subtopic',
  label: 'Subtopic',
  labelPlural: 'Subtopics',
  description: 'Manage topic subtopics and detailed content',
  
  list: SubtopicListConfig,
  form: SubtopicFormConfig,
  view: SubtopicViewConfig,
  actions: SubtopicActionsConfig,
  exporter: SubtopicExporterConfig,
  
  onValidate: async (values: Partial<Subtopic>) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Subtopic name is required';
    if (!values.topic) errors.topic = 'Topic is required';
    if (values.duration_minutes !== undefined && values.duration_minutes < 5) {
      errors.duration_minutes = 'Duration must be at least 5 minutes';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/academics/subtopics/',
  icon: 'List',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { SubtopicFormConfig, SubtopicListConfig, SubtopicViewConfig, SubtopicActionsConfig, SubtopicExporterConfig };
