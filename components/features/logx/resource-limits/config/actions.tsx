/**
 * Resource Limit Action Configurations
 * 
 * Defines actions available for resource limit management.
 */

import { EntityActionsConfig } from "@/components/entityManager/composition/config/types";
import { ResourceLimit } from "../../types";
import { resourceLimitsApiClient } from "../api/client";
import { 
  CheckCircle, 
  XCircle, 
  Trash2,
  Download,
  Gauge
} from "lucide-react";

export const ResourceLimitActionsConfig: EntityActionsConfig<ResourceLimit> = {
  actions: [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (entity?: ResourceLimit) => !entity?.is_active,
      confirmMessage: 'Are you sure you want to activate this resource limit?',
      confirmText: 'Activate',
      onConfirm: async (entity?: ResourceLimit, context?) => {
        if (!entity || !context?.refresh) return;
        try {
          await resourceLimitsApiClient.update(entity.id, { is_active: true });
          await context.refresh();
        } catch (error) {
          console.error('Failed to activate resource limit:', error);
        }
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      visible: (entity?: ResourceLimit) => entity?.is_active === true,
      confirmMessage: 'Are you sure you want to deactivate this resource limit?',
      confirmText: 'Deactivate',
      onConfirm: async (entity?: ResourceLimit, context?) => {
        if (!entity || !context?.refresh) return;
        try {
          await resourceLimitsApiClient.update(entity.id, { is_active: false });
          await context.refresh();
        } catch (error) {
          console.error('Failed to deactivate resource limit:', error);
        }
      },
    },
    {
      id: 'checkUsage',
      label: 'Check Usage',
      icon: <Gauge className="h-4 w-4" />,
      actionType: 'immediate',
      variant: 'outline',
      position: 'row',
      handler: async (entity?: ResourceLimit, context?) => {
        if (!entity) return;
        console.log('Checking usage for resource limit:', entity.id);
        // TODO: Implement usage check API call
      },
    },

    // ===========================
    // Bulk Actions
    // ===========================
    {
      id: 'bulkActivate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'primary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to activate ${count} resource limit(s)?`,
      handler: async (entities: ResourceLimit[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            entities.map(e => resourceLimitsApiClient.update(e.id, { is_active: true }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk activate:', error);
        }
      },
    },
    {
      id: 'bulkDeactivate',
      label: 'Deactivate Selected',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to deactivate ${count} resource limit(s)?`,
      handler: async (entities: ResourceLimit[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            entities.map(e => resourceLimitsApiClient.update(e.id, { is_active: false }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk deactivate:', error);
        }
      },
    },
    {
      id: 'bulkDelete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to delete ${count} resource limit(s)? This action cannot be undone.`,
      handler: async (entities: ResourceLimit[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(entities.map(e => resourceLimitsApiClient.delete(e.id)));
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk delete:', error);
        }
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportResourceLimits',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async (entity?: ResourceLimit, context?) => {
        console.log('Exporting resource limits');
        // Export handled by EntityManager exporter
      },
    },
  ],
  mode: 'dropdown',
  className: '',
};
