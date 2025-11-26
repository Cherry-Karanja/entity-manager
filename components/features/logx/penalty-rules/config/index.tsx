/**
 * Penalty Rule Configuration Index
 * 
 * Main configuration file that exports all penalty rule management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { PenaltyRule } from '../../types';

// Import individual configs
import { penaltyRuleFields } from './fields';
import { penaltyRuleColumns } from './list';
import { penaltyRuleViewConfig } from './view';
import { penaltyRuleActionsConfig } from './actions';
import { penaltyRuleExportConfig } from './export';

/**
 * Complete penalty rule entity configuration for the Entity Manager
 */
export const penaltyRuleConfig: EntityConfig<PenaltyRule> = {
  // Basic Metadata
  name: 'penaltyRule',
  label: 'Penalty Rule',
  labelPlural: 'Penalty Rules',
  description: 'Rules for calculating scheduling penalties',

  // List View Configuration
  list: { columns: penaltyRuleColumns },

  // Form Configuration
  form: { fields: penaltyRuleFields },

  // Detail View Configuration
  view: penaltyRuleViewConfig,

  // Actions Configuration
  actions: penaltyRuleActionsConfig,

  // Export Configuration
  exporter: penaltyRuleExportConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/penalty-rules/',

  // icon
  icon: 'AlertTriangle',

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
    tags: ['penalty', 'rules', 'scheduling'],
  },
};

// Export individual configs
export { penaltyRuleFields } from './fields';
export { penaltyRuleColumns, penaltyRuleColumns as penaltyRuleListConfig } from './list';
export { penaltyRuleViewConfig } from './view';
export { penaltyRuleActionsConfig } from './actions';
export { penaltyRuleExportConfig } from './export';
