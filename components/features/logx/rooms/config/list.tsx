/**
 * Room List Column Definitions
 * Defines the columns displayed in the rooms list view
 */

import type { Column } from '@/components/entityManager/components/list/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';

export const roomColumns: Column<Room>[] = [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    width: '100px',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: '200px',
  },
  {
    key: 'department_name',
    label: 'Department',
    sortable: true,
    render: (value: unknown, row?: Room) => (value ? String(value) : `Department ${row?.department}`),
  },
  {
    key: 'room_type',
    label: 'Type',
    sortable: true,
    render: (value: unknown) => (
      <Badge variant="outline">
        {String(ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] ?? value)}
      </Badge>
    ),
  },
  {
    key: 'capacity',
    label: 'Capacity',
    sortable: true,
    width: '100px',
    render: (value: unknown) => `${String(value)} people`,
  },
  {
    key: 'building',
    label: 'Location',
    render: (value: unknown, row?: Room) => {
      const parts: string[] = [];
      if (row?.building) parts.push(row.building);
      if (row?.floor) parts.push(`Floor ${row.floor}`);
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    width: '100px',
    render: (value: unknown) => (
      <Badge variant={(value as boolean) ? 'default' : 'secondary'}>
        {(value as boolean) ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
