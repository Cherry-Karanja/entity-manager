/**
 * Units Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { unitConfig } from '@/components/features/institution/units/config';
import { unitsApiClient } from '@/components/features/institution/units/api/client';
import { BookOpen } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function UnitsPage() {
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
          <BookOpen className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>
    );
    return () => setPageActions(null);
  }, [setPageActions]);

  const handleViewChange = React.useCallback((newView: EntityManagerView) => {
    setInitialView(newView);
    if (newView === 'list') setInitialId(undefined);
  }, []);

  return (
    <EntityManager
      config={{
        config: unitConfig,
        apiClient: unitsApiClient,
        initialView: initialView,
        initialId: initialId,
        initialData: [],
        onViewChange: handleViewChange,
        features: { offline: false, realtime: false, optimistic: true, collaborative: false },
      }}
    />
  );
}
