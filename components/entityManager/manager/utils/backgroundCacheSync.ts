'use client'

import { BaseEntity } from '../types'
import { CacheManager, CacheEntry, BackgroundSyncConfig, DEFAULT_BACKGROUND_SYNC_CONFIG } from '../types/cache'

// ===== BACKGROUND CACHE SYNC =====

export interface SyncOperation {
  id: string
  type: 'refresh' | 'prefetch' | 'invalidate'
  key: string
  priority: 'low' | 'medium' | 'high'
  timestamp: number
  retryCount: number
  maxRetries: number
}

export interface SyncResult {
  operationId: string
  success: boolean
  data?: unknown
  error?: string
  duration: number
  size: number
}

export interface SyncBatch {
  id: string
  operations: SyncOperation[]
  startTime: number
  endTime?: number
  results: SyncResult[]
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export class BackgroundCacheSync {
  private cacheManager: CacheManager
  private config: BackgroundSyncConfig
  private syncQueue: SyncOperation[] = []
  private activeBatches: Map<string, SyncBatch> = new Map()
  private syncTimer?: NodeJS.Timeout
  private isRunning = false

  // Callbacks for external integration
  private onSyncComplete?: (result: SyncResult) => void
  private onBatchComplete?: (batch: SyncBatch) => void
  private fetchFunction?: (key: string) => Promise<unknown>

  constructor(
    cacheManager: CacheManager,
    config: Partial<BackgroundSyncConfig> = {},
    fetchFunction?: (key: string) => Promise<unknown>
  ) {
    this.cacheManager = cacheManager
    this.config = { ...DEFAULT_BACKGROUND_SYNC_CONFIG, ...config }
    this.fetchFunction = fetchFunction
  }

  // ===== CONFIGURATION =====

  updateConfig(config: Partial<BackgroundSyncConfig>): void {
    this.config = { ...this.config, ...config }

    if (config.enabled && !this.syncTimer) {
      this.start()
    } else if (!config.enabled && this.syncTimer) {
      this.stop()
    }
  }

  setFetchFunction(fetchFunction: (key: string) => Promise<unknown>): void {
    this.fetchFunction = fetchFunction
  }

  onSyncCompleteCallback(callback: (result: SyncResult) => void): void {
    this.onSyncComplete = callback
  }

  onBatchCompleteCallback(callback: (batch: SyncBatch) => void): void {
    this.onBatchComplete = callback
  }

  // ===== SYNC CONTROL =====

  start(): void {
    if (!this.config.enabled || this.syncTimer) return

    this.syncTimer = setInterval(() => {
      this.performSync()
    }, this.config.interval)
  }

  stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = undefined
    }
  }

  // ===== QUEUE MANAGEMENT =====

  addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): string {
    const syncOp: SyncOperation = {
      ...operation,
      id: this.generateOperationId(),
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: this.config.retryAttempts
    }

    this.syncQueue.push(syncOp)
    this.syncQueue.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority))

    return syncOp.id
  }

  removeFromSyncQueue(operationId: string): boolean {
    const index = this.syncQueue.findIndex(op => op.id === operationId)
    if (index > -1) {
      this.syncQueue.splice(index, 1)
      return true
    }
    return false
  }

  getSyncQueue(): SyncOperation[] {
    return [...this.syncQueue]
  }

  clearSyncQueue(): void {
    this.syncQueue = []
  }

  // ===== SYNC OPERATIONS =====

  async performSync(): Promise<void> {
    if (this.isRunning || !this.config.enabled) return
    this.isRunning = true

    try {
      const batchSize = this.config.batchSize
      const batch = this.syncQueue.splice(0, batchSize)

      if (batch.length > 0) {
        await this.processBatch(batch)
      }

      // Check for expired cache entries to refresh
      await this.checkAndRefreshExpiredEntries()

    } finally {
      this.isRunning = false
    }
  }

  private async processBatch(operations: SyncOperation[]): Promise<void> {
    const batchId = this.generateBatchId()
    const batch: SyncBatch = {
      id: batchId,
      operations: [...operations],
      startTime: Date.now(),
      results: [],
      status: 'running'
    }

    this.activeBatches.set(batchId, batch)

    try {
      // Process operations in parallel with concurrency control
      const promises = operations.map(op => this.processOperation(op))
      const results = await Promise.allSettled(promises)

      batch.results = results.map((result, index) => {
        const operation = operations[index]
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          return {
            operationId: operation.id,
            success: false,
            error: result.reason?.message || 'Unknown error',
            duration: 0,
            size: 0
          }
        }
      })

      batch.endTime = Date.now()
      batch.status = 'completed'

      // Handle failed operations
      const failedOps = batch.results.filter(r => !r.success)
      for (const failed of failedOps) {
        const originalOp = operations.find(op => op.id === failed.operationId)
        if (originalOp && originalOp.retryCount < originalOp.maxRetries) {
          originalOp.retryCount++
          this.syncQueue.push(originalOp)
        }
      }

    } catch (error) {
      batch.status = 'failed'
      batch.endTime = Date.now()
    }

    this.activeBatches.delete(batchId)

    // Notify callbacks
    if (this.onBatchComplete) {
      this.onBatchComplete(batch)
    }

    for (const result of batch.results) {
      if (this.onSyncComplete) {
        this.onSyncComplete(result)
      }
    }
  }

  private async processOperation(operation: SyncOperation): Promise<SyncResult> {
    const startTime = Date.now()

    try {
      let data: unknown
      let size = 0

      switch (operation.type) {
        case 'refresh':
          data = await this.refreshCacheEntry(operation.key)
          break
        case 'prefetch':
          data = await this.prefetchData(operation.key)
          break
        case 'invalidate':
          await this.cacheManager.delete(operation.key)
          data = null
          break
        default:
          throw new Error(`Unknown operation type: ${operation.type}`)
      }

      if (data) {
        size = this.estimateSize(data)
        await this.cacheManager.set(operation.key, data, {
          priority: operation.priority
        })
      }

      return {
        operationId: operation.id,
        success: true,
        data,
        duration: Date.now() - startTime,
        size
      }

    } catch (error) {
      return {
        operationId: operation.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        size: 0
      }
    }
  }

  private async refreshCacheEntry(key: string): Promise<unknown> {
    if (!this.fetchFunction) {
      throw new Error('No fetch function provided for cache refresh')
    }

    // Check if entry exists and needs refresh
    const existing = await this.cacheManager.get(key)
    if (existing) {
      // Only refresh if it's close to expiry (80% of TTL)
      // This is a simplified check - in reality you'd need access to TTL
    }

    return this.fetchFunction(key)
  }

  private async prefetchData(key: string): Promise<unknown> {
    if (!this.fetchFunction) {
      throw new Error('No fetch function provided for prefetching')
    }

    return this.fetchFunction(key)
  }

  private async checkAndRefreshExpiredEntries(): Promise<void> {
    // This would typically scan the cache for entries nearing expiry
    // For now, we'll implement a basic version
    // In a real implementation, you'd need access to cache internals
  }

  // ===== UTILITY METHODS =====

  private generateOperationId(): string {
    return `sync_op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateBatchId(): string {
    return `sync_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getPriorityValue(priority: string): number {
    const values: Record<string, number> = { high: 3, medium: 2, low: 1 }
    return values[priority] || 1
  }

  private estimateSize(data: unknown): number {
    // Rough estimation
    try {
      return JSON.stringify(data).length * 2
    } catch {
      return 0
    }
  }

  // ===== MONITORING =====

  getActiveBatches(): SyncBatch[] {
    return Array.from(this.activeBatches.values())
  }

  getQueueLength(): number {
    return this.syncQueue.length
  }

  isSyncRunning(): boolean {
    return this.isRunning
  }

  getConfig(): BackgroundSyncConfig {
    return { ...this.config }
  }
}

