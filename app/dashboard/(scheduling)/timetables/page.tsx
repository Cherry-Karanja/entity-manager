/**
 * Timetables Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { timetableListConfig, timetableViewConfig, timetableActionsConfig, timetableExportConfig, timetableFields } from '@/components/features/logx/timetables/config';
import { timetablesClient } from '@/components/features/logx/timetables/api/client';
import { Calendar } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function TimetablesPage() {
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
          <Calendar className="h-4 w-4 mr-2" />
          Add Timetable
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
          entityName: 'Timetable',
          entityNamePlural: 'Timetables',
          fields: timetableFields,
          list: timetableListConfig,
          view: timetableViewConfig,
          actions: timetableActionsConfig,
          export: timetableExportConfig,
        },
        apiClient: timetablesClient,
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
