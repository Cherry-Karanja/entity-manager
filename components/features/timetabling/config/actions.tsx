/**
 * Timetable Actions Configuration
 * 
 * Defines all actions available for timetable management.
 * Integrates with the backend timetable generation service using Google OR-Tools.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../types';
import { timetableActions } from '../api/client';
import { entitiesToCSV, generateFilename, downloadFile } from '@/components/entityManager/components/exporter/utils';
import { ExportField } from '@/components/entityManager/components/exporter/types';
import {
  Play,
  RefreshCw,
  Send,
  Archive,
  Copy,
  XCircle,
  CheckCircle,
  Download,
  Trash2,
  FileText,
  AlertTriangle,
  Eye
} from 'lucide-react';

export const TimetableActionsConfig: EntityActionsConfig<Timetable> = {
  actions: [
    // ===========================
    // Generation Actions
    // ===========================
    {
      id: 'generate',
      label: 'Generate Timetable',
      icon: <Play className="h-4 w-4" />,
      actionType: 'form',
      variant: 'primary',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'draft' || timetable?.status === 'generated',
      formTitle: 'Generate Timetable',
      fields: [
        {
          name: 'algorithm',
          label: 'Algorithm',
          type: 'select',
          required: true,
          options: [
            { label: 'OR-Tools (Recommended)', value: 'or_tools' },
            { label: 'Constraint Programming', value: 'constraint_programming' },
            { label: 'Genetic Algorithm', value: 'genetic' },
            { label: 'Simulated Annealing', value: 'simulated_annealing' },
          ],
          defaultValue: 'or_tools',
        },
        {
          name: 'time_limit_seconds',
          label: 'Time Limit (seconds)',
          type: 'number',
          required: true,
          defaultValue: 300,
          helpText: 'Maximum time for the solver to run',
        },
        {
          name: 'respect_locked_entries',
          label: 'Respect Locked Entries',
          type: 'checkbox',
          defaultValue: true,
          helpText: 'Keep manually locked schedule entries unchanged',
        },
        {
          name: 'allow_partial_solution',
          label: 'Allow Partial Solution',
          type: 'checkbox',
          defaultValue: true,
          helpText: 'Accept best solution even if not all constraints are satisfied',
        },
      ],
      onSubmit: async (values, timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.generate({
            timetable_id: timetable.id,
            parameters: {
              algorithm: values.algorithm as 'or_tools' | 'genetic' | 'simulated_annealing' | 'constraint_programming',
              time_limit_seconds: values.time_limit_seconds as number,
              respect_locked_entries: values.respect_locked_entries as boolean,
              allow_partial_solution: values.allow_partial_solution as boolean,
            },
          });
          console.log('Timetable generation started:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to start generation:', error);
          throw error;
        }
      },
    },
    {
      id: 'regenerate',
      label: 'Regenerate',
      icon: <RefreshCw className="h-4 w-4" />,
      actionType: 'form',
      variant: 'secondary',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generated' || timetable?.status === 'published',
      formTitle: 'Regenerate Timetable',
      fields: [
        {
          name: 'clear_existing',
          label: 'Clear Existing Schedules',
          type: 'checkbox',
          defaultValue: true,
          helpText: 'Remove all existing schedule entries before regenerating',
        },
        {
          name: 'keep_locked_entries',
          label: 'Keep Locked Entries',
          type: 'checkbox',
          defaultValue: true,
          helpText: 'Preserve manually locked schedule entries',
        },
        {
          name: 'time_limit_seconds',
          label: 'Time Limit (seconds)',
          type: 'number',
          required: true,
          defaultValue: 300,
        },
      ],
      onSubmit: async (values, timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.regenerate({
            timetable_id: timetable.id,
            clear_existing: values.clear_existing as boolean,
            keep_locked_entries: values.keep_locked_entries as boolean,
            parameters: {
              algorithm: 'or_tools',
              time_limit_seconds: values.time_limit_seconds as number,
              respect_locked_entries: values.keep_locked_entries as boolean,
              allow_partial_solution: true,
            },
          });
          console.log('Timetable regeneration started:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to start regeneration:', error);
          throw error;
        }
      },
    },
    {
      id: 'cancelGeneration',
      label: 'Cancel Generation',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generating' || 
        timetable?.generation_status === 'in_progress',
      confirmMessage: 'Are you sure you want to cancel the timetable generation?',
      confirmText: 'Cancel Generation',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.cancelGeneration(timetable.id);
          console.log('Generation cancelled:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to cancel generation:', error);
          throw error;
        }
      },
    },

    // ===========================
    // Publication Actions
    // ===========================
    {
      id: 'publish',
      label: 'Publish',
      icon: <Send className="h-4 w-4" />,
      actionType: 'form',
      variant: 'primary',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generated' && !timetable?.is_published,
      formTitle: 'Publish Timetable',
      fields: [
        {
          name: 'notify_teachers',
          label: 'Notify Teachers',
          type: 'checkbox',
          defaultValue: true,
          helpText: 'Send email notifications to all teachers',
        },
        {
          name: 'notify_students',
          label: 'Notify Students',
          type: 'checkbox',
          defaultValue: false,
          helpText: 'Send notifications to students (if applicable)',
        },
      ],
      onSubmit: async (values, timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.publish({
            timetable_id: timetable.id,
            notify_teachers: values.notify_teachers as boolean,
            notify_students: values.notify_students as boolean,
          });
          console.log('Timetable published:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to publish:', error);
          throw error;
        }
      },
    },
    {
      id: 'unpublish',
      label: 'Unpublish',
      icon: <FileText className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (timetable?: Timetable) => timetable?.is_published === true,
      confirmMessage: 'Are you sure you want to unpublish this timetable? It will revert to draft status.',
      confirmText: 'Unpublish',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.unpublish(timetable.id);
          console.log('Timetable unpublished:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to unpublish:', error);
          throw error;
        }
      },
    },

    // ===========================
    // Validation & Analysis
    // ===========================
    {
      id: 'validate',
      label: 'Validate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'outline',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generated' || timetable?.status === 'published',
      handler: async (timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          const result = await timetableActions.validate(timetable.id);
          console.log('Validation result:', result);
          if (context?.refresh) await context.refresh();
          // The result should be displayed via toast or modal in a real implementation
        } catch (error) {
          console.error('Failed to validate:', error);
          throw error;
        }
      },
    },
    {
      id: 'viewConflicts',
      label: 'View Conflicts',
      icon: <AlertTriangle className="h-4 w-4" />,
      actionType: 'navigation',
      variant: 'outline',
      position: 'row',
      visible: (timetable?: Timetable) => (timetable?.conflicts_count ?? 0) > 0,
      url: (timetable?: Timetable) => 
        `/dashboard/timetabling/conflicts?timetable=${timetable?.id}`,
    },
    {
      id: 'viewSchedules',
      label: 'View Schedules',
      icon: <Eye className="h-4 w-4" />,
      actionType: 'navigation',
      variant: 'secondary',
      position: 'row',
      visible: (timetable?: Timetable) => (timetable?.schedules_count ?? 0) > 0,
      url: (timetable?: Timetable) => 
        `/dashboard/timetabling/schedules?timetable=${timetable?.id}`,
    },

    // ===========================
    // Management Actions
    // ===========================
    {
      id: 'clone',
      label: 'Clone',
      icon: <Copy className="h-4 w-4" />,
      actionType: 'form',
      variant: 'secondary',
      position: 'row',
      formTitle: 'Clone Timetable',
      fields: [
        {
          name: 'name',
          label: 'New Name',
          type: 'text',
          required: true,
          placeholder: 'Enter name for the cloned timetable',
        },
      ],
      onSubmit: async (values, timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.clone(timetable.id, values.name as string);
          console.log('Timetable cloned:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to clone:', error);
          throw error;
        }
      },
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (timetable?: Timetable) => timetable?.status !== 'archived',
      confirmMessage: 'Are you sure you want to archive this timetable?',
      confirmText: 'Archive',
      onConfirm: async (timetable?: Timetable, context?) => {
        if (!timetable) return;
        try {
          await timetableActions.archive(timetable.id);
          console.log('Timetable archived:', timetable.id);
          if (context?.refresh) await context.refresh();
        } catch (error) {
          console.error('Failed to archive:', error);
          throw error;
        }
      },
    },

    // ===========================
    // Export Actions
    // ===========================
    {
      id: 'exportPdf',
      label: 'Export PDF',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'outline',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generated' || timetable?.status === 'published',
      handler: async (timetable?: Timetable) => {
        if (!timetable) return;
        try {
          const blob = await timetableActions.export(timetable.id, 'pdf');
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `timetable_${timetable.name.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Failed to export PDF:', error);
          throw error;
        }
      },
    },
    {
      id: 'exportExcel',
      label: 'Export Excel',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'outline',
      position: 'row',
      visible: (timetable?: Timetable) => 
        timetable?.status === 'generated' || timetable?.status === 'published',
      handler: async (timetable?: Timetable) => {
        if (!timetable) return;
        try {
          const blob = await timetableActions.export(timetable.id, 'excel');
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `timetable_${timetable.name.replace(/\s+/g, '_')}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Failed to export Excel:', error);
          throw error;
        }
      },
    },

    // ===========================
    // Bulk Actions
    // ===========================
    {
      id: 'bulkArchive',
      label: 'Archive Selected',
      icon: <Archive className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to archive ${count} timetable(s)?`,
      handler: async (timetables: Timetable[], context) => {
        if (!context?.refresh) return;
        for (const timetable of timetables) {
          try {
            await timetableActions.archive(timetable.id);
          } catch (error) {
            console.error('Failed to archive timetable:', timetable.id, error);
          }
        }
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
        `Are you sure you want to delete ${count} timetable(s)? This action cannot be undone.`,
      handler: async (timetables: Timetable[], context) => {
        if (!context?.refresh) return;
        // TODO: Implement bulk delete via API
        console.log('Bulk deleting:', timetables.map(t => t.id));
        await context.refresh();
      },
    },

    // ===========================
    // Global Export Action
    // ===========================
    {
      id: 'exportTimetables',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async (entity?: Timetable, context?) => {
        try {
          const dataToExport: Timetable[] = context?.selectedEntities && context.selectedEntities.length > 0
            ? context.selectedEntities as Timetable[]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : (context?.customData as any)?.allData || [];

          if (dataToExport.length === 0) {
            console.warn('No data to export');
            return;
          }

          const exportFields: ExportField<Timetable>[] = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'academic_year', label: 'Academic Year' },
            { key: 'term', label: 'Term' },
            { key: 'status', label: 'Status' },
            { key: 'is_active', label: 'Active' },
            { key: 'is_published', label: 'Published' },
            { key: 'version', label: 'Version' },
            { key: 'schedules_count', label: 'Schedules' },
            { key: 'conflicts_count', label: 'Conflicts' },
            { key: 'fitness_score', label: 'Quality Score' },
            { key: 'created_at', label: 'Created At' },
          ];

          const csvContent = entitiesToCSV(
            dataToExport,
            exportFields,
            {
              format: 'csv',
              filename: 'timetables',
              includeHeaders: true,
              delimiter: ',',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            }
          );

          const filename = generateFilename(
            context?.selectedEntities && context.selectedEntities.length > 0
              ? `timetables_selected_${context.selectedEntities.length}`
              : 'timetables_all',
            'csv'
          );

          downloadFile(csvContent, filename, 'text/csv');
          console.log(`Exported ${dataToExport.length} timetables to ${filename}`);
        } catch (error) {
          console.error('Failed to export timetables:', error);
        }
      },
    },
  ],

  mode: 'dropdown',
  className: '',
  onActionStart: undefined,
};
