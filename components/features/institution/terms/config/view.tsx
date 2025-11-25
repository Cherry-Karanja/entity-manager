/**
 * Term View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Term } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const TermViewConfig: EntityViewConfig<Term> = {
  fields: [
    {
      key: 'term_number',
      label: 'Term Number',
      render: (entity) => <span className="font-medium text-lg">Term {(entity as Term).term_number}</span>,
    },
    { key: 'academic_year_name', label: 'Academic Year' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const active = (entity as Term).is_active;
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
