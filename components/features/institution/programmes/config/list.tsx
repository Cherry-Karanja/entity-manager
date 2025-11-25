/**
 * Programme List Column Configurations
 */

import { EntityListConfig } from '@/components/entityManager/composition/config/types';
import { Programme } from '../../types';
import { Badge } from '@/components/ui/badge';

export const ProgrammeListConfig: EntityListConfig<Programme> = {
  columns: [
    {
      key: 'name',
      label: 'Programme',
      sortable: true,
      width: '30%',
      render: (value, entity) => {
        const prog = entity as Programme;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{value as string}</span>
            {prog.code && (
              <span className="text-xs text-muted-foreground">{prog.code}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'department_name',
      label: 'Department',
      sortable: true,
      filterable: true,
      width: '25%',
      type: 'text',
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      filterable: true,
      width: '10%',
      type: 'number',
      render: (value) => (
        <Badge variant="outline">Level {value as number}</Badge>
      ),
    },
    {
      key: 'total_class_groups',
      label: 'Classes',
      sortable: true,
      width: '15%',
      type: 'number',
      render: (value) => (
        <Badge variant="secondary">{value as number || 0}</Badge>
      ),
    },
    {
      key: 'total_trainees',
      label: 'Trainees',
      sortable: true,
      width: '15%',
      type: 'number',
      render: (value) => (
        <Badge variant="outline">{value as number || 0}</Badge>
      ),
    },
  ],

  defaultSort: { field: 'name', direction: 'asc' },
  searchable: true,
  searchPlaceholder: 'Search programmes...',
  searchFields: ['name', 'code', 'department_name'],
  selectable: true,
  selectableKey: 'id',
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50, 100] },
};
