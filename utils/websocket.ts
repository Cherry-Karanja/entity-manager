import ReconnectingWebSocket from 'reconnecting-websocket';
import authManager from '../handler/AuthManager';

export interface WebSocketMessage {
  type: string;
  data?: any;
  action?: string;
  entity_type?: string;
  entity_id?: string;
  user?: any;
}

export interface WebSocketConfig {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: any) => void;
}

export class WebSocketManager {
  private ws: ReconnectingWebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000; // Start with 1 second

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const token = authManager.getToken();
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      return;
    }

    // Add token to URL as query parameter for authentication
    const url = new URL(this.config.url);
    url.searchParams.set('token', token);

    this.ws = new ReconnectingWebSocket(url.toString(), [], {
      maxReconnectionDelay: 30000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      maxRetries: this.maxReconnectAttempts,
    });

    this.ws.onopen = () => {
      console.log(`WebSocket connected to ${this.config.url}`);
      this.reconnectAttempts = 0;
      this.config.onOpen?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.config.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log(`WebSocket disconnected from ${this.config.url}`);
      this.config.onClose?.();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.config.onError?.(error);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getReadyState(): number | undefined {
    return this.ws?.readyState;
  }
}

// Global WebSocket managers for different connection types
export const notificationWebSocket = new WebSocketManager({
  url: `${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000'}/ws/notifications/`,
});

export const createEntityWebSocket = (entityType: string, entityId: string) => {
  return new WebSocketManager({
    url: `${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000'}/ws/entity/${entityType}/${entityId}/`,
  });
};