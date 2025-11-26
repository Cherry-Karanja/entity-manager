/**
 * Resource Limits Management Page
 * 
 * Main page for managing resource limits using Entity Manager with Django backend integration.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { resourceLimitConfig } from '@/components/features/logx/resource-limits/config';
import { resourceLimitsApiClient } from '@/components/features/logx/resource-limits/api/client';
import { Gauge } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';

export default function ResourceLimitsPage() {
  const { setPageActions } = usePageActions();
  const [initialView, setInitialView] = React.useState<EntityManagerView>('list');
  const [initialId, setInitialId] = React.useState<string | number | undefined>(undefined);

  // Set actions to display in the layout header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => {
            console.log('Add Resource Limit button clicked');
            setInitialView('create');
            setInitialId(undefined);
          }}
        >
          <Gauge className="h-4 w-4 mr-2" />
          Add Resource Limit
        </Button>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);

  // Callback when view changes internally (e.g., back to list after submit)
  const handleViewChange = React.useCallback((newView: EntityManagerView) => {
    console.log('View changed to:', newView);
    setInitialView(newView);
    if (newView === 'list') {
      setInitialId(undefined);
    }
  }, []);

  return (
    <EntityManager
      config={{
        config: resourceLimitConfig,
        apiClient: resourceLimitsApiClient,
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
