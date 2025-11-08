import { useState, useEffect, useCallback } from 'react';
import { getPermissionManager, PermissionManager } from '../utils/permissionManager';
import { EntityPermissionCheck, PermissionResult } from '../types/permissions';

interface UsePermissionsOptions {
  entityType: string;
  entityId?: string;
  userId?: number;
  autoCheck?: boolean;
}

export const usePermissions = ({
  entityType,
  entityId,
  userId,
  autoCheck = false
}: UsePermissionsOptions) => {
  const [permissionManager] = useState(() => getPermissionManager());
  const [permissions, setPermissions] = useState<Map<string, PermissionResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check single permission
  const checkPermission = useCallback(async (
    action: string,
    context?: Record<string, any>
  ): Promise<PermissionResult> => {
    if (!entityId || !userId) {
      return {
        allowed: false,
        reason: 'Entity ID or User ID not provided'
      };
    }

    setLoading(true);
    setError(null);

    try {
      const check: EntityPermissionCheck = {
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
        action,
        context
      };

      const result = await permissionManager.checkPermission(check);
      setPermissions(prev => new Map(prev.set(action, result)));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission check failed';
      setError(errorMessage);
      return {
        allowed: false,
        reason: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, userId, permissionManager]);

  // Check multiple permissions
  const checkPermissions = useCallback(async (
    actions: string[],
    context?: Record<string, any>
  ): Promise<Map<string, PermissionResult>> => {
    if (!entityId || !userId) {
      const emptyResults = new Map<string, PermissionResult>();
      actions.forEach(action => {
        emptyResults.set(action, {
          allowed: false,
          reason: 'Entity ID or User ID not provided'
        });
      });
      return emptyResults;
    }

    setLoading(true);
    setError(null);

    try {
      const checks: EntityPermissionCheck[] = actions.map(action => ({
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
        action,
        context
      }));

      const results = await permissionManager.checkBulkPermissions(checks);
      const resultsMap = new Map<string, PermissionResult>();

      actions.forEach((action, index) => {
        resultsMap.set(action, results[index]);
      });

      setPermissions(resultsMap);
      return resultsMap;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission check failed';
      setError(errorMessage);

      const errorResults = new Map<string, PermissionResult>();
      actions.forEach(action => {
        errorResults.set(action, {
          allowed: false,
          reason: errorMessage
        });
      });

      return errorResults;
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, userId, permissionManager]);

  // Get visible actions for entity type
  const getVisibleActions = useCallback(async (
    context?: Record<string, any>
  ): Promise<string[]> => {
    if (!entityId || !userId) {
      return [];
    }

    try {
      return await permissionManager.getVisibleActions(entityType, entityId, userId, context);
    } catch (err) {
      console.error('Failed to get visible actions:', err);
      return [];
    }
  }, [entityType, entityId, userId, permissionManager]);

  // Auto-check common permissions on mount
  useEffect(() => {
    if (autoCheck && entityId && userId) {
      checkPermissions(['read', 'update', 'delete'], {});
    }
  }, [autoCheck, entityId, userId, checkPermissions]);

  // Utility functions
  const canRead = permissions.get('read')?.allowed ?? false;
  const canUpdate = permissions.get('update')?.allowed ?? false;
  const canDelete = permissions.get('delete')?.allowed ?? false;
  const canCreate = permissions.get('create')?.allowed ?? false;

  return {
    // State
    permissions,
    loading,
    error,

    // Actions
    checkPermission,
    checkPermissions,
    getVisibleActions,

    // Convenience getters
    canRead,
    canUpdate,
    canDelete,
    canCreate,

    // Utility functions
    hasPermission: (action: string) => permissions.get(action)?.allowed ?? false,
    getPermissionReason: (action: string) => permissions.get(action)?.reason,
    clearPermissions: () => setPermissions(new Map()),
    refreshPermissions: () => {
      if (entityId && userId) {
        checkPermissions(['read', 'update', 'delete'], {});
      }
    }
  };
};

interface UseDynamicActionsOptions {
  entityType: string;
  entityId?: string;
  userId?: number;
  context?: Record<string, any>;
}

export const useDynamicActions = ({
  entityType,
  entityId,
  userId,
  context
}: UseDynamicActionsOptions) => {
  const [visibleActions, setVisibleActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionManager] = useState(() => getPermissionManager());

  const refreshActions = useCallback(async () => {
    if (!entityId || !userId) {
      setVisibleActions([]);
      return;
    }

    setLoading(true);
    try {
      const actions = await permissionManager.getVisibleActions(
        entityType,
        entityId,
        userId,
        context
      );
      setVisibleActions(actions);
    } catch (err) {
      console.error('Failed to refresh dynamic actions:', err);
      setVisibleActions([]);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, userId, context, permissionManager]);

  useEffect(() => {
    refreshActions();
  }, [refreshActions]);

  return {
    visibleActions,
    loading,
    refreshActions,
    hasAction: (action: string) => visibleActions.includes(action)
  };
};