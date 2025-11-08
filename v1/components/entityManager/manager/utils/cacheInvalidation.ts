'use client'

import { BaseEntity } from '../types'
import { CacheManager, CacheInvalidationRule, generateCacheKey, parseCacheKey } from '../types/cache'

// ===== CACHE INVALIDATION SYSTEM =====

export interface InvalidationPattern {
  entityType: string
  operation: string
  field?: string
  cascade: boolean
  dependencies: string[]
}

export interface InvalidationContext {
  entityType: string
  entityId: string | number
  operation: 'create' | 'update' | 'delete'
  changedFields?: string[]
  relatedEntities?: Array<{ type: string; id: string | number }>
  cascade?: boolean
}

export class CacheInvalidationManager {
  protected cacheManager: CacheManager
  private patterns: InvalidationPattern[] = []
  private entityRelationships: Map<string, string[]> = new Map()

  constructor(cacheManager: CacheManager) {
    this.cacheManager = cacheManager
    this.initializeDefaultPatterns()
  }

  // ===== PATTERN MANAGEMENT =====

  addPattern(pattern: InvalidationPattern): void {
    this.patterns.push(pattern)
  }

  removePattern(entityType: string, operation: string): void {
    this.patterns = this.patterns.filter(p =>
      !(p.entityType === entityType && p.operation === operation)
    )
  }

  getPatterns(entityType?: string): InvalidationPattern[] {
    if (entityType) {
      return this.patterns.filter(p => p.entityType === entityType)
    }
    return [...this.patterns]
  }

  // ===== ENTITY RELATIONSHIPS =====

  addRelationship(entityType: string, relatedTypes: string[]): void {
    this.entityRelationships.set(entityType, relatedTypes)
  }

  getRelationships(entityType: string): string[] {
    return this.entityRelationships.get(entityType) || []
  }

  // ===== INVALIDATION LOGIC =====

  async invalidate(context: InvalidationContext): Promise<number> {
    const keysToInvalidate: string[] = []

    // 1. Direct invalidation based on entity
    keysToInvalidate.push(...this.getDirectInvalidationKeys(context))

    // 2. Pattern-based invalidation
    keysToInvalidate.push(...this.getPatternInvalidationKeys(context))

    // 3. Relationship-based invalidation
    if (context.cascade) {
      keysToInvalidate.push(...this.getRelationshipInvalidationKeys(context))
    }

    // 4. Field-specific invalidation
    if (context.changedFields) {
      keysToInvalidate.push(...this.getFieldInvalidationKeys(context))
    }

    // Remove duplicates
    const uniqueKeys = [...new Set(keysToInvalidate)]

    // Perform invalidation
    let invalidated = 0
    for (const key of uniqueKeys) {
      if (await this.cacheManager.delete(key)) {
        invalidated++
      }
    }

    return invalidated
  }

  async invalidateByEntity(entityType: string, entityId: string | number, cascade = true): Promise<number> {
    return this.invalidate({
      entityType,
      entityId,
      operation: 'update',
      cascade
    })
  }

  async invalidateByPattern(pattern: string | RegExp): Promise<number> {
    return this.cacheManager.invalidateByPattern(pattern)
  }

  async invalidateByTag(tag: string): Promise<number> {
    return this.cacheManager.invalidateByTag(tag)
  }

  // ===== PRIVATE METHODS =====

  private getDirectInvalidationKeys(context: InvalidationContext): string[] {
    const keys: string[] = []

    // Invalidate specific entity
    keys.push(generateCacheKey(context.entityType, 'get', { id: context.entityId }))
    keys.push(generateCacheKey(context.entityType, 'list'))

    // Invalidate list views that might contain this entity
    keys.push(generateCacheKey(context.entityType, 'list', { page: '*' }))
    keys.push(generateCacheKey(context.entityType, 'list', { search: '*' }))

    return keys
  }

  private getPatternInvalidationKeys(context: InvalidationContext): string[] {
    const keys: string[] = []

    for (const pattern of this.patterns) {
      if (pattern.entityType === context.entityType && pattern.operation === context.operation) {
        // Add pattern dependencies
        keys.push(...pattern.dependencies)

        // If cascade is enabled, add related patterns
        if (pattern.cascade) {
          keys.push(...this.getCascadeKeys(pattern, context))
        }
      }
    }

    return keys
  }

  private getRelationshipInvalidationKeys(context: InvalidationContext): string[] {
    const keys: string[] = []
    const relatedTypes = this.getRelationships(context.entityType)

    for (const relatedType of relatedTypes) {
      keys.push(generateCacheKey(relatedType, 'list'))
      keys.push(generateCacheKey(relatedType, 'get', { entityId: context.entityId }))
    }

    // Handle specific related entities
    if (context.relatedEntities) {
      for (const related of context.relatedEntities) {
        keys.push(generateCacheKey(related.type, 'get', { id: related.id }))
        keys.push(generateCacheKey(related.type, 'list'))
      }
    }

    return keys
  }

