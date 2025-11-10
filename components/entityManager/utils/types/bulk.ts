// ===== BULK OPERATIONS TYPES =====

export interface BulkOperation<TData = Record<string, unknown>> {
  id: string
  type: 'create' | 'update' | 'delete'
  entityType: string
  entityIds: string[]
  data?: TData
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number // 0-100
  errors: Array<{ entityId: string; error: string }>
  timestamp: number
  completedAt?: number
  totalEntities: number
  processedEntities: number
}

export interface BulkOperationResult<TData = Record<string, unknown>> {
  operationId: string
  success: boolean
  results: Array<{
    entityId: string
    success: boolean
    data?: TData
    error?: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
    skipped: number
  }
  timestamp: number
}

export interface BulkOperationConfig {
  batchSize: number
  maxConcurrent: number
  retryFailed: boolean
  maxRetries: number
  continueOnError: boolean
  timeout?: number
}

export interface BulkOperationProgress {
  operationId: string
  current: number
  total: number
  percentage: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  currentBatch?: number
  totalBatches?: number
  eta?: number // estimated time of arrival in seconds
}