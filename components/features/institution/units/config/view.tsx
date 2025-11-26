/**
 * Unit View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Unit } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const UnitViewConfig: EntityViewConfig<Unit> = {
  fields: [
    { key: 'name', label: 'Unit Name' },
    {
      key: 'code',
      label: 'Code',
      render: (entity?: Unit) => (
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{entity?.code ?? ''}</code>
      ),
    },
    { key: 'programme_name', label: 'Programme' },
    { key: 'credits', label: 'Credits', render: (entity?: Unit) => {
      const credits = entity?.credits;
      return credits ? `${credits} credit hours` : '-';
    }},
    { key: 'level', label: 'Level/Year', render: (entity?: Unit) => {
      const level = entity?.level;
      return level ? `Year ${level}` : '-';
    }},
    { key: 'term_number', label: 'Term', render: (entity?: Unit) => {
      const term = entity?.term_number;
      return term ? `Term ${term}` : '-';
    }},
    {
      key: 'is_core',
      label: 'Unit Type',
      render: (entity?: Unit) => {
        const core = entity?.is_core;
        return (
          <Badge variant={core ? 'default' : 'outline'}>
            {core ? 'Core Unit' : 'Elective'}
          </Badge>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity?: Unit) => {
        const active = entity?.is_active;
        return (
          <Badge variant={active ? 'default' : 'secondary'} className={active ? 'bg-green-600' : ''}>
            {active ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'learning_outcomes', label: 'Learning Outcomes', type: 'text' },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'updated_at', label: 'Last Updated', type: 'date' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
