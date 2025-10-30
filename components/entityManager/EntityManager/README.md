# EntityManager Orchestrator

The EntityManager is a comprehensive orchestrator component that coordinates EntityList, EntityView, EntityForm, and EntityActions modules to provide full CRUD functionality for any entity type.

## Overview

The EntityManager provides:
- **Unified Architecture**: Combines schema-driven and variation-based approaches
- **Full CRUD Operations**: Create, Read, Update, Delete with MyLandlord backend integration
- **Multiple View Modes**: List, Create, Edit, View modes with smooth transitions
- **Related Entity Handling**: Support for entity relationships and foreign keys
- **Flexible Configuration**: Extensive configuration options for fields, views, actions, and permissions
- **Type Safety**: Full TypeScript support with generic entity types

## Architecture

```
EntityManager/
├── types/index.ts          # Type definitions
├── hooks/
│   └── useEntityManager.tsx # Orchestrator hooks
├── components/
│   └── EntityManager.tsx    # Main orchestrator component
├── api/
│   └── config.ts            # API configurations
└── examples/                # Usage examples
    └── index.tsx
```

## Quick Start

### 1. Import the EntityManager

```tsx
import { EntityManager } from './components/entityManager/EntityManager/components/EntityManager'
import { USER_CONFIG } from './components/entityManager/EntityManager/api/config'
```

### 2. Use with configuration

```tsx
function UserManagement() {
  return (
    <EntityManager config={USER_CONFIG} />
  )
}
```

### 3. Or use the HOC for pre-configured instances

```tsx
import { createEntityManager } from './components/entityManager/EntityManager/components/EntityManager'
import { USER_CONFIG } from './components/entityManager/EntityManager/api/config'

const UserManager = createEntityManager(USER_CONFIG)

function App() {
  return <UserManager />
}
```

## Configuration

### EntityManagerConfig

The configuration object defines everything about your entity:

```tsx
interface EntityManagerConfig<TEntity> {
  // Entity identification
  entityType: string
  displayName: string
  displayNamePlural: string

  // API configuration
  apiBaseUrl: string
  endpoints: {
    list: string
    create: string
    retrieve: string
    update: string
    delete: string
    bulk_delete?: string
    export?: string
    import?: string
  }

  // Field configuration
  fields: EntityFieldConfig[]

  // Related entities
  relations?: EntityRelation[]

  // View configurations
  listView: EntityListViewConfig
  detailView: EntityDetailViewConfig
  formView: EntityFormViewConfig

  // Actions configuration
  actions: EntityActionsConfig

  // Permissions
  permissions: EntityPermissions

  // Hooks and callbacks
  hooks?: {
    onBeforeCreate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterCreate?: (data: TEntity) => void | Promise<void>
    onBeforeUpdate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterUpdate?: (data: TEntity) => void | Promise<void>
    onBeforeDelete?: (id: string | number) => boolean | Promise<boolean>
    onAfterDelete?: (id: string | number) => void | Promise<void>
  }
}
```

### Field Configuration

```tsx
interface EntityFieldConfig {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'multiselect' | 'textarea' | 'file' | 'image' | 'relation'
  required?: boolean
  readonly?: boolean
  hidden?: boolean
  defaultValue?: unknown
  options?: Array<{ value: string | number; label: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
  }
  display?: {
    placeholder?: string
    helpText?: string
    icon?: React.ComponentType
  }
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
}
```

## Examples

### User Management

```tsx
import { EntityManager } from './EntityManager/components/EntityManager'
import { USER_CONFIG } from './EntityManager/api/config'

export function UserManagement() {
  return (
    <div>
      <h1>User Management</h1>
      <EntityManager
        config={USER_CONFIG}
        initialMode="list"
        onModeChange={(mode, item) => console.log('Mode:', mode, 'Item:', item)}
        onDataChange={(data) => console.log('Data updated:', data.length, 'users')}
      />
    </div>
  )
}
```

### Property Management with Relations

```tsx
import { EntityManager } from './EntityManager/components/EntityManager'
import { PROPERTY_CONFIG } from './EntityManager/api/config'

export function PropertyManagement() {
  return (
    <EntityManager
      config={PROPERTY_CONFIG}
      initialFilters={{ status: 'vacant' }}
      contextData={{
        currentUser: { id: 1, role: 'landlord' },
        organization: { id: 1, name: 'My Properties' }
      }}
    />
  )
}
```

### Custom Actions and Permissions

