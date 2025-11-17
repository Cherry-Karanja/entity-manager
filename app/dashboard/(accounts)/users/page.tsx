/**
 * Users Management Page
 * 
 * Main page for managing users using Entity Manager with Django backend integration.
 */

'use client';

import React, { useEffect } from 'react';
import { EntityManager } from '@/components/entityManager';
import { userConfig } from '@/components/features/accounts/users/config';
import { usersApiClient } from '@/components/features/accounts/users/api/client';
import { UserPlus } from 'lucide-react';
import { usePageActions } from '../../layout';
import { Button } from '@/components/ui/button';
import { EntityManagerView } from '@/components/entityManager';

export default function UsersPage() {
  const { setPageActions } = usePageActions();
  const [initialView, setInitialView] = React.useState<EntityManagerView>('list');

  // Set actions to display in the layout header
  useEffect(() => {
    setPageActions(
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setInitialView('create')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
    );

    // Cleanup on unmount
    return () => setPageActions(null);
  }, [setPageActions]);



  return (
    <EntityManager
      config={{
        config: userConfig,
        apiClient: usersApiClient,
        initialData: [],
        initialView: initialView,
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
