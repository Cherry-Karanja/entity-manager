/**
 * Room Detail View Configuration
 * Defines the layout for viewing room details
 */

import type { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Building2, Users, Clock, CheckCircle } from 'lucide-react';

export const roomViewConfig: EntityViewConfig<Room> = {
  fields: [],
  title: (room?: Room) => room?.name || '',
  subtitle: (room?: Room) => (room ? `Code: ${room.code}` : ''),
  icon: <LayoutGrid />,
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: <Building2 />,
      fields: [
        { key: 'code', label: 'Room Code' },
        { key: 'name', label: 'Room Name' },
        {
          key: 'room_type',
          label: 'Room Type',
          render: (value: any) => (
            <Badge variant="outline">
              {ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || String(value)}
            </Badge>
          ),
        },
        {
          key: 'department_name',
          label: 'Department',
          render: (value: any, row?: Room) => value || `Department ${row?.department}`,
        },
      ],
    },
    {
      id: 'location',
      label: 'Location',
      icon: Building2,
      fields: [
        { key: 'building', label: 'Building' },
        { key: 'floor', label: 'Floor' },
      ],
    },
    {
      id: 'capacity',
      label: 'Capacity & Usage',
      icon: <Users />,
      fields: [
        {
          key: 'capacity',
          label: 'Capacity',
          render: (value: any) => `${String(value)} people`,
        },
        {
          key: 'allows_concurrent_bookings',
          label: 'Concurrent Bookings',
          render: (value: any) => (
            <Badge variant={(value as boolean) ? 'default' : 'secondary'}>
              {(value as boolean) ? 'Allowed' : 'Not Allowed'}
            </Badge>
          ),
        },
        {
          key: 'requires_approval',
          label: 'Requires Approval',
          render: (value: any) => (
            <Badge variant={(value as boolean) ? 'destructive' : 'secondary'}>
              {(value as boolean) ? 'Yes' : 'No'}
            </Badge>
          ),
        },
      ],
    },
    {
      id: 'hours',
      label: 'Operating Hours',
      icon: <Clock />,
      fields: [
        {
          key: 'operating_hours_start',
          label: 'Start Time',
          render: (value: any) => (value ? String(value) : 'Not set'),
        },
        {
          key: 'operating_hours_end',
          label: 'End Time',
          render: (value: any) => (value ? String(value) : 'Not set'),
        },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      icon: <CheckCircle />,
      fields: [
        {
          key: 'is_active',
          label: 'Status',
          render: (value: any) => (
            <Badge variant={(value as boolean) ? 'default' : 'secondary'}>
              {(value as boolean) ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
        { key: 'notes', label: 'Notes' },
      ],
    },
  ],
};
