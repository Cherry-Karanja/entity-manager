/**
 * Subtopic List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Subtopic } from '../../types';
import { Badge } from '@/components/ui/badge';

export const SubtopicListConfig: EntityListConfig<Subtopic> = {
  columns: [
    {
      key: 'order',
      label: '#',
      sortable: true,
      width: '8%',
      render: (value) => (
        <span className="text-muted-foreground font-mono">{value as number || '-'}</span>
      ),
    },
    {
      key: 'name',
      label: 'Subtopic Name',
      sortable: true,
      width: '35%',
    },
    {
      key: 'topic_name',
      label: 'Topic',
      sortable: true,
      filterable: true,
      width: '25%',
    },
    {
      key: 'content_type',
      label: 'Type',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => {
        if (!value) return '-';
        const colors: Record<string, string> = {
          lecture: 'bg-blue-100 text-blue-800',
          practical: 'bg-green-100 text-green-800',
          discussion: 'bg-purple-100 text-purple-800',
          assessment: 'bg-red-100 text-red-800',
          'self-study': 'bg-yellow-100 text-yellow-800',
        };
        return (
          <Badge variant="outline" className={colors[value as string] || ''}>
            {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'duration_minutes',
      label: 'Duration',
      sortable: true,
      width: '12%',
      render: (value) => value ? `${value} min` : '-',
    },
  ],

  defaultSort: { field: 'order', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search subtopics...',
  searchFields: ['name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 25, pageSizeOptions: [10, 25, 50, 100] },
};
