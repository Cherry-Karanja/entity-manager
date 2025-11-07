import { useState, useEffect, useCallback, useRef } from 'react';
import { CollaborativeManager, getCollaborativeManager } from '../utils/collaborativeManager';
import { CollaborativeSession, UserPresenceData, CursorPosition, EntityLock } from '../types/collaborative';
import { WebSocketManager } from '../utils/websocket';

interface UseCollaborativeSessionOptions {
  entityId: string;
  entityType: string;
  wsManager: WebSocketManager;
  onPresenceUpdate?: (presence: UserPresenceData[]) => void;
  onLockUpdate?: (locks: EntityLock[]) => void;
  onCursorUpdate?: (cursors: CursorPosition[]) => void;
}

export const useCollaborativeSession = ({
  entityId,
  entityType,
  wsManager,
  onPresenceUpdate,
  onLockUpdate,
  onCursorUpdate
}: UseCollaborativeSessionOptions) => {
  const [session, setSession] = useState<CollaborativeSession | null>(null);
  const [activeUsers, setActiveUsers] = useState<UserPresenceData[]>([]);
  const [entityLocks, setEntityLocks] = useState<EntityLock[]>([]);
  const [userCursors, setUserCursors] = useState<CursorPosition[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const managerRef = useRef<CollaborativeManager | null>(null);

  // Initialize collaborative manager
  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = getCollaborativeManager(wsManager);
    }
  }, [wsManager]);

  // Create/join session
  useEffect(() => {
    if (!managerRef.current || !entityId || !entityType) return;

    const newSession = managerRef.current.createSession(entityId, entityType);
    setSession(newSession);
    setIsConnected(true);

    // Update presence
    managerRef.current.updatePresence(newSession.getSessionId(), {
      is_online: true,
      current_action: 'viewing'
    });

    return () => {
      if (managerRef.current && newSession) {
        managerRef.current.leaveSession(newSession.getSessionId());
      }
      setSession(null);
      setIsConnected(false);
    };
  }, [entityId, entityType]);

  // Listen for WebSocket messages
  useEffect(() => {
    if (!wsManager || !session) return;

    const handleMessage = (message: any) => {
      switch (message.type) {
        case 'user_joined':
        case 'user_left':
        case 'user_presence':
          if (session) {
            const users = session.getActiveUsers();
            setActiveUsers(users);
            onPresenceUpdate?.(users);
          }
          break;

        case 'entity_lock':
        case 'entity_unlock':
          if (session) {
            const locks = session.getActiveLocks();
            setEntityLocks(locks);
            onLockUpdate?.(locks);
          }
          break;

        case 'user_cursor':
          if (session) {
            const cursors = session.getActiveCursors();
            setUserCursors(cursors);
            onCursorUpdate?.(cursors);
          }
          break;
      }
    };

    wsManager.send = wsManager.send.bind(wsManager);
    // Note: In a real implementation, you'd need to hook into the WebSocket message handler
    // This is a simplified version

    return () => {
      // Cleanup message handler
    };
  }, [wsManager, session, onPresenceUpdate, onLockUpdate, onCursorUpdate]);

  // Actions
  const updatePresence = useCallback((presenceData: Partial<UserPresenceData>) => {
    if (!session || !managerRef.current) return;
    managerRef.current.updatePresence(session.getSessionId(), presenceData);
  }, [session]);

  const acquireLock = useCallback((lockEntityId: string, lockType: 'exclusive' | 'shared' = 'exclusive') => {
    if (!session || !managerRef.current) return false;
    return managerRef.current.acquireLock(session.getSessionId(), lockEntityId, lockType);
  }, [session]);

  const releaseLock = useCallback((lockEntityId: string) => {
    if (!session || !managerRef.current) return false;
    return managerRef.current.releaseLock(session.getSessionId(), lockEntityId);
  }, [session]);

  const updateCursor = useCallback((cursorData: Omit<CursorPosition, 'user_id'>) => {
    if (!session || !managerRef.current) return;
    managerRef.current.updateCursor(session.getSessionId(), cursorData);
  }, [session]);

  return {
    session,
    isConnected,
    activeUsers,
    entityLocks,
    userCursors,
    actions: {
      updatePresence,
      acquireLock,
      releaseLock,
      updateCursor
    }
  };
};