/**
 * Term List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Term } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export const TermListConfig: EntityListConfig<Term> = {
  columns: [
    {
      key: 'term_number',
      label: 'Term',
      sortable: true,
      width: '15%',
      render: (value) => (
        <span className="font-semibold">Term {value as number}</span>
      ),
    },
    {
      key: 'academic_year_name',
      label: 'Academic Year',
      sortable: true,
      width: '20%',
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      width: '20%',
      type: 'date',
    },
    {
      key: 'end_date',
      label: 'End Date',
      sortable: true,
      width: '20%',
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
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ],

  defaultSort: { field: 'term_number', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search terms...',
  searchFields: ['term_number', 'academic_year_name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] },
};
