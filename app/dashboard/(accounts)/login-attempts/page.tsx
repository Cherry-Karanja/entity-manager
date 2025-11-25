/**
 * Login Attempts Page
 * 
 * Main page for viewing login attempt history and security monitoring.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { loginAttemptConfig } from '@/components/features/accounts/login-attempts/config';
import { loginAttemptsApiClient } from '@/components/features/accounts/login-attempts/api/client';
import { ShieldAlert } from 'lucide-react';
import { usePageActions } from '../../layout';
import { EntityManagerView } from '@/components/entityManager';

export default function LoginAttemptsPage() {
  const { setPageActions } = usePageActions();
  const [initialView] = React.useState<EntityManagerView>('list');
  const [initialId] = React.useState<string | number | undefined>(undefined);

  // Set actions to display in the layout header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          <span>Login Attempt History</span>
        </div>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);

  return (
    <EntityManager
      config={{
        config: loginAttemptConfig,
        apiClient: loginAttemptsApiClient,
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
