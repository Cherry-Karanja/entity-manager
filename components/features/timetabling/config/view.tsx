/**
 * Timetable View Configurations
 * 
 * Defines the detail view layout for timetables.
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../types';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
} from 'lucide-react';

export const TimetableViewConfig: EntityViewConfig<Timetable> = {
  fields: [
    // ===========================
    // Header/Summary Section
    // ===========================
    {
      key: 'name',
      label: 'Timetable Name',
      group: 'summary',
    },
    {
      key: 'description',
      label: 'Description',
      group: 'summary',
      formatter: (value) => (value as string) || 'No description provided',
    },
    {
      key: 'status',
      label: 'Status',
      group: 'summary',
      formatter: (value) => {
        const statusMap: Record<string, string> = {
          draft: 'Draft',
          generating: 'Generating',
          generated: 'Generated',
          published: 'Published',
          archived: 'Archived',
        };
        return statusMap[value as string] || (value as string);
      },
    },

    // ===========================
    // Academic Details
    // ===========================
    {
      key: 'academic_year',
      label: 'Academic Year',
      group: 'academic',
    },
    {
      key: 'term',
      label: 'Term/Semester',
      group: 'academic',
      formatter: (value) => {
        const termMap: Record<string, string> = {
          'term_1': 'Term 1',
          'term_2': 'Term 2',
          'term_3': 'Term 3',
          'semester_1': 'Semester 1',
          'semester_2': 'Semester 2',
        };
        return termMap[value as string] || (value as string);
      },
    },
    {
      key: 'version',
      label: 'Version',
      group: 'academic',
      formatter: (value) => `v${value}`,
    },

    // ===========================
    // Statistics
    // ===========================
    {
      key: 'schedules_count',
      label: 'Total Schedules',
      group: 'statistics',
      type: 'number',
    },
    {
      key: 'conflicts_count',
      label: 'Conflicts',
      group: 'statistics',
      render: (entity: Timetable) => {
        const count = entity.conflicts_count || 0;
        if (count === 0) {
          return (
            <span className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              No conflicts
            </span>
          );
        }
        return (
          <span className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {count} conflict{count !== 1 ? 's' : ''}
          </span>
        );
      },
    },
    {
      key: 'fitness_score',
      label: 'Quality Score',
      group: 'statistics',
      render: (entity: Timetable) => {
        const score = entity.fitness_score;
        if (score === undefined || score === null) return 'Not calculated';
        const getColor = () => {
          if (score >= 90) return 'text-green-600';
          if (score >= 70) return 'text-yellow-600';
          return 'text-red-600';
        };
        return (
          <span className={`font-medium ${getColor()}`}>
            {score.toFixed(1)}%
          </span>
        );
      },
    },
    {
      key: 'constraints_satisfied',
      label: 'Constraints Satisfied',
      group: 'statistics',
      render: (entity: Timetable) => {
        if (!entity.constraints_satisfied || !entity.total_constraints) return 'N/A';
        const satisfied = entity.constraints_satisfied;
        const total = entity.total_constraints;
        const percentage = ((satisfied / total) * 100).toFixed(1);
        return `${satisfied}/${total} (${percentage}%)`;
      },
    },

    // ===========================
    // Generation Details
    // ===========================
    {
      key: 'generation_status',
      label: 'Generation Status',
      group: 'generation',
      render: (entity: Timetable) => {
        const value = entity.generation_status;
        if (!value) return 'Not started';
        const statusMap: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
          pending: { 
            icon: <Clock className="h-4 w-4" />, 
            label: 'Pending', 
            className: 'text-yellow-600' 
          },
          in_progress: { 
            icon: <Clock className="h-4 w-4 animate-spin" />, 
            label: 'In Progress', 
            className: 'text-blue-600' 
          },
          completed: { 
            icon: <CheckCircle className="h-4 w-4" />, 
            label: 'Completed', 
            className: 'text-green-600' 
          },
          failed: { 
            icon: <XCircle className="h-4 w-4" />, 
            label: 'Failed', 
            className: 'text-red-600' 
          },
          cancelled: { 
            icon: <XCircle className="h-4 w-4" />, 
            label: 'Cancelled', 
            className: 'text-gray-600' 
          },
        };
        const status = statusMap[value];
        if (!status) return value;
        return (
          <span className={`flex items-center ${status.className}`}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </span>
        );
      },
    },
    {
      key: 'generation_started_at',
      label: 'Generation Started',
      group: 'generation',
      type: 'date',
    },
    {
      key: 'generation_completed_at',
      label: 'Generation Completed',
      group: 'generation',
      type: 'date',
    },
    {
      key: 'generation_error',
      label: 'Error Message',
      group: 'generation',
      visible: (entity) => !!entity?.generation_error,
      render: (entity: Timetable) => (
        <span className="text-red-600">{entity.generation_error}</span>
      ),
    },
    {
      key: 'generated_by_name',
      label: 'Generated By',
      group: 'generation',
    },

    // ===========================
    // Publication Details
    // ===========================
    {
      key: 'is_published',
      label: 'Published',
      group: 'publication',
      type: 'boolean',
    },
    {
      key: 'published_at',
      label: 'Published At',
      group: 'publication',
      type: 'date',
      visible: (entity) => entity?.is_published,
    },

    // ===========================
    // Metadata
    // ===========================
    {
      key: 'is_active',
      label: 'Active',
      group: 'metadata',
      type: 'boolean',
    },
    {
      key: 'created_at',
      label: 'Created At',
      group: 'metadata',
      type: 'date',
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      group: 'metadata',
      type: 'date',
    },
  ],

  groups: [
    {
      id: 'summary',
      label: 'Summary',
      fields: ['name', 'description', 'status'],
      collapsible: false,
    },
    {
      id: 'academic',
      label: 'Academic Details',
      fields: ['academic_year', 'term', 'version'],
      collapsible: true,
      defaultCollapsed: false,
    },
    {
      id: 'statistics',
      label: 'Statistics',
      fields: ['schedules_count', 'conflicts_count', 'fitness_score', 'constraints_satisfied'],
      collapsible: true,
      defaultCollapsed: false,
    },
    {
      id: 'generation',
      label: 'Generation Details',
      fields: ['generation_status', 'generation_started_at', 'generation_completed_at', 'generation_error', 'generated_by_name'],
      collapsible: true,
      defaultCollapsed: false,
    },
    {
      id: 'publication',
      label: 'Publication',
      fields: ['is_published', 'published_at'],
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      id: 'metadata',
      label: 'Metadata',
      fields: ['is_active', 'created_at', 'updated_at'],
      collapsible: true,
      defaultCollapsed: true,
    },
  ],

  showMetadata: true,
};
