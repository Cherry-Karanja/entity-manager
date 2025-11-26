/**
 * Virtual Resource Configuration Index
 * 
 * Main configuration file that exports all virtual resource management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { VirtualResource } from '../../types';

// Import individual configs
import { virtualResourceFields } from './fields';
import { virtualResourceColumns } from './list';
import { virtualResourceViewConfig } from './view';
import { virtualResourceActionsConfig } from './actions';
import { virtualResourceExportConfig } from './export';

/**
 * Complete virtual resource entity configuration for the Entity Manager
 */
export const virtualResourceConfig: EntityConfig<VirtualResource> = {
  // Basic Metadata
  name: 'virtualResource',
  label: 'Virtual Resource',
  labelPlural: 'Virtual Resources',
  description: 'Virtual resources for scheduling (projectors, equipment, etc.)',

  // List View Configuration
  list: { columns: virtualResourceColumns },

  // Form Configuration
  form: { fields: virtualResourceFields },

  // Detail View Configuration
  view: virtualResourceViewConfig,

  // Actions Configuration
  actions: virtualResourceActionsConfig,

  // Export Configuration
  exporter: virtualResourceExportConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/virtual-resources/',

  // icon
  icon: 'Cpu',

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
    tags: ['resource', 'virtual', 'equipment'],
  },
};

// Export individual configs
export { virtualResourceFields } from './fields';
export { virtualResourceColumns, virtualResourceColumns as virtualResourceListConfig } from './list';
export { virtualResourceViewConfig } from './view';
export { virtualResourceActionsConfig } from './actions';
export { virtualResourceExportConfig } from './export';
