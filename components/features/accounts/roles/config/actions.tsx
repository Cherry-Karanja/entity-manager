/**
 * UserRole Action Configurations
 * 
 * Defines actions available for role management.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { userRoleActions as apiActions } from '../api/client';
import { entitiesToCSV, generateFilename, downloadFile } from '@/components/entityManager/components/exporter/utils';
import { ExportField } from '@/components/entityManager/components/exporter/types';
import { 
  CheckCircle, 
  XCircle, 
  Users,
  Trash2,
  Download
} from 'lucide-react';


export const UserRoleActionsConfig: EntityActionsConfig<UserRole> = {
  actions: [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'activate',
      label: 'Activate Role',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (role?: UserRole) => !role?.is_active,
      confirmMessage: (role?: UserRole) => 
        `Are you sure you want to activate the role "${role?.display_name}"?`,
      confirmText: 'Activate',
      onConfirm: async (role?: UserRole, context?) => {
        if (!role || !context?.refresh) return;
        // TODO: Implement API call for activate
        console.log('Activating role:', role.id);
        await context.refresh();
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate Role',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (role?: UserRole) => role?.is_active === true,
      confirmMessage: (role?: UserRole) => 
        `Are you sure you want to deactivate the role "${role?.display_name}"? Users with this role may lose access.`,
      confirmText: 'Deactivate',
      onConfirm: async (role?: UserRole, context?) => {
        if (!role || !context?.refresh) return;
        // TODO: Implement API call for deactivate
        console.log('Deactivating role:', role.id);
        await context.refresh();
      },
    },
    {
      id: 'viewUsers',
      label: 'View Users',
      icon: <Users className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'outline',
      position: 'row',
      handler: async (role?: UserRole) => {
        if (!role) return;
        try {
          const users = await apiActions.getUsers(role.id);
          console.log('Users with role:', users);
          // TODO: Navigate to users list filtered by role or show modal
        } catch (error) {
          console.error('Failed to get users for role:', error);
        }
      },
    },

    // ===========================
    // Bulk Actions
    // ===========================
    {
      id: 'bulkActivate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'primary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to activate ${count} role(s)?`,
      handler: async (roles: UserRole[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk activating:', roles.map(r => r.id));
        await context.refresh();
      },
    },
    {
      id: 'bulkDeactivate',
      label: 'Deactivate Selected',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to deactivate ${count} role(s)?`,
      handler: async (roles: UserRole[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk deactivating:', roles.map(r => r.id));
        await context.refresh();
      },
    },
    {
      id: 'bulkDelete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to delete ${count} role(s)? This action cannot be undone.`,
      handler: async (roles: UserRole[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk deleting:', roles.map(r => r.id));
        await context.refresh();
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportRoles',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async (entity?: UserRole, context?) => {
        try {
          // Get data to export - either selected items or all data
          const dataToExport: UserRole[] = context?.selectedEntities && context.selectedEntities.length > 0
            ? context.selectedEntities as UserRole[]
            : (context?.customData as { allData?: UserRole[] })?.allData || [];

          if (dataToExport.length === 0) {
            console.warn('No data to export');
            return;
          }

          // Define export fields
          const exportFields: ExportField<UserRole>[] = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Role Name' },
            { key: 'display_name', label: 'Display Name' },
            { key: 'description', label: 'Description' },
            { key: 'is_active', label: 'Active' },
            { key: 'users_count', label: 'Users Count' },
            { key: 'created_at', label: 'Created At' },
            { key: 'updated_at', label: 'Updated At' },
          ];

          // Export to CSV
          const csvContent = entitiesToCSV(
            dataToExport,
            exportFields,
            {
              format: 'csv',
              filename: 'roles',
              includeHeaders: true,
              delimiter: ',',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            }
          );

          // Generate filename with timestamp
          const filename = generateFilename(
            context?.selectedEntities && context.selectedEntities.length > 0
              ? `roles_selected_${context.selectedEntities.length}`
              : 'roles_all',
            'csv'
          );

          // Download file
          downloadFile(csvContent, filename, 'text/csv');

          console.log(`Exported ${dataToExport.length} roles to ${filename}`);
        } catch (error) {
          console.error('Failed to export roles:', error);
        }
      },
    },
  ],
  mode: 'dropdown',
  className: '',
  onActionStart: undefined
};
