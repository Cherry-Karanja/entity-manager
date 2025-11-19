/**
 * UserRole View Configuration
 * 
 * Defines fields for the role detail view.
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { UserRole } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const roleViewFields: ViewField<UserRole>[] = [
  {
    key: 'display_name',
    label: 'Display Name',
    group: 'basic',
    type: 'text',
    copyable: true,
  },
  {
    key: 'name',
    label: 'Role Name',
    group: 'basic',
    type: 'text',
    copyable: true,
  },
  {
    key: 'description',
    label: 'Description',
    group: 'basic',
    type: 'text',
  },
  {
    key: 'is_active',
    label: 'Status',
    group: 'status',
    render: (role) => {
      const r = role as UserRole;
      return r.is_active ? (
        <Badge variant="default" className="bg-green-600 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    },
  },
  {
    key: 'users_count',
    label: 'Users with this role',
    group: 'statistics',
    type: 'number',
  },
  {
    key: 'created_at',
    label: 'Created At',
    group: 'metadata',
    type: 'date',
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    group: 'metadata',
    type: 'date',
  },
];

export const roleViewGroups = [
  {
    id: 'basic',
    label: 'Basic Information',
    description: 'Core role details',
    fields: ['display_name', 'name', 'description'],
    collapsible: false,
    order: 1,
  },
  {
    id: 'status',
    label: 'Status',
    description: 'Role activation status',
    fields: ['is_active'],
    collapsible: false,
    order: 2,
  },
  {
    id: 'statistics',
    label: 'Statistics',
    description: 'Usage statistics',
    fields: ['users_count'],
    collapsible: true,
    order: 3,
  },
  {
    id: 'metadata',
    label: 'Metadata',
    description: 'Creation and modification information',
    fields: ['created_at', 'updated_at'],
    collapsible: true,
    order: 4,
  },
];
