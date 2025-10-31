"use client"

import React from 'react';
import EntityFormExamples from '@/components/entityManager/EntityForm/examples';
import { AdvancedEntityListExample } from '@/components/entityManager/EntityList/examples';
import EntityViewExamples from '@/components/entityManager/EntityView/examples';

const HomePage = () => {

  return (
    <div>
      <h1>Entity Manager Demo</h1>
          <EntityFormExamples />
    </div>
  );
};

export default HomePage;

