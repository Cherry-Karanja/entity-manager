/**
 * Resource Limits Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { resourceLimitListConfig, resourceLimitViewConfig, resourceLimitActionsConfig, resourceLimitExportConfig, resourceLimitFields } from '@/components/features/logx/resource-limits/config';
import resourceLimitClient from '@/components/features/logx/resource-limits/api/client';
import { Gauge } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function ResourceLimitsPage() {
  const { setPageActions } = usePageActions();
  const [initialView, setInitialView] = React.useState<EntityManagerView>('list');
  const [initialId, setInitialId] = React.useState<string | number | undefined>(undefined);

  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => {
            setInitialView('create');
            setInitialId(undefined);
          }}
        >
          <Gauge className="h-4 w-4 mr-2" />
          Add Resource Limit
        </Button>
      </div>
    );
    return () => setPageActions(null);
  }, [setPageActions]);

  const handleViewChange = React.useCallback((newView: EntityManagerView) => {
    setInitialView(newView);
    if (newView === 'list') {
      setInitialId(undefined);
    }
  }, []);

  return (
    <EntityManager
      config={{
        config: {
          entityName: 'Resource Limit',
          entityNamePlural: 'Resource Limits',
          fields: resourceLimitFields,
          list: resourceLimitListConfig,
          view: resourceLimitViewConfig,
          actions: resourceLimitActionsConfig,
          export: resourceLimitExportConfig,
        },
        apiClient: resourceLimitClient,
        initialView: initialView,
        initialId: initialId,
        initialData: [],
        onViewChange: handleViewChange,
        features: {
          offline: false,
          realtime: false,
          optimistic: true,
          collaborative: false,
        },
      }}
    />
  );
}
