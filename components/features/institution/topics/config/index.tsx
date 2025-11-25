/**
 * Topic Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { TopicFormConfig } from './fields';
import { TopicListConfig } from './list';
import { TopicViewConfig } from './view';
import { TopicActionsConfig } from './actions';
import { TopicExporterConfig } from './export';

export const topicConfig: EntityConfig<Topic> = {
  name: 'topic',
  label: 'Topic',
  labelPlural: 'Topics',
  description: 'Manage unit topics and curriculum content',
  
  list: TopicListConfig,
  form: TopicFormConfig,
  view: TopicViewConfig,
  actions: TopicActionsConfig,
  exporter: TopicExporterConfig,
  
  onValidate: async (values: Partial<Topic>) => {
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Topic name is required';
    if (!values.unit) errors.unit = 'Unit is required';
    if (values.weight !== undefined && (values.weight < 0 || values.weight > 100)) {
      errors.weight = 'Weight must be between 0 and 100';
    }
    return errors;
  },

  apiEndpoint: '/api/v1/academics/topics/',
  icon: 'FileText',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { TopicFormConfig, TopicListConfig, TopicViewConfig, TopicActionsConfig, TopicExporterConfig };
