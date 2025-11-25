/**
 * Topic List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { Badge } from '@/components/ui/badge';

export const TopicListConfig: EntityListConfig<Topic> = {
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
      label: 'Topic Name',
      sortable: true,
      width: '30%',
    },
    {
      key: 'unit_name',
      label: 'Unit',
      sortable: true,
      filterable: true,
      width: '22%',
    },
    {
      key: 'duration_hours',
      label: 'Duration',
      sortable: true,
      width: '12%',
      render: (value) => value ? `${value}h` : '-',
    },
    {
      key: 'weight',
      label: 'Weight',
      sortable: true,
      width: '12%',
      render: (value) => value ? (
        <Badge variant="outline">{value as number}%</Badge>
      ) : '-',
    },
    {
      key: 'subtopic_count',
      label: 'Subtopics',
      sortable: true,
      width: '12%',
      render: (value) => (
        <span className="text-muted-foreground">{value as number || 0}</span>
      ),
    },
  ],

  defaultSort: { field: 'order', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search topics...',
  searchFields: ['name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 25, pageSizeOptions: [10, 25, 50, 100] },
};
