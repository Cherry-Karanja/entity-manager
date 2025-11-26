/**
 * Timetable List Column Configurations
 * 
 * Defines columns for the timetable list view.
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Timetable, DAY_OF_WEEK_LABELS } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { TimetableActionsConfig } from './actions';

export const TimetableListConfig: EntityListConfig<Timetable> = {
  columns: [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '20%',
      type: 'text',
    },
    {
      key: 'academic_year_name',
      label: 'Academic Year',
      sortable: true,
      filterable: true,
      width: '12%',
      type: 'text',
      formatter: (value, entity) => (value as string) || `Year ${entity?.academic_year}`,
    },
    {
      key: 'term_name',
      label: 'Term',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'text',
      formatter: (value, entity) => (value as string) || `Term ${entity?.term}`,
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      width: '12%',
      type: 'date',
    },
    {
      key: 'end_date',
      label: 'End Date',
      sortable: true,
      width: '12%',
      type: 'date',
    },
    {
      key: 'working_days',
      label: 'Working Days',
      width: '15%',
      render: (value) => (
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
      width: '8%',
      align: 'center',
      type: 'number',
      formatter: (value) => `v${value}`,
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-600' : ''}>
          {value ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ],

  view: 'table',

  toolbar: {
    search: true,
    filters: true,
    viewSwitcher: true,
    columnSelector: true,
    refresh: true,
    export: true,
  },

  selectable: true,
  multiSelect: true,

  pagination: true,
  paginationConfig: {
    page: 1,
    pageSize: 10,
  },

  sortable: true,
  sortConfig: { field: 'created_at', direction: 'desc' },

  filterable: true,
  filterConfigs: [
    { field: 'is_active', operator: 'equals', value: true },
    { field: 'academic_year', operator: 'in', value: [] },
    { field: 'term', operator: 'in', value: [] },
  ],

  searchable: true,
  searchPlaceholder: 'Search timetables...',

  emptyMessage: 'No timetables found.',

  actions: TimetableActionsConfig as any,

  hover: true,
  striped: true,
  bordered: true,

  titleField: 'name',
  subtitleField: 'academic_year_name',
  dateField: 'created_at',
};

// Legacy exports for backward compatibility
export const timetableColumns = TimetableListConfig.columns;
export const timetableListConfig = TimetableListConfig;
