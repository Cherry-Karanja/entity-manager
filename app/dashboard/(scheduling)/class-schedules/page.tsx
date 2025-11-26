/**
 * Class Schedules Management Page
 * 
 * Main page for managing class schedules using Entity Manager with Django backend integration.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { classGroupScheduleConfig } from '@/components/features/logx/class-group-schedules/config';
import classGroupScheduleClient from '@/components/features/logx/class-group-schedules/api/client';
import { CalendarDays } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';

export default function ClassSchedulesPage() {
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
            console.log('Add Class Schedule button clicked');
            setInitialView('create');
            setInitialId(undefined);
          }}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Add Class Schedule
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
        config: classGroupScheduleConfig,
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
