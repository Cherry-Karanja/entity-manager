/**
 * Academic Year List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { AcademicYear } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

export const AcademicYearListConfig: EntityListConfig<AcademicYear> = {
  columns: [
    {
      key: 'year',
      label: 'Academic Year',
      sortable: true,
      width: '30%',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-lg">{value as number}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '25%',
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
      width: '25%',
      type: 'datetime',
    },
  ],

  defaultSort: { field: 'year', direction: 'desc' },
  searchable: true,
  searchPlaceholder: 'Search years...',
  searchFields: ['year'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] },
};
