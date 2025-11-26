/**
 * Room Configuration Index
 * 
 * Main configuration file that exports all room management configurations.
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Room } from '../../types';
import { RoomFormConfig } from './fields';
import { RoomListConfig } from './list';
import { RoomViewConfig } from './view';
import { RoomActionsConfig } from './actions';
import { RoomExporterConfig } from './export';

/**
 * Complete room entity configuration for the Entity Manager
 */
export const roomConfig: EntityConfig<Room> = {
  // ===========================
  // Basic Metadata
  // ===========================
  name: 'room',
  label: 'Room',
  labelPlural: 'Rooms',
  description: 'Physical rooms and facilities for scheduling',

  // ===========================
  // List View Configuration
  // ===========================
  list: RoomListConfig,

  // ===========================
  // Form Configuration
  // ===========================
  form: RoomFormConfig,

  // ===========================
  // Detail View Configuration
  // ===========================
  view: RoomViewConfig,

  // ===========================
  // Actions Configuration
  // ===========================
  actions: RoomActionsConfig,

  // ===========================
  // Export Configuration
  // ===========================
  exporter: RoomExporterConfig,

  // ===========================
  // Validation
  // ===========================
  onValidate: async (values: Partial<Room>) => {
    const errors: Record<string, string> = {};

    if (!values.name?.trim()) {
      errors.name = 'Room name is required';
    }

    if (!values.code?.trim()) {
      errors.code = 'Room code is required';
    }

    if (!values.department) {
      errors.department = 'Department is required';
    }

    if (!values.room_type) {
      errors.room_type = 'Room type is required';
    }

    if (!values.capacity || values.capacity < 1) {
      errors.capacity = 'Capacity must be at least 1';
    }

    return errors;
  },

  // Api endpoint
  apiEndpoint: '/api/v1/resources/rooms/',

  // icon
  icon: 'DoorOpen',

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
    tags: ['rooms', 'resources', 'facilities'],
  },
};

// Export all configurations
export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './export';
