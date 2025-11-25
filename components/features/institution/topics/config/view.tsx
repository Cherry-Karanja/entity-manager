/**
 * Topic View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { Badge } from '@/components/ui/badge';

export const TopicViewConfig: EntityViewConfig<Topic> = {
  fields: [
    { key: 'name', label: 'Topic Name' },
    { key: 'order', label: 'Order', render: (entity) => `#${(entity as Topic).order || '-'}` },
    { key: 'unit_name', label: 'Unit' },
    { key: 'duration_hours', label: 'Duration', render: (entity) => {
      const hours = (entity as Topic).duration_hours;
      return hours ? `${hours} hours` : '-';
    }},
    { key: 'weight', label: 'Assessment Weight', render: (entity) => {
      const weight = (entity as Topic).weight;
      return weight ? <Badge variant="outline">{weight}%</Badge> : '-';
    }},
    { key: 'subtopic_count', label: 'Subtopics', render: (entity) => {
      const count = (entity as Topic).subtopic_count;
      return `${count || 0} subtopic(s)`;
    }},
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'learning_objectives', label: 'Learning Objectives', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
