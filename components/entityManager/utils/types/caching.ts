export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: number;
  dependencies?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  strategy?: 'lru' | 'lfu' | 'fifo' | 'ttl';
  enableCompression?: boolean;
  enableEncryption?: boolean;
  persistence?: 'memory' | 'localStorage' | 'indexedDB';
}

export interface PrefetchConfig {
  enabled: boolean;
  patterns: PrefetchPattern[];
  priority: 'low' | 'medium' | 'high';
  maxConcurrent: number;
}

export interface PrefetchPattern {
  pattern: string; // e.g., "/api/entities/*/details"
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  priority: number;
  conditions?: Record<string, any>;
}

export interface CacheInvalidationRule {
  pattern: string;
  triggers: CacheInvalidationTrigger[];
  cascade?: boolean;
}

export interface CacheInvalidationTrigger {
  event: string;
  conditions?: Record<string, any>;
  delay?: number; // Delay invalidation in milliseconds
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  evictions: number;
  sets: number;
  size: number;
  hitRate: number;
  averageAccessTime: number;
}

export interface OfflineConfig {
  enabled: boolean;
  strategies: OfflineStrategy[];
  syncOnReconnect: boolean;
  maxOfflineTime: number;
}

export interface OfflineStrategy {
  pattern: string;
  method: string;
  fallback: 'cache' | 'queue' | 'reject';
  retryConfig?: RetryConfig;
}

export interface RetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export interface CacheQuery {
  key?: string;
  pattern?: string;
  tags?: string[];
  dependencies?: string[];
  since?: number;
  limit?: number;
}

export interface CacheSyncOperation {
  type: 'set' | 'delete' | 'invalidate';
  key: string;
  data?: any;
  timestamp: number;
  source: string;
}