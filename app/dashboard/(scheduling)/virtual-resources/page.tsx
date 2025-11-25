/**
 * Virtual Resources Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { virtualResourceListConfig, virtualResourceViewConfig, virtualResourceActionsConfig, virtualResourceExportConfig } from '@/components/features/logx/virtual-resources/config';
import { virtualResourceFields } from '@/components/features/logx/virtual-resources/config/fields';
import { default as virtualResourceClient } from '@/components/features/logx/virtual-resources/api/client';
import { Cloud } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function VirtualResourcesPage() {
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
          <Cloud className="h-4 w-4 mr-2" />
          Add Virtual Resource
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
          entityName: 'Virtual Resource',
          entityNamePlural: 'Virtual Resources',
          fields: virtualResourceFields,
          list: virtualResourceListConfig,
          view: virtualResourceViewConfig,
          actions: virtualResourceActionsConfig,
          export: virtualResourceExportConfig,
        },
        apiClient: virtualResourceClient,
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
