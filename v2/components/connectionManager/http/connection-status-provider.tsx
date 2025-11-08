"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConnectionState } from '../websockets/types';
import { getGlobalWebSocketManager } from '../websockets/manager';
import { WebSocketManager } from '../websockets/manager';

interface ConnectionStatus {
  isConnected: boolean;
  connectionState: ConnectionState;
  lastConnected?: Date;
  lastDisconnected?: Date;
  error?: string;
}

interface ConnectionStatusContextType {
  status: ConnectionStatus;
  refreshStatus: () => void;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextType | undefined>(undefined);

interface ConnectionStatusProviderProps {
  children: ReactNode;
}

export function ConnectionStatusProvider({ children }: ConnectionStatusProviderProps) {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    connectionState: ConnectionState.DISCONNECTED,
  });

  const refreshStatus = () => {
    try {
      // Check WebSocket connection status
      const wsManager = getGlobalWebSocketManager() as WebSocketManager;
      if (wsManager) {
        // For now, we'll assume WebSocket connection status represents overall connectivity
        // In a real app, you might want to check multiple connections
        const activeClients = wsManager.getActiveClients();
        if (activeClients.length > 0) {
          // Get the first client's state as representative
          const firstClient = activeClients[0];
          if (firstClient) {
            const wsState = firstClient.getState();
            const isConnected = firstClient.isConnected();

            setStatus(prev => ({
              ...prev,
              isConnected,
              connectionState: wsState,
              lastConnected: isConnected && !prev.isConnected ? new Date() : prev.lastConnected,
              lastDisconnected: !isConnected && prev.isConnected ? new Date() : prev.lastDisconnected,
              error: wsState === ConnectionState.ERROR ? 'Connection failed' : undefined,
            }));
            return;
          }
        }
      }

      // Fallback: assume connected if no WebSocket manager is available
      // In a real app, you might want to ping an endpoint to check HTTP connectivity
      setStatus(prev => ({
        ...prev,
        isConnected: true,
        connectionState: ConnectionState.CONNECTED,
        lastConnected: prev.lastConnected || new Date(),
      }));
    } catch (error) {
      console.error('Failed to check connection status:', error);
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        connectionState: ConnectionState.ERROR,
        error: 'Failed to check connection status',
        lastDisconnected: new Date(),
      }));
    }
  };

  useEffect(() => {
    // Initial status check
    refreshStatus();

    // Set up periodic status checks
    const interval = setInterval(refreshStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionStatusContext.Provider value={{ status, refreshStatus }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
}

export function useConnectionStatus() {
  const context = useContext(ConnectionStatusContext);
  if (context === undefined) {
    throw new Error('useConnectionStatus must be used within a ConnectionStatusProvider');
  }
  return context;
}