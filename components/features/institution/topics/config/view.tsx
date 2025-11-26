/**
 * Topic View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { Badge } from '@/components/ui/badge';

export const TopicViewConfig: EntityViewConfig<Topic> = {
  fields: [
    { key: 'name', label: 'Topic Name' },
    { key: 'order', label: 'Order', render: (entity?: Topic) => `#${entity?.order ?? '-'}` },
    { key: 'unit_name', label: 'Unit' },
    { key: 'duration_hours', label: 'Duration', render: (entity?: Topic) => {
      const hours = entity?.duration_hours;
      return hours ? `${hours} hours` : '-';
    }},
    { key: 'weight', label: 'Assessment Weight', render: (entity?: Topic) => {
      const weight = entity?.weight;
      return weight ? <Badge variant="outline">{weight}%</Badge> : '-';
    }},
    { key: 'subtopic_count', label: 'Subtopics', render: (entity?: Topic) => {
      const count = (entity as Topic)?.subtopic_count ?? (entity as any)?.subtopics_count ?? 0;
      return `${count} subtopic(s)`;
    }},
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'learning_objectives', label: 'Learning Objectives', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'updated_at', label: 'Last Updated', type: 'date' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
