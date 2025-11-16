/**
 * Use Entity Mutations Hook
 * 
 * Hook for creating, updating, and deleting entities via API.
 */

'use client';

import { useState, useCallback } from 'react';
import { BaseEntity } from '../../primitives/types';
import { UseEntityMutationsReturn } from './types';
import { useEntityApiContext } from './EntityApiProvider';

/**
 * Use entity mutations hook
 */
export function useEntityMutations<T extends BaseEntity = BaseEntity>(): UseEntityMutationsReturn<T> {
  const { client } = useEntityApiContext<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Create entity
   */
  const create = useCallback(async (data: Partial<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.create(data);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create entity');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Update entity
   */
  const update = useCallback(async (id: string | number, data: Partial<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.update(id, data);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entity');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Delete entity
   */
  const deleteEntity = useCallback(async (id: string | number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.delete(id);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entity');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Bulk create
   */
  const bulkCreate = useCallback(async (dataArray: Partial<T>[]): Promise<T[]> => {
    if (!client.bulkCreate) {
      throw new Error('Bulk create not supported by this API client');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.bulkCreate(dataArray);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk create entities');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Bulk update
   */
  const bulkUpdate = useCallback(async (
    updates: Array<{ id: string | number; data: Partial<T> }>
  ): Promise<T[]> => {
    if (!client.bulkUpdate) {
      throw new Error('Bulk update not supported by this API client');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.bulkUpdate(updates);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk update entities');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Bulk delete
   */
  const bulkDelete = useCallback(async (ids: Array<string | number>): Promise<void> => {
    if (!client.bulkDelete) {
      throw new Error('Bulk delete not supported by this API client');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.bulkDelete(ids);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk delete entities');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    create,
    update,
    delete: deleteEntity,
    bulkCreate,
    bulkUpdate,
    bulkDelete,
    loading,
    error
  };
}
