/**
 * Constraints Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { timetableConstraintListConfig, timetableConstraintViewConfig, timetableConstraintActionsConfig, timetableConstraintExportConfig, timetableConstraintFields } from '@/components/features/logx/timetable-constraints/config';
import timetableConstraintClient from '@/components/features/logx/timetable-constraints/api/client';
import { Lock } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function ConstraintsPage() {
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
          <Lock className="h-4 w-4 mr-2" />
          Add Constraint
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
          entityName: 'Timetable Constraint',
          entityNamePlural: 'Timetable Constraints',
          fields: timetableConstraintFields,
          list: timetableConstraintListConfig,
          view: timetableConstraintViewConfig,
          actions: timetableConstraintActionsConfig,
          export: timetableConstraintExportConfig,
        },
        apiClient: timetableConstraintClient,
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
