'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { MessageCircle, Users, Settings } from 'lucide-react'
import { ChatPanelProps, ChatMessage } from './types'
import { useWebSocket, WebSocketMessage } from '@/components/chat/hooks/use-websocket'
import { createMockChatMessages, createMockEntityMessages } from '@/components/chat/hooks/mock-websocket'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ChatToggle } from './ChatToggle'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatPanel({
  config,
  entityType,
  entityId,
  isOpen,
  onToggle,
  className
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUserId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)

  // Prepare WebSocket URL with entity context
  const websocketUrl = useMemo(() => {
    if (config.mockEnabled) return 'mock'

    let url = config.websocketUrl
    if (entityType && entityId && config.roomPrefix) {
      url += `${config.roomPrefix}${entityType}_${entityId}/`
    }
    return url
  }, [config, entityType, entityId])

  // Prepare mock messages
  const mockMessages = useMemo(() => {
    if (!config.mockEnabled) return []

    const chatMessages = createMockChatMessages()
    const entityMessages = entityType && entityId
      ? createMockEntityMessages(entityType, entityId)
      : []

    return [...chatMessages, ...entityMessages]
  }, [config.mockEnabled, entityType, entityId])

  // WebSocket connection
  const {
    isConnected,
    isConnecting,
    sendMessage: sendWebSocketMessage
  } = useWebSocket({
    url: websocketUrl,
    mockEnabled: config.mockEnabled,
    mockMessages,
    mockDelay: config.mockDelay || 2000,
    onMessage: useCallback((wsMessage: WebSocketMessage) => {
      const chatMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: wsMessage.type === 'chat.user_joined' ? 'system' :
              wsMessage.type.startsWith('entity.') ? 'entity_update' : 'user',
        message: wsMessage.data?.message || JSON.stringify(wsMessage.data),
        username: wsMessage.data?.username || 'Unknown',
        userId: wsMessage.data?.user_id || wsMessage.data?.user || 'unknown',
        timestamp: wsMessage.timestamp || Date.now(),
        entityType: wsMessage.data?.entity_type,
        entityId: wsMessage.data?.entity_id,
        action: wsMessage.data?.action
      }

      setMessages(prev => {
        const newMessages = [...prev, chatMessage]
        // Keep only the last maxMessages
        return config.maxMessages
          ? newMessages.slice(-config.maxMessages)
          : newMessages
      })

      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }
    }, [config.maxMessages, isOpen])
  })

  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  // Send message handler
  const handleSendMessage = useCallback(async (message: string) => {
    const wsMessage: WebSocketMessage = {
      type: 'chat.message',
      data: {
        message,
        username: 'You', // This should come from auth context
        user_id: currentUserId,
        timestamp: Date.now(),
        entity_type: entityType,
        entity_id: entityId
      },
      timestamp: Date.now()
    }

    sendWebSocketMessage(wsMessage)
  }, [sendWebSocketMessage, currentUserId, entityType, entityId])

  // Connection status
  const connectionStatus = useMemo(() => {
    if (config.mockEnabled) return { text: 'Mock Mode', color: 'bg-yellow-500' }
    if (isConnecting) return { text: 'Connecting...', color: 'bg-yellow-500' }
    if (isConnected) return { text: 'Connected', color: 'bg-green-500' }
    return { text: 'Disconnected', color: 'bg-red-500' }
  }, [config.mockEnabled, isConnecting, isConnected])

  if (!isOpen) {
    return (
      <ChatToggle
        isOpen={isOpen}
        onToggle={onToggle}
        unreadCount={unreadCount}
      />
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onToggle}
      />

      {/* Chat Panel */}
      <Card className={cn(
        'fixed bottom-16 right-4 w-80 h-96 z-50 shadow-xl',
        'md:bottom-4 md:right-4',
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
              {entityType && (
                <Badge variant="outline" className="text-xs">
                  {entityType} {entityId}
                </Badge>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={cn('w-2 h-2 rounded-full', connectionStatus.color)} />
                <span className="text-xs text-muted-foreground">
                  {connectionStatus.text}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
          {/* Messages */}
          <div className="flex-1 min-h-0">
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              className="h-full"
            />
          </div>

          {/* Input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected && !config.mockEnabled}
            placeholder={
              !isConnected && !config.mockEnabled
                ? 'Connecting to chat...'
                : 'Type a message...'
            }
          />
        </CardContent>
      </Card>
    </>
  )
}