```tsx
const customUserConfig = {
  ...USER_CONFIG,
  actions: {
    ...USER_CONFIG.actions,
    customActions: [
      {
        key: 'reset_password',
        label: 'Reset Password',
        variant: 'secondary',
        position: 'dropdown',
        confirmMessage: 'Reset password for this user?',
        handler: async (user) => {
          // Implement password reset
          console.log('Resetting password for:', user.email)
        }
      }
    ]
  }
}

export function AdvancedUserManagement() {
  return <EntityManager config={customUserConfig} />
}
```

## API Integration

The EntityManager integrates with REST APIs following common patterns:

### Endpoints

- `GET /api/users/` - List users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Response Format

```json
{
  "results": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  ],
  "count": 1,
  "next": null,
  "previous": null
}
```

## Hooks and Callbacks

### Lifecycle Hooks

```tsx
const configWithHooks = {
  ...USER_CONFIG,
  hooks: {
    onBeforeCreate: (data) => {
      // Validate or modify data before creation
      return { ...data, created_by: currentUser.id }
    },
    onAfterCreate: (user) => {
      // Send welcome email, log activity, etc.
      console.log('User created:', user)
    },
    onBeforeUpdate: (data) => {
      // Add audit trail
      return { ...data, updated_at: new Date().toISOString() }
    },
    onAfterDelete: (userId) => {
      // Clean up related data
      console.log('User deleted:', userId)
    }
  }
}
```

## View Variants

### List View Variants

- **table**: Traditional table layout
- **card**: Card-based grid layout
- **list**: Simple list layout
- **grid**: Advanced grid with thumbnails
- **compact**: Minimal space usage

### Form View Variants

- **single-column**: All fields in one column
- **two-column**: Fields split into two columns
- **grid**: Custom grid layout

## Permissions

```tsx
const configWithPermissions = {
  ...USER_CONFIG,
  permissions: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'user'],
    update: ['admin', 'manager'],
    delete: ['admin'],
    export: ['admin', 'manager']
  }
}
```

## Related Entities

```tsx
const userConfigWithRelations = {
  ...USER_CONFIG,
  relations: [
    {
      name: 'tenant_profile',
      type: 'has_one',
      entityType: 'tenant_profile',
      foreignKey: 'user',
      displayField: 'home_address',
      endpoint: '/api/tenant-profiles/',
      showInDetail: true,
      editable: true
    },
    {
      name: 'properties',
      type: 'has_many',
      entityType: 'property',
      foreignKey: 'landlord',
      displayField: 'property_name',
      endpoint: '/api/properties/',
      showInList: false,
      showInDetail: true
    }
  ]
}
```

## Styling

The EntityManager uses CSS classes for styling:

```css
.entity-manager {
  /* Main container */
}

.entity-manager-header {
  /* Header with title and actions */
}

.entity-manager-content {
  /* Main content area */
}

.entity-manager-footer {
  /* Footer with status/info */
}
```

## TypeScript Support

The EntityManager is fully typed:

```tsx
// Define your entity type
interface CustomEntity extends BaseEntity {
  name: string
  description: string
  status: 'active' | 'inactive'
}

// Create config with proper typing
const config: EntityManagerConfig<CustomEntity> = {
  // ... configuration
}

// Component automatically infers types
<EntityManager config={config} />
```

## Migration from Existing Systems

### From EntityForm Variations

```tsx
// Old way
<EntityForm variation="userForm" />

// New way
<EntityManager config={USER_CONFIG} />
```

### From Custom CRUD Components

```tsx
// Old way - multiple components
<UserList onEdit={handleEdit} />
<UserForm mode={mode} onSubmit={handleSubmit} />
<UserView item={item} />

// New way - single orchestrator
<EntityManager config={USER_CONFIG} />
```

## Best Practices

1. **Configuration First**: Define your entity config completely before using
2. **Type Safety**: Use proper TypeScript interfaces for your entities
3. **Error Handling**: Implement proper error boundaries and loading states
4. **Performance**: Use pagination for large datasets
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
6. **Testing**: Test all CRUD operations and edge cases

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure your entity interface extends `BaseEntity`
2. **API Errors**: Check endpoint URLs and response formats
3. **Permission Errors**: Verify permission configurations
4. **Styling Issues**: Check CSS class overrides

### Debug Mode

Enable debug logging:

```tsx
<EntityManager
  config={config}
  onAction={(action, data) => console.log('Action:', action, data)}
/>
```

## Contributing

When adding new features:

1. Update types in `types/index.ts`
2. Add configuration options
3. Update examples
4. Add tests
5. Update documentation

## License

This EntityManager is part of the entity-manager project.</content>
<parameter name="filePath">d:\entity-manager\components\entityManager\EntityManager\README.md