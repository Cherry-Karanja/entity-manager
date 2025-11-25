/**
 * Room List Column Definitions
 * Defines the columns displayed in the rooms list view
 */

import { ColumnDefinition } from '@/components/entityManager';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';

export const roomColumns: ColumnDefinition<Room>[] = [
  {
    key: 'code',
    header: 'Code',
    sortable: true,
    width: '100px',
  },
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    width: '200px',
  },
  {
    key: 'department_name',
    header: 'Department',
    sortable: true,
    render: (value, row) => value || `Department ${row.department}`,
  },
  {
    key: 'room_type',
    header: 'Type',
    sortable: true,
    render: (value) => (
      <Badge variant="outline">
        {ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || value}
      </Badge>
    ),
  },
  {
    key: 'capacity',
    header: 'Capacity',
    sortable: true,
    width: '100px',
    render: (value) => `${value} people`,
  },
  {
    key: 'building',
    header: 'Location',
    render: (value, row) => {
      const parts = [];
      if (row.building) parts.push(row.building);
      if (row.floor) parts.push(`Floor ${row.floor}`);
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    width: '100px',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
