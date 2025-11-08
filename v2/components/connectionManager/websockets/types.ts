/**
 * WebSocket and Real-Time Message Types for Entity Manager v2
 *
 * Comprehensive type definitions for real-time communication,
 * entity updates, user presence, and collaborative features.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

export enum MessageType {
  // Entity operations
  ENTITY_CREATED = 'entity_created',
  ENTITY_UPDATED = 'entity_updated',
  ENTITY_DELETED = 'entity_deleted',
  ENTITY_BULK_UPDATED = 'entity_bulk_updated',

  // User presence and collaboration
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  USER_VIEWING = 'user_viewing',
  USER_EDITING = 'user_editing',
  USER_EDITING_STARTED = 'user_editing_started',
  USER_EDITING_STOPPED = 'user_editing_stopped',

  // System messages
  CONNECTION_ACK = 'connection_ack',
  HEARTBEAT = 'heartbeat',
  HEARTBEAT_RESPONSE = 'heartbeat_response',
  ERROR = 'error',
  PING = 'ping',
  PONG = 'pong',

  // Notifications and broadcasts
  NOTIFICATION = 'notification',
  BROADCAST = 'broadcast',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',

  // Custom application messages
  CUSTOM = 'custom'
}

export interface BaseWebSocketMessage {
  type: MessageType;
  payload: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
}

export interface EntityMessage extends BaseWebSocketMessage {
  type: MessageType.ENTITY_CREATED | MessageType.ENTITY_UPDATED | MessageType.ENTITY_DELETED | MessageType.ENTITY_BULK_UPDATED;
  entityType: string;
  entityId: string | number;
  entityData?: any;
  changes?: EntityChange[];
  previousData?: any;
}

export interface EntityChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'deleted';
}

export interface PresenceMessage extends BaseWebSocketMessage {
  type: MessageType.USER_JOINED | MessageType.USER_LEFT | MessageType.USER_VIEWING | MessageType.USER_EDITING | MessageType.USER_EDITING_STARTED | MessageType.USER_EDITING_STOPPED;
  userId: string;
  userName?: string;
  userAvatar?: string;
  entityType?: string;
  entityId?: string | number;
  action?: string;
  metadata?: PresenceMetadata;
}

export interface PresenceMetadata {
  cursorPosition?: { x: number; y: number };
  viewport?: { width: number; height: number; scrollTop: number; scrollLeft: number };
  editingField?: string;
  lastActivity: number;
}

export interface NotificationMessage extends BaseWebSocketMessage {
  type: MessageType.NOTIFICATION;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  actionText?: string;
  autoClose?: boolean;
  duration?: number;
}

export interface BroadcastMessage extends BaseWebSocketMessage {
  type: MessageType.BROADCAST;
  channel: string;
  data: any;
  recipients?: string[];
}

export interface SystemMessage extends BaseWebSocketMessage {
  type: MessageType.CONNECTION_ACK | MessageType.HEARTBEAT | MessageType.HEARTBEAT_RESPONSE | MessageType.ERROR | MessageType.PING | MessageType.PONG;
  status?: 'ok' | 'error';
  errorMessage?: string;
  version?: string;
  serverTime?: number;
}

export interface CustomMessage extends BaseWebSocketMessage {
  type: MessageType.CUSTOM;
  eventName: string;
  data: any;
}

export type WebSocketMessage =
  | EntityMessage
  | PresenceMessage
  | NotificationMessage
  | BroadcastMessage
  | SystemMessage
  | CustomMessage;

export interface ConnectionConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  authToken?: string;
  userId?: string;
  sessionId?: string;
}

export interface ConnectionCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
  onError?: (error: Event | Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onStateChange?: (state: ConnectionState) => void;
}

export interface WebSocketHookOptions {
  url: string;
  protocols?: string | string[];
  authToken?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  autoConnect?: boolean;
  messageFilter?: (message: WebSocketMessage) => boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event | Error) => void;
  useGlobalManager?: boolean;
}

export interface WebSocketHookReturn {
  isConnected: boolean;
  connectionState: ConnectionState;
  queuedMessagesCount: number;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: Omit<BaseWebSocketMessage, 'timestamp'>) => boolean;
  lastMessage: WebSocketMessage | null;
  messages: WebSocketMessage[];
  clearMessages: () => void;
  manager: any; // WebSocketManager instance
}

// Specialized hook options
export interface EntityWebSocketOptions extends Omit<WebSocketHookOptions, 'messageFilter'> {
  entityType?: string;
  entityId?: string | number;
  operations?: MessageType[];
}

export interface PresenceWebSocketOptions extends Omit<WebSocketHookOptions, 'messageFilter'> {
  includeSelf?: boolean;
  trackPresence?: boolean;
}

// Real-time update types for entity management
export interface RealTimeEntityUpdate {
  entityType: string;
  entityId: string | number;
  operation: 'create' | 'update' | 'delete' | 'bulk_update';
  data: any;
  changes?: EntityChange[];
  timestamp: number;
  userId?: string;
  source: 'websocket' | 'api' | 'local';
}

export interface CollaborativeSession {
  sessionId: string;
  entityType: string;
  entityId: string | number;
  participants: CollaborativeParticipant[];
  lastActivity: number;
  isActive: boolean;
}

export interface CollaborativeParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'viewing' | 'editing' | 'idle';
  lastActivity: number;
  editingField?: string;
  cursorPosition?: { x: number; y: number };
}

// Error types
export class WebSocketError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'WebSocketError';
  }
}

export class ConnectionError extends WebSocketError {
  constructor(message: string, originalError?: any) {
    super(message, 'CONNECTION_ERROR', originalError);
    this.name = 'ConnectionError';
  }
}

export class AuthenticationError extends WebSocketError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class MessageParseError extends WebSocketError {
  constructor(message: string, originalError?: any) {
    super(message, 'MESSAGE_PARSE_ERROR', originalError);
    this.name = 'MessageParseError';
  }
}

// Utility types
export type MessageHandler<T extends WebSocketMessage = WebSocketMessage> = (message: T) => void;
export type ConnectionStateHandler = (state: ConnectionState) => void;
export type ErrorHandler = (error: Event | WebSocketError) => void;

// Configuration presets
export const DEFAULT_CONNECTION_CONFIG: Partial<ConnectionConfig> = {
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  heartbeatTimeout: 10000
};

export const FAST_RECONNECT_CONFIG: Partial<ConnectionConfig> = {
  reconnectInterval: 1000,
  maxReconnectAttempts: 20,
  heartbeatInterval: 15000,
  heartbeatTimeout: 5000
};

export const SLOW_RECONNECT_CONFIG: Partial<ConnectionConfig> = {
  reconnectInterval: 10000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 60000,
  heartbeatTimeout: 15000
};