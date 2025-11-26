import { EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { TimetableSettings } from '../../types';

export const timetableSettingsExportConfig: EntityExporterConfig<TimetableSettings> = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'institution_name', label: 'Institution' },
    { key: 'max_lessons_per_day', label: 'Max Lessons/Day' },
    { key: 'max_consecutive_lessons', label: 'Max Consecutive' },
    { key: 'min_break_duration', label: 'Min Break (min)' },
    { key: 'allow_split_lessons', label: 'Allow Split', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'prefer_morning_classes', label: 'Prefer Morning', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'balance_daily_load', label: 'Balance Load', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'avoid_gaps', label: 'Avoid Gaps', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'respect_room_capacity', label: 'Room Capacity', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'algorithm_timeout', label: 'Timeout (s)' },
    { key: 'optimization_iterations', label: 'Iterations' },
    { key: 'is_default', label: 'Default', formatter: (value: unknown) => ((value as boolean) ? 'Yes' : 'No') },
    { key: 'created_at', label: 'Created', formatter: (value: unknown) => (value ? new Date(value as string).toLocaleDateString() : '') },
  ],
  options: { format: 'csv', filename: 'timetable-settings', includeHeaders: true },
};
