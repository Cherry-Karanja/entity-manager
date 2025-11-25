/**
 * Rooms Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { roomListConfig, roomViewConfig, roomActionsConfig, roomExportConfig, roomFields } from '@/components/features/logx/rooms/config';
import roomClient from '@/components/features/logx/rooms/api/client';
import { DoorOpen } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function RoomsPage() {
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
          <DoorOpen className="h-4 w-4 mr-2" />
          Add Room
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
          entityName: 'Room',
          entityNamePlural: 'Rooms',
          fields: roomFields,
          list: roomListConfig,
          view: roomViewConfig,
          actions: roomActionsConfig,
          export: roomExportConfig,
        },
        apiClient: roomClient,
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
