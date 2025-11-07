# Entity Manager Chat Integration

This document explains how to configure and use the chat functionality in the Entity Manager.

## Overview

The Entity Manager now supports real-time chat functionality that connects to Django WebSockets. The chat system allows users to communicate in real-time while working with entities.

## Configuration

To enable chat for an entity, add the `chat` configuration to your `EntityConfig`:

```typescript
const entityConfig: EntityConfig = {
  // ... other config
  chat: {
    enabled: true,
    websocketUrl: "ws://localhost:8000/ws/chat/",
    roomPrefix: "entity_",
    maxMessages: 100,
    mockEnabled: false, // Set to true for development
    mockMessages: [],
    mockDelay: 2000
  }
}
```

## Configuration Options

- `enabled`: Whether chat is enabled for this entity
- `websocketUrl`: The Django WebSocket endpoint URL
- `roomPrefix`: Prefix for chat room names (default: "entity_")
- `maxMessages`: Maximum messages to keep in memory (default: 100)
- `mockEnabled`: Enable mock mode for development/testing
- `mockMessages`: Array of mock messages for testing
- `mockDelay`: Delay between mock messages in milliseconds

## Django WebSocket Setup

Your Django application should have WebSocket consumers set up. The chat expects messages in this format:

```json
{
  "type": "chat.message",
  "data": {
    "message": "Hello world",
    "username": "user123",
    "user_id": "user123",
    "timestamp": 1640995200000
  }
}
```

## Usage

Once configured, users will see a chat toggle button in the bottom-right corner. Clicking it opens a chat panel where they can:

- Send and receive messages in real-time
- See system messages for entity updates
- View chat history
- Get notifications for new messages

## Mock Mode

For development and testing, you can enable mock mode:

```typescript
chat: {
  enabled: true,
  websocketUrl: "ws://localhost:8000/ws/chat/",
  mockEnabled: true,
  mockMessages: [
    {
      type: "chat.message",
      data: {
        message: "Welcome to mock chat!",
        username: "System",
        user_id: "system"
      }
    }
  ],
  mockDelay: 3000
}
```

## Component Props

The EntityManager component now accepts additional chat-related props:

```tsx
<EntityManager
  config={entityConfig}
  chatOpen={false} // Initial chat state
  onChatToggle={(isOpen) => console.log('Chat toggled:', isOpen)}
/>
```

## Message Types

The chat system supports different message types:

- `user`: Regular user messages
- `system`: System notifications (user joined/left)
- `entity_update`: Notifications about entity changes

## Room Management

Chat rooms are automatically created based on the entity context:
- General chat: `{roomPrefix}{entityType}/`
- Entity-specific chat: `{roomPrefix}{entityType}_{entityId}/`

For example, with `roomPrefix: "entity_"`:
- User list chat: `entity_user/`
- Specific user chat: `entity_user_123/`