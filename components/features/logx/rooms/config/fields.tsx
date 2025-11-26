/**
 * Room Form Field Definitions
 * 
 * Defines the form fields for creating and editing rooms.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Building2, Users, Clock, Settings } from 'lucide-react';

export const roomFields: FormField<Room>[] = [
  // ===========================
  // Basic Information
  // ===========================
  {
    name: 'name',
    label: 'Room Name',
    type: 'text',
    required: true,
    placeholder: 'Enter room name',
    group: 'basic',
    validation: [
      { type: 'required', message: 'Room name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
    ],
    helpText: 'Name or number of the room',
    width: '50%',
  },
  {
    name: 'code',
    label: 'Room Code',
    type: 'text',
    required: true,
    placeholder: 'Enter unique room code',
    group: 'basic',
    validation: [
      { type: 'required', message: 'Room code is required' },
    ],
    helpText: 'Unique identifier for the room',
    width: '50%',
  },
  {
    name: 'department',
    label: 'Department',
    type: 'relation',
    required: true,
    placeholder: 'Select department',
    group: 'basic',
    relationConfig: {
      entity: 'departments',
      displayField: 'name',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const q = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/departments/', q as Record<string, unknown> | undefined);
        return getListData(resp.data);
      },
      searchFields: ['name'],
    },
    width: '50%',
  },
  {
    name: 'room_type',
    label: 'Room Type',
    type: 'select',
    required: true,
    placeholder: 'Select room type',
    group: 'basic',
    options: Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    width: '50%',
  },

  // ===========================
  // Location
  // ===========================
  {
    name: 'building',
    label: 'Building',
    type: 'text',
    required: false,
    placeholder: 'Building name or identifier',
    group: 'location',
    width: '50%',
  },
  {
    name: 'floor',
    label: 'Floor',
    type: 'text',
    required: false,
    placeholder: 'Floor number or identifier',
    group: 'location',
    width: '50%',
  },

  // ===========================
  // Capacity
  // ===========================
  {
    name: 'capacity',
    label: 'Capacity',
    type: 'number',
    required: true,
    placeholder: 'Enter maximum capacity',
    group: 'capacity',
    validation: [
      { type: 'required', message: 'Capacity is required' },
      { type: 'min', message: 'Capacity must be at least 1', value: 1 },
      { type: 'max', message: 'Capacity must be at most 1000', value: 1000 },
    ],
    helpText: 'Maximum number of people the room can accommodate',
    width: '33%',
  },
  {
    name: 'allows_concurrent_bookings',
    label: 'Allow Concurrent Bookings',
    type: 'switch',
    required: false,
    group: 'capacity',
    defaultValue: false,
    helpText: 'Allow multiple bookings simultaneously',
    width: '33%',
  },
  {
    name: 'requires_approval',
    label: 'Requires Approval',
    type: 'switch',
    required: false,
    group: 'capacity',
    defaultValue: false,
    helpText: 'Bookings require approval before confirmation',
    width: '33%',
  },

  // ===========================
  // Operating Hours
  // ===========================
  {
    name: 'operating_hours_start',
    label: 'Operating Hours Start',
    type: 'time',
    required: false,
    placeholder: 'Start time',
    group: 'hours',
    width: '50%',
  },
  {
    name: 'operating_hours_end',
    label: 'Operating Hours End',
    type: 'time',
    required: false,
    placeholder: 'End time',
    group: 'hours',
    width: '50%',
  },

  // ===========================
  // Status
  // ===========================
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    required: false,
    group: 'status',
    defaultValue: true,
    helpText: 'Whether the room is available for scheduling',
    width: '50%',
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    required: false,
    placeholder: 'Additional notes about the room',
    group: 'status',
    width: '100%',
  },
];

export const RoomFormConfig: EntityFormConfig<Room> = {
  fields: roomFields,
  layout: 'tabs',
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Room identification and type',
      fields: ['name', 'code', 'department', 'room_type'],
      icon: <Building2 className="h-4 w-4" />,
      order: 1,
    },
    {
      id: 'location',
      label: 'Location',
      description: 'Building and floor information',
      fields: ['building', 'floor'],
      icon: <Building2 className="h-4 w-4" />,
      order: 2,
    },
    {
      id: 'capacity',
      label: 'Capacity & Usage',
      description: 'Room capacity and booking settings',
      fields: ['capacity', 'allows_concurrent_bookings', 'requires_approval'],
      icon: <Users className="h-4 w-4" />,
      order: 3,
    },
    {
      id: 'hours',
      label: 'Operating Hours',
      description: 'Room availability hours',
      fields: ['operating_hours_start', 'operating_hours_end'],
      icon: <Clock className="h-4 w-4" />,
      order: 4,
    },
    {
      id: 'status',
      label: 'Status & Notes',
      description: 'Active status and additional information',
      fields: ['is_active', 'notes'],
      icon: <Settings className="h-4 w-4" />,
      order: 5,
    },
  ],
  submitText: 'Save Room',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,
};
