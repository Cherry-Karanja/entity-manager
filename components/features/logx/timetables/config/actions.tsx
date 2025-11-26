/**
 * Timetable Actions Configuration
 * Defines actions available for timetables
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../../types';
import { timetablesClient, timetableActions } from '../api/client';
import { Edit, Trash2, Eye, Power, PowerOff, RefreshCw } from 'lucide-react';

export const timetableActionsConfig: EntityActionsConfig<Timetable> = {
  actions: [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      actionType: 'navigation',
      position: 'row',
      url: (timetable?: Timetable) => `/dashboard/timetables/${timetable!.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      actionType: 'navigation',
      position: 'row',
      url: (timetable?: Timetable) => `/dashboard/timetables/${timetable!.id}/edit`,
    },
    {
      id: 'regenerate',
      label: 'Regenerate',
      icon: RefreshCw,
      actionType: 'confirm',
      position: 'row',
      confirmTitle: 'Regenerate Timetable',
      confirmMessage: (timetable?: Timetable) =>
        `Are you sure you want to regenerate "${timetable!.name}"? This will create new schedules based on current enrollments and constraints.`,
      onConfirm: async (timetable?: Timetable) => {
        await timetableActions.regenerateTimetable(timetable!.id as number, { use_optimization: true });
      },
    },
    {
      id: 'toggle-active',
      label: 'Toggle Active',
      icon: Power,
      actionType: 'confirm',
      position: 'row',
      confirmTitle: 'Toggle Timetable Active State',
      confirmMessage: (timetable?: Timetable) =>
        `Are you sure you want to toggle active state for "${timetable!.name}"?`,
      onConfirm: async (timetable?: Timetable) => {
        await timetablesClient.update(timetable!.id, { is_active: !timetable!.is_active } as Partial<Timetable>);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      actionType: 'confirm',
      position: 'row',
      confirmTitle: 'Delete Timetable',
      confirmMessage: (timetable?: Timetable) => `Are you sure you want to delete "${timetable!.name}"? This will also delete all associated schedules and cannot be undone.`,
      onConfirm: async (timetable?: Timetable) => {
        await timetablesClient.delete(timetable!.id);
      },
      variant: 'destructive',
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: Trash2,
      actionType: 'bulk',
      position: 'toolbar',
      handler: async (timetables: Timetable[]) => {
        await Promise.all(timetables.map((t: Timetable) => timetablesClient.delete(t.id)));
      },
      variant: 'destructive',
      requireConfirm: true,
      confirmMessage: (timetables?: Timetable[]) => `Are you sure you want to delete ${timetables?.length ?? 0} timetables? This action cannot be undone.`,
    },
  ],
};
