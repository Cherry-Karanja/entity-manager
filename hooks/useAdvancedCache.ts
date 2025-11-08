import { useState, useEffect, useCallback, useRef } from 'react';
import { getCacheManager, AdvancedCacheManager } from '../utils/advancedCacheManager';
import { CacheConfig, PrefetchConfig, OfflineConfig, CacheQuery, CacheEntry } from '../components/entityManager/utils/types/caching';

interface UseAdvancedCacheOptions {
  config?: CacheConfig;
  prefetchConfig?: PrefetchConfig;
  offlineConfig?: OfflineConfig;
  enableSync?: boolean;
}

export const useAdvancedCache = ({
  config,
  prefetchConfig,
  offlineConfig,
  enableSync = false
}: UseAdvancedCacheOptions = {}) => {
  const [cacheManager] = useState(() => getCacheManager(config, prefetchConfig, offlineConfig));
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync operations when coming back online
  useEffect(() => {
    if (isOnline && enableSync && syncStatus === 'idle') {
      setSyncStatus('syncing');
      // In a real implementation, this would sync pending operations
      // For now, we'll just simulate the sync
      syncTimeoutRef.current = setTimeout(() => {
        setSyncStatus('idle');
      }, 2000);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOnline, enableSync, syncStatus]);

  // Cache operations
  const get = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      return await cacheManager.get<T>(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }, [cacheManager]);

  const set = useCallback(async <T>(
    key: string,
    data: T,
    options?: {
      ttl?: number;
      dependencies?: string[];
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<void> => {
    try {
      await cacheManager.set(key, data, options || {});
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }, [cacheManager]);

  const remove = useCallback(async (key: string): Promise<boolean> => {
    try {
      return await cacheManager.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }, [cacheManager]);

  const invalidate = useCallback(async (pattern: string): Promise<number> => {
    try {
      return await cacheManager.invalidate(pattern);
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return 0;
    }
  }, [cacheManager]);

  const query = useCallback(async (query: CacheQuery): Promise<CacheEntry[]> => {
    try {
      return await cacheManager.query(query);
    } catch (error) {
      console.error('Cache query error:', error);
      return [];
    }
  }, [cacheManager]);

  // Prefetch operations
  const prefetch = useCallback(async (patterns: any[]): Promise<void> => {
    try {
      await cacheManager.prefetch(patterns);
    } catch (error) {
      console.error('Cache prefetch error:', error);
    }
  }, [cacheManager]);

  // Event handling
  const onCacheEvent = useCallback((event: string, listener: (data: any) => void) => {
    cacheManager.on(event, listener);

    return () => {
      cacheManager.off(event, listener);
    };
  }, [cacheManager]);

  // Statistics
  const getStatistics = useCallback(() => {
    return cacheManager.getStatistics();
  }, [cacheManager]);

  const resetStatistics = useCallback(() => {
    cacheManager.resetStatistics();
  }, [cacheManager]);

  // Offline handling
  const handleOfflineRequest = useCallback(async (
    url: string,
    method: string,
    data?: any
  ): Promise<any> => {
    if (isOnline) {
      throw new Error('Not offline');
    }

    try {
      return await cacheManager.handleOfflineRequest(url, method, data);
    } catch (error) {
      console.error('Offline request handling error:', error);
      throw error;
    }
  }, [cacheManager, isOnline]);

  return {
    // State
    isOnline,
    syncStatus,

    // Cache operations
    get,
    set,
    remove,
    invalidate,
    query,

    // Prefetch operations
    prefetch,

    // Event handling
    onCacheEvent,

    // Statistics
    getStatistics,
    resetStatistics,

    // Offline support
    handleOfflineRequest,

    // Utilities
    cacheManager
  };
};

interface UseCacheEntryOptions<T> {
  key: string;
  fetcher?: () => Promise<T>;
  ttl?: number;
  dependencies?: string[];
  tags?: string[];
  enabled?: boolean;
}

export const useCacheEntry = <T>({
  key,
  fetcher,
  ttl,
  dependencies,
  tags,
  enabled = true
}: UseCacheEntryOptions<T>) => {
  const { get, set } = useAdvancedCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !fetcher) return;

    setLoading(true);
    setError(null);

    try {
      // Try cache first
      const cached = await get<T>(key);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch from source
      const freshData = await fetcher();
      setData(freshData);

      // Cache the result
      await set(key, freshData, {
        ttl,
        dependencies,
        tags
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, enabled, get, set, ttl, dependencies, tags]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(async () => {
    // In a real implementation, this would invalidate the cache entry
    setData(null);
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  };
};

interface UsePrefetchOptions {
  patterns: any[];
  enabled?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export const usePrefetch = ({
  patterns,
  enabled = true,
  priority = 'medium'
}: UsePrefetchOptions) => {
  const { prefetch } = useAdvancedCache();

  useEffect(() => {
    if (enabled && patterns.length > 0) {
      prefetch(patterns);
    }
  }, [patterns, enabled, prefetch]);
};