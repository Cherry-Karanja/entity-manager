/**
 * Unit List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Unit } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';

export const UnitListConfig: EntityListConfig<Unit> = {
  columns: [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '10%',
      render: (value) => <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{value as string}</code>,
    },
    {
      key: 'name',
      label: 'Unit Name',
      sortable: true,
      width: '25%',
    },
    {
      key: 'programme_name',
      label: 'Programme',
      sortable: true,
      filterable: true,
      width: '20%',
    },
    {
      key: 'credits',
      label: 'Credits',
      sortable: true,
      width: '10%',
      render: (value) => value ? `${value} cr` : '-',
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      filterable: true,
      width: '10%',
      render: (value) => value ? `Year ${value}` : '-',
    },
    {
      key: 'is_core',
      label: 'Type',
      sortable: true,
      filterable: true,
      width: '10%',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Core' : 'Elective'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-600' : ''}>
          {value ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ],

  defaultSort: { field: 'code', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search units...',
  searchFields: ['name', 'code'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 20, pageSizeOptions: [10, 20, 50, 100] },
};
