'use client'

import React from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ChatToggleProps } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ChatToggle({
  isOpen,
  onToggle,
  unreadCount = 0,
  className
}: ChatToggleProps) {
  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50',
      className
    )}>
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          'h-12 w-12 rounded-full shadow-lg transition-all duration-200',
          'hover:scale-105 active:scale-95',
          isOpen && 'bg-destructive hover:bg-destructive/90'
        )}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        )}
      </Button>
    </div>
  )
}