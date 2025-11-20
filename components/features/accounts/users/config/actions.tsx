/**
 * User Action Configurations
 * 
 * Defines actions available for user management.
 * These are placeholder actions - implement actual API calls as needed.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { User } from '../../types';
import { userActions as apiActions } from '../api/client';
import { entitiesToCSV, generateFilename, downloadFile } from '@/components/entityManager/components/exporter/utils';
import { ExportField } from '@/components/entityManager/components/exporter/types';
import { 
  CheckCircle, 
  XCircle, 
  Unlock, 
  Key, 
  UserCog,
  Mail,
  Trash2,
  Download
} from 'lucide-react';


export const UserActionsConfig: EntityActionsConfig<User> = {
  actions:
  [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'approve',
      label: 'Approve User',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (user?: User) => !user?.is_approved,
      confirmMessage: (user?: User) => 
        `Are you sure you want to approve ${user?.email}?`,
      confirmText: 'Approve',
      onConfirm: async (user?: User, context?) => {
        if (!user || !context?.refresh) return;
        try {
          await apiActions.approve(user.id);
          console.log('User approved:', user.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to approve user:', error);
        }
      },
    },
    {
      id: 'reject',
      label: 'Reject User',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (user?: User) => user?.is_approved === true,
      confirmMessage: (user?: User) => 
        `Are you sure you want to reject ${user?.email}?`,
      confirmText: 'Reject',
      onConfirm: async (user?: User, context?) => {
        if (!user || !context?.refresh) return;
        // TODO: Implement API call
        console.log('Rejecting user:', user.id);
        await context.refresh();
      },
    },
    {
      id: 'activate',
      label: 'Activate User',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (user?: User) => !user?.is_active,
      confirmMessage: 'Are you sure you want to activate this user?',
      confirmText: 'Activate',
      onConfirm: async (user?: User, context?) => {
        if (!user || !context?.refresh) return;
        // TODO: Implement API call
        console.log('Activating user:', user.id);
        await context.refresh();
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate User',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (user?: User) => user?.is_active === true,
      confirmMessage: 'Are you sure you want to deactivate this user?',
      confirmText: 'Deactivate',
      onConfirm: async (user?: User, context?) => {
        if (!user || !context?.refresh) return;
        // TODO: Implement API call
        console.log('Deactivating user:', user.id);
        await context.refresh();
      },
    },
    {
      id: 'unlock',
      label: 'Unlock Account',
      icon: <Unlock className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'primary',
      position: 'row',
      visible: (user?: User) => !!user?.account_locked_until,
      handler: async (user?: User, context?) => {
        if (!user || !context?.refresh) return;
        try {
          await apiActions.unlockAccount(user.id);
          console.log('Account unlocked:', user.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to unlock account:', error);
        }
      },
    },
    {
      id: 'resetPassword',
      label: 'Reset Password',
      icon: <Key className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'outline',
      position: 'row',
      confirmMessage: (user?: User) => 
        `Send password reset email to ${user?.email}?`,
      confirmText: 'Send Reset Email',
      onConfirm: async (user?: User) => {
        if (!user) return;
        try {
          await apiActions.resetPassword(user.id);
          console.log('Password reset sent to:', user.email);
        } catch (error) {
          console.error('Failed to send password reset:', error);
        }
      },
    },
    {
      id: 'changeRole',
      label: 'Change Role',
      icon: <UserCog className="h-4 w-4" />,
      actionType: 'form',
      variant: 'primary',
      position: 'row',
      formTitle: 'Change User Role',
      fields: [
        {
          name: 'role',
          label: 'New Role',
          type: 'select',
          required: true,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Staff', value: 'staff' },
            { label: 'User', value: 'user' },
          ],
        },
      ],
      onSubmit: async (values, user?: User, context?) => {
        if (!user || !context?.refresh) return;
        try {
          await apiActions.changeRole(user.id, values.role as string);
          console.log('Role changed for user:', user.id, 'to:', values.role);
          await context.refresh();
        } catch (error) {
          console.error('Failed to change role:', error);
        }
      },
    },
    {
      id: 'sendEmail',
      label: 'Send Email',
      icon: <Mail className="h-4 w-4" />,
      actionType: 'form',
      variant: 'secondary',
      position: 'row',
      formTitle: 'Send Email to User',
      fields: [
        {
          name: 'subject',
          label: 'Subject',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
        },
      ],
      onSubmit: async (values, user?: User) => {
        if (!user) return;
        // TODO: Implement API call
        console.log('Sending email to:', user.email, values);
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
        `Are you sure you want to activate ${count} user(s)?`,
      handler: async (users: User[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk activating:', users.map(u => u.id));
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
        `Are you sure you want to deactivate ${count} user(s)?`,
      handler: async (users: User[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk deactivating:', users.map(u => u.id));
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
        `Are you sure you want to delete ${count} user(s)? This action cannot be undone.`,
      handler: async (users: User[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk deleting:', users.map(u => u.id));
        await context.refresh();
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportUsers',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async (entity?: User, context?) => {
        try {
          // Get data to export - either selected items or all data
          const dataToExport: User[] = context?.selectedEntities && context.selectedEntities.length > 0
            ? context.selectedEntities as User[]
            : (context?.customData as any)?.allData || [];

          if (dataToExport.length === 0) {
            console.warn('No data to export');
            return;
          }

          // Define export fields
          const exportFields: ExportField<User>[] = [
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'username', label: 'Username' },
            { key: 'full_name', label: 'Full Name' },
            { key: 'role_display', label: 'Role' },
            { key: 'department', label: 'Department' },
            { key: 'is_active', label: 'Active' },
            { key: 'is_verified', label: 'Verified' },
            { key: 'is_approved', label: 'Approved' },
            { key: 'created_at', label: 'Created At' },
            { key: 'last_login', label: 'Last Login' },
          ];

          // Export to CSV
          const csvContent = entitiesToCSV(
            dataToExport,
            exportFields,
            {
              format: 'csv',
              filename: 'users',
              includeHeaders: true,
              delimiter: ',',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            }
          );

          // Generate filename with timestamp
          const filename = generateFilename(
            context?.selectedEntities && context.selectedEntities.length > 0
              ? `users_selected_${context.selectedEntities.length}`
              : 'users_all',
            'csv'
          );

          // Download file
          downloadFile(csvContent, filename, 'text/csv');

          console.log(`Exported ${dataToExport.length} users to ${filename}`);
        } catch (error) {
          console.error('Failed to export users:', error);
        }
      },
    },
  ],
  mode: 'dropdown',
  className: '',
  onActionStart: undefined

};
