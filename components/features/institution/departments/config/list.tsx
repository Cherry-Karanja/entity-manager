/**
 * Department List Column Configurations
 * 
 * Defines columns for the department list view.
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Department } from '../../types';
import { Badge } from '@/components/ui/badge';

export const DepartmentListConfig: EntityListConfig<Department> = {
  columns: [
    {
      key: 'name',
      label: 'Department',
      sortable: true,
      width: '25%',
      render: (value) => (
        <span className="font-medium">{value as string}</span>
      ),
    },
    {
      key: 'hod_name',
      label: 'Head of Department',
      sortable: true,
      width: '20%',
      render: (value, entity) => {
        const dept = entity as Department;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{value as string || 'Not Assigned'}</span>
            {dept.hod_email && (
              <span className="text-xs text-muted-foreground">{dept.hod_email}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'total_programmes',
      label: 'Programmes',
      sortable: true,
      width: '12%',
      type: 'number',
      render: (value) => (
        <Badge variant="secondary">{value as number || 0}</Badge>
      ),
    },
    {
      key: 'total_class_groups',
      label: 'Classes',
      sortable: true,
      width: '12%',
      type: 'number',
      render: (value) => (
        <Badge variant="outline">{value as number || 0}</Badge>
      ),
    },
    {
      key: 'total_trainers',
      label: 'Trainers',
      sortable: true,
      width: '12%',
      type: 'number',
      render: (value) => (
        <Badge variant="outline">{value as number || 0}</Badge>
      ),
    },
    {
      key: 'total_trainees',
      label: 'Trainees',
      sortable: true,
      width: '12%',
      type: 'number',
      render: (value) => (
        <Badge variant="outline">{value as number || 0}</Badge>
      ),
    },
  ],

  defaultSort: {
    field: 'name',
    direction: 'asc',
  },

  searchable: true,
  searchPlaceholder: 'Search departments...',
  searchFields: ['name', 'hod_name'],

  selectable: true,
  selectableKey: 'id',

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
