# Unified Entity Manager

A comprehensive React component that provides a complete CRUD interface for managing entities. This component combines the best of MyLandlord's schema-driven architecture with EntityForm's variation-based approach.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete with full API integration
- **Multiple View Variants**: Table, Card, List, Grid, and Compact views
- **Advanced Search & Filtering**: Real-time search with multiple filter options
- **Sorting & Pagination**: Client-side and server-side sorting with configurable pagination
- **Bulk Operations**: Select multiple items for batch actions
- **Export/Import**: CSV, Excel, and JSON export capabilities
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Customizable**: Extensive configuration options for fields, layouts, and behaviors

## Installation

```bash
npm install @your-org/unified-entity-manager
```

## Quick Start

```tsx
import { UnifiedEntityManager } from './components/entityManager'

const userConfig = {
  name: 'user',
  namePlural: 'users',
  displayName: 'User',
  fields: [
    { name: 'firstName', label: 'First Name', type: 'string', required: true },
    { name: 'lastName', label: 'Last Name', type: 'string', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', required: true, options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' }
    ]}
  ],
  endpoints: {
    list: '/api/users',
    create: '/api/users',
    update: '/api/users',
    delete: '/api/users'
  },
  listView: {
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    variant: 'table'
  },
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true
  }
}

function App() {
  return (
    <UnifiedEntityManager config={userConfig} />
  )
}
```

## Configuration

### UnifiedEntityConfig

The main configuration object that defines the entity manager behavior.

```tsx
interface UnifiedEntityConfig<TEntity extends BaseEntity = BaseEntity> {
  // Entity identification
  name: string                    // Singular name (e.g., 'user')
  namePlural: string             // Plural name (e.g., 'users')
  displayName: string            // Display name (e.g., 'User')

  // Field definitions
  fields: UnifiedFieldConfig[]

  // API endpoints
  endpoints: ApiEndpoints

  // View configurations
  listView?: ListViewConfig
  formView?: FormConfig
  viewConfig?: ViewConfig

  // Permissions
  permissions?: PermissionsConfig

  // Export configuration
  exportConfig?: ExportConfig
}
```

### Field Configuration

```tsx
interface UnifiedFieldConfig {
  // Basic properties
  name: string
  label: string
  type: FieldDataType
  required?: boolean

  // UI customization
  placeholder?: string
  description?: string
  icon?: React.ComponentType

  // Layout
  gridSpan?: 'full' | 'half' | 'third'

  // List properties
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  exportable?: boolean

  // Custom rendering
  displayFormat?: (value: unknown) => string | React.ReactNode
  customRenderer?: (value: unknown, record?: Record<string, unknown>) => React.ReactNode
}
```

## API Integration

The entity manager expects RESTful API endpoints:

```tsx
const endpoints = {
  list: '/api/users',      // GET - List items with pagination/filtering
  create: '/api/users',    // POST - Create new item
  update: '/api/users',    // PUT/PATCH - Update existing item
  delete: '/api/users'     // DELETE - Delete item
}
```

### API Response Format

```tsx
// List endpoint response
{
  results: TEntity[],
  count: number,
  next: string | null,
  previous: string | null
}

// Single item response
{
  data: TEntity,
  success: boolean,
  message?: string
}
```

## View Variants

### Table View
Traditional tabular layout with sortable columns and inline actions.

```tsx
const config = {
  listView: {
    variant: 'table',
    enableSorting: true,
    enableSelection: true
  }
}
```

### Card View
Card-based layout ideal for content management and visual data.

```tsx
const config = {
  listView: {
    variant: 'card',
    pageSize: 12
  }
}
```

### List View
Compact list layout for mobile and simple data.

```tsx
const config = {
  listView: {
    variant: 'list',
    enableSearch: true
  }
}
```

## Integration with EntityForm

Convert existing EntityForm variations to UnifiedEntityManager configuration:

```tsx
import { createEntityManagerConfigFromVariation } from './entityManager'

const existingVariation = {
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true }
  ],
  layout: 'grid',
  columns: 2
}

const config = createEntityManagerConfigFromVariation(
  existingVariation,
  'Contact',
  {
    list: '/api/contacts',
    create: '/api/contacts',
    update: '/api/contacts',
    delete: '/api/contacts'
  }
)
```

## Advanced Features

### Custom Field Rendering

```tsx
const config: UnifiedEntityConfig = {
  fields: [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      customRenderer: (value, record) => (
        <span className={`badge ${value === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
          {value}
        </span>
      )
    }
  ]
}
```

### Custom Actions

```tsx
const config: UnifiedEntityConfig = {
  // Custom actions can be added to the actions menu
  customActions: [
    {
      name: 'activate',
      label: 'Activate',
      icon: 'CheckCircle',
      condition: (item) => !item.isActive,
      handler: async (item) => {
        // Custom activation logic
        await api.activateUser(item.id)
      }
    }
  ]
}
```

### Conditional Fields

```tsx
const config: UnifiedEntityConfig = {
  fields: [
    {
      name: 'userType',
      label: 'User Type',
      type: 'select',
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' }
      ]
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'string',
      condition: (formData) => formData.userType === 'business'
    }
  ]
}
```

## Permissions

Control what operations users can perform:

```tsx
const config: UnifiedEntityConfig = {
  permissions: {
    create: true,    // Can create new items
    read: true,      // Can view items
    update: true,    // Can edit items
    delete: false,   // Cannot delete items
    export: true     // Can export data
  }
}
```

## Styling

The component uses Tailwind CSS classes and can be customized via:

```tsx
<UnifiedEntityManager
  config={config}
  className="custom-entity-manager"
/>
```

## Events

Listen to component events:

```tsx
<UnifiedEntityManager
  config={config}
  onModeChange={(mode, item) => {
    console.log('Mode changed:', mode, item)
  }}
  onAction={(action, data) => {
    console.log('Action performed:', action, data)
  }}
/>
```

## TypeScript Support

Full TypeScript support with generic entity types:

```tsx
interface User extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
}

const config: UnifiedEntityConfig<User> = {
  // Configuration with full type safety
}

<UnifiedEntityManager<User> config={config} />
```

## Migration from MyLandlord

If migrating from MyLandlord's entity manager:

1. Update field configurations to use `UnifiedFieldConfig`
2. Convert API endpoints to the new format
3. Update view configurations to use the new structure
4. Replace custom hooks with the unified hooks system

## Migration from EntityForm

If migrating from EntityForm variations:

1. Use `createEntityManagerConfigFromVariation()` helper
2. Add API endpoints configuration
3. Configure list view settings
4. Set up permissions as needed

## Performance

- Lazy loading of form components
- Optimized re-renders with memoization
- Efficient pagination and filtering
- Background data fetching

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.