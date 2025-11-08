// Unified WebSocket Handler for Entity Manager v2
// Combines all WebSocket connection logic from v1 into a single, cohesive module

// Core WebSocket client and manager
export { WebSocketClient, createWebSocketClient, createEntityWebSocketClient, createNotificationWebSocketClient } from './client';
export { WebSocketManager, getGlobalWebSocketManager, setGlobalWebSocketManager, resetGlobalWebSocketManager } from './manager';

// React hooks
export {
  useWebSocket,
  useEntityWebSocket,
  usePresenceWebSocket,
  useNotificationWebSocket
} from './hooks';

// Types
export {
  ConnectionState,
  MessageType
} from './types';

export type {
  WebSocketMessage,
  BaseWebSocketMessage,
  EntityMessage,
  PresenceMessage,
  NotificationMessage,
  BroadcastMessage,
  SystemMessage,
  CustomMessage,
  ConnectionConfig,
  ConnectionCallbacks,
  WebSocketHookOptions,
  WebSocketHookReturn,
  EntityWebSocketOptions,
  PresenceWebSocketOptions,
  RealTimeEntityUpdate,
  CollaborativeSession,
  CollaborativeParticipant,
  EntityChange,
  PresenceMetadata,
  MessageHandler,
  ConnectionStateHandler,
  ErrorHandler
} from './types';

// Error classes
export { WebSocketError, ConnectionError, AuthenticationError, MessageParseError } from './types';

// Configuration presets
export { DEFAULT_CONNECTION_CONFIG, FAST_RECONNECT_CONFIG, SLOW_RECONNECT_CONFIG } from './types';