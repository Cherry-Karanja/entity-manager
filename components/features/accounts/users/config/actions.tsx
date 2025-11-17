/**
 * User Action Configurations
 * 
 * Defines actions available for user management.
 * These are placeholder actions - implement actual API calls as needed.
 */

import { Action } from '@/components/entityManager';
import { User } from '../../types';
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

export const userActions: Action<User>[] = [
  // ===========================
  // Single Item Actions
  // ===========================
  {
    id: 'approve',
    label: 'Approve User',
    icon: <CheckCircle className="h-4 w-4" />,
    actionType: 'confirm',
    variant: 'success',
    position: 'row',
    visible: (user?: User) => !user?.is_approved,
    confirmMessage: (user?: User) => 
      `Are you sure you want to approve ${user?.email}?`,
    confirmText: 'Approve',
    onConfirm: async (user?: User, context?) => {
      if (!user || !context?.refresh) return;
      // TODO: Implement API call
      console.log('Approving user:', user.id);
      await context.refresh();
    },
  },
  {
    id: 'reject',
    label: 'Reject User',
    icon: <XCircle className="h-4 w-4" />,
    actionType: 'confirm',
    variant: 'danger',
    position: 'row',
    visible: (user?: User) => !user?.is_rejected,
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
    variant: 'success',
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
    variant: 'danger',
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
      // TODO: Implement API call
      console.log('Unlocking account:', user.id);
      await context.refresh();
    },
  },
  {
    id: 'resetPassword',
    label: 'Reset Password',
    icon: <Key className="h-4 w-4" />,
    actionType: 'confirm',
    variant: 'warning',
    position: 'row',
    confirmMessage: (user?: User) => 
      `Send password reset email to ${user?.email}?`,
    confirmText: 'Send Reset Email',
    onConfirm: async (user?: User) => {
      if (!user) return;
      // TODO: Implement API call
      console.log('Sending password reset for:', user.email);
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
      // TODO: Implement API call
      console.log('Changing role for user:', user.id, 'to:', values.role);
      await context.refresh();
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
    variant: 'success',
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
    variant: 'danger',
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
    variant: 'danger',
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
    label: 'Export All',
    icon: <Download className="h-4 w-4" />,
    actionType: 'download',
    variant: 'secondary',
    position: 'toolbar',
    handler: async () => {
      // TODO: Implement export
      console.log('Exporting users');
    },
  },
];
