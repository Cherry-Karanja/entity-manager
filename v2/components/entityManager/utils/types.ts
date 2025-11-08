// ===== UTILITY TYPES =====

export interface CollaborativeParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'viewing' | 'editing' | 'idle';
  lastActivity: number;
  editingField?: string;
  cursorPosition?: { x: number; y: number };
}
// Optimistic Operations
export interface OptimisticOperation {
  id: string
  type: 'create' | 'update' | 'delete' | 'bulk_update'
  entityType: string
  entityId?: string
  tempId?: string
  data?: Record<string, unknown>
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed' | 'rolled_back'
  retryCount: number
  error?: string
  rollbackData?: Record<string, unknown>
}

export interface OptimisticState {
  operations: Map<string, OptimisticOperation>
  pendingCount: number
  failedCount: number
  lastSyncTimestamp?: number
}

// Conflict Resolution
export interface ConflictResolution {
  operationId: string
  entityType: string
  entityId: string
  conflictFields: string[]
  localData: Record<string, unknown>
  serverData: Record<string, unknown>
  timestamp: number
  resolution?: 'local' | 'server' | 'merge' | 'manual'
  resolvedData?: Record<string, unknown>
  resolvedAt?: number
}

// File Upload Types
export interface UploadProgress {
  fileId: string
  loaded: number
  total: number
  percentage: number
  speed: number
  eta: number
}

export interface UploadError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Collaborative Features
export interface CollaborativeSessionData {
  sessionId: string
  entityType: string
  entityId: string
  activeUsers: CollaborativeParticipant[]
  locks: EntityLock[]
  cursors: CursorPosition[]
  lastActivity: number
}

// Define missing collaborative types
export interface EntityLock {
  entity_id: string
  user_id: string
  user_name: string
  lock_type: 'exclusive' | 'shared'
  timestamp: number
  expires_at?: number
}

export interface CursorPosition {
  user_id: string
  user_name: string
  x: number
  y: number
  timestamp: number
}

// Bulk Operations
export interface BulkOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entityType: string
  entityIds: string[]
  data?: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  errors: Array<{ entityId: string; error: string }>
  timestamp: number
}