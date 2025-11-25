/**
 * Enrollment View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { Badge } from '@/components/ui/badge';

export const EnrollmentViewConfig: EntityViewConfig<Enrollment> = {
  fields: [
    { key: 'trainee_name', label: 'Trainee' },
    { key: 'class_group_name', label: 'Class Group' },
    { key: 'enrollment_date', label: 'Enrollment Date', type: 'date' },
    { key: 'status', label: 'Status', render: (entity) => {
      const status = (entity as Enrollment).status;
      const colors: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        withdrawn: 'bg-red-100 text-red-800',
        suspended: 'bg-orange-100 text-orange-800',
        deferred: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <Badge variant="outline" className={colors[status] || ''}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }},
    { key: 'grade', label: 'Grade' },
    { key: 'is_active', label: 'Active', type: 'boolean' },
    { key: 'notes', label: 'Notes', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
