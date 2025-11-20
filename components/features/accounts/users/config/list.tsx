/**
 * User List Column Configurations
 * 
 * Defines columns for the user list view.
 */

import { Column } from '@/components/entityManager/components/list/types';
import { User } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Shield, Lock } from 'lucide-react';

export const userColumns: Column<User>[] = [
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    width: '18%',
    // Keep custom render: composite display (email + username)
    render: (value, entity) => {
      const user = entity as User;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{value as string}</span>
          {user?.username && (
            <span className="text-xs text-muted-foreground">@{user.username}</span>
          )}
        </div>
      );
    },
  },
  {
    key: 'full_name',
    label: 'Name',
    sortable: true,
    width: '15%',
    // Keep custom render: conditional icons based on user roles
    render: (value, entity) => {
      const user = entity as User;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value as string}</span>
          {user?.is_superuser && <Shield className="h-3 w-3 text-purple-600" />}
          {user?.is_staff && <Shield className="h-3 w-3 text-blue-600" />}
        </div>
      );
    },
  },
  {
    key: 'role_display',
    label: 'Role',
    sortable: true,
    filterable: true,
    width: '12%',
    type: 'text',
    formatter: (value) => (value as string) || 'No Role',
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    filterable: true,
    width: '12%',
    type: 'text',
    formatter: (value) => (value as string) || '-',
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    filterable: true,
    width: '15%',
    type: 'boolean',
    // Keep custom render: complex multi-badge status display
    render: (value, entity) => {
      const user = entity as User;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {value ? (
              <Badge variant="default" className="text-xs bg-green-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {!user?.is_approved && (
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
            {user?.account_locked_until && new Date(user.account_locked_until) > new Date() && (
              <Badge variant="destructive" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: 'is_verified',
    label: 'Verified',
    sortable: true,
    filterable: true,
    width: '8%',
    align: 'center',
    type: 'boolean',
  },
  {
    key: 'last_login',
    label: 'Last Login',
    sortable: true,
    width: '10%',
    type: 'date',
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    width: '10%',
    type: 'date',
  },

];
