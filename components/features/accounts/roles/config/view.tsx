/**
 * UserRole View Field Configurations
 * 
 * Defines fields for the role detail view.
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const UserRoleViewConfig: EntityViewConfig<UserRole> = {
  fields: [
    // ===========================
    // Basic Information
    // ===========================
    {
      key: 'display_name',
      label: 'Display Name',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'name',
      label: 'Role Name',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      formatter: (value) => (value as string) || 'No description',
    },

    // ===========================
    // Status
    // ===========================
    {
      key: 'is_active',
      label: 'Status',
      // Keep custom render: status badge with icon
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

    // ===========================
    // Statistics
    // ===========================
    {
      key: 'users_count',
      label: 'Users with this role',
      type: 'number',
    },

    // ===========================
    // Metadata
    // ===========================
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
    },
  ],

  groups: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Core role details',
      fields: ['display_name', 'name', 'description'],
      collapsible: true,
      order: 1,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Role activation status',
      fields: ['is_active'],
      collapsible: true,
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
  ],

  mode: 'detail',
  showMetadata: true,

  titleField: 'display_name',
  subtitleField: 'name',
  imageField: undefined,

  actions: []
};

// Convenience exports for backward compatibility
export const roleViewFields = UserRoleViewConfig.fields;
export const roleViewGroups = UserRoleViewConfig.groups;
