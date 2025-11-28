/**
 * Timetable Action Configurations
 * 
 * Defines actions available for timetable management.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../../types';
import { timetablesApiClient, timetableActions as apiActions } from '../api/client';
import { 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';

export const TimetableActionsConfig: EntityActionsConfig<Timetable> = {
  actions: [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'view',
      label: 'View Schedule',
      icon: <Eye className="h-4 w-4" />,
      actionType: 'navigation',
      position: 'row',
      variant: 'default',
      url: (timetable?: Timetable) => `/dashboard/timetables/${timetable!.id}/viewer`,
      visible: (timetable?: Timetable) => timetable?.generation_status === 'completed',
    },
    {
      id: 'edit',
      label: 'Edit Details',
      icon: <Edit className="h-4 w-4" />,
      actionType: 'navigation',
      position: 'row',
      variant: 'outline',
      url: (timetable?: Timetable) => `/dashboard/timetables/${timetable!.id}`,
    },
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (timetable?: Timetable) => !timetable?.is_active,
      confirmMessage: (timetable?: Timetable) =>
        `Are you sure you want to activate "${timetable?.name}"?`,
      confirmText: 'Activate',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable || !context?.refresh) return;
        try {
          await timetablesApiClient.update(timetable.id, { is_active: true });
          await context.refresh();
        } catch (error) {
          console.error('Failed to activate timetable:', error);
        }
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (timetable?: Timetable) => timetable?.is_active === true,
      confirmMessage: (timetable?: Timetable) =>
        `Are you sure you want to deactivate "${timetable?.name}"?`,
      confirmText: 'Deactivate',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable || !context?.refresh) return;
        try {
          await timetablesApiClient.update(timetable.id, { is_active: false });
          await context.refresh();
        } catch (error) {
          console.error('Failed to deactivate timetable:', error);
        }
      },
    },
    {
      id: 'regenerate',
      label: 'Generate',
      icon: <RefreshCw className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'outline',
      position: 'row',
      visible: (timetable?: Timetable) => timetable?.generation_status !== 'in_progress',
      confirmMessage: (timetable?: Timetable) =>
        `Are you sure you want to ${timetable?.generation_status === 'completed' ? 'regenerate' : 'generate'} "${timetable?.name}"? This will create new schedules based on current enrollments and constraints.`,
      confirmText: timetable => timetable?.generation_status === 'completed' ? 'Regenerate' : 'Generate',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await apiActions.regenerateTimetable(timetable.id as number, { use_optimization: true });
          // Show toast notification
          if (typeof window !== 'undefined') {
            const toast = (window as any).toast;
            if (toast) {
              toast.loading('Generating timetable...', { id: `gen-${timetable.id}` });
            }
          }
          if (context?.refresh) {
            await context.refresh();
          }
        } catch (error) {
          console.error('Failed to regenerate timetable:', error);
          if (typeof window !== 'undefined') {
            const toast = (window as any).toast;
            if (toast) {
              toast.error('Failed to start generation', { id: `gen-${timetable.id}` });
            }
          }
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (timetable?: Timetable) => 
        `Are you sure you want to delete "${timetable?.name}"? This will also delete all associated schedules and cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable || !context?.refresh) return;
        try {
          await timetablesApiClient.delete(timetable.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to delete timetable:', error);
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
        `Are you sure you want to activate ${count} timetable(s)?`,
      handler: async (timetables: Timetable[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            timetables.map(t => timetablesApiClient.update(t.id, { is_active: true }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk activate:', error);
        }
      },
    },
    {
      id: 'bulkDeactivate',
      label: 'Deactivate Selected',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to deactivate ${count} timetable(s)?`,
      handler: async (timetables: Timetable[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            timetables.map(t => timetablesApiClient.update(t.id, { is_active: false }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk deactivate:', error);
        }
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
        `Are you sure you want to delete ${count} timetable(s)? This action cannot be undone.`,
      handler: async (timetables: Timetable[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(timetables.map(t => timetablesApiClient.delete(t.id)));
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk delete:', error);
        }
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportTimetables',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async () => {
        console.log('Exporting timetables');
        // Export handled by EntityManager exporter
      },
    },
  ],
  mode: 'dropdown',
  className: '',
};

// Legacy export for backward compatibility
export const timetableActionsConfig = TimetableActionsConfig;
