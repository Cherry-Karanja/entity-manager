/**
 * Department View Field Configurations
 * 
 * Defines fields for the department detail view.
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Department } from '../../types';
import { Badge } from '@/components/ui/badge';

export const DepartmentViewConfig: EntityViewConfig<Department> = {
  fields: [
    {
      key: 'name',
      label: 'Department Name',
      render: (entity) => (
        <span className="font-medium text-lg">{(entity as Department).name}</span>
      ),
    },
    {
      key: 'hod_name',
      label: 'Head of Department',
      render: (entity) => {
        const dept = entity as Department;
        if (!dept.hod_name) {
          return <span className="text-muted-foreground">Not Assigned</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="font-medium">{dept.hod_name}</span>
            {dept.hod_email && (
              <span className="text-sm text-muted-foreground">{dept.hod_email}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'total_programmes',
      label: 'Total Programmes',
      type: 'number',
      render: (entity) => (
        <Badge variant="secondary">{(entity as Department).total_programmes || 0}</Badge>
      ),
    },
    {
      key: 'total_class_groups',
      label: 'Total Classes',
      type: 'number',
      render: (entity) => (
        <Badge variant="outline">{(entity as Department).total_class_groups || 0}</Badge>
      ),
    },
    {
      key: 'total_trainers',
      label: 'Total Trainers',
      type: 'number',
      render: (entity) => (
        <Badge variant="outline">{(entity as Department).total_trainers || 0}</Badge>
      ),
    },
    {
      key: 'total_trainees',
      label: 'Total Trainees',
      type: 'number',
      render: (entity) => (
        <Badge variant="outline">{(entity as Department).total_trainees || 0}</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'datetime',
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      type: 'datetime',
    },
  ],

  layout: 'grid',
  gridColumns: 2,
};
