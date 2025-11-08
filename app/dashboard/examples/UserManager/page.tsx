"use client"

import React from 'react';
import { EntityManager } from '@/components/entityManager/manager/orchestrator';
import { userConfig } from '@/examples/UserManager';

const UserManagerPage = () => {
  return (
    <div>
      <h1>User Manager</h1>
      <p className="text-muted-foreground mb-6">
        Manage users in the MyLandlord system. Create, view, edit, and manage user accounts with different roles.
      </p>
      <EntityManager config={userConfig} />
    </div>
  );
};

export default UserManagerPage;