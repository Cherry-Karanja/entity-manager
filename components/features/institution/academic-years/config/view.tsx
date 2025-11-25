/**
 * Academic Year View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { AcademicYear } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const AcademicYearViewConfig: EntityViewConfig<AcademicYear> = {
  fields: [
    {
      key: 'year',
      label: 'Academic Year',
      render: (entity) => (
        <span className="font-medium text-2xl">{(entity as AcademicYear).year}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const active = (entity as AcademicYear).is_active;
        return (
          <Badge variant={active ? 'default' : 'secondary'} className={active ? 'bg-green-600' : ''}>
            {active ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