// ===== SYNC SCHEDULER =====

export class SyncScheduler {
  private syncManager: BackgroundCacheSync
  private schedules: Map<string, NodeJS.Timeout> = new Map()

  constructor(syncManager: BackgroundCacheSync) {
    this.syncManager = syncManager
  }

  // Schedule sync operations
  schedule(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>, delay: number): string {
    const operationId = this.syncManager.addToSyncQueue(operation)

    const timeout = setTimeout(() => {
      this.syncManager.performSync()
      this.schedules.delete(operationId)
    }, delay)

    this.schedules.set(operationId, timeout)
    return operationId
  }

  // Schedule recurring sync
  scheduleRecurring(
    operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>,
    interval: number
  ): string {
    const operationId = this.syncManager.addToSyncQueue(operation)

    const intervalId = setInterval(() => {
      this.syncManager.addToSyncQueue(operation)
    }, interval)

    this.schedules.set(operationId, intervalId)
    return operationId
  }

  // Cancel scheduled operation
  cancel(operationId: string): boolean {
    const timeout = this.schedules.get(operationId)
    if (timeout) {
      clearTimeout(timeout)
      clearInterval(timeout as any) // Also clear if it's an interval
      this.schedules.delete(operationId)
      this.syncManager.removeFromSyncQueue(operationId)
      return true
    }
    return false
  }

  // Cancel all scheduled operations
  cancelAll(): void {
    for (const [id, timeout] of this.schedules) {
      clearTimeout(timeout)
      clearInterval(timeout as any)
      this.syncManager.removeFromSyncQueue(id)
    }
    this.schedules.clear()
  }
}

// ===== UTILITY FUNCTIONS =====

export function createBackgroundCacheSync(
  cacheManager: CacheManager,
  config?: Partial<BackgroundSyncConfig>,
  fetchFunction?: (key: string) => Promise<unknown>
): BackgroundCacheSync {
  return new BackgroundCacheSync(cacheManager, config, fetchFunction)
}

export function createSyncScheduler(syncManager: BackgroundCacheSync): SyncScheduler {
  return new SyncScheduler(syncManager)
}