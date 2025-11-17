/**
 * Users Management Page
 * 
 * Main page for managing users using Entity Manager with Django backend integration.
 */

'use client';

import React from 'react';
import { EntityManager } from '@/components/entityManager';
import { userConfig } from '@/components/features/accounts/users/config';
import { usersApiClient } from '@/components/features/accounts/users/api/client';

export default function UsersPage() {
  return (
    <EntityManager
      config={{
        config: userConfig,
        apiClient: usersApiClient,
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
