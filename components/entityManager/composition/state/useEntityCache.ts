/**
 * Entity Cache Hook
 * 
 * Hook for caching entity data with TTL and storage strategies.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { CacheEntry, CacheOptions } from './types';

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: Required<CacheOptions> = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'memory'
};

/**
 * Storage adapter interface
 */
interface StorageAdapter {
  get(key: string): CacheEntry | null;
  set(key: string, entry: CacheEntry): void;
  delete(key: string): void;
  clear(): void;
  keys(): string[];
}

/**
 * Memory storage adapter
 */
class MemoryStorage implements StorageAdapter {
  private cache = new Map<string, CacheEntry>();

  get(key: string): CacheEntry | null {
    return this.cache.get(key) || null;
  }

  set(key: string, entry: CacheEntry): void {
    this.cache.set(key, entry);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * LocalStorage adapter
 */
class LocalStorageAdapter implements StorageAdapter {
  private prefix = 'entity-cache:';

  get(key: string): CacheEntry | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set(key: string, entry: CacheEntry): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Ignore storage errors
    }
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Ignore storage errors
    }
  }

  clear(): void {
    try {
      const keys = this.keys();
      keys.forEach(key => this.delete(key));
    } catch {
      // Ignore storage errors
    }
  }

  keys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length));
        }
      }
      return keys;
    } catch {
      return [];
    }
  }
}

/**
 * SessionStorage adapter
 */
class SessionStorageAdapter implements StorageAdapter {
  private prefix = 'entity-cache:';

  get(key: string): CacheEntry | null {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set(key: string, entry: CacheEntry): void {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Ignore storage errors
    }
  }

  delete(key: string): void {
    try {
      sessionStorage.removeItem(this.prefix + key);
    } catch {
      // Ignore storage errors
    }
  }

  clear(): void {
    try {
      const keys = this.keys();
      keys.forEach(key => this.delete(key));
    } catch {
      // Ignore storage errors
    }
  }

  keys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length));
        }
      }
      return keys;
    } catch {
      return [];
    }
  }
}

/**
 * Get storage adapter
 */
function getStorageAdapter(strategy: CacheOptions['strategy']): StorageAdapter {
  switch (strategy) {
    case 'localStorage':
      return new LocalStorageAdapter();
    case 'sessionStorage':
      return new SessionStorageAdapter();
    default:
      return new MemoryStorage();
  }
}

/**
 * Use entity cache hook
 */
export function useEntityCache<T = unknown>(options: CacheOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const storageRef = useRef(getStorageAdapter(opts.strategy));
  const [version, setVersion] = useState(0);

  /**
   * Check if entry is expired
   */
  const isExpired = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp > entry.ttl;
  }, []);

  /**
   * Get cached value
   */
  const get = useCallback((key: string): T | null => {
    const entry = storageRef.current.get(key);
    if (!entry) return null;
    
    if (isExpired(entry)) {
      storageRef.current.delete(key);
      return null;
    }
    
    return entry.data as T;
  }, [isExpired]);

  /**
   * Set cached value
   */
  const set = useCallback((key: string, data: T, ttl?: number): void => {
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttl || opts.ttl
    };
    
    // Enforce max size
    const keys = storageRef.current.keys();
    if (keys.length >= opts.maxSize) {
      // Remove oldest entry
      const entries = keys.map(k => storageRef.current.get(k)).filter((e): e is CacheEntry => e !== null);
      const oldest = entries.sort((a, b) => a.timestamp - b.timestamp)[0];
      if (oldest) {
        storageRef.current.delete(oldest.key);
      }
    }
    
    storageRef.current.set(key, entry);
    setVersion(v => v + 1);
  }, [opts.ttl, opts.maxSize]);

  /**
   * Delete cached value
   */
  const del = useCallback((key: string): void => {
    storageRef.current.delete(key);
    setVersion(v => v + 1);
  }, []);

  /**
   * Clear all cache
   */
  const clear = useCallback((): void => {
    storageRef.current.clear();
    setVersion(v => v + 1);
  }, []);

  /**
   * Check if key exists
   */
  const has = useCallback((key: string): boolean => {
    const entry = storageRef.current.get(key);
    if (!entry) return false;
    if (isExpired(entry)) {
      storageRef.current.delete(key);
      return false;
    }
    return true;
  }, [isExpired]);

  /**
   * Get all keys
   */
  const keys = useCallback((): string[] => {
    return storageRef.current.keys();
  }, []);

  /**
   * Get cache size
   */
  const size = useCallback((): number => {
    return storageRef.current.keys().length;
  }, []);

  /**
   * Clean expired entries
   */
  const cleanExpired = useCallback((): void => {
    const allKeys = storageRef.current.keys();
    allKeys.forEach(key => {
      const entry = storageRef.current.get(key);
      if (entry && isExpired(entry)) {
        storageRef.current.delete(key);
      }
    });
    setVersion(v => v + 1);
  }, [isExpired]);

  // Auto-clean expired entries periodically
  useEffect(() => {
    const interval = setInterval(cleanExpired, opts.ttl);
    return () => clearInterval(interval);
  }, [cleanExpired, opts.ttl]);

  return {
    get,
    set,
    delete: del,
    clear,
    has,
    keys,
    size,
    cleanExpired,
    version
  };
}
