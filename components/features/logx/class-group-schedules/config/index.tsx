/**
 * Class Group Schedule Configuration Index
 * 
 * Main configuration file that exports all class group schedule management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroupSchedule } from '../../types';

// Import individual configs
import { classGroupScheduleFields } from './fields';
import { classGroupScheduleColumns } from './list';
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
  list: { columns: classGroupScheduleColumns },

  // Form Configuration
  form: { fields: classGroupScheduleFields },

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
export { classGroupScheduleFields } from './fields';
export { classGroupScheduleColumns, classGroupScheduleColumns as classGroupScheduleListConfig } from './list';
export { classGroupScheduleViewConfig } from './view';
export { classGroupScheduleActionsConfig } from './actions';
export { classGroupScheduleExportConfig } from './export';
