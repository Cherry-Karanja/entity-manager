import {
  CacheEntry,
  CacheConfig,
  PrefetchConfig,
  CacheInvalidationRule,
  CacheStatistics,
  OfflineConfig,
  CacheQuery,
  CacheSyncOperation,
  PrefetchPattern
} from '../components/entityManager/utils/types/caching';

export class AdvancedCacheManager {
  private cache = new Map<string, CacheEntry>();
  private config: Required<CacheConfig>;
  private prefetchConfig: PrefetchConfig;
  private invalidationRules: CacheInvalidationRule[] = [];
  private offlineConfig: OfflineConfig;
  private statistics: CacheStatistics;
  private prefetchQueue: PrefetchPattern[] = [];
  private activePrefetches = new Set<string>();
  private syncOperations: CacheSyncOperation[] = [];
  private eventListeners = new Map<string, Set<(data: any) => void>>();

  constructor(
    config: CacheConfig = {},
    prefetchConfig: PrefetchConfig = { enabled: false, patterns: [], priority: 'low', maxConcurrent: 3 },
    offlineConfig: OfflineConfig = { enabled: false, strategies: [], syncOnReconnect: false, maxOfflineTime: 3600000 }
  ) {
    this.config = {
      ttl: config.ttl || 300000, // 5 minutes
      maxSize: config.maxSize || 1000,
      strategy: config.strategy || 'lru',
      enableCompression: config.enableCompression || false,
      enableEncryption: config.enableEncryption || false,
      persistence: config.persistence || 'memory'
    };

    this.prefetchConfig = prefetchConfig;
    this.offlineConfig = offlineConfig;

    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      size: 0,
      hitRate: 0,
      averageAccessTime: 0
    };

