'use client'

import { CacheAnalytics, CacheEntry, CacheConfig } from '../types/cache'

// ===== CACHE ANALYTICS =====

export interface CacheMetrics {
  timestamp: number
  hits: number
  misses: number
  hitRate: number
  averageAccessTime: number
  size: number
  entries: number
  evictions: number
  compressionRatio?: number
}

export interface CachePerformanceReport {
  period: {
    start: number
    end: number
    duration: number
  }
  overall: CacheMetrics
  byEntityType: Record<string, CacheMetrics>
  byOperation: Record<string, CacheMetrics>
  trends: {
    hitRateTrend: number[]
    sizeTrend: number[]
    accessTimeTrend: number[]
  }
  recommendations: string[]
}

export interface CacheHealthStatus {
  status: 'healthy' | 'warning' | 'critical'
  score: number // 0-100
  issues: string[]
  recommendations: string[]
}

export class CacheAnalyticsManager {
  private metrics: CacheMetrics[] = []
  private currentMetrics: CacheMetrics
  private config: CacheConfig
  private entityMetrics: Map<string, CacheMetrics> = new Map()
  private operationMetrics: Map<string, CacheMetrics> = new Map()

  constructor(config: CacheConfig) {
    this.config = config
    this.currentMetrics = this.createEmptyMetrics()
  }

  // ===== METRICS COLLECTION =====

  recordHit(entityType?: string, operation?: string, accessTime?: number): void {
    this.currentMetrics.hits++
    this.currentMetrics.averageAccessTime =
      (this.currentMetrics.averageAccessTime + (accessTime || 0)) / 2

    if (entityType) {
      this.recordEntityMetric(entityType, 'hit', accessTime)
    }

    if (operation) {
      this.recordOperationMetric(operation, 'hit', accessTime)
    }

    this.updateHitRate()
  }

  recordMiss(entityType?: string, operation?: string): void {
    this.currentMetrics.misses++

    if (entityType) {
      this.recordEntityMetric(entityType, 'miss')
    }

    if (operation) {
      this.recordOperationMetric(operation, 'miss')
    }

    this.updateHitRate()
  }

  recordEviction(size: number, entityType?: string): void {
    this.currentMetrics.evictions++
    this.currentMetrics.size -= size

    if (entityType) {
      const entityMetric = this.entityMetrics.get(entityType)
      if (entityMetric) {
        entityMetric.evictions++
        entityMetric.size -= size
      }
    }
  }

  recordEntryAdded(size: number, entityType?: string): void {
    this.currentMetrics.size += size
    this.currentMetrics.entries++

    if (entityType) {
      const entityMetric = this.entityMetrics.get(entityType) || this.createEmptyMetrics()
      entityMetric.size += size
      entityMetric.entries++
      this.entityMetrics.set(entityType, entityMetric)
    }
  }

  recordEntryRemoved(size: number, entityType?: string): void {
    this.currentMetrics.size -= size
    this.currentMetrics.entries--

    if (entityType) {
      const entityMetric = this.entityMetrics.get(entityType)
      if (entityMetric) {
        entityMetric.size -= size
        entityMetric.entries--
      }
    }
  }

  // ===== ANALYTICS GENERATION =====

  getCurrentMetrics(): CacheMetrics {
    return { ...this.currentMetrics }
  }

  getEntityMetrics(entityType: string): CacheMetrics | null {
    return this.entityMetrics.get(entityType) || null
  }

  getOperationMetrics(operation: string): CacheMetrics | null {
    return this.operationMetrics.get(operation) || null
  }

