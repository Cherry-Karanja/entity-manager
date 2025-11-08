'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp?: number
}

export interface UseWebSocketOptions {
  url: string
  protocols?: string | string[]
  reconnectAttempts?: number
  reconnectInterval?: number
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  mockEnabled?: boolean
  mockMessages?: WebSocketMessage[]
  mockDelay?: number
}

export interface UseWebSocketReturn {
  socket: WebSocket | null
  isConnected: boolean
  isConnecting: boolean
  sendMessage: (message: WebSocketMessage) => void
  connect: () => void
  disconnect: () => void
  lastMessage: WebSocketMessage | null
}

export function useWebSocket({
  url,
  protocols,
  reconnectAttempts = 3,
  reconnectInterval = 3000,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  mockEnabled = false,
  mockMessages = [],
  mockDelay = 1000
}: UseWebSocketOptions): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mockMessageIndexRef = useRef(0)
  const onMessageRef = useRef(onMessage)
  const onConnectRef = useRef(onConnect)
  const onDisconnectRef = useRef(onDisconnect)
  const onErrorRef = useRef(onError)

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onConnectRef.current = onConnect
  }, [onConnect])

  useEffect(() => {
    onDisconnectRef.current = onDisconnect
  }, [onDisconnect])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN || isConnecting) return

    setIsConnecting(true)
    reconnectAttemptsRef.current = 0

    if (mockEnabled) {
      // Mock connection
      setTimeout(() => {
        setIsConnected(true)
        setIsConnecting(false)
        onConnectRef.current?.()

        // Start sending mock messages
        if (mockMessages.length > 0) {
          mockIntervalRef.current = setInterval(() => {
            if (mockMessageIndexRef.current < mockMessages.length) {
              const message = mockMessages[mockMessageIndexRef.current]
              setLastMessage(message)
              onMessageRef.current?.(message)
              mockMessageIndexRef.current++
            } else {
              // Reset to loop messages
              mockMessageIndexRef.current = 0
            }
          }, mockDelay)
        }
      }, 500) // Simulate connection delay
      return
    }

    try {
      const ws = new WebSocket(url, protocols)
      setSocket(ws)

      ws.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        onConnectRef.current?.()
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessageRef.current?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        setIsConnecting(false)
        setSocket(null)
        onDisconnectRef.current?.()
      }

      ws.onerror = (error) => {
        setIsConnecting(false)
        onErrorRef.current?.(error)
      }
    } catch (error) {
      setIsConnecting(false)
      console.error('Failed to create WebSocket connection:', error)
    }
  }, [socket, isConnecting, url, protocols, mockEnabled, mockMessages, mockDelay])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current)
      mockIntervalRef.current = null
    }

    if (socket) {
      socket.close()
      setSocket(null)
    }

    setIsConnected(false)
    setIsConnecting(false)
  }, [socket])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (mockEnabled) {
      // In mock mode, just log the message and simulate echo
      console.log('Mock WebSocket send:', message)
      setTimeout(() => {
        const echoMessage = {
          ...message,
          type: 'chat.message.echo',
          timestamp: Date.now()
        }
        setLastMessage(echoMessage)
        onMessageRef.current?.(echoMessage)
      }, 500)
      return
    }

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message)
    }
  }, [socket, mockEnabled])

  // Auto-reconnect logic
  useEffect(() => {
    if (!isConnected && !isConnecting && reconnectAttemptsRef.current < reconnectAttempts) {
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current += 1
        connect()
      }, reconnectInterval)
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [isConnected, isConnecting, connect, reconnectAttempts, reconnectInterval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    socket,
    isConnected,
    isConnecting,
    sendMessage,
    connect,
    disconnect,
    lastMessage
  }
}