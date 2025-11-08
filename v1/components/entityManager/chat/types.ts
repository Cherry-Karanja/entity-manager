export interface ChatMessage {
  id: string
  type: 'user' | 'system' | 'entity_update'
  message: string
  username: string
  userId: string
  timestamp: number
  entityType?: string
  entityId?: string
  action?: string
}

export interface ChatUser {
  id: string
  username: string
  isOnline: boolean
  lastSeen?: number
}

export interface ChatConfig {
  enabled: boolean
  websocketUrl: string
  roomPrefix?: string
  maxMessages?: number
  mockEnabled?: boolean
  mockMessages?: any[]
  mockDelay?: number
}

export interface ChatPanelProps {
  config: ChatConfig
  entityType?: string
  entityId?: string
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export interface MessageListProps {
  messages: ChatMessage[]
  currentUserId?: string
  className?: string
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export interface ChatToggleProps {
  isOpen: boolean
  onToggle: () => void
  unreadCount?: number
  className?: string
}