  generatePerformanceReport(hours: number = 24): CachePerformanceReport {
    const endTime = Date.now()
    const startTime = endTime - (hours * 60 * 60 * 1000)

    const relevantMetrics = this.metrics.filter(m => m.timestamp >= startTime)

    const overall = this.aggregateMetrics(relevantMetrics)
    const byEntityType = this.aggregateByEntityType(relevantMetrics)
    const byOperation = this.aggregateByOperation(relevantMetrics)

    const trends = this.calculateTrends(relevantMetrics, hours)
    const recommendations = this.generateRecommendations(overall, byEntityType)

    return {
      period: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime
      },
      overall,
      byEntityType,
      byOperation,
      trends,
      recommendations
    }
  }

  getHealthStatus(): CacheHealthStatus {
    const metrics = this.getCurrentMetrics()
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    // Hit rate assessment
    if (metrics.hitRate < 0.5) {
      issues.push('Low cache hit rate')
      recommendations.push('Consider increasing cache TTL or implementing prefetching')
      score -= 30
    } else if (metrics.hitRate < 0.7) {
      issues.push('Moderate cache hit rate')
      recommendations.push('Monitor cache performance and consider optimization')
      score -= 10
    }

    // Size assessment
    const sizeMB = metrics.size / (1024 * 1024)
    if (sizeMB > this.config.maxSize / (1024 * 1024) * 0.9) {
      issues.push('Cache size near capacity')
      recommendations.push('Consider increasing max cache size or implementing better eviction')
      score -= 20
    }

    // Access time assessment
    if (metrics.averageAccessTime > 100) {
      issues.push('High cache access time')
      recommendations.push('Consider optimizing cache storage or reducing cache size')
      score -= 15
    }

    // Eviction rate assessment
    const totalRequests = metrics.hits + metrics.misses
    if (totalRequests > 0 && metrics.evictions / totalRequests > 0.1) {
      issues.push('High eviction rate')
      recommendations.push('Consider increasing cache size or adjusting TTL values')
      score -= 25
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (score < 50) {
      status = 'critical'
    } else if (score < 75) {
      status = 'warning'
    }

    return {
      status,
      score: Math.max(0, score),
      issues,
      recommendations
    }
  }

  // ===== UTILITY METHODS =====

  private createEmptyMetrics(): CacheMetrics {
    return {
      timestamp: Date.now(),
      hits: 0,
      misses: 0,
      hitRate: 0,
      averageAccessTime: 0,
      size: 0,
      entries: 0,
      evictions: 0
    }
  }

  private recordEntityMetric(entityType: string, type: 'hit' | 'miss', accessTime?: number): void {
    const metric = this.entityMetrics.get(entityType) || this.createEmptyMetrics()

    if (type === 'hit') {
      metric.hits++
      if (accessTime) {
        metric.averageAccessTime = (metric.averageAccessTime + accessTime) / 2
      }
    } else {
      metric.misses++
    }

    metric.hitRate = metric.hits / (metric.hits + metric.misses)
    this.entityMetrics.set(entityType, metric)
  }

  private recordOperationMetric(operation: string, type: 'hit' | 'miss', accessTime?: number): void {
    const metric = this.operationMetrics.get(operation) || this.createEmptyMetrics()

    if (type === 'hit') {
      metric.hits++
      if (accessTime) {
        metric.averageAccessTime = (metric.averageAccessTime + accessTime) / 2
      }
    } else {
      metric.misses++
    }

    metric.hitRate = metric.hits / (metric.hits + metric.misses)
    this.operationMetrics.set(operation, metric)
  }

  private updateHitRate(): void {
    const total = this.currentMetrics.hits + this.currentMetrics.misses
    this.currentMetrics.hitRate = total > 0 ? this.currentMetrics.hits / total : 0
  }

  private aggregateMetrics(metrics: CacheMetrics[]): CacheMetrics {
    if (metrics.length === 0) return this.createEmptyMetrics()

    const aggregated = this.createEmptyMetrics()
    aggregated.hits = metrics.reduce((sum, m) => sum + m.hits, 0)
    aggregated.misses = metrics.reduce((sum, m) => sum + m.misses, 0)
    aggregated.evictions = metrics.reduce((sum, m) => sum + m.evictions, 0)
    aggregated.size = metrics[metrics.length - 1]?.size || 0
    aggregated.entries = metrics[metrics.length - 1]?.entries || 0

    const totalRequests = aggregated.hits + aggregated.misses
    aggregated.hitRate = totalRequests > 0 ? aggregated.hits / totalRequests : 0

    const avgAccessTime = metrics
      .filter(m => m.averageAccessTime > 0)
      .reduce((sum, m, _, arr) => sum + m.averageAccessTime / arr.length, 0)
    aggregated.averageAccessTime = avgAccessTime

    return aggregated
  }

  private aggregateByEntityType(metrics: CacheMetrics[]): Record<string, CacheMetrics> {
    const byEntity: Record<string, CacheMetrics[]> = {}

    // This is a simplified aggregation - in practice you'd need to track entity-specific metrics
    for (const [entityType, entityMetric] of this.entityMetrics) {
      byEntity[entityType] = [entityMetric]
    }

    const result: Record<string, CacheMetrics> = {}
    for (const [entityType, entityMetrics] of Object.entries(byEntity)) {
      result[entityType] = this.aggregateMetrics(entityMetrics)
    }

    return result
  }

  private aggregateByOperation(metrics: CacheMetrics[]): Record<string, CacheMetrics> {
    const result: Record<string, CacheMetrics> = {}
    for (const [operation, opMetrics] of this.operationMetrics) {
      result[operation] = opMetrics
    }
    return result
  }

  private calculateTrends(metrics: CacheMetrics[], hours: number): CachePerformanceReport['trends'] {
    const intervals = hours * 4 // 15-minute intervals
    const intervalDuration = (hours * 60 * 60 * 1000) / intervals

    const hitRateTrend: number[] = []
    const sizeTrend: number[] = []
    const accessTimeTrend: number[] = []

    for (let i = 0; i < intervals; i++) {
      const intervalStart = Date.now() - ((intervals - i) * intervalDuration)
      const intervalEnd = intervalStart + intervalDuration

      const intervalMetrics = metrics.filter(m =>
        m.timestamp >= intervalStart && m.timestamp < intervalEnd
      )

      if (intervalMetrics.length > 0) {
        const aggregated = this.aggregateMetrics(intervalMetrics)
        hitRateTrend.push(aggregated.hitRate)
        sizeTrend.push(aggregated.size)
        accessTimeTrend.push(aggregated.averageAccessTime)
      } else {
        hitRateTrend.push(0)
        sizeTrend.push(0)
        accessTimeTrend.push(0)
      }
    }

    return {
      hitRateTrend,
      sizeTrend,
      accessTimeTrend
    }
  }

  private generateRecommendations(
    overall: CacheMetrics,
    byEntityType: Record<string, CacheMetrics>
  ): string[] {
    const recommendations: string[] = []

    if (overall.hitRate < 0.6) {
      recommendations.push('Implement prefetching for frequently accessed entities')
    }

    if (overall.averageAccessTime > 50) {
      recommendations.push('Consider using faster storage for cache or reduce cache size')
    }

    if (overall.evictions > overall.hits * 0.1) {
      recommendations.push('Increase cache size or adjust TTL values to reduce evictions')
    }

    // Entity-specific recommendations
    for (const [entityType, metrics] of Object.entries(byEntityType)) {
      if (metrics.hitRate < 0.5) {
        recommendations.push(`Consider increasing TTL for ${entityType} entities`)
      }
    }

    return recommendations
  }

  // ===== SNAPSHOT MANAGEMENT =====

  takeSnapshot(): void {
    this.metrics.push({ ...this.currentMetrics })
    this.currentMetrics = this.createEmptyMetrics()

    // Keep only last 1000 snapshots to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  reset(): void {
    this.metrics = []
    this.currentMetrics = this.createEmptyMetrics()
    this.entityMetrics.clear()
    this.operationMetrics.clear()
  }
}

