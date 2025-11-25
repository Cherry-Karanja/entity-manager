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
export const timetableConfig = {
  fields: timetableFields,
  columns: timetableColumns,
  view: timetableViewConfig,
  actions: timetableActionsConfig,
  export: timetableExportConfig,
};
