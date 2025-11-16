/**
 * Entity API Provider
 * 
 * React context provider for API integration.
 */

'use client';

import React, { createContext, useContext } from 'react';
import { BaseEntity } from '../../primitives/types';
import { EntityApiProviderProps, EntityApiContextValue } from './types';

/**
 * Entity API context
 */
const EntityApiContext = createContext<EntityApiContextValue<BaseEntity> | null>(null);

/**
 * Entity API provider component
 */
export function EntityApiProvider<T extends BaseEntity = BaseEntity>(
  props: EntityApiProviderProps<T>
) {
  const { client, config, children } = props;

  const value: EntityApiContextValue<T> = {
    client,
    config
  };

  return (
    <EntityApiContext.Provider value={value}>
      {children}
    </EntityApiContext.Provider>
  );
}

/**
 * Use entity API context hook
 */
export function useEntityApiContext<T extends BaseEntity = BaseEntity>(): EntityApiContextValue<T> {
  const context = useContext(EntityApiContext);
  if (!context) {
    throw new Error('useEntityApiContext must be used within EntityApiProvider');
  }
  return context as EntityApiContextValue<T>;
}
