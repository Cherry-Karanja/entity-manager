/**
 * Room Configuration Index
 * Exports all room-related configurations
 */

export { roomFields } from './fields';
export { roomColumns } from './list';
export { roomViewConfig } from './view';
export { roomActions } from './actions';
export { roomExportConfig } from './export';

import { roomFields } from './fields';
import { roomColumns } from './list';
import { roomViewConfig } from './view';
import { roomActions } from './actions';
import { roomExportConfig } from './export';

// Combined config object for EntityManager
export const roomConfig = {
  fields: roomFields,
  columns: roomColumns,
  view: roomViewConfig,
  actions: roomActions,
  export: roomExportConfig,
};
