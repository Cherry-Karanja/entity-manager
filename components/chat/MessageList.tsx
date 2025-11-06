'use client'

import React, { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { MessageListProps, ChatMessage } from './types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

function MessageItem({
  message,
  isCurrentUser
}: {
  message: ChatMessage
  isCurrentUser: boolean
}) {
  const getMessageTypeColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'system':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'entity_update':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return isCurrentUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted'
    }
  }

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {getInitials(message.username)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        'flex flex-col gap-1 max-w-[70%]',
        isCurrentUser ? 'items-end' : 'items-start'
      )}>
        {!isCurrentUser && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {message.username}
            </span>
            {message.type === 'system' && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
            {message.type === 'entity_update' && (
              <Badge variant="outline" className="text-xs">
                Update
              </Badge>
            )}
          </div>
        )}

        <div className={cn(
          'px-3 py-2 rounded-lg text-sm break-words',
          getMessageTypeColor(message.type)
        )}>
          {message.message}
        </div>

        <span className="text-xs text-muted-foreground">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  )
}

export function MessageList({
  messages,
  currentUserId,
  className
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center h-full text-muted-foreground',
        className
      )}>
        <div className="text-center">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={cn('h-full px-4', className)}
    >
      <div className="py-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={message.userId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}