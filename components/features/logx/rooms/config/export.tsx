/**
 * Room Export Configuration
 * Defines export fields for rooms
 */

import type { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';

export const roomExportConfig: EntityExporterConfig<Room> = {
  options: {
    format: 'csv',
    filename: 'rooms',
    includeHeaders: true,
  },
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'department_name', label: 'Department' },
    {
      key: 'room_type',
      label: 'Type',
      formatter: (value: unknown) => ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || String(value),
    },
    { key: 'capacity', label: 'Capacity' },
    { key: 'building', label: 'Building' },
    { key: 'floor', label: 'Floor' },
    { key: 'operating_hours_start', label: 'Operating Hours Start' },
    { key: 'operating_hours_end', label: 'Operating Hours End' },
    {
      key: 'is_active',
      label: 'Status',
      formatter: (value: unknown) => (value ? 'Active' : 'Inactive'),
    },
    {
      key: 'allows_concurrent_bookings',
      label: 'Concurrent Bookings',
      formatter: (value: unknown) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'requires_approval',
      label: 'Requires Approval',
      formatter: (value: unknown) => (value ? 'Yes' : 'No'),
    },
    { key: 'notes', label: 'Notes' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ],
};
