// ===== OPTIMISTIC UI UPDATE TYPES =====

export interface OptimisticOperation<TData = Record<string, unknown>> {
  id: string
  type: 'create' | 'update' | 'delete'
  entityType: string
  entityId?: string | number
  tempId?: string // For optimistic creates before server confirmation
  localData: TData
  serverData?: TData
  status: 'pending' | 'confirmed' | 'failed' | 'rolled_back'
  timestamp: number
  retryCount: number
  error?: string
  version?: number // For conflict detection
}

export interface ConflictResolution<TData = Record<string, unknown>> {
  operationId: string
  entityType: string
  entityId: string | number
  localData: TData
  serverData: TData
  conflictFields: string[]
  resolution: 'local' | 'server' | 'merge' | 'manual'
  resolvedData?: TData
  timestamp: number
}

export interface OptimisticState {
  operations: Map<string, OptimisticOperation>
  conflicts: ConflictResolution[]
  pendingCount: number
  failedCount: number
  lastSyncTimestamp: number
}

export interface OptimisticApiResult<TData> {
  success: boolean
  data?: TData
  operationId: string
  isOptimistic: boolean
  confirmed: boolean
  error?: string
}

export interface OptimisticConfig {
  enabled: boolean
  autoRetry: boolean
  maxRetries: number
  retryDelay: number
  conflictResolution: 'auto' | 'manual' | 'last-write-wins'
  showPendingIndicators: boolean
  rollbackOnFailure: boolean
}