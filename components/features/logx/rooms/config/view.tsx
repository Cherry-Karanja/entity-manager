/**
 * Room View Field Configurations
 * 
 * Defines fields for the room detail view.
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const RoomViewConfig: EntityViewConfig<Room> = {
  fields: [
    {
      key: 'code',
      label: 'Room Code',
      type: 'text',
    },
    {
      key: 'name',
      label: 'Room Name',
      type: 'text',
    },
    {
      key: 'room_type',
      label: 'Room Type',
      render: (entity) => {
        const value = (entity as Room).room_type;
        return (
          <Badge variant="outline">
            {ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || String(value)}
          </Badge>
        );
      },
    },
    {
      key: 'department_name',
      label: 'Department',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'building',
      label: 'Building',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'floor',
      label: 'Floor',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'capacity',
      label: 'Capacity',
      type: 'number',
      formatter: (value) => `${value} people`,
    },
    {
      key: 'allows_concurrent_bookings',
      label: 'Concurrent Bookings',
      render: (entity) => {
        const value = (entity as Room).allows_concurrent_bookings;
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Allowed' : 'Not Allowed'}
          </Badge>
        );
      },
    },
    {
      key: 'requires_approval',
      label: 'Requires Approval',
      render: (entity) => {
        const value = (entity as Room).requires_approval;
        return (
          <Badge variant={value ? 'destructive' : 'secondary'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        );
      },
    },
    {
      key: 'operating_hours_start',
      label: 'Operating Hours Start',
      type: 'text',
      formatter: (value) => (value as string) || 'Not set',
    },
    {
      key: 'operating_hours_end',
      label: 'Operating Hours End',
      type: 'text',
      formatter: (value) => (value as string) || 'Not set',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const value = (entity as Room).is_active;
        return (
          <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-600 text-white' : ''}>
            {value ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {value ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
    },
  ],

  groups: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Room identification and type',
      fields: ['code', 'name', 'room_type', 'department_name'],
      collapsible: true,
      order: 1,
    },
    {
      id: 'location',
      label: 'Location',
      description: 'Building and floor information',
      fields: ['building', 'floor'],
      collapsible: true,
      order: 2,
    },
    {
      id: 'capacity',
      label: 'Capacity & Usage',
      description: 'Room capacity and booking settings',
      fields: ['capacity', 'allows_concurrent_bookings', 'requires_approval'],
      collapsible: true,
      order: 3,
    },
    {
      id: 'hours',
      label: 'Operating Hours',
      description: 'Room availability hours',
      fields: ['operating_hours_start', 'operating_hours_end'],
      collapsible: true,
      order: 4,
    },
    {
      id: 'status',
      label: 'Status & Notes',
      description: 'Active status and timestamps',
      fields: ['is_active', 'notes', 'created_at', 'updated_at'],
      collapsible: true,
      order: 5,
    },
  ],

  mode: 'detail',
  showMetadata: true,

  titleField: 'name',
  subtitleField: 'code',

  actions: [],
};

// Convenience exports for backward compatibility
export const roomViewFields = RoomViewConfig.fields;
export const roomViewGroups = RoomViewConfig.groups;
export const roomViewConfig = RoomViewConfig;
