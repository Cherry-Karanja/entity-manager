// Enhanced WebSocket types for collaborative features
import { BaseWebSocketMessage, MessageType } from '../../../connectionManager/websockets/types'

export interface CollaborativeMessage extends BaseWebSocketMessage {
  type: MessageType.USER_JOINED | MessageType.USER_LEFT | MessageType.USER_EDITING | MessageType.USER_EDITING_STARTED | MessageType.USER_EDITING_STOPPED;
  user_id: string;
  session_id: string;
  timestamp: number;
}

export interface UserPresenceData {
  user_id: number;
  user_name: string;
  user_email: string;
  avatar?: string;
  color: string; // For cursor and indicator colors
  last_seen: number;
  is_online: boolean;
  current_entity?: string;
  current_action?: 'viewing' | 'editing' | 'creating';
}

export interface CursorPosition {
  user_id: number;
  entity_id: string;
  field_path?: string; // For form field focus
  x?: number; // For canvas/text editor positions
  y?: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface EntityLock {
  entity_id: string;
  entity_type: string;
  user_id: number;
  user_name: string;
  lock_type: 'exclusive' | 'shared'; // Exclusive prevents others from editing, shared allows multiple viewers
  timestamp: number;
  expires_at?: number;
}

export interface ConflictResolution {
  entity_id: string;
  entity_type: string;
  conflicts: Array<{
    field: string;
    local_value: any;
    remote_value: any;
    remote_user: string;
    timestamp: number;
  }>;
  resolution_strategy: 'merge' | 'overwrite' | 'manual';
}

// Collaborative session management
export class CollaborativeSession {
  private sessionId: string;
  private userId: number;
  private entityId: string;
  private entityType: string;
  private presenceData: Map<number, UserPresenceData> = new Map();
  private locks: Map<string, EntityLock> = new Map();
  private cursors: Map<number, CursorPosition> = new Map();

  constructor(sessionId: string, userId: number, entityId: string, entityType: string) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.entityId = entityId;
    this.entityType = entityType;
  }

  // User presence management
  updatePresence(userData: UserPresenceData): void {
    this.presenceData.set(userData.user_id, {
      ...userData,
      last_seen: Date.now(),
      is_online: true
    });
  }

  removePresence(userId: number): void {
    const presence = this.presenceData.get(userId);
    if (presence) {
      presence.is_online = false;
      presence.last_seen = Date.now();
    }
  }

  getActiveUsers(): UserPresenceData[] {
    return Array.from(this.presenceData.values()).filter(user => user.is_online);
  }

  // Entity locking
  acquireLock(lock: EntityLock): boolean {
    const existingLock = this.locks.get(lock.entity_id);

    // Check if lock already exists
    if (existingLock) {
      // Allow shared locks if both are shared
      if (existingLock.lock_type === 'shared' && lock.lock_type === 'shared') {
        return true;
      }
      // Exclusive lock blocks everything
      if (existingLock.lock_type === 'exclusive' || lock.lock_type === 'exclusive') {
        return false;
      }
    }

    this.locks.set(lock.entity_id, lock);
    return true;
  }

  releaseLock(entityId: string, userId: number): boolean {
    const lock = this.locks.get(entityId);
    if (lock && lock.user_id === userId) {
      this.locks.delete(entityId);
      return true;
    }
    return false;
  }

  getLock(entityId: string): EntityLock | undefined {
    return this.locks.get(entityId);
  }

  // Cursor tracking
  updateCursor(cursor: CursorPosition): void {
    this.cursors.set(cursor.user_id, cursor);
  }

  removeCursor(userId: number): void {
    this.cursors.delete(userId);
  }

  getActiveLocks(): EntityLock[] {
    return Array.from(this.locks.values());
  }

  getActiveCursors(): CursorPosition[] {
    return Array.from(this.cursors.values());
  }

  // Session management
  getSessionId(): string {
    return this.sessionId;
  }

  getEntityId(): string {
    return this.entityId;
  }

  getEntityType(): string {
    return this.entityType;
  }

  // Cleanup inactive users
  cleanupInactiveUsers(maxAge: number = 300000): void { // 5 minutes default
    const now = Date.now();
    for (const [userId, presence] of this.presenceData) {
      if (now - presence.last_seen > maxAge) {
        this.presenceData.delete(userId);
        this.cursors.delete(userId);
        // Clean up locks owned by inactive users
        for (const [entityId, lock] of this.locks) {
          if (lock.user_id === userId) {
            this.locks.delete(entityId);
          }
        }
      }
    }
  }
}