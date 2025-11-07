// Export all types from their respective modules

// API Types
export type { ApiErrorResponse, DjangoPaginatedResponse } from './api';

// Authentication Types
export type {
  User,
  SubscriptionTier,
  AuthState,
  SUBSCRIPTION_TIERS
} from './auth';
export interface FormFieldConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'textarea' | 'email' | 'url' | 'password' | 'file'
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string | number; label: string }>
  validation?: (value: unknown) => boolean | string
  defaultValue?: unknown
  disabled?: boolean
  readOnly?: boolean
  permissions?: {
    create?: boolean
    update?: boolean
    read?: boolean
    delete?: boolean
  }
  relationshipType?: 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'
  condition?: (formData: Record<string, unknown>) => boolean
  accept?: string // For file inputs - MIME types or file extensions
}

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