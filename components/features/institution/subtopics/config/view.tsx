/**
 * Subtopic View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Subtopic } from '../../types';
import { Badge } from '@/components/ui/badge';

export const SubtopicViewConfig: EntityViewConfig<Subtopic> = {
  fields: [
    { key: 'name', label: 'Subtopic Name' },
    { key: 'order', label: 'Order', render: (entity) => `#${(entity as Subtopic).order || '-'}` },
    { key: 'topic_name', label: 'Topic' },
    { key: 'duration_minutes', label: 'Duration', render: (entity) => {
      const mins = (entity as Subtopic).duration_minutes;
      return mins ? `${mins} minutes` : '-';
    }},
    { key: 'content_type', label: 'Content Type', render: (entity) => {
      const type = (entity as Subtopic).content_type;
      if (!type) return '-';
      const colors: Record<string, string> = {
        lecture: 'bg-blue-100 text-blue-800',
        practical: 'bg-green-100 text-green-800',
        discussion: 'bg-purple-100 text-purple-800',
        assessment: 'bg-red-100 text-red-800',
        'self-study': 'bg-yellow-100 text-yellow-800',
      };
      return (
        <Badge variant="outline" className={colors[type] || ''}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
    }},
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'resources', label: 'Resources', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
