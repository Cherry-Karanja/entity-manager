/**
 * Timetables Feature Index
 * Main export file for timetables feature
 */

export { timetablesApiClient, timetablesClient, timetableActions } from './api/client';
export {
  timetableConfig,
  timetableFields,
  TimetableFormConfig,
  TimetableListConfig,
  timetableListConfig,
  timetableColumns,
  TimetableViewConfig,
  timetableViewConfig,
  timetableViewFields,
  timetableViewGroups,
  TimetableActionsConfig,
  timetableActionsConfig,
  TimetableExporterConfig,
  timetableExportConfig,
} from './config';

// Export ScheduleEditor component for interactive timetable editing
export { default as ScheduleEditor } from './components/ScheduleEditor';

// Re-export API client with expected name for backward compatibility
export { timetablesApiClient as timetableClient } from './api/client';
