/**
 * Programme View Field Configurations
 */

import { EntityViewConfig } from '@/components/entityManager/composition/config/types';
import { Programme } from '../../types';
import { Badge } from '@/components/ui/badge';

export const ProgrammeViewConfig: EntityViewConfig<Programme> = {
  fields: [
    {
      key: 'name',
      label: 'Programme Name',
      render: (entity) => (
        <span className="font-medium text-lg">{(entity as Programme).name}</span>
      ),
    },
    {
      key: 'code',
      label: 'Programme Code',
      type: 'text',
      formatter: (value) => (value as string) || '-',
    },
    {
      key: 'level',
      label: 'Level',
      render: (entity) => (
        <Badge variant="outline">Level {(entity as Programme).level}</Badge>
      ),
    },
    {
      key: 'department_name',
      label: 'Department',
      type: 'text',
    },
    {
      key: 'total_class_groups',
      label: 'Total Classes',
      type: 'number',
      render: (entity) => (
        <Badge variant="secondary">{(entity as Programme).total_class_groups || 0}</Badge>
      ),
    },
    {
      key: 'total_trainees',
      label: 'Total Trainees',
      type: 'number',
      render: (entity) => (
        <Badge variant="outline">{(entity as Programme).total_trainees || 0}</Badge>
      ),
    },
    { key: 'created_at', label: 'Created At', type: 'datetime' },
    { key: 'updated_at', label: 'Last Updated', type: 'datetime' },
  ],
  layout: 'grid',
  gridColumns: 2,
};
