/**
 * Room Configuration Index
 * Exports all room-related configurations
 */

export { roomFields } from './fields';
export { roomColumns, roomColumns as roomListConfig } from './list';
export { roomViewConfig } from './view';
export { roomActions, roomActions as roomActionsConfig } from './actions';
export { roomExportConfig } from './export';

import { roomFields } from './fields';
import { roomColumns } from './list';
import { roomViewConfig } from './view';
import { roomActions } from './actions';
import { roomExportConfig } from './export';

// Combined config object for EntityManager
import type { EntityConfig } from '@/components/entityManager/composition/config/types';
import type { Room } from '../../types';

export const roomConfig: EntityConfig<Room> = {
  name: 'room',
  label: 'Room',
  labelPlural: 'Rooms',
  description: 'Physical rooms and facilities',
  list: { columns: roomColumns },
  form: { fields: roomFields },
  view: roomViewConfig,
  actions: roomActions,
  exporter: roomExportConfig,
  apiEndpoint: '/api/v1/resources/rooms/',
  icon: 'DoorOpen',
  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { category: 'scheduling', tags: ['rooms', 'resources'] },
};

export default roomConfig;
