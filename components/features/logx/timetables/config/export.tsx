/**
 * Timetable Export Configuration
 * Defines export fields for timetables
 */

import { ExportConfig } from '@/components/entityManager';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';

export const timetableExportConfig: ExportConfig<Timetable> = {
  filename: 'timetables',
  fields: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'academic_year_name', header: 'Academic Year' },
    { key: 'term_name', header: 'Term' },
    { key: 'start_date', header: 'Start Date' },
    { key: 'end_date', header: 'End Date' },
    { 
      key: 'working_days', 
      header: 'Working Days',
      transform: (value: string[]) => 
        value?.map(day => DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS] || day).join(', '),
    },
    { key: 'working_hours_start', header: 'Start Time' },
    { key: 'working_hours_end', header: 'End Time' },
    { key: 'version', header: 'Version' },
    { 
      key: 'is_active', 
      header: 'Status',
      transform: (value) => value ? 'Active' : 'Inactive',
    },
    { key: 'created_at', header: 'Created At' },
    { key: 'updated_at', header: 'Updated At' },
  ],
};