  private getFieldInvalidationKeys(context: InvalidationContext): string[] {
    const keys: string[] = []

    if (!context.changedFields) return keys

    for (const field of context.changedFields) {
      // Invalidate field-specific caches
      keys.push(generateCacheKey(context.entityType, 'field', {
        id: context.entityId,
        field
      }))

      // Invalidate computed fields that depend on this field
      keys.push(...this.getComputedFieldKeys(context.entityType, field))
    }

    return keys
  }

  private getCascadeKeys(pattern: InvalidationPattern, context: InvalidationContext): string[] {
    const keys: string[] = []

    // Add cascading dependencies
    for (const dep of pattern.dependencies) {
      const parsed = parseCacheKey(dep)
      if (parsed.params) {
        // Create variations with current context
        keys.push(generateCacheKey(parsed.entityType, parsed.operation, {
          ...parsed.params,
          entityId: context.entityId
        }))
      }
    }

    return keys
  }

  private getComputedFieldKeys(entityType: string, field: string): string[] {
    const keys: string[] = []

    // Common computed field patterns
    const computedPatterns = [
      `${field}_count`,
      `${field}_total`,
      `${field}_average`,
      `${field}_sum`,
      `computed_${field}`
    ]

    for (const pattern of computedPatterns) {
      keys.push(generateCacheKey(entityType, 'computed', { field: pattern }))
    }

    return keys
  }

  private initializeDefaultPatterns(): void {
    // User entity patterns
    this.addPattern({
      entityType: 'user',
      operation: 'update',
      cascade: true,
      dependencies: [
        generateCacheKey('user', 'list'),
        generateCacheKey('user', 'permissions'),
        generateCacheKey('user', 'profile')
      ]
    })

    this.addPattern({
      entityType: 'user',
      operation: 'delete',
      cascade: true,
      dependencies: [
        generateCacheKey('user', 'list'),
        generateCacheKey('user', 'permissions'),
        generateCacheKey('user', 'profile'),
        generateCacheKey('user', 'activity')
      ]
    })

    // Generic entity patterns
    this.addPattern({
      entityType: '*',
      operation: 'create',
      cascade: false,
      dependencies: [
        generateCacheKey('*', 'list'),
        generateCacheKey('*', 'count')
      ]
    })

    this.addPattern({
      entityType: '*',
      operation: 'update',
      cascade: true,
      dependencies: [
        generateCacheKey('*', 'list'),
        generateCacheKey('*', 'get'),
        generateCacheKey('*', 'related')
      ]
    })

    this.addPattern({
      entityType: '*',
      operation: 'delete',
      cascade: true,
      dependencies: [
        generateCacheKey('*', 'list'),
        generateCacheKey('*', 'count'),
        generateCacheKey('*', 'related')
      ]
    })
  }
}

// ===== INTELLIGENT INVALIDATION STRATEGIES =====

export interface InvalidationStrategy {
  name: string
  shouldInvalidate: (context: InvalidationContext, cacheKey: string) => boolean
  getPriority: (context: InvalidationContext) => 'low' | 'medium' | 'high'
}

export class IntelligentInvalidationManager extends CacheInvalidationManager {
  private strategies: InvalidationStrategy[] = []

  addStrategy(strategy: InvalidationStrategy): void {
    this.strategies.push(strategy)
  }

  async invalidate(context: InvalidationContext): Promise<number> {
    // Use intelligent strategies to determine what to invalidate
    const relevantStrategies = this.strategies.filter(strategy =>
      this.shouldUseStrategy(strategy, context)
    )

    if (relevantStrategies.length > 0) {
      return this.invalidateWithStrategies(context, relevantStrategies)
    }

    // Fall back to default invalidation
    return super.invalidate(context)
  }

  private shouldUseStrategy(strategy: InvalidationStrategy, context: InvalidationContext): boolean {
    // Check if strategy is relevant for this context
    return true // In a real implementation, this would be more sophisticated
  }

  private async invalidateWithStrategies(
    context: InvalidationContext,
    strategies: InvalidationStrategy[]
  ): Promise<number> {
    const keysToCheck: string[] = []

    // Get all cache keys (this is a simplified version)
    // In a real implementation, you'd get all keys from the cache manager

    let invalidated = 0
    for (const strategy of strategies) {
      for (const key of keysToCheck) {
        if (strategy.shouldInvalidate(context, key)) {
          if (await this.cacheManager.delete(key)) {
            invalidated++
          }
        }
      }
    }

    return invalidated
  }
}

// ===== UTILITY FUNCTIONS =====

export function createInvalidationContext(
  entityType: string,
  entityId: string | number,
  operation: 'create' | 'update' | 'delete',
  options: {
    changedFields?: string[]
    relatedEntities?: Array<{ type: string; id: string | number }>
    cascade?: boolean
  } = {}
): InvalidationContext {
  return {
    entityType,
    entityId,
    operation,
    changedFields: options.changedFields,
    relatedEntities: options.relatedEntities,
    cascade: options.cascade ?? true
  }
}

export function createDefaultInvalidationManager(cacheManager: CacheManager): CacheInvalidationManager {
  return new CacheInvalidationManager(cacheManager)
}

export function createIntelligentInvalidationManager(cacheManager: CacheManager): IntelligentInvalidationManager {
  return new IntelligentInvalidationManager(cacheManager)
}