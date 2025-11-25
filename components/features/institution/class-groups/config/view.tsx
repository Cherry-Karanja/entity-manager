/**
 * ClassGroup View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const ClassGroupViewConfig: EntityViewConfig<ClassGroup> = {
  fields: [
    {
      key: 'name',
      label: 'Class Name',
      render: (entity) => (
        <span className="font-medium font-mono text-lg">{(entity as ClassGroup).name}</span>
      ),
    },
    {
      key: 'programme_name',
      label: 'Programme',
      type: 'text',
    },
    {
      key: 'cirriculum_code',
      label: 'Curriculum Code',
      type: 'text',
      formatter: (v) => (v as string) || '-',
    },
    {
      key: 'intake_name',
      label: 'Intake',
      render: (entity) => {
        const cg = entity as ClassGroup;
        return cg.intake_name ? `${cg.intake_name} ${cg.year || ''}` : '-';
      },
    },
    {
      key: 'term_number',
      label: 'Term',
      render: (entity) => {
        const term = (entity as ClassGroup).term_number;
        return term ? <Badge variant="outline">Term {term}</Badge> : '-';
      },
    },
    {
      key: 'suffix',
      label: 'Suffix',
      type: 'text',
      formatter: (v) => (v as string) || '-',
    },
    {
      key: 'total_trainees',
      label: 'Total Trainees',
      render: (entity) => <Badge variant="secondary">{(entity as ClassGroup).total_trainees || 0}</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (entity) => {
        const active = (entity as ClassGroup).is_active;
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
