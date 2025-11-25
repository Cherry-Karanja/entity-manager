/**
 * Timetable Actions Configuration
 * Defines actions available for timetables
 */

import { ActionConfig } from '@/components/entityManager';
import { Timetable } from '../../types';
import { timetablesClient, timetableActions } from '../api/client';
import { Edit, Trash2, Eye, Power, PowerOff, RefreshCw, BarChart3 } from 'lucide-react';

export const timetableActionsConfig: ActionConfig<Timetable> = {
  row: [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      actionType: 'navigation',
      href: (timetable) => `/dashboard/timetables/${timetable.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      actionType: 'navigation',
      href: (timetable) => `/dashboard/timetables/${timetable.id}/edit`,
    },
    {
      id: 'regenerate',
      label: 'Regenerate',
      icon: RefreshCw,
      actionType: 'confirm',
      confirmTitle: 'Regenerate Timetable',
      confirmMessage: (timetable) => 
        `Are you sure you want to regenerate "${timetable.name}"? This will create new schedules based on current enrollments and constraints.`,
      onConfirm: async (timetable) => {
        await timetableActions.regenerateTimetable(timetable.id, { use_optimization: true });
      },
    },
    {
      id: 'toggle-active',
      label: (timetable) => timetable.is_active ? 'Deactivate' : 'Activate',
      icon: (timetable) => timetable.is_active ? PowerOff : Power,
      actionType: 'confirm',
      confirmTitle: (timetable) => timetable.is_active ? 'Deactivate Timetable' : 'Activate Timetable',
      confirmMessage: (timetable) => 
        timetable.is_active 
          ? `Are you sure you want to deactivate "${timetable.name}"?`
          : `Are you sure you want to activate "${timetable.name}"? Other active timetables for this term may be affected.`,
      onConfirm: async (timetable) => {
        await timetablesClient.update(timetable.id, { is_active: !timetable.is_active } as Partial<Timetable>);
      },
      variant: (timetable) => timetable.is_active ? 'destructive' : 'default',
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      actionType: 'confirm',
      confirmTitle: 'Delete Timetable',
      confirmMessage: (timetable) => `Are you sure you want to delete "${timetable.name}"? This will also delete all associated schedules and cannot be undone.`,
      onConfirm: async (timetable) => {
        await timetablesClient.delete(timetable.id);
      },
      variant: 'destructive',
    },
  ],
  bulk: [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: Trash2,
      actionType: 'bulk',
      onBulkAction: async (timetables) => {
        await Promise.all(timetables.map(t => timetablesClient.delete(t.id)));
      },
      variant: 'destructive',
      requireConfirm: true,
      confirmMessage: (timetables) => `Are you sure you want to delete ${timetables.length} timetables? This action cannot be undone.`,
    },
  ],
};
