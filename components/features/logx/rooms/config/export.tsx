/**
 * Room Export Configuration
 * Defines export fields for rooms
 */

import { ExportConfig } from '@/components/entityManager';
import { Room, ROOM_TYPE_LABELS } from '../../types';

export const roomExportConfig: ExportConfig<Room> = {
  filename: 'rooms',
  fields: [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'department_name', header: 'Department' },
    { 
      key: 'room_type', 
      header: 'Type',
      transform: (value) => ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || value,
    },
    { key: 'capacity', header: 'Capacity' },
    { key: 'building', header: 'Building' },
    { key: 'floor', header: 'Floor' },
    { key: 'operating_hours_start', header: 'Operating Hours Start' },
    { key: 'operating_hours_end', header: 'Operating Hours End' },
    { 
      key: 'is_active', 
      header: 'Status',
      transform: (value) => value ? 'Active' : 'Inactive',
    },
    { 
      key: 'allows_concurrent_bookings', 
      header: 'Concurrent Bookings',
      transform: (value) => value ? 'Yes' : 'No',
    },
    { 
      key: 'requires_approval', 
      header: 'Requires Approval',
      transform: (value) => value ? 'Yes' : 'No',
    },
    { key: 'notes', header: 'Notes' },
    { key: 'created_at', header: 'Created At' },
    { key: 'updated_at', header: 'Updated At' },
  ],
};
