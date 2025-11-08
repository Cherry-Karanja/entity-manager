import React from 'react'
import { EntityManager } from '../components/entityManager/manager/orchestrator'
import { EntityConfig } from '../components/entityManager/manager/types'

// Example entity configuration with chat enabled
const userEntityConfig: EntityConfig = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'Users',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      required: true
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: true
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true
    }
  ],
  endpoints: {
    list: '/api/users/',
    create: '/api/users/',
    update: '/api/users/',
    delete: '/api/users/'
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'name', header: 'Name', sortable: true },
      { id: 'email', header: 'Email', sortable: true }
    ],
    pageSize: 10
  },
  // Chat configuration
  chat: {
    enabled: true,
    websocketUrl: 'ws://localhost:8000/ws/chat/',
    roomPrefix: 'entity_',
    maxMessages: 100,
    // Enable mock mode for development
    mockEnabled: process.env.NODE_ENV === 'development',
    mockDelay: 2000
  }
}

export function UserManagerWithChat() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management with Chat</h1>

      <EntityManager
        config={userEntityConfig}
        chatOpen={false} // Start with chat closed
        onChatToggle={(isOpen: boolean) => {
          console.log('Chat toggled:', isOpen)
        }}
      />
    </div>
  )
}

// Example with mock messages for testing
export const userEntityConfigWithMocks: EntityConfig = {
  ...userEntityConfig,
  chat: {
    enabled: true,
    websocketUrl: 'ws://localhost:8000/ws/chat/',
    roomPrefix: 'entity_',
    maxMessages: 100,
    mockEnabled: true,
    mockMessages: [
      {
        type: 'chat.message',
        data: {
          message: 'Welcome to the User Management chat!',
          username: 'System',
          user_id: 'system'
        }
      },
      {
        type: 'chat.message',
        data: {
          message: 'You can discuss user management tasks here.',
          username: 'Admin',
          user_id: 'admin'
        }
      }
    ],
    mockDelay: 3000
  }
}