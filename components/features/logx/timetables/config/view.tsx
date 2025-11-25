/**
 * Timetable Detail View Configuration
 * Defines the layout for viewing timetable details
 */

import { ViewConfig } from '@/components/entityManager';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Calendar, Clock, Settings, Info } from 'lucide-react';

export const timetableViewConfig: ViewConfig<Timetable> = {
  title: (timetable) => timetable.name,
  subtitle: (timetable) => `Version ${timetable.version}`,
  icon: CalendarClock,
  sections: [
    {
      title: 'Basic Information',
      icon: Info,
      fields: [
        { key: 'name', label: 'Timetable Name' },
        { 
          key: 'academic_year_name', 
          label: 'Academic Year',
          render: (value, row) => value || `Year ${row.academic_year}`,
        },
        { 
          key: 'term_name', 
          label: 'Term',
          render: (value, row) => value || `Term ${row.term}`,
        },
        { key: 'version', label: 'Version', render: (value) => `v${value}` },
      ],
    },
    {
      title: 'Schedule Period',
      icon: Calendar,
      fields: [
        { 
          key: 'start_date', 
          label: 'Start Date',
          render: (value) => new Date(value).toLocaleDateString(),
        },
        { 
          key: 'end_date', 
          label: 'End Date',
          render: (value) => new Date(value).toLocaleDateString(),
        },
        { 
          key: 'working_days', 
          label: 'Working Days',
          render: (value: string[]) => (
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
      title: 'Working Hours',
      icon: Clock,
      fields: [
        { key: 'working_hours_start', label: 'Start Time' },
        { key: 'working_hours_end', label: 'End Time' },
      ],
    },
    {
      title: 'Status',
      icon: Settings,
      fields: [
        { 
          key: 'is_active', 
          label: 'Status',
          render: (value) => (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
        { 
          key: 'generation_task_id', 
          label: 'Last Generation Task',
          render: (value) => value || 'No generation task',
        },
      ],
    },
  ],
};
