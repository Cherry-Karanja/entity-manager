/**
 * Timetable Configuration Index
 * 
 * Main configuration file that exports all timetable management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../../types';
import { TimetableFormConfig } from './fields';
import { TimetableListConfig } from './list';
import { TimetableViewConfig } from './view';
import { TimetableActionsConfig } from './actions';
import { TimetableExporterConfig } from './export';

/**
 * Complete timetable entity configuration for the Entity Manager
 */
export const timetableConfig: EntityConfig<Timetable> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'timetable',
  label: 'Timetable',
  labelPlural: 'Timetables',
  description: 'Academic timetables and schedules',

  // ===========================
  // List View Configuration
  // ===========================
  list: TimetableListConfig,

  // ===========================
  // Form Configuration
  // ===========================
  form: TimetableFormConfig,

  // ===========================
  // Detail View Configuration
  // ===========================
  view: TimetableViewConfig,

  // ===========================
  // Actions Configuration
  // ===========================
  actions: TimetableActionsConfig,

  // ===========================
  // Export Configuration
  // ===========================
  exporter: TimetableExporterConfig,

  // ===========================
  // Validation
  // ===========================
  onValidate: async (values: Partial<Timetable>) => {
    const errors: Record<string, string> = {};

    if (!values.name?.trim()) {
      errors.name = 'Timetable name is required';
    }

    if (!values.academic_year) {
      errors.academic_year = 'Academic year is required';
    }

    if (!values.term) {
      errors.term = 'Term is required';
    }

    if (!values.start_date) {
      errors.start_date = 'Start date is required';
    }

    if (!values.end_date) {
      errors.end_date = 'End date is required';
    }

    if (values.start_date && values.end_date && new Date(values.start_date) >= new Date(values.end_date)) {
      errors.end_date = 'End date must be after start date';
    }

    return errors;
  },

  // Api endpoint
  apiEndpoint: '/api/v1/timetabling/timetables/',

  // icon
  icon: 'Calendar',

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
    color: 'blue',
    category: 'scheduling',
    tags: ['timetables', 'scheduling', 'academic'],
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './export';
