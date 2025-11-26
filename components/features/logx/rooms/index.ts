/**
 * Rooms Feature Index
 * Main export file for rooms feature
 */

export { roomsApiClient, roomsClient, roomActions } from './api/client';
export {
  roomConfig,
  roomFields,
  RoomFormConfig,
  RoomListConfig,
  roomListConfig,
  roomColumns,
  RoomViewConfig,
  roomViewConfig,
  roomViewFields,
  roomViewGroups,
  RoomActionsConfig,
  roomActionsConfig,
  RoomExporterConfig,
  roomExportConfig,
} from './config';

// Re-export API client with expected name for backward compatibility
export { roomsApiClient as roomClient } from './api/client';