// ===== CACHE MONITOR =====

export interface CacheAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: number
  resolved: boolean
  metadata?: Record<string, unknown>
}

export class CacheMonitor {
  private analytics: CacheAnalyticsManager
  private alerts: CacheAlert[] = []
  private thresholds: {
    minHitRate: number
    maxSizeRatio: number
    maxAccessTime: number
    maxEvictionRate: number
  }

  constructor(analytics: CacheAnalyticsManager) {
    this.analytics = analytics
    this.thresholds = {
      minHitRate: 0.5,
      maxSizeRatio: 0.9,
      maxAccessTime: 100,
      maxEvictionRate: 0.1
    }
  }

  // ===== MONITORING =====

  checkHealth(): CacheAlert[] {
    const metrics = this.analytics.getCurrentMetrics()
    const newAlerts: CacheAlert[] = []

    // Hit rate check
    if (metrics.hitRate < this.thresholds.minHitRate) {
      newAlerts.push({
        id: this.generateAlertId(),
        type: 'warning',
        message: `Cache hit rate is low: ${(metrics.hitRate * 100).toFixed(1)}%`,
        timestamp: Date.now(),
        resolved: false,
        metadata: { hitRate: metrics.hitRate, threshold: this.thresholds.minHitRate }
      })
    }

    // Size check
    const sizeRatio = metrics.size / (50 * 1024 * 1024) // Assuming 50MB max
    if (sizeRatio > this.thresholds.maxSizeRatio) {
      newAlerts.push({
        id: this.generateAlertId(),
        type: 'warning',
        message: `Cache size is near capacity: ${(sizeRatio * 100).toFixed(1)}%`,
        timestamp: Date.now(),
        resolved: false,
        metadata: { sizeRatio, threshold: this.thresholds.maxSizeRatio }
      })
    }

    // Access time check
    if (metrics.averageAccessTime > this.thresholds.maxAccessTime) {
      newAlerts.push({
        id: this.generateAlertId(),
        type: 'error',
        message: `Cache access time is high: ${metrics.averageAccessTime.toFixed(1)}ms`,
        timestamp: Date.now(),
        resolved: false,
        metadata: { accessTime: metrics.averageAccessTime, threshold: this.thresholds.maxAccessTime }
      })
    }

    // Eviction rate check
    const totalRequests = metrics.hits + metrics.misses
    const evictionRate = totalRequests > 0 ? metrics.evictions / totalRequests : 0
    if (evictionRate > this.thresholds.maxEvictionRate) {
      newAlerts.push({
        id: this.generateAlertId(),
        type: 'warning',
        message: `Cache eviction rate is high: ${(evictionRate * 100).toFixed(1)}%`,
        timestamp: Date.now(),
        resolved: false,
        metadata: { evictionRate, threshold: this.thresholds.maxEvictionRate }
      })
    }

    this.alerts.push(...newAlerts)
    return newAlerts
  }

  getAlerts(activeOnly = true): CacheAlert[] {
    if (activeOnly) {
      return this.alerts.filter(alert => !alert.resolved)
    }
    return [...this.alerts]
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      return true
    }
    return false
  }

  updateThresholds(thresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  // ===== UTILITY METHODS =====

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// ===== UTILITY FUNCTIONS =====

export function createCacheAnalyticsManager(config: CacheConfig): CacheAnalyticsManager {
  return new CacheAnalyticsManager(config)
}

export function createCacheMonitor(analytics: CacheAnalyticsManager): CacheMonitor {
  return new CacheMonitor(analytics)
}