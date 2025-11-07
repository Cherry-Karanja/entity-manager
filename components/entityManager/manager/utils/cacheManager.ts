'use client'

import {
  CacheManager,
  CacheEntry,
  CacheConfig,
  CacheAnalytics,
  CacheOptions,
  PrefetchRequest,
  PrefetchResult,
  DEFAULT_CACHE_CONFIG,
  DEFAULT_PREFETCH_STRATEGY,
  DEFAULT_BACKGROUND_SYNC_CONFIG,
  estimateSize,
  isExpired,
  shouldRefresh
} from '../types/cache'
import { CachePolicyManager, defaultCachePolicyConfig } from '../../../../lib/cachePolicies'

// ===== ADVANCED CACHE MANAGER IMPLEMENTATION =====

export class AdvancedCacheManager implements CacheManager {
  private cache = new Map<string, CacheEntry>()
  private config: CacheConfig
  private analytics: CacheAnalytics
  private prefetchQueue: PrefetchRequest[] = []
  private backgroundSyncTimer?: NodeJS.Timeout
  private isBackgroundSyncRunning = false
  private policyManager: CachePolicyManager

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config }
    this.policyManager = new CachePolicyManager(defaultCachePolicyConfig)
    this.analytics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
      averageAccessTime: 0,
      lastReset: Date.now()
    }
  }

  // ===== CORE CACHE OPERATIONS =====

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now()
    const entry = this.cache.get(key)

    if (!entry) {
      this.analytics.misses++
      this.updateHitRate()
      return null
    }

    // Get entity type from key (assuming format: entityType:id)
    const entityType = key.split(':')[0]
    const policy = this.policyManager.getPolicy(entityType)

    // Check expiration based on policy
    const age = Date.now() - entry.timestamp
    if (age > policy.ttl) {
      this.cache.delete(key)
      this.analytics.misses++
      this.analytics.evictions++
      this.updateAnalytics()
      return null
    }

    // Update access statistics
    entry.accessCount++
    entry.lastAccessed = Date.now()

    this.analytics.hits++
    this.analytics.averageAccessTime = (this.analytics.averageAccessTime + (Date.now() - startTime)) / 2
    this.updateHitRate()

    return entry.data as T
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    // Get entity type from key (assuming format: entityType:id)
    const entityType = key.split(':')[0]
    const policy = this.policyManager.getPolicy(entityType)

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: options.ttl || policy.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size: estimateSize(value),
      dependencies: options.dependencies,
      tags: options.tags,
      metadata: options.metadata
    }

    // Check if we need to evict entries based on policy maxSize
    await this.ensureCapacity(entry.size, policy.maxSize)

    this.cache.set(key, entry)
    this.analytics.size += entry.size
    this.analytics.entries++
    this.updateAnalytics()

    // Handle dependencies
    if (options.dependencies) {
      for (const dep of options.dependencies) {
        const depEntry = this.cache.get(dep)
        if (depEntry && !depEntry.dependencies) {
          depEntry.dependencies = []
        }
        if (depEntry && depEntry.dependencies && !depEntry.dependencies.includes(key)) {
          depEntry.dependencies.push(key)
        }
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Handle dependent entries
    if (entry.dependencies) {
      for (const dep of entry.dependencies) {
        const depEntry = this.cache.get(dep)
        if (depEntry && depEntry.dependencies) {
          depEntry.dependencies = depEntry.dependencies.filter((d: string) => d !== key)
        }
      }
    }

    this.cache.delete(key)
    this.analytics.size -= entry.size
    this.analytics.entries--
    this.analytics.evictions++
    this.updateAnalytics()

    return true
  }

  async clear(): Promise<void> {
    this.cache.clear()
    this.analytics.size = 0
    this.analytics.entries = 0
    this.analytics.evictions = 0
    this.updateAnalytics()
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    return entry !== undefined && !isExpired(entry)
  }

  // ===== ADVANCED OPERATIONS =====

  async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    const results = new Map<string, T>()
    const promises = keys.map(async (key) => {
      const value = await this.get<T>(key)
      if (value !== null) {
        results.set(key, value)
      }
    })
    await Promise.all(promises)
    return results
  }

  async setMultiple(entries: Map<string, unknown>, options: CacheOptions = {}): Promise<void> {
    const promises = Array.from(entries.entries()).map(([key, value]) =>
      this.set(key, value, options)
    )
    await Promise.all(promises)
  }

  async deleteMultiple(keys: string[]): Promise<number> {
    let deleted = 0
    for (const key of keys) {
      if (await this.delete(key)) {
        deleted++
      }
    }
    return deleted
  }

  async invalidateByPattern(pattern: string | RegExp): Promise<number> {
    const keysToDelete: string[] = []
    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string') {
        if (key.includes(pattern)) {
          keysToDelete.push(key)
        }
      } else {
        if (pattern.test(key)) {
          keysToDelete.push(key)
        }
      }
    }
    return this.deleteMultiple(keysToDelete)
  }

  async invalidateByTag(tag: string): Promise<number> {
    const keysToDelete: string[] = []
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        keysToDelete.push(key)
      }
    }
    return this.deleteMultiple(keysToDelete)
  }

  // ===== PREFETCHING =====

  async prefetch(keys: string[], priority: 'low' | 'medium' | 'high' = 'low'): Promise<void> {
    const requests: PrefetchRequest[] = keys.map(key => ({
      key,
      priority,
      timestamp: Date.now(),
      retryCount: 0
    }))

    this.prefetchQueue.push(...requests)
    this.prefetchQueue.sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    // Process prefetch queue
    this.processPrefetchQueue()
  }

  async prefetchRelated(entityType: string, entityId: string | number, relations: string[]): Promise<void> {
    const keys = relations.map(relation =>
      `${entityType}:${entityId}:${relation}`
    )
    await this.prefetch(keys, 'medium')
  }

  private async processPrefetchQueue(): Promise<void> {
    if (!this.config.prefetchEnabled || this.prefetchQueue.length === 0) return

    const batchSize = DEFAULT_PREFETCH_STRATEGY.batchSize
    const batch = this.prefetchQueue.splice(0, batchSize)

    // In a real implementation, this would fetch data from the API
    // For now, we'll just mark as processed
    for (const request of batch) {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  // ===== ANALYTICS =====

  getAnalytics(): CacheAnalytics {
    return { ...this.analytics }
  }

  resetAnalytics(): void {
    this.analytics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: this.analytics.size,
      entries: this.analytics.entries,
      hitRate: 0,
      averageAccessTime: 0,
      lastReset: Date.now()
    }
  }

  private updateHitRate(): void {
    const total = this.analytics.hits + this.analytics.misses
    this.analytics.hitRate = total > 0 ? this.analytics.hits / total : 0
  }

  private updateAnalytics(): void {
    // Additional analytics updates can be added here
  }

  // ===== BACKGROUND SYNC =====

  startBackgroundSync(): void {
    if (!this.config.backgroundSync || this.backgroundSyncTimer) return

    this.backgroundSyncTimer = setInterval(() => {
      this.performBackgroundSync()
    }, DEFAULT_BACKGROUND_SYNC_CONFIG.interval)
  }

  stopBackgroundSync(): void {
    if (this.backgroundSyncTimer) {
      clearInterval(this.backgroundSyncTimer)
      this.backgroundSyncTimer = undefined
    }
  }

  private async performBackgroundSync(): Promise<void> {
    if (this.isBackgroundSyncRunning) return
    this.isBackgroundSyncRunning = true

    try {
      // Check for expired entries and refresh them
      const expiredKeys: string[] = []
      for (const [key, entry] of this.cache.entries()) {
        if (shouldRefresh(entry, 0.8)) { // Refresh when 80% of TTL is reached
          expiredKeys.push(key)
        }
      }

      if (expiredKeys.length > 0) {
        // In a real implementation, this would refresh data from the API
        console.log(`Background sync: refreshing ${expiredKeys.length} entries`)
      }
    } finally {
      this.isBackgroundSyncRunning = false
    }
  }

  // ===== CONFIGURATION =====

  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config }

    if (config.backgroundSync !== undefined) {
      if (config.backgroundSync) {
        this.startBackgroundSync()
      } else {
        this.stopBackgroundSync()
      }
    }
  }

  getConfig(): CacheConfig {
    return { ...this.config }
  }

  // ===== CLEANUP AND OPTIMIZATION =====

  async cleanup(): Promise<void> {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (isExpired(entry, now)) {
        keysToDelete.push(key)
      }
    }

    await this.deleteMultiple(keysToDelete)
  }

  async optimize(): Promise<void> {
    // Implement cache optimization based on access patterns
    const entries = Array.from(this.cache.entries())

    switch (this.config.evictionPolicy) {
      case 'lru':
        entries.sort(([, a], [, b]) => b.lastAccessed - a.lastAccessed)
        break
      case 'lfu':
        entries.sort(([, a], [, b]) => b.accessCount - a.accessCount)
        break
      case 'fifo':
        entries.sort(([, a], [, b]) => a.timestamp - b.timestamp)
        break
      case 'ttl':
        entries.sort(([, a], [, b]) => (a.timestamp + a.ttl) - (b.timestamp + b.ttl))
        break
    }

    // Keep only the most relevant entries
    const maxEntries = Math.floor(this.config.maxSize / 1024) // Rough estimate
    if (entries.length > maxEntries) {
      const toEvict = entries.slice(maxEntries)
      const keysToDelete = toEvict.map(([key]) => key)
      await this.deleteMultiple(keysToDelete)
    }
  }

  // ===== UTILITY METHODS =====

  private async ensureCapacity(newEntrySize: number, maxSize?: number): Promise<void> {
    const effectiveMaxSize = maxSize || this.config.maxSize
    while (this.analytics.size + newEntrySize > effectiveMaxSize && this.cache.size > 0) {
      await this.evictLeastRelevant()
    }
  }

  private async evictLeastRelevant(): Promise<void> {
    let keyToEvict: string | null = null
    let lowestScore = Infinity

    for (const [key, entry] of this.cache.entries()) {
      let score = 0

      switch (this.config.evictionPolicy) {
        case 'lru':
          score = entry.lastAccessed
          break
        case 'lfu':
          score = entry.accessCount
          break
        case 'fifo':
          score = entry.timestamp
          break
        case 'ttl':
          score = entry.timestamp + entry.ttl
          break
      }

      if (score < lowestScore) {
        lowestScore = score
        keyToEvict = key
      }
    }

    if (keyToEvict) {
      await this.delete(keyToEvict)
    }
  }

  // ===== POLICY MANAGEMENT METHODS =====

  getPolicy(entityType: string) {
    return this.policyManager.getPolicy(entityType)
  }

  updatePolicy(entityType: string, policy: any) {
    this.policyManager.updatePolicy(entityType, policy)
  }

  shouldRefreshEntry(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const entityType = key.split(':')[0]
    const policy = this.policyManager.getPolicy(entityType)
    return this.policyManager.shouldRefresh(entry, policy)
  }

  getAllPolicies() {
    return this.policyManager.getAllPolicies()
  }
}

// ===== CACHE MANAGER FACTORY =====

export function createCacheManager(config: Partial<CacheConfig> = {}): CacheManager {
  return new AdvancedCacheManager(config)
}

// ===== DEFAULT CACHE INSTANCE =====

export const defaultCacheManager = createCacheManager()