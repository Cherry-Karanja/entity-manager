'use client'

import { BaseEntity } from '../types'
import { CacheManager, PrefetchStrategy, DEFAULT_PREFETCH_STRATEGY, generateCacheKey } from '../types/cache'

// ===== PREFETCHING STRATEGIES =====

export interface PrefetchRule {
  id: string
  name: string
  condition: (entity: BaseEntity, context?: PrefetchContext) => boolean
  prefetchKeys: (entity: BaseEntity, context?: PrefetchContext) => string[]
  priority: 'low' | 'medium' | 'high'
  enabled: boolean
}

export interface PrefetchContext {
  currentEntityType: string
  accessedFields?: string[]
  userRole?: string
  timeOfDay?: number
  accessPattern?: 'frequent' | 'occasional' | 'rare'
}

export interface PrefetchBatch {
  id: string
  keys: string[]
  priority: 'low' | 'medium' | 'high'
  timestamp: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  results: PrefetchResult[]
}

export interface PrefetchResult {
  key: string
  success: boolean
  data?: unknown
  error?: string
  duration: number
  size: number
}

export class PrefetchManager {
  private cacheManager: CacheManager
  private strategy: PrefetchStrategy
  private rules: PrefetchRule[] = []
  private prefetchQueue: PrefetchBatch[] = []
  private accessPatterns: Map<string, AccessPattern> = new Map()
  private isProcessing = false

  constructor(cacheManager: CacheManager, strategy?: Partial<PrefetchStrategy>) {
    this.cacheManager = cacheManager
    this.strategy = { ...DEFAULT_PREFETCH_STRATEGY, ...strategy }
    this.initializeDefaultRules()
  }

  // ===== RULE MANAGEMENT =====

