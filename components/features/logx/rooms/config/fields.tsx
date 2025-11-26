/**
 * Room Form Field Definitions
 * Defines the form fields for creating and editing rooms
 */

import type { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';
import { Room, ROOM_TYPE_LABELS } from '../../types';

export const roomFields: FormField<Room>[] = [
  {
    name: 'name',
    label: 'Room Name',
    type: 'text',
    required: true,
    placeholder: 'Enter room name',
    description: 'Name or number of the room',
    width: 'span 6',
  },
  {
    name: 'code',
    label: 'Room Code',
    type: 'text',
    required: true,
    placeholder: 'Enter unique room code',
    description: 'Unique identifier for the room',
    width: 'span 6',
  },
  {
    name: 'department',
    label: 'Department',
    type: 'relation',
    required: true,
    relationConfig: {
      entity: 'departments',
      displayField: 'name',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const q = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/departments/', q as any);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
      searchFields: ['name'],
    },
    width: 'span 6',
  },
  {
    name: 'room_type',
    label: 'Room Type',
    type: 'select',
    required: true,
    options: Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    width: 'span 6',
  },
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number',
    required: true,
    placeholder: 'Enter maximum capacity',
    description: 'Maximum number of people the room can accommodate',
    validation: [
      { type: 'min', message: 'Capacity must be at least 1', value: 1 },
      { type: 'max', message: 'Capacity must be at most 1000', value: 1000 },
    ],
    width: 'span 4',
  },
  {
    name: 'building',
    label: 'Building',
    type: 'text',
    placeholder: 'Building name or identifier',
    width: 'span 4',
  },
  {
    name: 'floor',
    label: 'Floor',
    type: 'text',
    placeholder: 'Floor number or identifier',
    width: 'span 4',
  },
  {
    name: 'operating_hours_start',
    label: 'Operating Hours Start',
    type: 'time',
    placeholder: 'Start time',
    width: 'span 6',
  },
  {
    name: 'operating_hours_end',
    label: 'Operating Hours End',
    type: 'time',
    placeholder: 'End time',
    width: 'span 6',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    defaultValue: true,
    description: 'Whether the room is available for scheduling',
    width: 'span 4',
  },
  {
    name: 'allows_concurrent_bookings',
    label: 'Allow Concurrent Bookings',
    type: 'switch',
    defaultValue: false,
    description: 'Allow multiple bookings simultaneously',
    width: 'span 4',
  },
  {
    name: 'requires_approval',
    label: 'Requires Approval',
    type: 'switch',
    defaultValue: false,
    description: 'Bookings require approval before confirmation',
    width: 'span 4',
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    placeholder: 'Additional notes about the room',
    width: 'span 12',
  },
];