    this.initializePersistence();
    this.startCleanupInterval();
  }

  // Core cache operations
  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.statistics.misses++;
      return null;
    }

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.statistics.misses++;
      this.statistics.evictions++;
      return null;
    }

    this.statistics.hits++;
    this.updateAccessTime(key, startTime);

    // Update LRU if using LRU strategy
    if (this.config.strategy === 'lru') {
      entry.metadata = entry.metadata || {};
      entry.metadata.lastAccessed = Date.now();
    }

    return entry.data as T;
  }

  async set<T>(key: string, data: T, options: {
    ttl?: number;
    dependencies?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
  } = {}): Promise<void> {
    const now = Date.now();
    const expiresAt = options.ttl ? now + options.ttl : (this.config.ttl ? now + this.config.ttl : undefined);

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: now,
      expiresAt,
      version: 1,
      dependencies: options.dependencies,
      tags: options.tags,
      metadata: {
        ...options.metadata,
        createdAt: now,
        lastAccessed: now
      }
    };

    // Check size limits
    if (this.cache.size >= this.config.maxSize) {
      this.evictEntries();
    }

    this.cache.set(key, entry);
    this.statistics.sets++;
    this.statistics.size = this.cache.size;

    // Persist if configured
    if (this.config.persistence !== 'memory') {
      await this.persistEntry(key, entry);
    }

    // Trigger prefetch for related data
    this.triggerPrefetch(key, data);

    // Emit sync operation
    this.emitSyncOperation({
      type: 'set',
      key,
      data,
      timestamp: now,
      source: 'local'
    });
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.statistics.size = this.cache.size;

      // Remove from persistence
      if (this.config.persistence !== 'memory') {
        await this.removePersistedEntry(key);
      }

      // Invalidate dependencies
      await this.invalidateDependencies(key);

      // Emit sync operation
      this.emitSyncOperation({
        type: 'delete',
        key,
        timestamp: Date.now(),
        source: 'local'
      });
    }
    return deleted;
  }

  async invalidate(pattern: string): Promise<number> {
    const keysToDelete: string[] = [];
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      await this.delete(key);
    }

    return keysToDelete.length;
  }

  // Advanced querying
  async query(query: CacheQuery): Promise<CacheEntry[]> {
    let entries = Array.from(this.cache.values());

    if (query.key) {
      entries = entries.filter(entry => entry.key === query.key);
    }

    if (query.pattern) {
      const regex = new RegExp(query.pattern.replace(/\*/g, '.*'));
      entries = entries.filter(entry => regex.test(entry.key));
    }

    if (query.tags && query.tags.length > 0) {
      const tagSet = new Set(query.tags);
      entries = entries.filter(entry =>
        entry.tags && entry.tags.some(tag => tagSet.has(tag))
      );
    }

    if (query.dependencies && query.dependencies.length > 0) {
      const depSet = new Set(query.dependencies);
      entries = entries.filter(entry =>
        entry.dependencies && entry.dependencies.some(dep => depSet.has(dep))
      );
    }

    if (query.since) {
      const sinceTime = query.since;
      entries = entries.filter(entry => entry.timestamp >= sinceTime);
    }

    if (query.limit) {
      entries = entries.slice(0, query.limit);
    }

    return entries;
  }

  // Prefetching
  async prefetch(patterns: PrefetchPattern[]): Promise<void> {
    if (!this.prefetchConfig.enabled) return;

    this.prefetchQueue.push(...patterns);
    await this.processPrefetchQueue();
  }

  private async processPrefetchQueue(): Promise<void> {
    if (this.activePrefetches.size >= this.prefetchConfig.maxConcurrent) {
      return;
    }

    const pattern = this.prefetchQueue.shift();
    if (!pattern) return;

    const prefetchKey = `${pattern.method}_${pattern.pattern}`;
    if (this.activePrefetches.has(prefetchKey)) {
      return;
    }

    this.activePrefetches.add(prefetchKey);

    try {
      // Generate prefetch URLs based on pattern
      const urls = this.generatePrefetchUrls(pattern);

      for (const url of urls) {
        if (this.activePrefetches.size >= this.prefetchConfig.maxConcurrent) {
          break;
        }

        try {
          // In a real implementation, this would make actual API calls
          // For now, we'll simulate prefetching
          await this.simulatePrefetch(url);
        } catch (error) {
          console.warn(`Prefetch failed for ${url}:`, error);
        }
      }
    } finally {
      this.activePrefetches.delete(prefetchKey);
      // Process next item in queue
      setTimeout(() => this.processPrefetchQueue(), 100);
    }
  }

  private generatePrefetchUrls(pattern: PrefetchPattern): string[] {
    // Simple implementation - in reality, this would be more sophisticated
    // and might involve analyzing recent access patterns
    const urls: string[] = [];

    // For demonstration, generate some common prefetch URLs
    if (pattern.pattern.includes('*')) {
      // Generate URLs for common IDs
      for (let i = 1; i <= 5; i++) {
        urls.push(pattern.pattern.replace('*', i.toString()));
      }
    } else {
      urls.push(pattern.pattern);
    }

    return urls;
  }

  private async simulatePrefetch(url: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    // Simulate caching the result
    const mockData = { url, prefetched: true, timestamp: Date.now() };
    await this.set(`prefetch_${url}`, mockData, { ttl: this.config.ttl });
  }

  // Cache invalidation rules
  registerInvalidationRule(rule: CacheInvalidationRule): void {
    this.invalidationRules.push(rule);
  }

  async processInvalidationEvent(event: string, data: any): Promise<void> {
    for (const rule of this.invalidationRules) {
      const regex = new RegExp(rule.pattern.replace(/\*/g, '.*'));
      if (regex.test(event)) {
        for (const trigger of rule.triggers) {
          if (trigger.event === event) {
            // Check conditions
            if (trigger.conditions) {
              const conditionsMet = Object.entries(trigger.conditions).every(
                ([key, value]) => data[key] === value
              );
              if (!conditionsMet) continue;
            }

            // Execute invalidation
            const delay = trigger.delay || 0;
            setTimeout(async () => {
              const invalidated = await this.invalidate(rule.pattern);
              console.log(`Invalidated ${invalidated} cache entries for pattern ${rule.pattern}`);

              if (rule.cascade) {
                // Trigger cascading invalidations
                await this.processCascadingInvalidation(rule.pattern, data);
              }
            }, delay);
          }
        }
      }
    }
  }

  private async processCascadingInvalidation(pattern: string, data: any): Promise<void> {
    // Find entries that depend on the invalidated pattern
    const dependentEntries = Array.from(this.cache.values()).filter(entry =>
      entry.dependencies && entry.dependencies.some(dep => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(dep);
      })
    );

    for (const entry of dependentEntries) {
      await this.delete(entry.key);
    }
  }

  // Offline support
  async handleOfflineRequest(url: string, method: string, data?: any): Promise<any> {
    if (!this.offlineConfig.enabled) {
      throw new Error('Offline mode not enabled');
    }

    const strategy = this.offlineConfig.strategies.find(s => {
      const regex = new RegExp(s.pattern.replace(/\*/g, '.*'));
      return regex.test(url) && s.method === method;
    });

    if (!strategy) {
      throw new Error('No offline strategy found');
    }

    switch (strategy.fallback) {
      case 'cache':
        const cached = await this.get(`offline_${method}_${url}`);
        if (cached) return cached;
        throw new Error('No cached data available');

      case 'queue':
        // Queue the request for later
        this.queueOfflineRequest(url, method, data);
        return { queued: true };

      case 'reject':
      default:
        throw new Error('Request not available offline');
    }
  }

  private queueOfflineRequest(url: string, method: string, data?: any): void {
    // In a real implementation, this would store the request in IndexedDB
    // or another persistent storage for later retry
    console.log(`Queued offline request: ${method} ${url}`, data);
  }

  // Statistics and monitoring
  getStatistics(): CacheStatistics {
    const totalRequests = this.statistics.hits + this.statistics.misses;
    this.statistics.hitRate = totalRequests > 0 ? this.statistics.hits / totalRequests : 0;

    return { ...this.statistics };
  }

  resetStatistics(): void {
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      size: this.cache.size,
      hitRate: 0,
      averageAccessTime: 0
    };
  }

  // Event system
  on(event: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(listener);
    }
  }

  off(event: string, listener: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in cache event listener:', error);
        }
      });
    }
  }

  private emitSyncOperation(operation: CacheSyncOperation): void {
    this.syncOperations.push(operation);
    this.emit('sync', operation);
  }

  // Persistence
  private async initializePersistence(): Promise<void> {
    if (this.config.persistence === 'memory') return;

    try {
      if (this.config.persistence === 'localStorage') {
        await this.loadFromLocalStorage();
      } else if (this.config.persistence === 'indexedDB') {
        await this.loadFromIndexedDB();
      }
    } catch (error) {
      console.warn('Failed to initialize cache persistence:', error);
    }
  }

  private async persistEntry(key: string, entry: CacheEntry): Promise<void> {
    try {
      if (this.config.persistence === 'localStorage') {
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } else if (this.config.persistence === 'indexedDB') {
        // IndexedDB implementation would go here
        console.log('IndexedDB persistence not implemented');
      }
    } catch (error) {
      console.warn('Failed to persist cache entry:', error);
    }
  }

  private async removePersistedEntry(key: string): Promise<void> {
    try {
      if (this.config.persistence === 'localStorage') {
        localStorage.removeItem(`cache_${key}`);
      } else if (this.config.persistence === 'indexedDB') {
        // IndexedDB implementation would go here
        console.log('IndexedDB removal not implemented');
      }
    } catch (error) {
      console.warn('Failed to remove persisted cache entry:', error);
    }
  }

  private async loadFromLocalStorage(): Promise<void> {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          const cacheKey = key.substring(6);
          const data = localStorage.getItem(key);
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            this.cache.set(cacheKey, entry);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private async loadFromIndexedDB(): Promise<void> {
    // IndexedDB implementation would go here
    console.log('IndexedDB loading not implemented');
  }

  // Cache eviction strategies
  private evictEntries(): void {
    const entries = Array.from(this.cache.entries());

    switch (this.config.strategy) {
      case 'lru':
        entries.sort((a, b) => {
          const aTime = a[1].metadata?.lastAccessed || a[1].timestamp;
          const bTime = b[1].metadata?.lastAccessed || b[1].timestamp;
          return aTime - bTime; // Oldest first
        });
        break;

      case 'lfu':
        // Least frequently used - would need access count tracking
        entries.sort((a, b) => {
          const aCount = a[1].metadata?.accessCount || 0;
          const bCount = b[1].metadata?.accessCount || 0;
          return aCount - bCount;
        });
        break;

      case 'fifo':
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        break;

      case 'ttl':
        entries.sort((a, b) => {
          const aExpiry = a[1].expiresAt || Infinity;
          const bExpiry = b[1].expiresAt || Infinity;
          return aExpiry - bExpiry;
        });
        break;
    }

    // Remove oldest entries until we're under the limit
    const toRemove = Math.max(0, this.cache.size - this.config.maxSize + 1);
    for (let i = 0; i < toRemove; i++) {
      const [key] = entries[i];
      this.cache.delete(key);
      this.statistics.evictions++;
    }
  }

  private updateAccessTime(key: string, accessTime: number): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.metadata = entry.metadata || {};
      entry.metadata.accessCount = (entry.metadata.accessCount || 0) + 1;
      entry.metadata.lastAccessed = accessTime;
      entry.metadata.totalAccessTime = (entry.metadata.totalAccessTime || 0) + (Date.now() - accessTime);
    }
  }

  private async invalidateDependencies(key: string): Promise<void> {
    const entry = this.cache.get(key);
    if (!entry?.dependencies) return;

    for (const dependency of entry.dependencies) {
      await this.invalidate(dependency);
    }
  }

  private triggerPrefetch(key: string, data: any): void {
    if (!this.prefetchConfig.enabled) return;

    // Analyze the data to determine what to prefetch
    // This is a simple implementation - in reality, this would be more sophisticated
    if (typeof data === 'object' && data !== null) {
      const relatedKeys = this.extractRelatedKeys(data);
      for (const relatedKey of relatedKeys) {
        if (!this.cache.has(relatedKey)) {
          // Add to prefetch queue
          this.prefetchQueue.push({
            pattern: relatedKey,
            method: 'GET',
            priority: 1
          });
        }
      }
    }

    this.processPrefetchQueue();
  }

  private extractRelatedKeys(data: any): string[] {
    const keys: string[] = [];

    if (Array.isArray(data)) {
      // If it's an array of entities, prefetch related data
      data.forEach(item => {
        if (item && typeof item === 'object') {
          if (item.id) {
            keys.push(`${item.type || 'entity'}_${item.id}_details`);
          }
        }
      });
    } else if (data && typeof data === 'object') {
      // If it's a single entity, prefetch related entities
      if (data.related_entities) {
        data.related_entities.forEach((related: any) => {
          if (related.id) {
            keys.push(`${related.type || 'entity'}_${related.id}`);
          }
        });
      }
    }

    return keys;
  }

  private startCleanupInterval(): void {
    // Clean up expired entries every minute
    setInterval(() => {
      const now = Date.now();
      const expiredKeys: string[] = [];

      for (const [key, entry] of this.cache) {
        if (entry.expiresAt && now > entry.expiresAt) {
          expiredKeys.push(key);
        }
      }

      expiredKeys.forEach(key => {
        this.cache.delete(key);
        this.statistics.evictions++;
      });

      this.statistics.size = this.cache.size;
    }, 60000);
  }

  // Cleanup
  destroy(): void {
    this.cache.clear();
    this.prefetchQueue.length = 0;
    this.activePrefetches.clear();
    this.eventListeners.clear();
  }
}

// Global cache manager instance
let cacheManager: AdvancedCacheManager | null = null;

export const getCacheManager = (
  config?: CacheConfig,
  prefetchConfig?: PrefetchConfig,
  offlineConfig?: OfflineConfig
): AdvancedCacheManager => {
  if (!cacheManager) {
    cacheManager = new AdvancedCacheManager(config, prefetchConfig, offlineConfig);
  }
  return cacheManager;
};

export const destroyCacheManager = (): void => {
  if (cacheManager) {
    cacheManager.destroy();
    cacheManager = null;
  }
};