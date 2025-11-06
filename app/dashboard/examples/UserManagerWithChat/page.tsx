"use client"

import React from 'react';
import EntityFormExamples from '@/components/entityManager/EntityForm/examples';
import { AdvancedEntityListExample } from '@/components/entityManager/EntityList/examples';
import EntityViewExamples from '@/components/entityManager/EntityView/examples';
import UserManagement from '@/examples/UserManagement';
import { UserManagerWithChat } from '@/examples/UserManagerWithChat';

const HomePage = () => {

  return (
    <div>
      <h1>Entity Manager Demo</h1>
      <UserManagerWithChat />
    </div>
  );
};

export default HomePage;

