/**
 * Class Group Schedule Configuration Index
 * 
 * Main configuration file that exports all class group schedule management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroupSchedule } from '../../types';

// Import individual configs
import { classGroupScheduleFields, ClassGroupScheduleFormConfig } from './fields';
import { classGroupScheduleColumns, ClassGroupScheduleListConfig } from './list';
import { classGroupScheduleViewConfig } from './view';
import { classGroupScheduleActionsConfig } from './actions';
import { classGroupScheduleExportConfig } from './export';

/**
 * Complete class group schedule entity configuration for the Entity Manager
 */
export const classGroupScheduleConfig: EntityConfig<ClassGroupSchedule> = {
  // Basic Metadata
  name: 'classGroupSchedule',
  label: 'Class Schedule',
  labelPlural: 'Class Schedules',
  description: 'Scheduled classes for class groups',

  // List View Configuration
  list: ClassGroupScheduleListConfig,

  // Form Configuration
  form: ClassGroupScheduleFormConfig,

  // Detail View Configuration
  view: classGroupScheduleViewConfig,

  // Actions Configuration
  actions: classGroupScheduleActionsConfig,

  // Export Configuration
  exporter: classGroupScheduleExportConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/class-group-schedules/',

  // icon
  icon: 'CalendarDays',

  // Permissions
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
  },

  // Additional Metadata
  metadata: {
    category: 'scheduling',
    tags: ['schedule', 'class', 'timetable'],
  },
};

// Export individual configs
export { classGroupScheduleFields, ClassGroupScheduleFormConfig } from './fields';
export { classGroupScheduleColumns, ClassGroupScheduleListConfig } from './list';
export { classGroupScheduleViewConfig } from './view';
export { classGroupScheduleActionsConfig } from './actions';
export { classGroupScheduleExportConfig } from './export';

// Backwards-compatible lower-cased exports used by other modules
export const classGroupScheduleListConfig = ClassGroupScheduleListConfig;
export const classGroupScheduleFormConfig = ClassGroupScheduleFormConfig;
