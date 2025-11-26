/**
 * Timetable Form Field Definitions
 * 
 * Defines the form fields for creating and editing timetables.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Calendar, Clock, Settings } from 'lucide-react';

export const timetableFields: FormField<Timetable>[] = [
  // ===========================
  // Basic Information
  // ===========================
  {
    name: 'name',
    label: 'Timetable Name',
    type: 'text',
    required: true,
    placeholder: 'Enter timetable name',
    group: 'basic',
    validation: [
      { type: 'required', message: 'Timetable name is required' },
      { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
    ],
    helpText: 'A descriptive name for this timetable',
    width: '100%',
  },
  {
    name: 'academic_year',
    label: 'Academic Year',
    type: 'relation',
    required: true,
    placeholder: 'Select academic year',
    group: 'basic',
    relationConfig: {
      entity: 'academic-years',
      displayField: 'year',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/academic-years/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
      searchFields: ['year'],
    },
    width: '50%',
  },
  {
    name: 'term',
    label: 'Term',
    type: 'relation',
    required: true,
    placeholder: 'Select term',
    group: 'basic',
    relationConfig: {
      entity: 'terms',
      displayField: 'name',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/terms/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
      searchFields: ['name'],
    },
    width: '50%',
  },

  // ===========================
  // Schedule Period
  // ===========================
  {
    name: 'start_date',
    label: 'Start Date',
    type: 'date',
    required: true,
    group: 'schedule',
    helpText: 'Start date of the timetable period',
    width: '50%',
  },
  {
    name: 'end_date',
    label: 'End Date',
    type: 'date',
    required: true,
    group: 'schedule',
    helpText: 'End date of the timetable period',
    width: '50%',
  },
  {
    name: 'working_days',
    label: 'Working Days',
    type: 'multiselect',
    required: true,
    group: 'schedule',
    options: Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    helpText: 'Days when classes can be scheduled',
    width: '100%',
  },

  // ===========================
  // Working Hours
  // ===========================
  {
    name: 'working_hours_start',
    label: 'Working Hours Start',
    type: 'time',
    required: true,
    defaultValue: '08:00',
    group: 'hours',
    helpText: 'Start time of working hours',
    width: '50%',
  },
  {
    name: 'working_hours_end',
    label: 'Working Hours End',
    type: 'time',
    required: true,
    defaultValue: '17:00',
    group: 'hours',
    helpText: 'End time of working hours',
    width: '50%',
  },

  // ===========================
  // Status
  // ===========================
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    required: false,
    group: 'status',
    defaultValue: false,
    helpText: 'Whether this timetable is currently active',
    width: '50%',
  },
  {
    name: 'version',
    label: 'Version',
    type: 'number',
    required: false,
    group: 'status',
    defaultValue: 1,
    disabled: true,
    helpText: 'Version number for regeneration tracking',
    width: '50%',
  },
];

export const TimetableFormConfig: EntityFormConfig<Timetable> = {
  fields: timetableFields,
  layout: 'tabs',
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Timetable name and academic period',
      fields: ['name', 'academic_year', 'term'],
      icon: <Calendar className="h-4 w-4" />,
      order: 1,
    },
    {
      id: 'schedule',
      label: 'Schedule Period',
      description: 'Date range and working days',
      fields: ['start_date', 'end_date', 'working_days'],
      icon: <Calendar className="h-4 w-4" />,
      order: 2,
    },
    {
      id: 'hours',
      label: 'Working Hours',
      description: 'Daily time boundaries',
      fields: ['working_hours_start', 'working_hours_end'],
      icon: <Clock className="h-4 w-4" />,
      order: 3,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Activation and version info',
      fields: ['is_active', 'version'],
      icon: <Settings className="h-4 w-4" />,
      order: 4,
    },
  ],
  submitText: 'Save Timetable',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,
};
