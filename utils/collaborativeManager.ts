import { CollaborativeSession, UserPresenceData, CursorPosition, EntityLock, ConflictResolution } from '../types/collaborative';
import { WebSocketManager } from '../utils/websocket';
import authManager from '../handler/AuthManager';

export class CollaborativeManager {
  private sessions: Map<string, CollaborativeSession> = new Map();
  private wsManager: WebSocketManager;
  private currentUserId: number | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
    this.initializeUser();
    this.startCleanupInterval();
  }

  private initializeUser(): void {
    // Get current user ID from auth manager or local storage
    // This would need to be implemented based on your auth system
    this.currentUserId = 1; // Placeholder - should get from auth context
  }

  private startCleanupInterval(): void {
    // Clean up inactive users every 5 minutes
    this.cleanupInterval = setInterval(() => {
      for (const session of this.sessions.values()) {
        session.cleanupInactiveUsers();
      }
    }, 300000);
  }

  // Session management
  createSession(entityId: string, entityType: string): CollaborativeSession {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    const sessionId = `${entityType}_${entityId}_${Date.now()}`;
    const session = new CollaborativeSession(sessionId, this.currentUserId, entityId, entityType);

    this.sessions.set(sessionId, session);

    // Announce user joined
    this.broadcastUserJoined(session);

    return session;
  }

  joinSession(sessionId: string): CollaborativeSession | null {
    return this.sessions.get(sessionId) || null;
  }

  leaveSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session && this.currentUserId) {
      // Announce user left
      this.broadcastUserLeft(session);

      // Clean up session if no active users
      const activeUsers = session.getActiveUsers();
      if (activeUsers.length === 0) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // User presence
  updatePresence(sessionId: string, presenceData: Partial<UserPresenceData>): void {
    const session = this.sessions.get(sessionId);
    if (!session || !this.currentUserId) return;

    const fullPresenceData: UserPresenceData = {
      user_id: this.currentUserId,
      user_name: 'Current User', // Should get from auth context
      user_email: 'user@example.com', // Should get from auth context
      color: this.generateUserColor(this.currentUserId),
      last_seen: Date.now(),
      is_online: true,
      current_entity: session.getEntityId(),
      current_action: 'viewing',
      ...presenceData
    };

    session.updatePresence(fullPresenceData);
    this.broadcastPresenceUpdate(session, fullPresenceData);
  }

  // Entity locking
  acquireLock(sessionId: string, entityId: string, lockType: 'exclusive' | 'shared' = 'exclusive'): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !this.currentUserId) return false;

    const lock: EntityLock = {
      entity_id: entityId,
      entity_type: session.getEntityType(),
      user_id: this.currentUserId,
      user_name: 'Current User', // Should get from auth context
      lock_type: lockType,
      timestamp: Date.now()
    };

    const acquired = session.acquireLock(lock);
    if (acquired) {
      this.broadcastLockAcquired(session, lock);
    }

    return acquired;
  }

  releaseLock(sessionId: string, entityId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !this.currentUserId) return false;

    const released = session.releaseLock(entityId, this.currentUserId);
    if (released) {
      this.broadcastLockReleased(session, entityId);
    }

    return released;
  }

  // Cursor tracking
  updateCursor(sessionId: string, cursorData: Omit<CursorPosition, 'user_id'>): void {
    const session = this.sessions.get(sessionId);
    if (!session || !this.currentUserId) return;

    const cursor: CursorPosition = {
      user_id: this.currentUserId,
      ...cursorData
    };

    session.updateCursor(cursor);
    this.broadcastCursorUpdate(session, cursor);
  }

  // Broadcasting methods
  private broadcastUserJoined(session: CollaborativeSession): void {
    if (!this.currentUserId) return;
    this.wsManager.send({
      type: 'user_joined',
      user_id: this.currentUserId,
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  private broadcastUserLeft(session: CollaborativeSession): void {
    if (!this.currentUserId) return;
    this.wsManager.send({
      type: 'user_left',
      user_id: this.currentUserId,
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  private broadcastPresenceUpdate(session: CollaborativeSession, presence: UserPresenceData): void {
    this.wsManager.send({
      type: 'user_presence',
      data: presence,
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  private broadcastLockAcquired(session: CollaborativeSession, lock: EntityLock): void {
    this.wsManager.send({
      type: 'entity_lock',
      data: lock,
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  private broadcastLockReleased(session: CollaborativeSession, entityId: string): void {
    this.wsManager.send({
      type: 'entity_unlock',
      data: { entity_id: entityId },
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  private broadcastCursorUpdate(session: CollaborativeSession, cursor: CursorPosition): void {
    this.wsManager.send({
      type: 'user_cursor',
      data: cursor,
      session_id: session.getSessionId(),
      entity_type: session.getEntityType(),
      entity_id: session.getEntityId(),
      timestamp: Date.now()
    });
  }

  // Utility methods
  private generateUserColor(userId: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[userId % colors.length];
  }

  // Cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessions.clear();
  }
}

// Global collaborative manager instance
let collaborativeManager: CollaborativeManager | null = null;

export const getCollaborativeManager = (wsManager: WebSocketManager): CollaborativeManager => {
  if (!collaborativeManager) {
    collaborativeManager = new CollaborativeManager(wsManager);
  }
  return collaborativeManager;
};

export const destroyCollaborativeManager = (): void => {
  if (collaborativeManager) {
    collaborativeManager.destroy();
    collaborativeManager = null;
  }
};