/**
 * Timetable View Field Configurations
 * 
 * Defines fields for the timetable detail view.
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { GenerationStatusBadge } from '../components/GenerationStatusDisplay';

export const TimetableViewConfig: EntityViewConfig<Timetable> = {
  fields: [
    {
      key: 'name',
      label: 'Timetable Name',
      type: 'text',
    },
    {
      key: 'academic_year_name',
      label: 'Academic Year',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'term_name',
      label: 'Term',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'start_date',
      label: 'Start Date',
      type: 'date',
    },
    {
      key: 'end_date',
      label: 'End Date',
      type: 'date',
    },
    {
      key: 'working_days',
      label: 'Working Days',
      render: (entity) => {
        const days = (entity as Timetable).working_days || [];
        return (
          <div className="flex flex-wrap gap-1">
            {days.map((day) => (
              <Badge key={day} variant="outline">
                {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS] || day}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: 'working_hours_start',
      label: 'Working Hours Start',
      type: 'text',
    },
    {
      key: 'working_hours_end',
      label: 'Working Hours End',
      type: 'text',
    },
    {
      key: 'version',
      label: 'Version',
      type: 'number',
      formatter: (value) => `v${value}`,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const isActive = (entity as Timetable).is_active;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-600 text-white' : ''}>
            {isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'generation_status',
      label: 'Generation Status',
      render: (entity) => {
        const timetable = entity as Timetable;
        const status = timetable.generation_status || 'pending';
        return (
          <GenerationStatusBadge 
            status={status as any} 
            isGenerating={status === 'in_progress'} 
          />
        );
      },
    },
    {
      key: 'generation_task_id',
      label: 'Last Generation Task',
      type: 'text',
      formatter: (value) => (value as string) || 'No generation task',
    },
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
      description: 'Timetable name and academic period',
      fields: ['name', 'academic_year_name', 'term_name', 'version'],
      collapsible: true,
      order: 1,
    },
    {
      id: 'schedule',
      label: 'Schedule Period',
      description: 'Date range and working days',
      fields: ['start_date', 'end_date', 'working_days'],
      collapsible: true,
      order: 2,
    },
    {
      id: 'hours',
      label: 'Working Hours',
      description: 'Daily time boundaries',
      fields: ['working_hours_start', 'working_hours_end'],
      collapsible: true,
      order: 3,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Activation and generation info',
      fields: ['is_active', 'generation_task_id', 'created_at', 'updated_at'],
      collapsible: true,
      order: 4,
    },
  ],

  mode: 'detail',
  showMetadata: true,

  titleField: 'name',
  subtitleField: 'academic_year_name',

  actions: [],
};

// Convenience exports for backward compatibility
export const timetableViewFields = TimetableViewConfig.fields;
export const timetableViewGroups = TimetableViewConfig.groups;
export const timetableViewConfig = TimetableViewConfig;
