/**
 * Class Schedules Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { classGroupScheduleListConfig, classGroupScheduleViewConfig, classGroupScheduleActionsConfig, classGroupScheduleExportConfig, classGroupScheduleFields } from '@/components/features/logx/class-group-schedules/config';
import classGroupScheduleClient from '@/components/features/logx/class-group-schedules/api/client';
import { CalendarDays } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function ClassSchedulesPage() {
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
          <CalendarDays className="h-4 w-4 mr-2" />
          Add Class Schedule
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
          entityName: 'Class Schedule',
          entityNamePlural: 'Class Schedules',
          fields: classGroupScheduleFields,
          list: classGroupScheduleListConfig,
          view: classGroupScheduleViewConfig,
          actions: classGroupScheduleActionsConfig,
          export: classGroupScheduleExportConfig,
        },
        apiClient: classGroupScheduleClient,
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
