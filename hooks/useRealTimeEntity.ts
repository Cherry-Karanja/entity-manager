import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useEntityRealTimeUpdates } from '../hooks/useEntityWebSocket';
import { toast } from 'sonner';

interface UseRealTimeEntityOptions {
  entityType: string;
  entityId?: string | number;
  enabled?: boolean;
  onUpdate?: (data: any) => void;
  onCreate?: (data: any) => void;
  onDelete?: (data: any) => void;
}

/**
 * Hook to enable real-time updates for entity management components
 * Automatically handles WebSocket connections and query invalidation
 */
export const useRealTimeEntity = ({
  entityType,
  entityId,
  enabled = true,
  onUpdate,
  onCreate,
  onDelete,
}: UseRealTimeEntityOptions) => {
  const queryClient = useQueryClient();

  const { isConnected } = useEntityRealTimeUpdates(entityType, entityId);

  useEffect(() => {
    if (!enabled || !isConnected) return;

    // Set up real-time update handlers
    const handleEntityUpdate = (message: any) => {
      if (message.type === 'entity_update') {
        const { action, entity_type, entity_id, data, user } = message;

        // Invalidate relevant queries
        if (entityId) {
          queryClient.invalidateQueries({
            queryKey: [entityType, entityId]
          });
        }

        queryClient.invalidateQueries({
          queryKey: [entityType]
        });

        // Call specific handlers
        switch (action) {
          case 'create':
            onCreate?.(data);
            toast.success(`${entityType} created`, {
              description: `New ${entityType} has been added`
            });
            break;
          case 'update':
            onUpdate?.(data);
            toast.info(`${entityType} updated`, {
              description: `Changes have been applied to ${entityType}`
            });
            break;
          case 'delete':
            onDelete?.(data);
            toast.warning(`${entityType} deleted`, {
              description: `${entityType} has been removed`
            });
            break;
        }
      }
    };

    // The WebSocket hook already handles the connection and message routing
    // This effect is mainly for any additional setup if needed

    return () => {
      // Cleanup if needed
    };
  }, [
    enabled,
    isConnected,
    entityType,
    entityId,
    queryClient,
    onUpdate,
    onCreate,
    onDelete,
  ]);

  return {
    isConnected,
    entityType,
    entityId,
  };
};

// Specialized hooks for common entity types

export const useRealTimeProperties = (propertyId?: string | number, options?: Partial<UseRealTimeEntityOptions>) => {
  return useRealTimeEntity({
    entityType: 'property',
    entityId: propertyId,
    ...options,
  });
};

export const useRealTimeMaintenance = (requestId?: string | number, options?: Partial<UseRealTimeEntityOptions>) => {
  return useRealTimeEntity({
    entityType: 'maintenance_request',
    entityId: requestId,
    ...options,
  });
};

export const useRealTimeRentRecords = (recordId?: string | number, options?: Partial<UseRealTimeEntityOptions>) => {
  return useRealTimeEntity({
    entityType: 'rent_record',
    entityId: recordId,
    ...options,
  });
};