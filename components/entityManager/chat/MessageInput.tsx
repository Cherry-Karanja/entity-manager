'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { MessageInputProps } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || disabled || isSending) return

    setIsSending(true)
    try {
      await onSendMessage(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-end gap-2 p-4 border-t bg-background',
        className
      )}
    >
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connecting...' : placeholder}
          disabled={disabled || isSending}
          className={cn(
            'min-h-[40px] max-h-[120px] resize-none pr-12',
            'focus:ring-1 focus:ring-ring focus:ring-offset-0'
          )}
          rows={1}
        />

        {message.length > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {message.length}
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={!message.trim() || disabled || isSending}
        className="h-10 w-10 p-0 flex-shrink-0"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}