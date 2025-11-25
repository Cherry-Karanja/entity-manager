/**
 * Profiles Management Page
 * 
 * Main page for managing user profiles using Entity Manager.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { userProfileConfig } from '@/components/features/accounts/profiles/config';
import { userProfilesApiClient } from '@/components/features/accounts/profiles/api/client';
import { User } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';

export default function ProfilesPage() {
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
            console.log('Add Profile button clicked');
            setInitialView('create');
            setInitialId(undefined);
          }}
        >
          <User className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);

  // Callback when view changes internally
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
        config: userProfileConfig,
        apiClient: userProfilesApiClient,
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
