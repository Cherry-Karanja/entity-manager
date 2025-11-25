/**
 * UserProfile Action Configurations
 * 
 * Defines actions available for profile management.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { UserProfile } from '../types';
import { userProfileActions as apiActions } from '../api/client';
import { entitiesToCSV, generateFilename, downloadFile } from '@/components/entityManager/components/exporter/utils';
import { ExportField } from '@/components/entityManager/components/exporter/types';
import { 
  CheckCircle, 
  XCircle, 
  Ban,
  Trash2,
  Download
} from 'lucide-react';


export const UserProfileActionsConfig: EntityActionsConfig<UserProfile> = {
  actions: [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'approve',
      label: 'Approve Profile',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (profile?: UserProfile) => profile?.status === 'pending',
      confirmMessage: (profile?: UserProfile) => 
        `Are you sure you want to approve the profile for ${profile?.user_name}?`,
      confirmText: 'Approve',
      onConfirm: async (profile?: UserProfile, context?) => {
        if (!profile || !context?.refresh) return;
        try {
          await apiActions.approve(profile.id);
          console.log('Profile approved:', profile.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to approve profile:', error);
        }
      },
    },
    {
      id: 'reject',
      label: 'Reject Profile',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (profile?: UserProfile) => profile?.status === 'pending',
      confirmMessage: (profile?: UserProfile) => 
        `Are you sure you want to reject the profile for ${profile?.user_name}?`,
      confirmText: 'Reject',
      onConfirm: async (profile?: UserProfile, context?) => {
        if (!profile || !context?.refresh) return;
        try {
          await apiActions.reject(profile.id);
          console.log('Profile rejected:', profile.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to reject profile:', error);
        }
      },
    },
    {
      id: 'suspend',
      label: 'Suspend Profile',
      icon: <Ban className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (profile?: UserProfile) => profile?.status === 'approved',
      confirmMessage: (profile?: UserProfile) => 
        `Are you sure you want to suspend the profile for ${profile?.user_name}?`,
      confirmText: 'Suspend',
      onConfirm: async (profile?: UserProfile, context?) => {
        if (!profile || !context?.refresh) return;
        try {
          await apiActions.suspend(profile.id);
          console.log('Profile suspended:', profile.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to suspend profile:', error);
        }
      },
    },

    // ===========================
    // Bulk Actions
    // ===========================
    {
      id: 'bulkApprove',
      label: 'Approve Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'primary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to approve ${count} profile(s)?`,
      handler: async (profiles: UserProfile[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk approving:', profiles.map(p => p.id));
        await context.refresh();
      },
    },
    {
      id: 'bulkReject',
      label: 'Reject Selected',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to reject ${count} profile(s)?`,
      handler: async (profiles: UserProfile[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk rejecting:', profiles.map(p => p.id));
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
        `Are you sure you want to delete ${count} profile(s)? This action cannot be undone.`,
      handler: async (profiles: UserProfile[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk API call
        console.log('Bulk deleting:', profiles.map(p => p.id));
        await context.refresh();
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportProfiles',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async (entity?: UserProfile, context?) => {
        try {
          // Get data to export - either selected items or all data
          const dataToExport: UserProfile[] = context?.selectedEntities && context.selectedEntities.length > 0
            ? context.selectedEntities as UserProfile[]
            : (context?.customData as { allData?: UserProfile[] })?.allData || [];

          if (dataToExport.length === 0) {
            console.warn('No data to export');
            return;
          }

          // Define export fields
          const exportFields: ExportField<UserProfile>[] = [
            { key: 'id', label: 'ID' },
            { key: 'user_email', label: 'Email' },
            { key: 'user_name', label: 'Name' },
            { key: 'bio', label: 'Bio' },
            { key: 'phone_number', label: 'Phone' },
            { key: 'department', label: 'Department' },
            { key: 'job_title', label: 'Job Title' },
            { key: 'status', label: 'Status' },
            { key: 'created_at', label: 'Created At' },
            { key: 'updated_at', label: 'Updated At' },
          ];

          // Export to CSV
          const csvContent = entitiesToCSV(
            dataToExport,
            exportFields,
            {
              format: 'csv',
              filename: 'profiles',
              includeHeaders: true,
              delimiter: ',',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            }
          );

          // Generate filename with timestamp
          const filename = generateFilename(
            context?.selectedEntities && context.selectedEntities.length > 0
              ? `profiles_selected_${context.selectedEntities.length}`
              : 'profiles_all',
            'csv'
          );

          // Download file
          downloadFile(csvContent, filename, 'text/csv');

          console.log(`Exported ${dataToExport.length} profiles to ${filename}`);
        } catch (error) {
          console.error('Failed to export profiles:', error);
        }
      },
    },
  ],
  mode: 'dropdown',
  className: '',
  onActionStart: undefined
};
