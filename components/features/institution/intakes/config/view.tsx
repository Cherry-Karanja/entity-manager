/**
 * Intake View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Intake } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const IntakeViewConfig: EntityViewConfig<Intake> = {
  fields: [
    { key: 'name', label: 'Intake Name' },
    {
      key: 'code',
      label: 'Code',
      render: (entity) => {
        const code = (entity as Intake).code;
        return code ? <code className="text-sm bg-muted px-2 py-1 rounded">{code}</code> : '-';
      },
    },
    { key: 'academic_year_name', label: 'Academic Year' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const active = (entity as Intake).is_active;
        return (
          <Badge variant={active ? 'default' : 'secondary'} className={active ? 'bg-green-600' : ''}>
            {active ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {active ? 'Active' : 'Closed'}
          </Badge>
        );
      },
    },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
