import React from 'react';
import { UserPresenceData, CursorPosition, EntityLock } from '../../types/collaborative';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface CollaborativeIndicatorProps {
  activeUsers: UserPresenceData[];
  entityLocks: EntityLock[];
  userCursors: CursorPosition[];
  currentUserId?: number;
  className?: string;
}

export const CollaborativeIndicator: React.FC<CollaborativeIndicatorProps> = ({
  activeUsers,
  entityLocks,
  userCursors,
  currentUserId,
  className = ''
}) => {
  // Filter out current user from active users list
  const otherUsers = activeUsers.filter(user => user.user_id !== currentUserId);

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex -space-x-2">
          {otherUsers.slice(0, 3).map((user) => (
            <Tooltip key={user.user_id}>
              <TooltipTrigger asChild>
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                  <AvatarImage src="" alt={user.user_name} />
                  <AvatarFallback
                    className="text-xs font-medium"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-medium">{user.user_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.current_action || 'Viewing'}
                  </div>
                  {user.last_seen && (
                    <div className="text-xs text-muted-foreground">
                      Active {new Date(user.last_seen).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          {otherUsers.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{otherUsers.length - 3}
              </span>
            </div>
          )}
        </div>

        {/* Lock indicators */}
        {entityLocks.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {entityLocks.length} locked
          </Badge>
        )}

        {/* Cursor indicators */}
        {userCursors.length > 0 && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {userCursors.length} cursor{userCursors.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

interface LiveCursorProps {
  cursors: CursorPosition[];
  containerRef: React.RefObject<HTMLElement>;
  currentUserId?: number;
}

export const LiveCursors: React.FC<LiveCursorProps> = ({
  cursors,
  containerRef,
  currentUserId
}) => {
  // Filter out current user's cursor
  const otherCursors = cursors.filter(cursor => cursor.user_id !== currentUserId);

  if (!containerRef.current || otherCursors.length === 0) {
    return null;
  }

  return (
    <>
      {otherCursors.map((cursor) => {
        const user = cursor as any; // Assuming cursor has user info
        return (
          <div
            key={cursor.user_id}
            className="absolute pointer-events-none z-50"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: 'translate(-2px, -2px)'
            }}
          >
            <div
              className="w-4 h-4 border-2 border-white shadow-lg"
              style={{
                backgroundColor: user.color || '#3B82F6',
                clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)'
              }}
            />
            <div className="absolute top-5 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {user.user_name || `User ${cursor.user_id}`}
            </div>
          </div>
        );
      })}
    </>
  );
};

interface EntityLockIndicatorProps {
  locks: EntityLock[];
  entityId: string;
  className?: string;
}

export const EntityLockIndicator: React.FC<EntityLockIndicatorProps> = ({
  locks,
  entityId,
  className = ''
}) => {
  const lock = locks.find(l => l.entity_id === entityId);

  if (!lock) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center space-x-2 ${className}`}>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">
              Locked by {lock.user_name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">Entity Locked</div>
            <div className="text-xs text-muted-foreground">
              Locked by {lock.user_name} ({lock.lock_type})
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(lock.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};