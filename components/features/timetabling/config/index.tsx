/**
 * Timetable Configuration Index
 * 
 * Main configuration file that exports all timetable management configurations.
 */

import { EntityConfig, EntityExporterConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../types';
import { TimetableFormConfig } from './fields';
import { TimetableListConfig } from './list';
import { TimetableViewConfig } from './view';
import { TimetableActionsConfig } from './actions';

/**
 * Timetable exporter configuration
 */
export const TimetableExporterConfig: EntityExporterConfig<Timetable> = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'academic_year', label: 'Academic Year' },
    { key: 'term', label: 'Term' },
    { key: 'status', label: 'Status' },
    { key: 'is_active', label: 'Active' },
    { key: 'is_published', label: 'Published' },
    { key: 'version', label: 'Version' },
    { key: 'schedules_count', label: 'Schedules' },
    { key: 'conflicts_count', label: 'Conflicts' },
    { key: 'fitness_score', label: 'Quality Score' },
    { key: 'created_at', label: 'Created At' },
  ],
  options: {
    format: 'csv',
    filename: 'timetables',
    includeHeaders: true,
  },
  buttonLabel: 'Export Timetables',
};

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
  description: 'Manage school timetables with automated generation using Google OR-Tools',

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
  // Exporter Configuration
  // ===========================
  exporter: TimetableExporterConfig,

  // ===========================
  // Validation
  // ===========================
  onValidate: async (values: Partial<Timetable>) => {
    const errors: Record<string, string> = {};

    // Basic validation
    if (!values.name?.trim()) {
      errors.name = 'Timetable name is required';
    } else if (values.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (values.name.length > 200) {
      errors.name = 'Name must be less than 200 characters';
    }

    if (!values.academic_year?.trim()) {
      errors.academic_year = 'Academic year is required';
    }

    if (!values.term?.trim()) {
      errors.term = 'Term is required';
    }

    // Description validation (optional but with max length)
    if (values.description && values.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    return errors;
  },

  // API endpoint
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
    color: 'purple',
    category: 'timetabling',
    tags: ['timetable', 'schedule', 'generation', 'or-tools'],
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
