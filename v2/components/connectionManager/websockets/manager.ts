/* eslint-disable @typescript-eslint/no-explicit-any */

import { WebSocketClient, createWebSocketClient } from './client';
import { ConnectionConfig, ConnectionCallbacks } from './types';

/**
 * WebSocket Manager for global connection management
 *
 * Provides singleton management of WebSocket connections
 * with automatic cleanup and state tracking.
 */
export class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private clientCallbacks: Map<string, ConnectionCallbacks> = new Map();

  constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  /**
   * Create or get a WebSocket client for a specific URL
   */
  getClient(url: string, config?: Partial<ConnectionConfig>, callbacks?: ConnectionCallbacks): WebSocketClient {
    const key = this.getClientKey(url, config);

    if (!this.clients.has(key)) {
      const fullConfig: ConnectionConfig = {
        url,
        ...config
      };

      const client = createWebSocketClient(fullConfig, callbacks);
      this.clients.set(key, client);

      if (callbacks) {
        this.clientCallbacks.set(key, callbacks);
      }
    }

    return this.clients.get(key)!;
  }

  /**
   * Create an entity-specific WebSocket client
   */
  getEntityClient(
    entityType: string,
    entityId: string | number,
    baseUrl: string = 'ws://127.0.0.1:8000',
    callbacks?: ConnectionCallbacks
  ): WebSocketClient {
    const url = `${baseUrl}/ws/entity/${entityType}/${entityId}/`;
    return this.getClient(url, {}, callbacks);
  }

  /**
   * Create a notifications WebSocket client
   */
  getNotificationClient(
    baseUrl: string = 'ws://127.0.0.1:8000',
    callbacks?: ConnectionCallbacks
  ): WebSocketClient {
    const url = `${baseUrl}/ws/notifications/`;
    return this.getClient(url, {}, callbacks);
  }

  /**
   * Disconnect a specific client
   */
  disconnectClient(url: string, config?: Partial<ConnectionConfig>): void {
    const key = this.getClientKey(url, config);
    const client = this.clients.get(key);

    if (client) {
      client.disconnect();
      this.clients.delete(key);
      this.clientCallbacks.delete(key);
    }
  }

  /**
   * Disconnect all clients
   */
  disconnectAll(): void {
    for (const client of this.clients.values()) {
      client.disconnect();
    }
    this.clients.clear();
    this.clientCallbacks.clear();
  }

  /**
   * Get all active clients
   */
  getActiveClients(): WebSocketClient[] {
    return Array.from(this.clients.values());
  }

  /**
   * Get client connection states
   */
  getClientStates(): Record<string, any> {
    const states: Record<string, any> = {};

    for (const [key, client] of this.clients.entries()) {
      states[key] = {
        state: client.getState(),
        isConnected: client.isConnected(),
        queuedMessages: client.getQueuedMessagesCount(),
        readyState: client.getReadyState()
      };
    }

    return states;
  }

  /**
   * Check if any client is connected
   */
  hasActiveConnections(): boolean {
    return Array.from(this.clients.values()).some(client => client.isConnected());
  }

  private getClientKey(url: string, config?: Partial<ConnectionConfig>): string {
    // Create a unique key based on URL and relevant config
    const keyParts = [url];

    if (config?.protocols) {
      keyParts.push(Array.isArray(config.protocols) ? config.protocols.join(',') : config.protocols);
    }

    if (config?.userId) {
      keyParts.push(config.userId);
    }

    return keyParts.join('|');
  }
}

// Global instance
let globalWebSocketManager: WebSocketManager | null = null;

/**
 * Get the global WebSocket manager instance
 */
export function getGlobalWebSocketManager(): WebSocketManager {
  if (!globalWebSocketManager) {
    globalWebSocketManager = WebSocketManager.getInstance();
  }
  return globalWebSocketManager;
}

/**
 * Set a custom global WebSocket manager
 */
export function setGlobalWebSocketManager(manager: WebSocketManager): void {
  globalWebSocketManager = manager;
}

/**
 * Reset the global WebSocket manager
 */
export function resetGlobalWebSocketManager(): void {
  if (globalWebSocketManager) {
    globalWebSocketManager.disconnectAll();
  }
  globalWebSocketManager = null;
}