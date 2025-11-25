/**
 * Sessions Management Page
 * 
 * Main page for viewing and managing active user sessions.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { userSessionConfig } from '@/components/features/accounts/sessions/config';
import { userSessionsApiClient } from '@/components/features/accounts/sessions/api/client';
import { Monitor } from 'lucide-react';
import { usePageActions } from '../../layout';
import { EntityManagerView } from '@/components/entityManager';

export default function SessionsPage() {
  const { setPageActions } = usePageActions();
  const [initialView] = React.useState<EntityManagerView>('list');
  const [initialId] = React.useState<string | number | undefined>(undefined);

  // Set actions to display in the layout header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Monitor className="h-4 w-4" />
          <span>Active User Sessions</span>
        </div>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);

  return (
    <EntityManager
      config={{
        config: userSessionConfig,
        apiClient: userSessionsApiClient,
        initialView: initialView,
        initialId: initialId,
        initialData: [],
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
