/**
 * Room Exporter Configuration
 * 
 * Defines export fields and options for rooms.
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';

export const RoomExporterConfig: EntityExporterConfig<Room> = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'department_name', label: 'Department' },
    {
      key: 'room_type',
      label: 'Type',
      formatter: (value: unknown) => String(ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] || value || ''),
    },
    { key: 'capacity', label: 'Capacity' },
    { key: 'building', label: 'Building' },
    { key: 'floor', label: 'Floor' },
    { key: 'operating_hours_start', label: 'Operating Hours Start' },
    { key: 'operating_hours_end', label: 'Operating Hours End' },
    {
      key: 'is_active',
      label: 'Status',
      formatter: (value: unknown) => ((value as boolean) ? 'Active' : 'Inactive'),
    },
    {
      key: 'allows_concurrent_bookings',
      label: 'Concurrent Bookings',
      formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No'),
    },
    {
      key: 'requires_approval',
      label: 'Requires Approval',
      formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No'),
    },
    { key: 'notes', label: 'Notes' },
    { 
      key: 'created_at', 
      label: 'Created At',
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : '-',
    },
    { 
      key: 'updated_at', 
      label: 'Updated At',
      formatter: (value: unknown) => value ? new Date(value as string).toLocaleString() : '-',
    },
  ],

  options: {
    format: 'xlsx',
    filename: 'rooms_export',
    includeHeaders: true,
    prettyPrint: true,
    dateFormat: 'MM/DD/YYYY HH:mm:ss',
    delimiter: ',',
    sheetName: 'Rooms',
  },

  buttonLabel: 'Export Rooms',
  showFormatSelector: true,
  showFieldSelector: true,
  className: 'btn btn-primary',
  disabled: false,
};

// Legacy export for backward compatibility
export const roomExportConfig = RoomExporterConfig;
