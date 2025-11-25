/**
 * Enrollment List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { Badge } from '@/components/ui/badge';

export const EnrollmentListConfig: EntityListConfig<Enrollment> = {
  columns: [
    {
      key: 'trainee_name',
      label: 'Trainee',
      sortable: true,
      width: '25%',
    },
    {
      key: 'class_group_name',
      label: 'Class Group',
      sortable: true,
      filterable: true,
      width: '20%',
    },
    {
      key: 'enrollment_date',
      label: 'Enrolled On',
      sortable: true,
      width: '15%',
      render: (value) => value ? new Date(value as string).toLocaleDateString() : '-',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => {
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          completed: 'bg-blue-100 text-blue-800',
          withdrawn: 'bg-red-100 text-red-800',
          suspended: 'bg-orange-100 text-orange-800',
          deferred: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <Badge variant="outline" className={colors[value as string] || ''}>
            {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      width: '10%',
      render: (value) => value || '-',
    },
    {
      key: 'is_active',
      label: 'Active',
      sortable: true,
      filterable: true,
      width: '10%',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ],

  defaultSort: { field: 'enrollment_date', direction: 'desc' },
  searchable: true,
  searchPlaceholder: 'Search enrollments...',
  searchFields: ['trainee_name', 'class_group_name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 25, pageSizeOptions: [10, 25, 50, 100] },
};
