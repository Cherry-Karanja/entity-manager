/**
 * Room List Column Configurations
 * 
 * Defines columns for the room list view.
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Room, ROOM_TYPE_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { RoomActionsConfig } from './actions';

export const RoomListConfig: EntityListConfig<Room> = {
  columns: [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '10%',
      type: 'text',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '18%',
      type: 'text',
    },
    {
      key: 'department_name',
      label: 'Department',
      sortable: true,
      filterable: true,
      width: '15%',
      type: 'text',
      formatter: (value, entity) => (value as string) || `Department ${entity?.department}`,
    },
    {
      key: 'room_type',
      label: 'Type',
      sortable: true,
      filterable: true,
      width: '12%',
      render: (value) => (
        <Badge variant="outline">
          {String(ROOM_TYPE_LABELS[value as keyof typeof ROOM_TYPE_LABELS] ?? value)}
        </Badge>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      width: '10%',
      align: 'center',
      type: 'number',
      formatter: (value) => `${value} people`,
    },
    {
      key: 'building',
      label: 'Location',
      width: '15%',
      render: (value, entity) => {
        const parts: string[] = [];
        if (entity?.building) parts.push(entity.building);
        if (entity?.floor) parts.push(`Floor ${entity.floor}`);
        return parts.length > 0 ? parts.join(', ') : '-';
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={(value as boolean) ? 'default' : 'secondary'} className={(value as boolean) ? 'bg-green-600' : ''}>
          {(value as boolean) ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {(value as boolean) ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ],

  view: 'table',

  toolbar: {
    search: true,
    filters: true,
    viewSwitcher: true,
    columnSelector: true,
    refresh: true,
    export: true,
  },

  selectable: true,
  multiSelect: true,

  pagination: true,
  paginationConfig: {
    page: 1,
    pageSize: 10,
  },

  sortable: true,
  sortConfig: { field: 'name', direction: 'asc' },

  filterable: true,
  filterConfigs: [
    { field: 'is_active', operator: 'equals', value: true },
    { field: 'room_type', operator: 'in', value: [] },
    { field: 'department', operator: 'in', value: [] },
  ],

  searchable: true,
  searchPlaceholder: 'Search rooms...',

  emptyMessage: 'No rooms found.',

  actions: RoomActionsConfig as any,

  hover: true,
  striped: true,
  bordered: true,

  titleField: 'name',
  subtitleField: 'code',
};

// Legacy exports for backward compatibility
export const roomColumns = RoomListConfig.columns;
export const roomListConfig = RoomListConfig;
