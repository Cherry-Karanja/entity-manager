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
    width: '20%',
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{u.email}</span>
          {u.employee_id && (
            <span className="text-xs text-muted-foreground">ID: {u.employee_id}</span>
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
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{u.full_name}</span>
          {u.is_superuser && <Shield className="h-3 w-3 text-purple-600" />}
          {u.is_staff && <Shield className="h-3 w-3 text-blue-600" />}
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
    render: (user) => {
      const u = user as User;
      return (
        <Badge variant="outline">
          {u.role_display || 'No Role'}
        </Badge>
      );
    },
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    filterable: true,
    width: '12%',
    render: (user) => {
      const u = user as User;
      return (
        <span className="text-sm">
          {u.department || '-'}
        </span>
      );
    },
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    filterable: true,
    width: '15%',
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {u.is_active ? (
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
            {!u.is_approved && (
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
            {u.account_locked_until && new Date(u.account_locked_until) > new Date() && (
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
    render: (user) => {
      const u = user as User;
      return u.is_verified ? (
        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
      );
    },
  },
  {
    key: 'last_login',
    label: 'Last Login',
    sortable: true,
    width: '10%',
    render: (user) => {
      const u = user as User;
      return (
        <span className="text-sm text-muted-foreground">
          {u.last_login 
            ? new Date(u.last_login).toLocaleDateString() 
            : 'Never'}
        </span>
      );
    },
  },
  {
    key: 'date_joined',
    label: 'Joined',
    sortable: true,
    width: '10%',
    render: (user) => {
      const u = user as User;
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(u.date_joined).toLocaleDateString()}
        </span>
      );
    },
  },
];
