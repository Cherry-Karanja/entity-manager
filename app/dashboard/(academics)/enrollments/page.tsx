/**
 * Enrollments Management Page
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager, EntityManagerView } from '@/components/entityManager';
import { enrollmentConfig } from '@/components/features/institution/enrollments/config';
import { enrollmentsApiClient } from '@/components/features/institution/enrollments/api/client';
import { UserCheck } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';

export default function EnrollmentsPage() {
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
          <UserCheck className="h-4 w-4 mr-2" />
          Add Enrollment
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
        config: enrollmentConfig,
        apiClient: enrollmentsApiClient,
        initialView: initialView,
        initialId: initialId,
        initialData: [],
        onViewChange: handleViewChange,
        features: { offline: false, realtime: false, optimistic: true, collaborative: false },
      }}
    />
  );
}
