/**
 * Timetable List Column Definitions
 * Defines the columns displayed in the timetables list view
 */

import { Column } from '@/components/entityManager/components/list/types';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';

export const timetableColumns: Column<Timetable>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: '200px',
  },
  // {
  //   key: 'academic_year_name',
  //   label: 'Academic Year',
  //   sortable: true,
  //   render: (value: any, row?: Timetable) => (value as string) || `Year ${row?.academic_year}`,
  // },
  // {
  //   key: 'term_name',
  //   label: 'Term',
  //   sortable: true,
  //   render: (value: any, row?: Timetable) => (value as string) || `Term ${row?.term}`,
  // },
  {
    key: 'start_date',
    label: 'Start Date',
    sortable: true,
    render: (value: any) => new Date(value as string).toLocaleDateString(),
  },
  {
    key: 'end_date',
    label: 'End Date',
    sortable: true,
    render: (value: any) => new Date(value as string).toLocaleDateString(),
  },
  {
    key: 'working_days',
    label: 'Working Days',
    render: (value: any) => (
      <div className="flex flex-wrap gap-1">
        {(value as string[])?.slice(0, 3).map((day) => (
          <Badge key={day} variant="outline" className="text-xs">
            {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS]?.slice(0, 3) || day}
          </Badge>
        ))}
        {(value as string[])?.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{(value as string[]).length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: 'version',
    label: 'Version',
    sortable: true,
    width: '80px',
    render: (value: any) => `v${value}`,
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
    width: '100px',
    render: (value: any) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
