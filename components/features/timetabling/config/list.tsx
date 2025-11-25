/**
 * Timetable List Column Configurations
 * 
 * Defines columns for the timetable list view.
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Timetable, TimetableStatus, GenerationStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send, 
  Archive,
  Loader2,
  AlertTriangle,
  Calendar,
  FileText,
  Activity
} from 'lucide-react';
import { TimetableActionsConfig } from './actions';

/**
 * Get status badge variant and icon
 */
const getStatusBadge = (status: TimetableStatus) => {
  switch (status) {
    case 'draft':
      return {
        variant: 'secondary' as const,
        icon: <FileText className="h-3 w-3 mr-1" />,
        label: 'Draft',
        className: '',
      };
    case 'generating':
      return {
        variant: 'outline' as const,
        icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
        label: 'Generating',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    case 'generated':
      return {
        variant: 'default' as const,
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        label: 'Generated',
        className: 'bg-green-600 text-white',
      };
    case 'published':
      return {
        variant: 'default' as const,
        icon: <Send className="h-3 w-3 mr-1" />,
        label: 'Published',
        className: 'bg-purple-600 text-white',
      };
    case 'archived':
      return {
        variant: 'secondary' as const,
        icon: <Archive className="h-3 w-3 mr-1" />,
        label: 'Archived',
        className: 'text-gray-600',
      };
    default:
      return {
        variant: 'secondary' as const,
        icon: null,
        label: status,
        className: '',
      };
  }
};

/**
 * Get generation status indicator
 */
const getGenerationStatusIndicator = (status?: GenerationStatus) => {
  if (!status) return null;
  
  switch (status) {
    case 'pending':
      return <Clock className="h-3 w-3 text-yellow-600" />;
    case 'in_progress':
      return <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />;
    case 'completed':
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'failed':
      return <XCircle className="h-3 w-3 text-red-600" />;
    case 'cancelled':
      return <XCircle className="h-3 w-3 text-gray-600" />;
    default:
      return null;
  }
};

export const TimetableListConfig: EntityListConfig<Timetable> = {
  columns: [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '25%',
      render: (value, entity) => {
        const timetable = entity as Timetable;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{value as string}</span>
            {timetable.version > 1 && (
              <span className="text-xs text-muted-foreground">
                Version {timetable.version}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'academic_year',
      label: 'Year',
      sortable: true,
      filterable: true,
      width: '12%',
      type: 'text',
    },
    {
      key: 'term',
      label: 'Term',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'text',
      formatter: (value) => {
        const termMap: Record<string, string> = {
          'term_1': 'Term 1',
          'term_2': 'Term 2',
          'term_3': 'Term 3',
          'semester_1': 'Sem 1',
          'semester_2': 'Sem 2',
        };
        return termMap[value as string] || (value as string);
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '12%',
      render: (value, entity) => {
        const timetable = entity as Timetable;
        const statusInfo = getStatusBadge(value as TimetableStatus);
        
        return (
          <div className="flex items-center gap-2">
            <Badge 
              variant={statusInfo.variant} 
              className={`text-xs ${statusInfo.className}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </Badge>
            {timetable.generation_status && (
              getGenerationStatusIndicator(timetable.generation_status)
            )}
          </div>
        );
      },
    },
    {
      key: 'schedules_count',
      label: 'Schedules',
      sortable: true,
      width: '10%',
      align: 'center',
      render: (value, entity) => {
        const timetable = entity as Timetable;
        return (
          <div className="flex flex-col items-center">
            <span className="font-medium">{value as number}</span>
            {timetable.conflicts_count > 0 && (
              <span className="text-xs text-red-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {timetable.conflicts_count} conflicts
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'fitness_score',
      label: 'Quality',
      sortable: true,
      width: '10%',
      align: 'center',
      render: (value) => {
        if (value === undefined || value === null) return '-';
        const score = value as number;
        const getColor = () => {
          if (score >= 90) return 'text-green-600';
          if (score >= 70) return 'text-yellow-600';
          return 'text-red-600';
        };
        return (
          <div className={`flex items-center justify-center ${getColor()}`}>
            <Activity className="h-3 w-3 mr-1" />
            <span className="font-medium">{score.toFixed(1)}%</span>
          </div>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Active',
      sortable: true,
      filterable: true,
      width: '8%',
      align: 'center',
      type: 'boolean',
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      width: '13%',
      type: 'date',
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
    actions: [],
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
    { field: 'status', operator: 'in', value: [] },
    { field: 'academic_year', operator: 'in', value: [] },
    { field: 'is_active', operator: 'equals', value: true },
  ],

  searchable: true,
  searchPlaceholder: 'Search timetables...',

  emptyMessage: 'No timetables found.',

  actions: {
    ...TimetableActionsConfig,
    context: {
      refresh: undefined,
      customData: undefined,
    },
  },

  className: '',
  hover: true,
  striped: true,
  bordered: true,

  titleField: 'name',
  subtitleField: 'academic_year',
  imageField: undefined,
  dateField: 'created_at',
};
