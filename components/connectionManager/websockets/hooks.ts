"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient } from './client';
import { WebSocketManager, getGlobalWebSocketManager } from './manager';
import {
  ConnectionState,
  MessageType,
  WebSocketMessage,
  BaseWebSocketMessage,
  WebSocketHookOptions,
  WebSocketHookReturn
} from './types';

/**
 * Main WebSocket hook for managing connections
 */
export function useWebSocket(options: WebSocketHookOptions): WebSocketHookReturn {
  const {
    url,
    protocols,
    authToken,
    reconnectInterval,
    maxReconnectAttempts,
    heartbeatInterval,
    autoConnect = true,
    messageFilter,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    useGlobalManager = true
  } = options;

  // State
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [queuedMessagesCount, setQueuedMessagesCount] = useState(0);

  // Refs
  const managerRef = useRef<WebSocketManager | null>(null);
  const clientRef = useRef<WebSocketClient | null>(null);
  const messagesRef = useRef<WebSocketMessage[]>([]);
  const isMountedRef = useRef(true);

  // Computed values
  const isConnected = connectionState === ConnectionState.CONNECTED;

  // Message handler
  const handleMessage = useCallback((message: WebSocketMessage) => {
    // Apply filter if provided
    if (messageFilter && !messageFilter(message)) {
      return;
    }

    // Update state
    if (isMountedRef.current) {
      setLastMessage(message);
      const newMessages = [...messagesRef.current, message];
      messagesRef.current = newMessages;
      setMessages(newMessages);
    }

    // Call custom handler
    onMessage?.(message);
  }, [messageFilter, onMessage]);

  // State change handler
  const handleStateChange = useCallback((state: ConnectionState) => {
    if (isMountedRef.current) {
      setConnectionState(state);
    }
  }, []);

  // Queue count updater
  const updateQueueCount = useCallback(() => {
    if (clientRef.current && isMountedRef.current) {
      setQueuedMessagesCount(clientRef.current.getQueuedMessagesCount());
    }
  }, []);

  // Initialize client
  const initializeClient = useCallback(() => {
    let manager: WebSocketManager;
    let client: WebSocketClient;

    if (useGlobalManager) {
      manager = getGlobalWebSocketManager();
      client = manager.getClient(url, {
        protocols,
        authToken,
        reconnectInterval,
        maxReconnectAttempts,
        heartbeatInterval
      }, {
        onConnect,
        onDisconnect,
        onError,
        onMessage: handleMessage,
        onStateChange: (state) => {
          handleStateChange(state);
          updateQueueCount();
        }
      });

      managerRef.current = manager;
    } else {
      // Create a new manager instance for this hook
      manager = new WebSocketManager();
      client = manager.getClient(url, {
        protocols,
        authToken,
        reconnectInterval,
        maxReconnectAttempts,
        heartbeatInterval
      }, {
        onConnect,
        onDisconnect,
        onError,
        onMessage: handleMessage,
        onStateChange: (state) => {
          handleStateChange(state);
          updateQueueCount();
        }
      });

      managerRef.current = manager;
    }

    clientRef.current = client;
    return client;
  }, [
    url,
    protocols,
    authToken,
    reconnectInterval,
    maxReconnectAttempts,
    heartbeatInterval,
    useGlobalManager,
    onConnect,
    onDisconnect,
    onError,
    handleMessage,
    handleStateChange,
    updateQueueCount
  ]);

  // Connect function
  const connect = useCallback(() => {
    if (!clientRef.current) {
      initializeClient();
    }
    clientRef.current?.connect();
  }, [initializeClient]);

  // Disconnect function
  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  // Send message function
  const sendMessage = useCallback((message: Omit<BaseWebSocketMessage, 'timestamp'>): boolean => {
    if (clientRef.current) {
      const success = clientRef.current.send(message);
      updateQueueCount();
      return success;
    }
    return false;
  }, [updateQueueCount]);

  // Clear messages function
  const clearMessages = useCallback(() => {
    messagesRef.current = [];
    if (isMountedRef.current) {
      setMessages([]);
      setLastMessage(null);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    isMountedRef.current = true;

    if (autoConnect) {
      connect();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoConnect, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Don't disconnect global manager clients on unmount, let them persist
      if (!useGlobalManager && managerRef.current) {
        managerRef.current.disconnectAll();
      }
    };
  }, [useGlobalManager]);

  // Update queue count periodically
  useEffect(() => {
    const interval = setInterval(updateQueueCount, 1000);
    return () => clearInterval(interval);
  }, [updateQueueCount]);

  return {
    isConnected,
    connectionState,
    queuedMessagesCount,
    connect,
    disconnect,
    sendMessage,
    lastMessage,
    messages,
    clearMessages,
    manager: managerRef.current
  };
}

/**
 * Specialized hook for entity-specific WebSocket connections
 */
export interface UseEntityWebSocketOptions extends Omit<WebSocketHookOptions, 'messageFilter'> {
  entityType?: string;
  entityId?: string | number;
  operations?: MessageType[];
}

export function useEntityWebSocket(options: UseEntityWebSocketOptions) {
  const { entityType, entityId, operations = [], ...webSocketOptions } = options;

  const messageFilter = useCallback((message: WebSocketMessage) => {
    // Filter by entity type if specified
    if (entityType && 'entityType' in message && message.entityType !== entityType) {
      return false;
    }

    // Filter by entity ID if specified
    if (entityId !== undefined && 'entityId' in message && message.entityId !== entityId) {
      return false;
    }

    // Filter by operations if specified
    if (operations.length > 0 && !operations.includes(message.type)) {
      return false;
    }

    return true;
  }, [entityType, entityId, operations]);

  return useWebSocket({
    ...webSocketOptions,
    messageFilter
  });
}

/**
 * Specialized hook for presence WebSocket connections
 */
export function usePresenceWebSocket(options: Omit<WebSocketHookOptions, 'messageFilter'>) {
  const messageFilter = useCallback((message: WebSocketMessage) => {
    return [
      MessageType.USER_JOINED,
      MessageType.USER_LEFT,
      MessageType.USER_VIEWING,
      MessageType.USER_EDITING
    ].includes(message.type);
  }, []);

  return useWebSocket({
    ...options,
    messageFilter
  });
}

/**
 * Specialized hook for notification WebSocket connections
 */
export function useNotificationWebSocket(options: Omit<WebSocketHookOptions, 'messageFilter'>) {
  const messageFilter = useCallback((message: WebSocketMessage) => {
    return message.type === MessageType.NOTIFICATION;
  }, []);

  return useWebSocket({
    ...options,
    messageFilter
  });
}