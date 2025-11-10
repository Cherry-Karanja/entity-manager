"use client";

import { useState, useEffect } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  lastChecked: Date;
}

/**
 * Simple hook to check internet connectivity using navigator.onLine
 * Much simpler than the previous complex implementation
 */
export function useConnectionStatus(): ConnectionStatus {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    lastChecked: new Date(),
  };
}

/**
 * Hook to get connection status color for UI components
 */
export function useConnectionStatusColor() {
  const { isOnline } = useConnectionStatus();

  if (!isOnline) {
    return {
      color: 'red',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-700 dark:text-red-400',
      dotColor: 'bg-red-500',
      status: 'Offline',
    };
  }

  return {
    color: 'green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-700 dark:text-green-400',
    dotColor: 'bg-green-500',
    status: 'Online',
  };
}