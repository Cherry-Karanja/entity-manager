/**
 * Room Detail View Configuration
 * Defines the layout for viewing room details
 */

import { ViewConfig } from '@/components/entityManager';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Building2, Users, Clock, CheckCircle } from 'lucide-react';

export const roomViewConfig: ViewConfig<Room> = {
  title: (room) => room.name,
  subtitle: (room) => `Code: ${room.code}`,
  icon: LayoutGrid,
  sections: [
    {
      title: 'Basic Information',
      icon: Building2,
      fields: [
        { key: 'code', label: 'Room Code' },
        { key: 'name', label: 'Room Name' },
        { 
          key: 'room_type', 
          label: 'Room Type',
          render: (value) => (
            <Badge variant="outline">
              {ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || value}
            </Badge>
          ),
        },
        { 
          key: 'department_name', 
          label: 'Department',
          render: (value, row) => value || `Department ${row.department}`,
        },
      ],
    },
    {
      title: 'Location',
      icon: Building2,
      fields: [
        { key: 'building', label: 'Building' },
        { key: 'floor', label: 'Floor' },
      ],
    },
    {
      title: 'Capacity & Usage',
      icon: Users,
      fields: [
        { 
          key: 'capacity', 
          label: 'Capacity',
          render: (value) => `${value} people`,
        },
        { 
          key: 'allows_concurrent_bookings', 
          label: 'Concurrent Bookings',
          render: (value) => (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Allowed' : 'Not Allowed'}
            </Badge>
          ),
        },
        { 
          key: 'requires_approval', 
          label: 'Requires Approval',
          render: (value) => (
            <Badge variant={value ? 'destructive' : 'secondary'}>
              {value ? 'Yes' : 'No'}
            </Badge>
          ),
        },
      ],
    },
    {
      title: 'Operating Hours',
      icon: Clock,
      fields: [
        { 
          key: 'operating_hours_start', 
          label: 'Start Time',
          render: (value) => value || 'Not set',
        },
        { 
          key: 'operating_hours_end', 
          label: 'End Time',
          render: (value) => value || 'Not set',
        },
      ],
    },
    {
      title: 'Status',
      icon: CheckCircle,
      fields: [
        { 
          key: 'is_active', 
          label: 'Status',
          render: (value) => (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
        { key: 'notes', label: 'Notes' },
      ],
    },
  ],
};
