"use client";

import { useQuery } from '@tanstack/react-query';

export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  connectionQuality: 'offline' | 'weak' | 'good';
  latency?: number;
  lastChecked: Date;
}

/**
 * Hook to check internet connectivity using TanStack Query
 * Performs periodic connectivity checks and caches results
 */
export function useConnectionStatus() {
  return useQuery<ConnectionStatus>({
    queryKey: ['connection-status'],
    queryFn: async (): Promise<ConnectionStatus> => {
      const startTime = Date.now();

      try {
        // Check basic online status
        const isOnline = navigator.onLine;

        if (!isOnline) {
          return {
            isOnline: false,
            isConnected: false,
            connectionQuality: 'offline',
            lastChecked: new Date(),
          };
        }

        // Perform actual connectivity check by pinging a reliable endpoint
        // Using a small, fast endpoint for connectivity testing
        const response = await fetch('https://httpbin.org/status/200', {
          method: 'HEAD', // HEAD request is lighter than GET
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        const latency = Date.now() - startTime;
        const isConnected = response.ok;

        // Determine connection quality based on latency
        let connectionQuality: 'offline' | 'weak' | 'good';
        if (!isConnected) {
          connectionQuality = 'offline';
        } else if (latency > 2000) {
          connectionQuality = 'weak';
        } else {
          connectionQuality = 'good';
        }

        return {
          isOnline,
          isConnected,
          connectionQuality,
          latency,
          lastChecked: new Date(),
        };
      } catch {
        // If the fetch fails, we're likely offline or have poor connectivity
        return {
          isOnline: navigator.onLine,
          isConnected: false,
          connectionQuality: 'offline',
          lastChecked: new Date(),
        };
      }
    },
    // Check connection status every 30 seconds
    refetchInterval: 30000,
    // Also refetch when window comes back online
    refetchOnWindowFocus: true,
    // Keep data fresh for 1 minute
    staleTime: 60000,
    // Don't retry failed requests immediately
    retry: false,
    // Cache for 5 minutes
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get connection status color for UI components
 */
export function useConnectionStatusColor() {
  const { data } = useConnectionStatus();

  if (!data) {
    return {
      color: 'gray',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      textColor: 'text-gray-700 dark:text-gray-400',
      dotColor: 'bg-gray-500',
      status: 'Checking...',
    };
  }

  switch (data.connectionQuality) {
    case 'good':
      return {
        color: 'green',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        textColor: 'text-green-700 dark:text-green-400',
        dotColor: 'bg-green-500',
        status: 'Connected',
      };
    case 'weak':
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        dotColor: 'bg-yellow-500',
        status: 'Weak Connection',
      };
    case 'offline':
    default:
      return {
        color: 'red',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-700 dark:text-red-400',
        dotColor: 'bg-red-500',
        status: 'Offline',
      };
  }
}