/**
 * Timetable Constraint Configuration Index
 * 
 * Main configuration file that exports all timetable constraint management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { TimetableConstraint } from '../../types';

// Import individual configs
import { timetableConstraintFields } from './fields';
import { timetableConstraintColumns } from './list';
import { timetableConstraintViewConfig } from './view';
import { timetableConstraintActionsConfig } from './actions';
import { timetableConstraintExportConfig } from './export';

/**
 * Complete timetable constraint entity configuration for the Entity Manager
 */
export const timetableConstraintConfig: EntityConfig<TimetableConstraint> = {
  // Basic Metadata
  name: 'timetableConstraint',
  label: 'Timetable Constraint',
  labelPlural: 'Timetable Constraints',
  description: 'Constraints for timetable generation and scheduling',

  // List View Configuration
  list: { columns: timetableConstraintColumns },

  // Form Configuration
  form: { fields: timetableConstraintFields },

  // Detail View Configuration
  view: timetableConstraintViewConfig,

  // Actions Configuration
  actions: timetableConstraintActionsConfig,

  // Export Configuration
  exporter: timetableConstraintExportConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/timetable-constraints/',

  // icon
  icon: 'Lock',

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
    tags: ['timetable', 'constraints', 'rules'],
  },
};

// Export individual configs
export { timetableConstraintFields } from './fields';
export { timetableConstraintColumns, timetableConstraintColumns as timetableConstraintListConfig } from './list';
export { timetableConstraintViewConfig } from './view';
export { timetableConstraintActionsConfig } from './actions';
export { timetableConstraintExportConfig } from './export';
