/**
 * UserRole List Column Configurations
 * 
 * Defines columns for the role list view.
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { UserRoleActionsConfig } from './actions';

export const UserRoleListConfig: EntityListConfig<UserRole> = {
  /** Column definitions */
  columns: [
    {
      key: 'display_name',
      label: 'Role Name',
      sortable: true,
      width: '25%',
      // Keep custom render: composite display (display_name + name)
      render: (value, entity) => {
        const role = entity as UserRole;
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">{value as string}</div>
              <div className="text-xs text-muted-foreground">{role.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      width: '35%',
      type: 'text',
      formatter: (value) => (value as string) || 'No description',
    },
    {
      key: 'users_count',
      label: 'Users',
      sortable: true,
      width: '10%',
      // Keep custom render: badge display
      render: (value) => (
        <Badge variant="secondary">
          {(value as number) || 0} users
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '15%',
      type: 'boolean',
      // Keep custom render: status badge with icon
      render: (value) => (
        value ? (
          <Badge variant="default" className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      width: '15%',
      type: 'date',
    },
  ],

  /** View mode */
  view: 'table',

  /** Toolbar configuration */
  toolbar: {
    search: true,
    filters: true,
    viewSwitcher: true,
    columnSelector: true,
    refresh: true,
    export: true,
    actions: [],
  },

  selectable: true,
  multiSelect: true,

  pagination: true,
  paginationConfig: {
    page: 1,
    pageSize: 10,
  },

  sortable: true,
  sortConfig: { field: 'display_name', direction: 'asc' },

  filterable: true,
  filterConfigs: [
    { field: 'is_active', operator: 'equals', value: true },
  ],

  searchable: true,
  searchPlaceholder: 'Search roles...',

  emptyMessage: 'No roles found.',

  actions: {
    ...UserRoleActionsConfig,
    context: {
      refresh: undefined, // Will be provided by EntityManager
      customData: undefined,
    },
  },

  className: '',

  hover: true,

  striped: true,
  bordered: true,

  titleField: 'display_name',
  subtitleField: 'name',
  imageField: undefined,
  dateField: 'created_at',
};
