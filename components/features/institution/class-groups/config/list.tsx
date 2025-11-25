/**
 * ClassGroup List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const ClassGroupListConfig: EntityListConfig<ClassGroup> = {
  columns: [
    {
      key: 'name',
      label: 'Class',
      sortable: true,
      width: '25%',
      render: (value, entity) => {
        const cg = entity as ClassGroup;
        return (
          <div className="flex flex-col">
            <span className="font-medium font-mono">{value as string}</span>
            {cg.programme_name && (
              <span className="text-xs text-muted-foreground">{cg.programme_name}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'intake_name',
      label: 'Intake',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value, entity) => {
        const cg = entity as ClassGroup;
        if (!value && !cg.year) return <span className="text-muted-foreground">-</span>;
        return (
          <span>{value as string} {cg.year}</span>
        );
      },
    },
    {
      key: 'term_number',
      label: 'Term',
      sortable: true,
      filterable: true,
      width: '10%',
      render: (value) => value ? <Badge variant="outline">Term {value as number}</Badge> : '-',
    },
    {
      key: 'total_trainees',
      label: 'Trainees',
      sortable: true,
      width: '12%',
      type: 'number',
      render: (value) => <Badge variant="secondary">{value as number || 0}</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '12%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-600' : ''}>
          {value ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      width: '15%',
      type: 'datetime',
    },
  ],

  defaultSort: { field: 'name', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search classes...',
  searchFields: ['name', 'programme_name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50, 100] },
};
