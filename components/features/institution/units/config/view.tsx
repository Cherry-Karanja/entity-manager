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
      render: (entity) => (
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{(entity as Unit).code}</code>
      ),
    },
    { key: 'programme_name', label: 'Programme' },
    { key: 'credits', label: 'Credits', render: (entity) => {
      const credits = (entity as Unit).credits;
      return credits ? `${credits} credit hours` : '-';
    }},
    { key: 'level', label: 'Level/Year', render: (entity) => {
      const level = (entity as Unit).level;
      return level ? `Year ${level}` : '-';
    }},
    { key: 'term_number', label: 'Term', render: (entity) => {
      const term = (entity as Unit).term_number;
      return term ? `Term ${term}` : '-';
    }},
    {
      key: 'is_core',
      label: 'Unit Type',
      render: (entity) => {
        const core = (entity as Unit).is_core;
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
      render: (entity) => {
        const active = (entity as Unit).is_active;
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
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
