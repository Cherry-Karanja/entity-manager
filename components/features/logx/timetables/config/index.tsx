/**
 * Timetable Configuration Index
 * Exports all timetable-related configurations
 */

export { timetableFields } from './fields';
export { timetableColumns, timetableColumns as timetableListConfig } from './list';
export { timetableViewConfig } from './view';
export { timetableActionsConfig } from './actions';
export { timetableExportConfig } from './export';

import { timetableFields } from './fields';
import { timetableColumns } from './list';
import { timetableViewConfig } from './view';
import { timetableActionsConfig } from './actions';
import { timetableExportConfig } from './export';

// Combined config object for EntityManager
import type { EntityConfig } from '@/components/entityManager/composition/config/types';
import type { Timetable } from '../../types';

export const timetableConfig: EntityConfig<Timetable> = {
  name: 'timetable',
  label: 'Timetable',
  labelPlural: 'Timetables',
  description: 'Academic timetables and schedules',
  list: { columns: timetableColumns },
  form: { fields: timetableFields },
  view: timetableViewConfig,
  actions: timetableActionsConfig,
  exporter: timetableExportConfig,
  apiEndpoint: '/api/v1/logx/timetabling/timetables/',
  icon: 'Calendar',
  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { category: 'scheduling', tags: ['timetables'] },
};

export default timetableConfig;
