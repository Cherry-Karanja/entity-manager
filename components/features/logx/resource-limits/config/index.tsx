/**
 * Resource Limit Configuration Index
 * 
 * Main configuration file that exports all resource limit management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { ResourceLimit } from '../../types';
import { ResourceLimitFormConfig } from './fields';
import { ResourceLimitListConfig } from './list';
import { ResourceLimitViewConfig } from './view';
import { ResourceLimitActionsConfig } from './actions';
import { ResourceLimitExporterConfig } from './export';

/**
 * Complete resource limit entity configuration for the Entity Manager
 */
export const resourceLimitConfig: EntityConfig<ResourceLimit> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'resourceLimit',
  label: 'Resource Limit',
  labelPlural: 'Resource Limits',
  description: 'Limits for resource usage within timetables',

  // ===========================
  // List View Configuration
  // ===========================
  list: ResourceLimitListConfig,

  // ===========================
  // Form Configuration
  // ===========================
  form: ResourceLimitFormConfig,

  // ===========================
  // Detail View Configuration
  // ===========================
  view: ResourceLimitViewConfig,

  // ===========================
  // Actions Configuration
  // ===========================
  actions: ResourceLimitActionsConfig,

  // ===========================
  // Export Configuration
  // ===========================
  exporter: ResourceLimitExporterConfig,

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/resource-limits/',

  // icon
  icon: 'Gauge',

  // ===========================
  // Permissions
  // ===========================
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
  },

  // ===========================
  // Additional Metadata
  // ===========================
  metadata: {
    category: 'scheduling',
    tags: ['resource', 'limits', 'timetabling'],
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './export';
