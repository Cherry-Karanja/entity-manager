import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNotificationWebSocket, useEntityWebSocket } from '../../../../hooks/useWebSocket';
import authManager from '../../../../handler/AuthManager';

export interface NotificationData {
  id: number;
  user_id: number;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  created_at: string;
  is_read: boolean;
}

export interface EntityUpdateData {
  action: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_id: string;
  data: any;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Enhanced notification WebSocket hook with toast integration
export const useEntityNotificationWebSocket = () => {
  const queryClient = useQueryClient();

  const handleNotificationMessage = useCallback((message: any) => {
    if (message.type === 'notification' && message.data) {
      const notification: NotificationData = message.data;

      // Invalidate notifications query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Show toast notification based on priority
      const { title, message: content, priority } = notification;

      switch (priority) {
        case 'high':
          toast.error(title, { description: content });
          break;
        case 'medium':
          toast.warning(title, { description: content });
          break;
        default:
          toast.success(title, { description: content });
      }
    }
  }, [queryClient]);

  const ws = useNotificationWebSocket({
    url: `${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000'}/ws/notifications/`,
    // No authToken needed - authentication handled via HTTP-only cookies
    onMessage: handleNotificationMessage,
    autoConnect: false, // Don't auto-connect to avoid connection issues
  });

  // Auto-connect when user becomes authenticated
  useEffect(() => {
    if (authManager.isAuthenticated() && !ws.isConnected) {
      ws.connect();
    } else if (!authManager.isAuthenticated() && ws.isConnected) {
      ws.disconnect();
    }
  }, [authManager.isAuthenticated(), ws.isConnected, ws.connect, ws.disconnect]);

  return ws;
};

// Hook for entity-specific real-time updates
export const useEntityRealTimeUpdates = (entityType: string, entityId?: string | number) => {
  const queryClient = useQueryClient();

  const handleEntityMessage = useCallback((message: any) => {
    if (message.type === 'entity_update' && message.data) {
      const update: EntityUpdateData = message;

      // Invalidate specific entity query
      if (entityId) {
        queryClient.invalidateQueries({
          queryKey: [entityType, entityId]
        });
      }

      // Invalidate entity list queries
      queryClient.invalidateQueries({
        queryKey: [entityType]
      });

      // Show update notification
      const actionText = update.action === 'create' ? 'created' :
                        update.action === 'update' ? 'updated' : 'deleted';

      toast.info(`${entityType} ${actionText}`, {
        description: `Entity ${update.entity_id} has been ${actionText}`
      });
    }
  }, [queryClient, entityType, entityId]);

  const ws = useEntityWebSocket({
    url: `${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000'}/ws/entity/${entityType}/${entityId || ''}/`,
    // No authToken needed - authentication handled via HTTP-only cookies
    entityType,
    entityId,
    onMessage: handleEntityMessage,
    autoConnect: false, // Don't auto-connect to avoid connection issues
  });

  return ws;
};

// Hook for property-specific real-time updates
export const usePropertyRealTimeUpdates = (propertyId?: string | number) => {
  return useEntityRealTimeUpdates('property', propertyId);
};

// Hook for maintenance request real-time updates
export const useMaintenanceRealTimeUpdates = (requestId?: string | number) => {
  return useEntityRealTimeUpdates('maintenance_request', requestId);
};

// Hook for rent record real-time updates
export const useRentRealTimeUpdates = (recordId?: string | number) => {
  return useEntityRealTimeUpdates('rent_record', recordId);
};