  addRule(rule: PrefetchRule): void {
    this.rules.push(rule)
  }

  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(r => r.id === ruleId)
    if (index > -1) {
      this.rules.splice(index, 1)
      return true
    }
    return false
  }

  getRules(): PrefetchRule[] {
    return [...this.rules]
  }

  enableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.id === ruleId)
    if (rule) {
      rule.enabled = true
      return true
    }
    return false
  }

  disableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.id === ruleId)
    if (rule) {
      rule.enabled = false
      return true
    }
    return false
  }

  // ===== PREFETCHING LOGIC =====

  async prefetchForEntity(entity: BaseEntity, context?: PrefetchContext): Promise<void> {
    if (!this.strategy.enabled) return

    const applicableRules = this.rules.filter(rule =>
      rule.enabled && rule.condition(entity, context)
    )

    if (applicableRules.length === 0) return

    const allKeys: string[] = []
    const priorities: Record<string, 'low' | 'medium' | 'high'> = {}

    for (const rule of applicableRules) {
      const keys = rule.prefetchKeys(entity, context)
      for (const key of keys) {
        if (!allKeys.includes(key)) {
          allKeys.push(key)
          priorities[key] = rule.priority
        }
      }
    }

    // Create batches based on priority
    const batches = this.createBatches(allKeys, priorities)
    for (const batch of batches) {
      this.prefetchQueue.push(batch)
    }

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processPrefetchQueue()
    }

    // Update access patterns
    this.updateAccessPattern(entity, context)
  }

  async prefetchRelated(entityType: string, entityId: string | number, relations: string[]): Promise<void> {
    if (!this.strategy.relatedEntities) return

    const keys = relations.map(relation =>
      generateCacheKey(entityType, 'related', { id: entityId, relation })
    )

    await this.prefetch(keys, 'medium')
  }

  async prefetchFrequentlyAccessed(limit: number = 10): Promise<void> {
    if (!this.strategy.frequentlyAccessed) return

    const frequentEntities = this.getFrequentlyAccessedEntities(limit)
    const keys = frequentEntities.map(entity =>
      generateCacheKey(entity.type, 'get', { id: entity.id })
    )

    await this.prefetch(keys, 'low')
  }

  async prefetchPredictive(context?: PrefetchContext): Promise<void> {
    if (!this.strategy.predictive) return

    const predictedKeys = this.predictNextAccesses(context)
    if (predictedKeys.length > 0) {
      await this.prefetch(predictedKeys, 'low')
    }
  }

  private async prefetch(keys: string[], priority: 'low' | 'medium' | 'high' = 'low'): Promise<void> {
    const batch: PrefetchBatch = {
      id: this.generateBatchId(),
      keys: [...keys],
      priority,
      timestamp: Date.now(),
      status: 'pending',
      results: []
    }

    this.prefetchQueue.push(batch)
    this.prefetchQueue.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority))

    if (!this.isProcessing) {
      this.processPrefetchQueue()
    }
  }

  private async processPrefetchQueue(): Promise<void> {
    if (this.isProcessing || this.prefetchQueue.length === 0) return
    this.isProcessing = true

    try {
      while (this.prefetchQueue.length > 0) {
        const batch = this.prefetchQueue[0]

        if (batch.status === 'pending') {
          batch.status = 'processing'
          const success = await this.processBatch(batch)

          if (success) {
            batch.status = 'completed'
            this.prefetchQueue.shift()
          } else {
            batch.status = 'failed'
            // Move failed batch to the end for retry
            const failedBatch = this.prefetchQueue.shift()
            if (failedBatch) {
              this.prefetchQueue.push(failedBatch)
            }
            break // Stop processing to avoid infinite loops
          }
        }
      }
    } finally {
      this.isProcessing = false
    }
  }

  private async processBatch(batch: PrefetchBatch): Promise<boolean> {
    try {
      // Process keys in parallel with concurrency control
      const promises = batch.keys.map(key => this.prefetchSingleKey(key))
      const results = await Promise.allSettled(promises)

      batch.results = results.map((result, index) => {
        const key = batch.keys[index]
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          return {
            key,
            success: false,
            error: result.reason?.message || 'Unknown error',
            duration: 0,
            size: 0
          }
        }
      })

      return true

    } catch (error) {
      return false
    }
  }

  private async prefetchSingleKey(key: string): Promise<PrefetchResult> {
    const startTime = Date.now()

    try {
      // Check if already in cache
      const existing = await this.cacheManager.get(key)
      if (existing !== null) {
        return {
          key,
          success: true,
          data: existing,
          duration: Date.now() - startTime,
          size: this.estimateSize(existing)
        }
      }

      // In a real implementation, this would fetch from the API
      // For now, we'll simulate the fetch
      const data = await this.simulateFetch(key)

      if (data) {
        await this.cacheManager.set(key, data, { priority: 'low' })
      }

      return {
        key,
        success: true,
        data,
        duration: Date.now() - startTime,
        size: this.estimateSize(data)
      }

    } catch (error) {
      return {
        key,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        size: 0
      }
    }
  }

  // ===== ACCESS PATTERN ANALYSIS =====

  private updateAccessPattern(entity: BaseEntity, context?: PrefetchContext): void {
    const key = `${entity.constructor.name}:${entity.id}`
    const pattern = this.accessPatterns.get(key) || {
      entityType: entity.constructor.name,
      entityId: entity.id,
      accessCount: 0,
      lastAccessed: 0,
      accessTimes: [],
      contexts: []
    }

    pattern.accessCount++
    pattern.lastAccessed = Date.now()
    pattern.accessTimes.push(Date.now())

    if (context) {
      pattern.contexts.push(context)
    }

    // Keep only last 100 access times
    if (pattern.accessTimes.length > 100) {
      pattern.accessTimes = pattern.accessTimes.slice(-100)
    }

    // Keep only last 10 contexts
    if (pattern.contexts.length > 10) {
      pattern.contexts = pattern.contexts.slice(-10)
    }

    this.accessPatterns.set(key, pattern)
  }

  private getFrequentlyAccessedEntities(limit: number): Array<{ type: string; id: string | number }> {
    const entities = Array.from(this.accessPatterns.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit)
      .map(pattern => ({
        type: pattern.entityType,
        id: pattern.entityId
      }))

    return entities
  }

  private predictNextAccesses(context?: PrefetchContext): string[] {
    // Simple prediction based on access patterns
    const predictions: string[] = []

    if (!context) return predictions

    // Find similar contexts and predict next accesses
    for (const [key, pattern] of this.accessPatterns) {
      const similarContexts = pattern.contexts.filter(c =>
        c.currentEntityType === context.currentEntityType &&
        c.accessPattern === context.accessPattern
      )

      if (similarContexts.length > 0) {
        // Predict related entities
        predictions.push(`${pattern.entityType}:related:${pattern.entityId}`)
      }
    }

    return predictions.slice(0, 5) // Limit predictions
  }

  // ===== DEFAULT RULES =====

  private initializeDefaultRules(): void {
    // Rule for entities with relationships
    this.addRule({
      id: 'related_entities',
      name: 'Related Entities Prefetch',
      condition: (entity) => this.hasRelationships(entity),
      prefetchKeys: (entity) => this.getRelationshipKeys(entity),
      priority: 'medium',
      enabled: true
    })

    // Rule for frequently accessed entities
    this.addRule({
      id: 'frequent_access',
      name: 'Frequent Access Prefetch',
      condition: (entity, context) => context?.accessPattern === 'frequent',
      prefetchKeys: (entity) => [
        generateCacheKey(entity.constructor.name, 'list'),
        generateCacheKey(entity.constructor.name, 'count')
      ],
      priority: 'high',
      enabled: true
    })

    // Rule for list views
    this.addRule({
      id: 'list_view',
      name: 'List View Prefetch',
      condition: (entity, context) => context?.currentEntityType === 'list',
      prefetchKeys: (entity) => [
        generateCacheKey(entity.constructor.name, 'list', { page: 1 }),
        generateCacheKey(entity.constructor.name, 'list', { page: 2 })
      ],
      priority: 'low',
      enabled: true
    })

    // Rule for detail views
    this.addRule({
      id: 'detail_view',
      name: 'Detail View Prefetch',
      condition: (entity, context) => context?.currentEntityType === 'detail',
      prefetchKeys: (entity) => this.getDetailRelatedKeys(entity),
      priority: 'medium',
      enabled: true
    })
  }

  // ===== UTILITY METHODS =====

  private createBatches(keys: string[], priorities: Record<string, 'low' | 'medium' | 'high'>): PrefetchBatch[] {
    const batches: Record<string, string[]> = { high: [], medium: [], low: [] }

    for (const key of keys) {
      const priority = priorities[key] || 'low'
      batches[priority].push(key)
    }

    const result: PrefetchBatch[] = []

    for (const [priority, batchKeys] of Object.entries(batches)) {
      if (batchKeys.length > 0) {
        result.push({
          id: this.generateBatchId(),
          keys: batchKeys,
          priority: priority as 'low' | 'medium' | 'high',
          timestamp: Date.now(),
          status: 'pending',
          results: []
        })
      }
    }

    return result
  }

  private generateBatchId(): string {
    return `prefetch_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getPriorityValue(priority: string): number {
    const values: Record<string, number> = { high: 3, medium: 2, low: 1 }
    return values[priority] || 1
  }

  private estimateSize(data: unknown): number {
    try {
      return JSON.stringify(data).length * 2
    } catch {
      return 0
    }
  }

  private async simulateFetch(key: string): Promise<unknown> {
    // This is a placeholder - in a real implementation, this would make an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ simulated: true, key })
      }, Math.random() * 100 + 50) // Simulate network delay
    })
  }

  private hasRelationships(entity: BaseEntity): boolean {
    // Check if entity has relationship fields
    return Object.keys(entity).some(key =>
      key.includes('_id') || key.includes('Id') || key.includes('_ids')
    )
  }

  private getRelationshipKeys(entity: BaseEntity): string[] {
    const keys: string[] = []
    const entityType = entity.constructor.name

    // Generate keys for related entities
    Object.keys(entity).forEach(key => {
      if (key.includes('_id') || key.includes('Id')) {
        const relatedId = (entity as any)[key]
        if (relatedId) {
          const relatedType = key.replace('_id', '').replace('Id', '')
          keys.push(generateCacheKey(relatedType, 'get', { id: relatedId }))
        }
      }
    })

    return keys
  }

  private getDetailRelatedKeys(entity: BaseEntity): string[] {
    const keys: string[] = []
    const entityType = entity.constructor.name

    // Add related list views
    keys.push(generateCacheKey(entityType, 'list'))

    // Add computed/aggregated data
    keys.push(generateCacheKey(entityType, 'stats', { id: entity.id }))

    return keys
  }
}

// ===== ACCESS PATTERN INTERFACE =====

interface AccessPattern {
  entityType: string
  entityId: string | number
  accessCount: number
  lastAccessed: number
  accessTimes: number[]
  contexts: PrefetchContext[]
}

// ===== UTILITY FUNCTIONS =====

export function createPrefetchManager(
  cacheManager: CacheManager,
  strategy?: Partial<PrefetchStrategy>
): PrefetchManager {
  return new PrefetchManager(cacheManager, strategy)
}

export function createDefaultPrefetchRule(
  id: string,
  name: string,
  condition: PrefetchRule['condition'],
  prefetchKeys: PrefetchRule['prefetchKeys'],
  priority: 'low' | 'medium' | 'high' = 'medium'
): PrefetchRule {
  return {
    id,
    name,
    condition,
    prefetchKeys,
    priority,
    enabled: true
  }
}