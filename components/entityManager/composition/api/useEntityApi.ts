/**
 * Use Entity API Hook
 * 
 * Hook for fetching and managing entity data from API.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { BaseEntity } from '../../primitives/types';
import { ListQueryParams, UseEntityApiReturn } from './types';
import { useEntityApiContext } from './EntityApiProvider';
import { getListData, getEntityData } from '../api/responseUtils';

/**
 * Use entity API hook
 */
export function useEntityApi<T extends BaseEntity = BaseEntity>(
  initialParams?: ListQueryParams
): UseEntityApiReturn<T> {
  const { client } = useEntityApiContext<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [params, setParams] = useState<ListQueryParams | undefined>(initialParams);

  /**
   * List entities
   */
  const list = useCallback(async (queryParams?: ListQueryParams): Promise<T[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.list(queryParams) as any;

      // Use shared normalization helpers to accept both canonical ApiResponse<T[]> and legacy DRF shapes
      const entities = getListData<T>(response);
      setData(entities);
      // Attempt to read meta.total when present, fallback to array length
      const total = response && typeof response === 'object' && response.meta?.total !== undefined
        ? (response.meta.total as number)
        : Array.isArray(entities) ? entities.length : 0;
      setTotal(total);
      setParams(queryParams);

      return entities;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to list entities');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Get single entity
   */
  const get = useCallback(async (id: string | number): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.get(id) as any;
      return getEntityData<T>(response) as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get entity');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  /**
   * Refresh data
   */
  const refresh = useCallback(async (): Promise<void> => {
    await list(params);
  }, [list, params]);

  // Auto-fetch on mount if initial params provided
  useEffect(() => {
    if (initialParams) {
      list(initialParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    list,
    get,
    refresh,
    loading,
    error,
    data,
    total
  };
}
