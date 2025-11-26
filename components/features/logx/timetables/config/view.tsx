/**
 * Timetable Detail View Configuration
 * Defines the layout for viewing timetable details
 */

import { EntityViewConfig as ViewConfig } from '@/components/entityManager/composition/config/types';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Calendar, Clock, Settings, Info } from 'lucide-react';

export const timetableViewConfig: ViewConfig<Timetable> = {
  fields: [],
  title: (timetable?: Timetable) => timetable?.name ?? '',
  subtitle: (timetable?: Timetable) => `Version ${timetable?.version ?? ''}`,
  icon: CalendarClock,
  sections: [
    {
      id: 'basic-information',
      label: 'Basic Information',
      icon: Info,
      fields: [
        { key: 'name', label: 'Timetable Name' },
        { 
          key: 'academic_year_name', 
          label: 'Academic Year',
          render: (value: any, row?: Timetable) => value || `Year ${row?.academic_year}`,
        },
        { 
          key: 'term_name', 
          label: 'Term',
          render: (value: any, row?: Timetable) => value || `Term ${row?.term}`,
        },
        { key: 'version', label: 'Version', render: (value: any) => `v${value}` },
      ],
    },
    {
      id: 'schedule-period',
      label: 'Schedule Period',
      icon: Calendar,
      fields: [
        { 
          key: 'start_date', 
          label: 'Start Date',
          render: (value: any) => new Date(value as string).toLocaleDateString(),
        },
        { 
          key: 'end_date', 
          label: 'End Date',
          render: (value: any) => new Date(value as string).toLocaleDateString(),
        },
        { 
          key: 'working_days', 
          label: 'Working Days',
          render: (value: string[] | any) => (
            <div className="flex flex-wrap gap-1">
              {value?.map((day) => (
                <Badge key={day} variant="outline">
                  {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS] || day}
                </Badge>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      id: 'working-hours',
      label: 'Working Hours',
      icon: Clock,
      fields: [
        { key: 'working_hours_start', label: 'Start Time' },
        { key: 'working_hours_end', label: 'End Time' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      icon: Settings,
      fields: [
        { 
          key: 'is_active', 
          label: 'Status',
          render: (value: any) => (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
        { 
          key: 'generation_task_id', 
          label: 'Last Generation Task',
          render: (value: any) => value || 'No generation task',
        },
      ],
    },
  ],
};
