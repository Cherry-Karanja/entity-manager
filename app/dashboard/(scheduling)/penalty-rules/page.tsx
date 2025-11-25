/**
 * Penalty Rules Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { penaltyRuleListConfig, penaltyRuleViewConfig, penaltyRuleActionsConfig, penaltyRuleExportConfig } from '@/components/features/logx/penalty-rules/config';
import { penaltyRuleFields } from '@/components/features/logx/penalty-rules/config/fields';
import { default as penaltyRuleClient } from '@/components/features/logx/penalty-rules/api/client';
import { Scale } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function PenaltyRulesPage() {
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
          <Scale className="h-4 w-4 mr-2" />
          Add Penalty Rule
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
          entityName: 'Penalty Rule',
          entityNamePlural: 'Penalty Rules',
          fields: penaltyRuleFields,
          list: penaltyRuleListConfig,
          view: penaltyRuleViewConfig,
          actions: penaltyRuleActionsConfig,
          export: penaltyRuleExportConfig,
        },
        apiClient: penaltyRuleClient,
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
