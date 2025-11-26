/**
 * Timetable Form Field Definitions
 * Defines the form fields for creating and editing timetables
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { authApi } from '@/components/connectionManager/http/client';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';

export const timetableFields: FormField<Timetable>[] = [
  {
    name: 'name',
    label: 'Timetable Name',
    type: 'text',
    required: true,
    placeholder: 'Enter timetable name',
    description: 'Name of the timetable',
    width: 'span 12',
  },
  {
    name: 'academic_year',
    label: 'Academic Year',
    type: 'relationship',
    required: true,
    relationConfig: {
      entity: 'academic-years',
      displayField: 'name',
      valueField: 'id',
      fetchOptions: async (search?: string) => {
        const params = search ? { params: { search } } : undefined;
        const resp = await authApi.get('/api/v1/institution/academic-years/', params as Record<string, unknown> | undefined);
        const data = resp.data;
        return Array.isArray(data) ? data : data.results ?? data.data ?? [];
      },
      searchFields: ['name'],
    },
    width: 'span 6',
  },
  {
    name: 'term',
    label: 'Term',
    type: 'relationship',
    required: true,
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
    width: 'span 6',
  },
  {
    name: 'start_date',
    label: 'Start Date',
    type: 'date',
    required: true,
    description: 'Start date of the timetable period',
    width: 'span 6',
  },
  {
    name: 'end_date',
    label: 'End Date',
    type: 'date',
    required: true,
    description: 'End date of the timetable period',
    width: 'span 6',
  },
  {
    name: 'working_hours_start',
    label: 'Working Hours Start',
    type: 'time',
    required: true,
    defaultValue: '08:00',
    description: 'Start time of working hours',
    width: 'span 6',
  },
  {
    name: 'working_hours_end',
    label: 'Working Hours End',
    type: 'time',
    required: true,
    defaultValue: '17:00',
    description: 'End time of working hours',
    width: 'span 6',
  },
  {
    name: 'working_days',
    label: 'Working Days',
    type: 'multiselect',
    required: true,
    options: Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
    defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    description: 'Days when classes can be scheduled',
    width: 'span 12',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'switch',
    defaultValue: false,
    description: 'Whether this timetable is currently active',
    width: 'span 6',
  },
  {
    name: 'version',
    label: 'Version',
    type: 'number',
    defaultValue: 1,
    disabled: true,
    description: 'Version number for regeneration tracking',
    width: 'span 6',
  },
];
