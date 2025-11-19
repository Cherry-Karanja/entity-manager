/**
 * UserRole List Configuration
 * 
 * Defines columns and settings for the role list view.
 */

import { Column } from '@/components/entityManager/components/list/types';
import { UserRole } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

export const roleColumns: Column<UserRole>[] = [
  {
    key: 'display_name',
    label: 'Role Name',
    sortable: true,
    width: '25%',
    render: (_value, role) => (
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <div>
          <div className="font-medium">{role.display_name}</div>
          <div className="text-xs text-muted-foreground">{role.name}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'description',
    label: 'Description',
    sortable: false,
    width: '35%',
    render: (_value, role) => (
      <span className="text-sm text-muted-foreground line-clamp-2">
        {role.description || 'No description'}
      </span>
    ),
  },
  {
    key: 'users_count',
    label: 'Users',
    sortable: true,
    width: '10%',
    render: (_value, role) => (
      <Badge variant="secondary">
        {role.users_count || 0} users
      </Badge>
    ),
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    filterable: true,
    width: '15%',
    render: (_value, role) => (
      role.is_active ? (
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
    type: 'date',
    width: '15%',
  },
];

export const roleListConfig = {
  defaultView: 'table' as const,
  defaultPageSize: 20,
  enableSearch: true,
  enableFilters: true,
  enableExport: true,
  enableBulkActions: true,
};
