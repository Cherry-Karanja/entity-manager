/**
 * Timetable Settings Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { timetableSettingListConfig, timetableSettingViewConfig, timetableSettingActionsConfig, timetableSettingExportConfig, timetableSettingFields } from '@/components/features/logx/timetable-settings/config';
import timetableSettingClient from '@/components/features/logx/timetable-settings/api/client';
import { Settings } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function TimetableSettingsPage() {
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
          <Settings className="h-4 w-4 mr-2" />
          Add Setting
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
          entityName: 'Timetable Setting',
          entityNamePlural: 'Timetable Settings',
          fields: timetableSettingFields,
          list: timetableSettingListConfig,
          view: timetableSettingViewConfig,
          actions: timetableSettingActionsConfig,
          export: timetableSettingExportConfig,
        },
        apiClient: timetableSettingClient,
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
