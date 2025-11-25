/**
 * Room Form Field Definitions
 * Defines the form fields for creating and editing rooms
 */

import { FieldDefinition } from '@/components/entityManager';
import { Room, ROOM_TYPE_LABELS } from '../../types';

export const roomFields: FieldDefinition<Room>[] = [
  {
    name: 'name',
    label: 'Room Name',
    type: 'text',
    required: true,
    placeholder: 'Enter room name',
    description: 'Name or number of the room',
    gridColumn: 'span 6',
  },
  {
    name: 'code',
    label: 'Room Code',
    type: 'text',
    required: true,
    placeholder: 'Enter unique room code',
    description: 'Unique identifier for the room',
    gridColumn: 'span 6',
  },
  {
    name: 'department',
    label: 'Department',
    type: 'relationship',
    required: true,
    relationship: {
      endpoint: '/api/v1/institution/departments/',
      valueField: 'id',
      labelField: 'name',
      searchable: true,
    },
    gridColumn: 'span 6',
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
    gridColumn: 'span 6',
  },
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number',
    required: true,
    placeholder: 'Enter maximum capacity',
    description: 'Maximum number of people the room can accommodate',
    validation: {
      min: 1,
      max: 1000,
    },
    gridColumn: 'span 4',
  },
  {
    name: 'building',
    label: 'Building',
    type: 'text',
    placeholder: 'Building name or identifier',
    gridColumn: 'span 4',
  },
  {
    name: 'floor',
    label: 'Floor',
    type: 'text',
    placeholder: 'Floor number or identifier',
    gridColumn: 'span 4',
  },
  {
    name: 'operating_hours_start',
    label: 'Operating Hours Start',
    type: 'time',
    placeholder: 'Start time',
    gridColumn: 'span 6',
  },
  {
    name: 'operating_hours_end',
    label: 'Operating Hours End',
    type: 'time',
    placeholder: 'End time',
    gridColumn: 'span 6',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    defaultValue: true,
    description: 'Whether the room is available for scheduling',
    gridColumn: 'span 4',
  },
  {
    name: 'allows_concurrent_bookings',
    label: 'Allow Concurrent Bookings',
    type: 'switch',
    defaultValue: false,
    description: 'Allow multiple bookings simultaneously',
    gridColumn: 'span 4',
  },
  {
    name: 'requires_approval',
    label: 'Requires Approval',
    type: 'switch',
    defaultValue: false,
    description: 'Bookings require approval before confirmation',
    gridColumn: 'span 4',
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    placeholder: 'Additional notes about the room',
    gridColumn: 'span 12',
  },
];
