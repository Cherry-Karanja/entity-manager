/**
 * Timetable List Column Definitions
 * Defines the columns displayed in the timetables list view
 */

import { ColumnDefinition } from '@/components/entityManager';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';

export const timetableColumns: ColumnDefinition<Timetable>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    width: '200px',
  },
  {
    key: 'academic_year_name',
    header: 'Academic Year',
    sortable: true,
    render: (value, row) => value || `Year ${row.academic_year}`,
  },
  {
    key: 'term_name',
    header: 'Term',
    sortable: true,
    render: (value, row) => value || `Term ${row.term}`,
  },
  {
    key: 'start_date',
    header: 'Start Date',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'end_date',
    header: 'End Date',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'working_days',
    header: 'Working Days',
    render: (value: string[]) => (
      <div className="flex flex-wrap gap-1">
        {value?.slice(0, 3).map((day) => (
          <Badge key={day} variant="outline" className="text-xs">
            {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS]?.slice(0, 3) || day}
          </Badge>
        ))}
        {value?.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{value.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: 'version',
    header: 'Version',
    sortable: true,
    width: '80px',
    render: (value) => `v${value}`,
  },
  {
    key: 'is_active',
    header: 'Status',
    sortable: true,
    width: '100px',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
