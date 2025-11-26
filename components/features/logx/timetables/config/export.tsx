/**
 * Timetable Export Configuration
 * Defines export fields for timetables
 */

import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';

export const timetableExportConfig: EntityExporterConfig<Timetable> = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'academic_year_name', label: 'Academic Year' },
    { key: 'term_name', label: 'Term' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    {
      key: 'working_days',
      label: 'Working Days',
      formatter: (value: unknown) =>
        (value as string[])
          ?.map((day) => DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS] || day)
          .join(', '),
    },
    { key: 'working_hours_start', label: 'Start Time' },
    { key: 'working_hours_end', label: 'End Time' },
    { key: 'version', label: 'Version' },
    {
      key: 'is_active',
      label: 'Status',
      formatter: (value: unknown) => ((value as boolean) ? 'Active' : 'Inactive'),
    },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ],
  options: {
    format: 'xlsx',
    filename: 'timetables',
    includeHeaders: true,
    prettyPrint: true,
  },
};
