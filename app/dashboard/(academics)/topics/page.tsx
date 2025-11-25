/**
 * Topics Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { topicConfig } from '@/components/features/institution/topics/config';
import { topicsApiClient } from '@/components/features/institution/topics/api/client';
import { FileText } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function TopicsPage() {
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
          <FileText className="h-4 w-4 mr-2" />
          Add Topic
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
        config: topicConfig,
        apiClient: topicsApiClient,
        initialView: initialView,
        initialId: initialId,
        initialData: [],
        onViewChange: handleViewChange,
        features: { offline: false, realtime: false, optimistic: true, collaborative: false },
      }}
    />
  );
}
