import React, { useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useDynamicActions } from '../../hooks/usePermissions';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Loader2, Eye, Edit, Trash2, Plus, Download, Upload } from 'lucide-react';

interface PermissionedActionProps {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showTooltip?: boolean;
  context?: Record<string, any>;
}

export const PermissionedAction: React.FC<PermissionedActionProps> = ({
  action,
  entityType,
  entityId,
  userId,
  children,
  fallback = null,
  showTooltip = true,
  context
}) => {
  const { hasPermission, getPermissionReason, loading } = usePermissions({
    entityType,
    entityId,
    userId,
    autoCheck: true
  });

  const allowed = hasPermission(action);
  const reason = getPermissionReason(action);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!allowed) {
    if (showTooltip && reason) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="opacity-50 cursor-not-allowed">
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{reason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface DynamicActionBarProps {
  entityType: string;
  entityId?: string;
  userId?: number;
  onAction?: (action: string) => void;
  context?: Record<string, any>;
  className?: string;
}

export const DynamicActionBar: React.FC<DynamicActionBarProps> = ({
  entityType,
  entityId,
  userId,
  onAction,
  context,
  className = ''
}) => {
  const { visibleActions, loading } = useDynamicActions({
    entityType,
    entityId,
    userId,
    context
  });

  const actionConfigs = useMemo(() => ({
    create: { icon: Plus, label: 'Create', variant: 'default' as const },
    read: { icon: Eye, label: 'View', variant: 'outline' as const },
    update: { icon: Edit, label: 'Edit', variant: 'outline' as const },
    delete: { icon: Trash2, label: 'Delete', variant: 'destructive' as const },
    export: { icon: Download, label: 'Export', variant: 'outline' as const },
    import: { icon: Upload, label: 'Import', variant: 'outline' as const }
  }), []);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading actions...</span>
      </div>
    );
  }

  if (visibleActions.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        No actions available
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {visibleActions.map(action => {
        const config = actionConfigs[action as keyof typeof actionConfigs];
        if (!config) return null;

        const Icon = config.icon;

        return (
          <Button
            key={action}
            variant={config.variant}
            size="sm"
            onClick={() => onAction?.(action)}
            className="flex items-center space-x-1"
          >
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

interface PermissionedFieldProps {
  field: string;
  entityType: string;
  entityId?: string;
  userId?: number;
  children: React.ReactNode;
  readOnly?: React.ReactNode;
  context?: Record<string, any>;
}

export const PermissionedField: React.FC<PermissionedFieldProps> = ({
  field,
  entityType,
  entityId,
  userId,
  children,
  readOnly,
  context
}) => {
  const { hasPermission } = usePermissions({
    entityType,
    entityId,
    userId,
    autoCheck: true
  });

  // For fields, we typically check update permission
  const canEdit = hasPermission('update');

  if (!canEdit) {
    return <>{readOnly || children}</>;
  }

  return <>{children}</>;
};

interface BulkActionPermissionsProps {
  entityType: string;
  entityIds: string[];
  userId?: number;
  actions: string[];
  children: (permissions: Record<string, boolean>) => React.ReactNode;
  context?: Record<string, any>;
}

export const BulkActionPermissions: React.FC<BulkActionPermissionsProps> = ({
  entityType,
  entityIds,
  userId,
  actions,
  children,
  context
}) => {
  const { permissions, loading } = usePermissions({
    entityType,
    entityId: entityIds[0], // Use first entity for permission check
    userId,
    autoCheck: false
  });

  // For bulk actions, we check if user has permission on at least one entity
  // In a real implementation, you'd check permissions for all entities
  const bulkPermissions = useMemo(() => {
    const result: Record<string, boolean> = {};
    actions.forEach(action => {
      result[action] = permissions.get(action)?.allowed ?? false;
    });
    return result;
  }, [permissions, actions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <span>Checking permissions...</span>
      </div>
    );
  }

  return <>{children(bulkPermissions)}</>;
};