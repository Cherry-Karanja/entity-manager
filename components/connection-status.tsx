'use client';

import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEntityNotificationWebSocket } from '../hooks/useEntityWebSocket';

interface ConnectionStatusProps {
  className?: string;
  showLabel?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className,
  showLabel = false
}) => {
  const { isConnected, connectionState } = useEntityNotificationWebSocket();

  const getStatusInfo = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-500',
          label: 'Connected',
          bgColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: Loader2,
          color: 'text-yellow-500',
          label: 'Connecting',
          bgColor: 'bg-yellow-500'
        };
      case 'disconnected':
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          label: 'Disconnected',
          bgColor: 'bg-red-500'
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-500',
          label: 'Unknown',
          bgColor: 'bg-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Icon
          className={cn('w-4 h-4', statusInfo.color, {
            'animate-spin': connectionState === 'connecting'
          })}
        />
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background',
          statusInfo.bgColor
        )} />
      </div>
      {showLabel && (
        <span className={cn('text-sm', statusInfo.color)}>
          {statusInfo.label}
        </span>
      )}
    </div>
  );
};

// Real-time indicator for specific entities
interface EntityStatusIndicatorProps {
  entityType: string;
  entityId: string;
  className?: string;
}

export const EntityStatusIndicator: React.FC<EntityStatusIndicatorProps> = ({
  entityType,
  entityId,
  className
}) => {
  // This would use the entity-specific WebSocket hook
  // For now, we'll show a generic connected state
  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      <span>Live</span>
    </div>
  );
};