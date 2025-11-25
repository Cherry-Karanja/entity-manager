/**
 * Intake List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Intake } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const IntakeListConfig: EntityListConfig<Intake> = {
  columns: [
    {
      key: 'name',
      label: 'Intake Name',
      sortable: true,
      width: '25%',
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '10%',
      render: (value) => value ? <code className="text-sm bg-muted px-1 rounded">{value as string}</code> : '-',
    },
    {
      key: 'academic_year_name',
      label: 'Academic Year',
      sortable: true,
      filterable: true,
      width: '15%',
    },
    {
      key: 'start_date',
      label: 'Start',
      sortable: true,
      width: '15%',
      type: 'date',
    },
    {
      key: 'end_date',
      label: 'End',
      sortable: true,
      width: '15%',
      type: 'date',
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '15%',
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'} className={value ? 'bg-green-600' : ''}>
          {value ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {value ? 'Active' : 'Closed'}
        </Badge>
      ),
    },
  ],

  defaultSort: { field: 'start_date', direction: 'desc' },
  searchable: true,
  searchPlaceholder: 'Search intakes...',
  searchFields: ['name', 'code'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] },
};
