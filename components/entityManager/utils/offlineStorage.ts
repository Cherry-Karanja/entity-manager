/**
 * Offline Storage & Sync Utility
 * Provides offline data storage and synchronization capabilities
 */

import React from 'react'

export interface OfflineOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entityType: string
  entityId?: string | number
  data?: Record<string, unknown>
  timestamp: number
  retryCount: number
  maxRetries: number
  priority: 'high' | 'normal' | 'low'
  dependencies?: string[]
}

export interface SyncResult {
  success: boolean
  operationsProcessed: number
  operationsSuccessful: number
  operationsFailed: number
  errors: Array<{ operationId: string; error: string }>
  duration: number
}

export interface OfflineState {
  isOnline: boolean
  hasPendingOperations: boolean
  pendingOperationCount: number
  lastSyncTime?: number
  storageQuota?: {
    used: number
    available: number
    total: number
  }
}

export interface SyncStrategy {
  name: string
  shouldSync: (operation: OfflineOperation) => boolean
  executeSync: (operation: OfflineOperation) => Promise<boolean>
  priority: number
}

// ===== CONSTANTS =====

const STORAGE_KEY_PREFIX = 'entity_manager_offline_'
const MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB
const SYNC_RETRY_DELAY = 5000 // 5 seconds
const MAX_SYNC_RETRIES = 3

// ===== UTILITY FUNCTIONS =====

/**
 * Check if the browser supports offline storage
 */
export function isOfflineStorageSupported(): boolean {
  try {
    return typeof Storage !== 'undefined' && !!window.indexedDB
  } catch {
    return false
  }
}

/**
 * Get current online/offline state
 */
export function getOnlineState(): boolean {
  return navigator.onLine
}

/**
 * Generate unique operation ID
 */
function generateOperationId(): string {
  return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ===== OFFLINE STORAGE CLASS =====

class OfflineStorage {
  private db: IDBDatabase | null = null
  private readonly dbName = 'EntityManagerOffline'
  private readonly dbVersion = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create operations store
        if (!db.objectStoreNames.contains('operations')) {
          const operationsStore = db.createObjectStore('operations', { keyPath: 'id' })
          operationsStore.createIndex('entityType', 'entityType', { unique: false })
          operationsStore.createIndex('timestamp', 'timestamp', { unique: false })
          operationsStore.createIndex('priority', 'priority', { unique: false })
        }

        // Create entities store for offline data
        if (!db.objectStoreNames.contains('entities')) {
          const entitiesStore = db.createObjectStore('entities', { keyPath: 'id' })
          entitiesStore.createIndex('entityType', 'entityType', { unique: false })
          entitiesStore.createIndex('lastModified', 'lastModified', { unique: false })
        }
      }
    })
  }

  async storeOperation(operation: OfflineOperation): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite')
      const store = transaction.objectStore('operations')
      const request = store.add(operation)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingOperations(): Promise<OfflineOperation[]> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readonly')
      const store = transaction.objectStore('operations')
      const request = store.getAll()

      request.onsuccess = () => {
        const operations = request.result as OfflineOperation[]
        // Sort by priority and timestamp
        operations.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 }
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
          return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp
        })
        resolve(operations)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async removeOperation(operationId: string): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite')
      const store = transaction.objectStore('operations')
      const request = store.delete(operationId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async updateOperation(operation: OfflineOperation): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations'], 'readwrite')
      const store = transaction.objectStore('operations')
      const request = store.put(operation)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async storeEntity(entityType: string, entity: Record<string, unknown>): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    const entityData = {
      ...entity,
      entityType,
      lastModified: Date.now(),
      id: `${entityType}_${entity.id}`
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['entities'], 'readwrite')
      const store = transaction.objectStore('entities')
      const request = store.put(entityData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getStoredEntity(entityType: string, entityId: string | number): Promise<Record<string, unknown> | null> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['entities'], 'readonly')
      const store = transaction.objectStore('entities')
      const request = store.get(`${entityType}_${entityId}`)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('Failed to initialize offline storage')
    const db = this.db

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['operations', 'entities'], 'readwrite')

      const clearOperations = transaction.objectStore('operations').clear()
      const clearEntities = transaction.objectStore('entities').clear()

      let completed = 0
      const checkComplete = () => {
        completed++
        if (completed === 2) resolve()
      }

      clearOperations.onsuccess = checkComplete
      clearEntities.onsuccess = checkComplete

      clearOperations.onerror = () => reject(clearOperations.error)
      clearEntities.onerror = () => reject(clearEntities.error)
    })
  }
}

// ===== SYNC MANAGER CLASS =====

class SyncManager {
  private storage = new OfflineStorage()
  private syncStrategies: SyncStrategy[] = []
  private isSyncing = false

  constructor() {
    this.registerDefaultStrategies()
  }

