import { WebSocketMessage } from './use-websocket'

export interface MockWebSocketConfig {
  messages: WebSocketMessage[]
  delay: number
  loop: boolean
}

export class MockWebSocketService {
  private config: MockWebSocketConfig
  private messageIndex: number = 0
  private intervalId: NodeJS.Timeout | null = null
  private onMessage?: (message: WebSocketMessage) => void

  constructor(config: MockWebSocketConfig) {
    this.config = config
  }

  connect(onMessage: (message: WebSocketMessage) => void) {
    this.onMessage = onMessage
    this.startMockMessages()
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  sendMessage(message: WebSocketMessage) {
    // Echo the message back with a slight delay
    setTimeout(() => {
      const echoMessage: WebSocketMessage = {
        ...message,
        type: 'chat.message.echo',
        timestamp: Date.now()
      }
      this.onMessage?.(echoMessage)
    }, 300)
  }

  private startMockMessages() {
    this.intervalId = setInterval(() => {
      if (this.messageIndex < this.config.messages.length) {
        const message = this.config.messages[this.messageIndex]
        this.onMessage?.({
          ...message,
          timestamp: Date.now()
        })
        this.messageIndex++
      } else if (this.config.loop) {
        this.messageIndex = 0
      } else {
        this.disconnect()
      }
    }, this.config.delay)
  }
}

// Predefined mock messages for common chat scenarios
export const createMockChatMessages = (): WebSocketMessage[] => [
  {
    type: 'chat.message',
    data: {
      message: 'Welcome to the entity chat!',
      username: 'System',
      user_id: 'system',
      timestamp: Date.now()
    }
  },
  {
    type: 'chat.message',
    data: {
      message: 'Hello everyone! How is the entity management going?',
      username: 'Alice',
      user_id: 'user1',
      timestamp: Date.now() + 1000
    }
  },
  {
    type: 'chat.message',
    data: {
      message: 'Great! Just finished updating the user permissions.',
      username: 'Bob',
      user_id: 'user2',
      timestamp: Date.now() + 2000
    }
  },
  {
    type: 'chat.message',
    data: {
      message: 'Anyone working on the new dashboard feature?',
      username: 'Charlie',
      user_id: 'user3',
      timestamp: Date.now() + 3000
    }
  },
  {
    type: 'chat.user_joined',
    data: {
      username: 'Diana',
      user_id: 'user4',
      timestamp: Date.now() + 4000
    }
  },
  {
    type: 'chat.message',
    data: {
      message: 'Hi Diana! Yes, I am working on the dashboard. Need any help?',
      username: 'Alice',
      user_id: 'user1',
      timestamp: Date.now() + 5000
    }
  }
]

export const createMockEntityMessages = (entityType: string, entityId: string): WebSocketMessage[] => [
  {
    type: 'entity.update',
    data: {
      entity_type: entityType,
      entity_id: entityId,
      action: 'updated',
      user: 'System',
      timestamp: Date.now(),
      message: `${entityType} ${entityId} has been updated`
    }
  },
  {
    type: 'entity.create',
    data: {
      entity_type: entityType,
      entity_id: entityId,
      action: 'created',
      user: 'Alice',
      timestamp: Date.now() + 1000,
      message: `New ${entityType} created by Alice`
    }
  },
  {
    type: 'entity.delete',
    data: {
      entity_type: entityType,
      entity_id: entityId,
      action: 'deleted',
      user: 'Bob',
      timestamp: Date.now() + 2000,
      message: `${entityType} ${entityId} was deleted by Bob`
    }
  }
]