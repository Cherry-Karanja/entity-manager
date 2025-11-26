/**
 * Timetable Settings Configuration Index
 * 
 * Main configuration file that exports all timetable settings management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { TimetableSettings } from '../../types';

// Import individual configs
import { timetableSettingsFields } from './fields';
import { timetableSettingsColumns } from './list';
import { timetableSettingsViewConfig } from './view';
import { timetableSettingsActions } from './actions';
import { timetableSettingsExportConfig } from './export';

/**
 * Complete timetable settings entity configuration for the Entity Manager
 */
export const timetableSettingsConfig: EntityConfig<TimetableSettings> = {
  // Basic Metadata
  name: 'timetableSettings',
  label: 'Timetable Settings',
  labelPlural: 'Timetable Settings',
  description: 'Settings and constraints for timetable generation',

  // List View Configuration
  list: { columns: timetableSettingsColumns },

  // Form Configuration
  form: { fields: timetableSettingsFields },

  // Detail View Configuration
  view: timetableSettingsViewConfig,

  // Actions Configuration
  actions: timetableSettingsActions,

  // Export Configuration
  exporter: timetableSettingsExportConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/timetable-settings/',

  // icon
  icon: 'Settings',

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
    tags: ['timetable', 'settings', 'constraints'],
  },
};

// Export individual configs with proper names
export { timetableSettingsFields, timetableSettingsFields as timetableSettingFields } from './fields';
export { timetableSettingsColumns, timetableSettingsColumns as timetableSettingListConfig } from './list';
export { timetableSettingsViewConfig, timetableSettingsViewConfig as timetableSettingViewConfig } from './view';
export { timetableSettingsActions, timetableSettingsActions as timetableSettingActionsConfig } from './actions';
export { timetableSettingsExportConfig, timetableSettingsExportConfig as timetableSettingExportConfig } from './export';
