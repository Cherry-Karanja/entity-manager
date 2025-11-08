'use client'

import { BaseEntity } from '../types'

// ===== ADVANCED CACHE TYPES =====

export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
  size: number // estimated size in bytes
  dependencies?: string[] // cache keys this entry depends on
  tags?: string[] // tags for group invalidation
  metadata?: Record<string, unknown>
}

export interface CacheConfig {
  defaultTtl: number
  maxSize: number // max entries or bytes
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl'
  enableCompression: boolean
  enablePersistence: boolean
  backgroundSync: boolean
  prefetchEnabled: boolean
  analyticsEnabled: boolean
}

export interface CacheAnalytics {
  hits: number
  misses: number
  evictions: number
  size: number
  entries: number
  hitRate: number
  averageAccessTime: number
  lastReset: number
}

export interface PrefetchStrategy {
  enabled: boolean
  relatedEntities: boolean
  frequentlyAccessed: boolean
  predictive: boolean
  batchSize: number
  priority: 'low' | 'medium' | 'high'
}

export interface CacheInvalidationRule {
  pattern: string | RegExp
  ttl?: number
  cascade: boolean
  dependencies?: string[]
}

export interface BackgroundSyncConfig {
  enabled: boolean
  interval: number
  batchSize: number
  retryAttempts: number
  priority: 'low' | 'medium' | 'high'
}

export interface CachePolicy {
  name: string
  ttl: number
  maxAge: number
  refreshThreshold: number // when to refresh before expiry
  dependencies: string[]
  invalidationRules: CacheInvalidationRule[]
}

// ===== CACHE MANAGER INTERFACE =====

export interface CacheManager {
  // Core operations
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T, options?: CacheOptions) => Promise<void>
  delete: (key: string) => Promise<boolean>
  clear: () => Promise<void>
  has: (key: string) => boolean

  // Advanced operations
  getMultiple: <T>(keys: string[]) => Promise<Map<string, T>>
  setMultiple: (entries: Map<string, unknown>, options?: CacheOptions) => Promise<void>
  deleteMultiple: (keys: string[]) => Promise<number>
  invalidateByPattern: (pattern: string | RegExp) => Promise<number>
  invalidateByTag: (tag: string) => Promise<number>

  // Prefetching
  prefetch: (keys: string[], priority?: 'low' | 'medium' | 'high') => Promise<void>
  prefetchRelated: (entityType: string, entityId: string | number, relations: string[]) => Promise<void>

  // Analytics
  getAnalytics: () => CacheAnalytics
  resetAnalytics: () => void

  // Background sync
  startBackgroundSync: () => void
  stopBackgroundSync: () => void

  // Configuration
  updateConfig: (config: Partial<CacheConfig>) => void
  getConfig: () => CacheConfig

  // Cleanup
  cleanup: () => Promise<void>
  optimize: () => Promise<void>
}

export interface CacheOptions {
  ttl?: number
  tags?: string[]
  dependencies?: string[]
  priority?: 'low' | 'medium' | 'high'
  metadata?: Record<string, unknown>
  skipCompression?: boolean
}

// ===== PREFETCHING TYPES =====

export interface PrefetchRequest {
  key: string
  priority: 'low' | 'medium' | 'high'
  timestamp: number
  retryCount: number
}

export interface PrefetchResult {
  key: string
  success: boolean
  data?: unknown
  error?: string
  duration: number
  size: number
}

// ===== CACHE STRATEGIES =====

export interface CacheStrategy {
  name: string
  shouldCache: (key: string, data: unknown) => boolean
  getTtl: (key: string, data: unknown) => number
  getPriority: (key: string) => 'low' | 'medium' | 'high'
  getTags: (key: string, data: unknown) => string[]
  getDependencies: (key: string, data: unknown) => string[]
}

export interface EntityCacheStrategy extends CacheStrategy {
  entityType: string
  prefetchRelations: (entity: BaseEntity) => string[]
  getInvalidationPatterns: (entity: BaseEntity) => string[]
}

// ===== UTILITY FUNCTIONS =====

export function generateCacheKey(entityType: string, operation: string, params?: Record<string, unknown>): string {
  const paramStr = params ? `_${JSON.stringify(params)}` : ''
  return `${entityType}:${operation}${paramStr}`
}

export function parseCacheKey(key: string): { entityType: string; operation: string; params?: Record<string, unknown> } {
  const [entityType, operationAndParams] = key.split(':')
  const [operation, paramStr] = operationAndParams.split('_', 2)

  let params: Record<string, unknown> | undefined
  if (paramStr) {
    try {
      params = JSON.parse(paramStr)
    } catch {
      // Invalid JSON, ignore
    }
  }

  return { entityType, operation, params }
}

export function estimateSize(data: unknown): number {
  // Rough estimation of object size in bytes
  const str = JSON.stringify(data)
  return str ? str.length * 2 : 0 // UTF-16 encoding
}

export function isExpired(entry: CacheEntry, currentTime: number = Date.now()): boolean {
  return currentTime - entry.timestamp > entry.ttl
}

export function shouldRefresh(entry: CacheEntry, refreshThreshold: number, currentTime: number = Date.now()): boolean {
  const age = currentTime - entry.timestamp
  const refreshTime = entry.ttl * refreshThreshold
  return age > refreshTime
}

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  defaultTtl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50 * 1024 * 1024, // 50MB
  evictionPolicy: 'lru',
  enableCompression: false,
  enablePersistence: false,
  backgroundSync: true,
  prefetchEnabled: true,
  analyticsEnabled: true
}

export const DEFAULT_PREFETCH_STRATEGY: PrefetchStrategy = {
  enabled: true,
  relatedEntities: true,
  frequentlyAccessed: true,
  predictive: false,
  batchSize: 5,
  priority: 'low'
}

export const DEFAULT_BACKGROUND_SYNC_CONFIG: BackgroundSyncConfig = {
  enabled: true,
  interval: 30 * 1000, // 30 seconds
  batchSize: 10,
  retryAttempts: 3,
  priority: 'low'
}