  private registerDefaultStrategies(): void {
    // Create operation sync strategy
    this.syncStrategies.push({
      name: 'create',
      shouldSync: (op) => op.type === 'create',
      executeSync: async (operation) => {
        try {
          // TODO: Implement actual API call for create operation
          console.log('Syncing create operation:', operation)
          return true
        } catch (error) {
          console.error('Failed to sync create operation:', error)
          return false
        }
      },
      priority: 1
    })

    // Update operation sync strategy
    this.syncStrategies.push({
      name: 'update',
      shouldSync: (op) => op.type === 'update',
      executeSync: async (operation) => {
        try {
          // TODO: Implement actual API call for update operation
          console.log('Syncing update operation:', operation)
          return true
        } catch (error) {
          console.error('Failed to sync update operation:', error)
          return false
        }
      },
      priority: 2
    })

    // Delete operation sync strategy
    this.syncStrategies.push({
      name: 'delete',
      shouldSync: (op) => op.type === 'delete',
      executeSync: async (operation) => {
        try {
          // TODO: Implement actual API call for delete operation
          console.log('Syncing delete operation:', operation)
          return true
        } catch (error) {
          console.error('Failed to sync delete operation:', error)
          return false
        }
      },
      priority: 3
    })
  }

  async syncPendingOperations(): Promise<SyncResult> {
    if (this.isSyncing || !getOnlineState()) {
      return {
        success: false,
        operationsProcessed: 0,
        operationsSuccessful: 0,
        operationsFailed: 0,
        errors: [{ operationId: 'sync', error: 'Sync already in progress or offline' }],
        duration: 0
      }
    }

    const startTime = Date.now()
    this.isSyncing = true

    try {
      const operations = await this.storage.getPendingOperations()
      let successful = 0
      let failed = 0
      const errors: Array<{ operationId: string; error: string }> = []

      for (const operation of operations) {
        const strategy = this.syncStrategies.find(s => s.shouldSync(operation))

        if (!strategy) {
          errors.push({
            operationId: operation.id,
            error: `No sync strategy found for operation type: ${operation.type}`
          })
          failed++
          continue
        }

        try {
          const success = await strategy.executeSync(operation)

          if (success) {
            await this.storage.removeOperation(operation.id)
            successful++
          } else {
            // Increment retry count and update operation
            operation.retryCount++
            if (operation.retryCount < MAX_SYNC_RETRIES) {
              await this.storage.updateOperation(operation)
            } else {
              await this.storage.removeOperation(operation.id)
              errors.push({
                operationId: operation.id,
                error: `Max retries exceeded for operation`
              })
            }
            failed++
          }
        } catch (error) {
          operation.retryCount++
          if (operation.retryCount < MAX_SYNC_RETRIES) {
            await this.storage.updateOperation(operation)
          } else {
            await this.storage.removeOperation(operation.id)
            errors.push({
              operationId: operation.id,
              error: error instanceof Error ? error.message : 'Unknown sync error'
            })
          }
          failed++
        }
      }

      return {
        success: failed === 0,
        operationsProcessed: operations.length,
        operationsSuccessful: successful,
        operationsFailed: failed,
        errors,
        duration: Date.now() - startTime
      }
    } finally {
      this.isSyncing = false
    }
  }

  async queueOperation(
    type: 'create' | 'update' | 'delete',
    entityType: string,
    entityId?: string | number,
    data?: Record<string, unknown>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    const operation: OfflineOperation = {
      id: generateOperationId(),
      type,
      entityType,
      entityId,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: MAX_SYNC_RETRIES,
      priority
    }

    await this.storage.storeOperation(operation)
    return operation.id
  }

  async getOfflineState(): Promise<OfflineState> {
    const operations = await this.storage.getPendingOperations()

    return {
      isOnline: getOnlineState(),
      hasPendingOperations: operations.length > 0,
      pendingOperationCount: operations.length,
      lastSyncTime: undefined // TODO: Track last sync time
    }
  }
}

// ===== EXPORTS =====

export const offlineStorage = new OfflineStorage()
export const syncManager = new SyncManager()

// React hook for offline state management
export function useOfflineState() {
  const [state, setState] = React.useState<OfflineState>({
    isOnline: getOnlineState(),
    hasPendingOperations: false,
    pendingOperationCount: 0
  })

  React.useEffect(() => {
    const updateState = async () => {
      const offlineState = await syncManager.getOfflineState()
      setState(offlineState)
    }

    updateState()

    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return state
}

// Auto-sync functionality
let autoSyncInterval: NodeJS.Timeout | null = null

export function startAutoSync(intervalMs: number = 30000): void {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval)
  }

  autoSyncInterval = setInterval(async () => {
    if (getOnlineState()) {
      try {
        await syncManager.syncPendingOperations()
      } catch (error) {
        console.error('Auto-sync failed:', error)
      }
    }
  }, intervalMs)
}

export function stopAutoSync(): void {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval)
    autoSyncInterval = null
  }
}