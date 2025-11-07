/**
 * WebSocket Connection Manager for Real-Time Updates
 *
 * Provides robust WebSocket connection management with:
 * - Auto-reconnect functionality
 * - Heartbeat monitoring
 * - Connection state tracking
 * - Message queuing during disconnection
 * - Event-driven architecture for real-time updates
 */

import {
  ConnectionState,
  MessageType,
  WebSocketMessage,
  BaseWebSocketMessage,
  ConnectionConfig,
  ConnectionCallbacks
} from '../types/websocket';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: ConnectionConfig;
  private callbacks: ConnectionCallbacks;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private messageQueue: BaseWebSocketMessage[] = [];
  private isDestroyed = false;

  constructor(config: ConnectionConfig, callbacks: ConnectionCallbacks = {}) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatTimeout: 10000,
      ...config
    };
    this.callbacks = callbacks;
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.isDestroyed || this.state === ConnectionState.CONNECTING) {
      return;
    }

    this.setState(ConnectionState.CONNECTING);

    try {
      this.ws = new WebSocket(this.config.url, this.config.protocols);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      this.handleConnectionError(error as Event);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.clearTimers();
    this.isDestroyed = true;

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.setState(ConnectionState.DISCONNECTED);
  }

  /**
   * Send message to server
   */
  send(message: Omit<BaseWebSocketMessage, 'timestamp'>): boolean {
    const fullMessage: BaseWebSocketMessage = {
      ...message,
      timestamp: Date.now()
    };

    if (this.state === ConnectionState.CONNECTED && this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(fullMessage));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        this.messageQueue.push(fullMessage);
        return false;
      }
    } else {
      // Queue message for later sending
      this.messageQueue.push(fullMessage);
      return false;
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED;
  }

  /**
   * Get queued messages count
   */
  getQueuedMessagesCount(): number {
    return this.messageQueue.length;
  }

  /**
   * Clear message queue
   */
  clearMessageQueue(): void {
    this.messageQueue = [];
  }

  private setState(newState: ConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.callbacks.onStateChange?.(newState);
    }
  }

  private handleOpen(): void {
    console.log('WebSocket connected');
    this.setState(ConnectionState.CONNECTED);
    this.reconnectAttempts = 0;
    this.callbacks.onConnect?.();

    // Send authentication if token provided
    if (this.config.authToken) {
      this.send({
        type: MessageType.CONNECTION_ACK,
        payload: { token: this.config.authToken }
      });
    }

    // Start heartbeat
    this.startHeartbeat();

    // Send queued messages
    this.flushMessageQueue();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.callbacks.onMessage?.(message);

      // Handle heartbeat response
      if (message.type === MessageType.HEARTBEAT) {
        this.resetHeartbeatTimeout();
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.clearTimers();
    this.setState(ConnectionState.DISCONNECTED);
    this.callbacks.onDisconnect?.();

    // Attempt reconnect if not intentionally closed
    if (!this.isDestroyed && event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.callbacks.onError?.(event);
    this.setState(ConnectionState.ERROR);
  }

  private handleConnectionError(error: Event): void {
    console.error('WebSocket connection error:', error);
    this.setState(ConnectionState.ERROR);
    this.callbacks.onError?.(error);

    if (!this.isDestroyed) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.setState(ConnectionState.RECONNECTING);
    this.callbacks.onReconnect?.();

    const delay = (this.config.reconnectInterval || 5000) * Math.min(this.reconnectAttempts, 5); // Exponential backoff

    this.reconnectTimer = setTimeout(() => {
      if (!this.isDestroyed) {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: MessageType.HEARTBEAT, payload: {} });
        this.startHeartbeatTimeout();
      }
    }, this.config.heartbeatInterval);
  }

  private startHeartbeatTimeout(): void {
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('Heartbeat timeout - connection may be lost');
      if (this.ws) {
        this.ws.close(1008, 'Heartbeat timeout');
      }
    }, this.config.heartbeatTimeout);
  }

  private resetHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }
}

// Singleton instance for global WebSocket management
let globalWebSocketManager: WebSocketManager | null = null;

export function getGlobalWebSocketManager(): WebSocketManager | null {
  return globalWebSocketManager;
}

export function setGlobalWebSocketManager(manager: WebSocketManager): void {
  globalWebSocketManager = manager;
}

export function createWebSocketManager(config: ConnectionConfig, callbacks: ConnectionCallbacks = {}): WebSocketManager {
  return new WebSocketManager(config, callbacks);
}