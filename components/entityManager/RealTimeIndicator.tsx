/**
 * RealTimeIndicator Component
 *
 * Displays WebSocket connection status and real-time update indicators
 * for the Entity Manager system.
 */

'use client'

import React from 'react'
import { ConnectionState } from '../../types/websocket'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RealTimeIndicatorProps {
  isConnected: boolean
  connectionState: ConnectionState
  queuedMessagesCount: number
  className?: string
  showQueuedCount?: boolean
  compact?: boolean
}

export function RealTimeIndicator({
  isConnected,
  connectionState,
  queuedMessagesCount,
  className,
  showQueuedCount = true,
  compact = false
}: RealTimeIndicatorProps) {
  const getStatusInfo = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return {
          icon: Wifi,
          label: 'Real-time connected',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          description: 'Receiving live updates'
        }
      case ConnectionState.CONNECTING:
        return {
          icon: RefreshCw,
          label: 'Connecting...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          description: 'Establishing real-time connection'
        }
      case ConnectionState.RECONNECTING:
        return {
          icon: RefreshCw,
          label: 'Reconnecting...',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          description: 'Re-establishing connection'
        }
      case ConnectionState.ERROR:
        return {
          icon: AlertCircle,
          label: 'Connection error',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          description: 'Real-time updates unavailable'
        }
      case ConnectionState.DISCONNECTED:
      default:
        return {
          icon: WifiOff,
          label: 'Disconnected',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          description: 'Real-time updates disabled'
        }
    }
  }

  const statusInfo = getStatusInfo()
  const Icon = statusInfo.icon

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('flex items-center gap-1', className)}>
              <Icon
                className={cn('h-4 w-4', statusInfo.color, {
                  'animate-spin': connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.RECONNECTING
                })}
              />
              {queuedMessagesCount > 0 && showQueuedCount && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {queuedMessagesCount}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{statusInfo.label}</div>
              <div className="text-muted-foreground">{statusInfo.description}</div>
              {queuedMessagesCount > 0 && (
                <div className="text-muted-foreground">
                  {queuedMessagesCount} message{queuedMessagesCount !== 1 ? 's' : ''} queued
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'flex items-center gap-2 px-3 py-1',
              statusInfo.bgColor,
              statusInfo.color,
              className
            )}
          >
            <Icon
              className={cn('h-4 w-4', {
                'animate-spin': connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.RECONNECTING
              })}
            />
            <span className="text-sm font-medium">{statusInfo.label}</span>
            {queuedMessagesCount > 0 && showQueuedCount && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {queuedMessagesCount}
              </Badge>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">{statusInfo.label}</div>
            <div className="text-muted-foreground">{statusInfo.description}</div>
            {queuedMessagesCount > 0 && (
              <div className="text-muted-foreground">
                {queuedMessagesCount} message{queuedMessagesCount !== 1 ? 's' : ''} queued for sending
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Live Update Notification Component
interface LiveUpdateNotificationProps {
  message: string
  timestamp: number
  type?: 'info' | 'success' | 'warning'
  className?: string
  onDismiss?: () => void
  autoHideDelay?: number
}

export function LiveUpdateNotification({
  message,
  timestamp,
  type = 'info',
  className,
  onDismiss,
  autoHideDelay = 3000
}: LiveUpdateNotificationProps) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [autoHideDelay, onDismiss])

  if (!visible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-all',
        getTypeStyles(),
        className
      )}
    >
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <span className="text-xs opacity-70">
        {new Date(timestamp).toLocaleTimeString()}
      </span>
      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false)
            onDismiss()
          }}
          className="ml-2 text-current opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}

// Real-time Status Bar Component
interface RealTimeStatusBarProps {
  isConnected: boolean
  connectionState: ConnectionState
  queuedMessagesCount: number
  lastUpdate?: number
  className?: string
}

export function RealTimeStatusBar({
  isConnected,
  connectionState,
  queuedMessagesCount,
  lastUpdate,
  className
}: RealTimeStatusBarProps) {
  return (
    <div className={cn('flex items-center justify-between border-t bg-muted/50 px-4 py-2', className)}>
      <div className="flex items-center gap-4">
        <RealTimeIndicator
          isConnected={isConnected}
          connectionState={connectionState}
          queuedMessagesCount={queuedMessagesCount}
          compact
        />
        {lastUpdate && (
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>

      {isConnected && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      )}
    </div>
  )
}