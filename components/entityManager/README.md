# Entity Manager

A complete, modular entity management system built with a clean 5-layer architecture. Zero circular dependencies, 100% tree-shakeable, fully standalone components.

## 🏗️ Architecture

### Layer 1: Primitives (Zero Dependencies)
**17 files, ~2,723 lines**

Foundation layer with no dependencies:
- **Types**: Core interfaces (BaseEntity, FilterConfig, SortConfig, PaginationConfig)
- **Hooks**: Reusable hooks (useFilters, usePagination, useSelection, useSort, useValidation)
- **Utils**: Pure utility functions (validation, formatting, array, object operations)

### Layer 2: Components (Standalone)
**21 files, ~5,150 lines**

Five independent UI components, each works standalone:

#### EntityList
- **8 view modes**: table, card, list, grid, compact, timeline, detailed, gallery
- **Features**: Search, filter, sort, pagination, bulk selection, row actions
- **~850 lines**: Comprehensive list management

#### EntityForm
- **21 field types**: text, number, email, password, url, tel, textarea, select, multiselect, radio, checkbox, switch, date, datetime, time, file, image, color, range, json, relation, custom
- **5 layouts**: vertical, horizontal, grid, tabs, wizard
- **Validation**: 10 rule types (required, email, url, minLength, maxLength, min, max, pattern, custom, async)
- **~1,400 lines**: Complete form solution

#### EntityView
- **4 view modes**: detail, card, summary, timeline
- **Features**: Field grouping, tabs, metadata, copy-to-clipboard
- **~1,000 lines**: Flexible entity display

#### EntityActions
- **8 action types**: immediate, confirm, form, modal, navigation, bulk, download, custom
- **Features**: Modal system, form validation, bulk operations
- **~1,100 lines**: Comprehensive action handling

#### EntityExporter
- **3 formats**: CSV, JSON, XLSX
- **Features**: Field selection, custom formatters, download
- **~800 lines**: Multi-format export

### Layer 3: Composition (Integration)
**13 files, ~2,350 lines**

Integration and configuration layer:

#### Configuration Builders
- **EntityConfigBuilder**: Fluent API for complete entity configuration
- **FieldBuilder**: Build form/view fields with validation
- **ColumnBuilder**: Build list columns with sorting/filtering
- **ActionBuilder**: Build actions with 8 types
- **Adapters**: JSON Schema, OpenAPI, TypeScript, Database schema

#### State Management
- **EntityStateProvider**: Centralized state with reducer pattern
- **useEntityState**: CRUD, selection, pagination, filters, sort, search
- **useEntityCache**: TTL-based caching (memory, localStorage, sessionStorage)

#### API Integration
- **EntityApiProvider**: Context provider for API client
- **useEntityApi**: Data fetching (list, get, refresh)
- **useEntityMutations**: Mutations (create, update, delete, bulk operations)

### Layer 5: Orchestration (Coordinator)
**2 files, ~200 lines**

Thin orchestrator that coordinates components:
- **EntityManager**: Main orchestrator component (~150 lines)
- All logic delegated to hooks and components
- Supports custom layouts via children prop

## 🚀 Quick Start

### Basic Usage

```typescript
import { EntityManager, EntityConfigBuilder } from '@/components/new/entityManager';

// Define your entity type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Build configuration
const config = EntityConfigBuilder.build<User>('User', (builder) => {
  builder
    .pluralName('Users')
    .description('User management')
    
    // Add columns
    .column('name', 'Name', col => col.text().sortable())
    .column('email', 'Email', col => col.text().sortable())
    .column('role', 'Role', col => col.text().filterable())
    .column('createdAt', 'Created', col => col.date().sortable())
    
    // Add form fields
    .field('name', 'Name', f => f.type('text').required())
    .field('email', 'Email', f => f.type('email').required().email())
    .field('role', 'Role', f => f.type('select').options([
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]))
    
    // Add actions
    .action('create', 'Create User', a => a.variant('primary').position('toolbar'))
    .action('edit', 'Edit', a => a.variant('secondary').position('row'))
    .action('delete', 'Delete', a => a.variant('danger').position('row'))
    
    // Auto-generate view and export fields from columns
    .autoViewFields()
    .autoExportFields()
    
    // Set defaults
    .defaultSort('createdAt', 'desc')
    .defaultPageSize(25);
});

// Use the entity manager
function UsersPage() {
  return (
    <EntityManager
      config={{
        config,
        initialData: users
      }}
    />
  );
}
```

### With API Integration

```typescript
import { EntityManager, ApiClient } from '@/components/entityManager';

// Create API client
const userApiClient: ApiClient<User> = {
  list: async (params) => {
    const response = await fetch('/api/users?' + new URLSearchParams(params));
    const data = await response.json();
    return { data };
  },
  
  get: async (id) => {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { data };
  },
  
  create: async (data) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { data: result };
  },
  
  update: async (id, data) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { data: result };
  },
  
  delete: async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    return { data: undefined };
  }
};

// Use with API
function UsersPage() {
  return (
    <EntityManager
      config={{
        config,
        apiClient: userApiClient
      }}
    />
  );
}
```

### Using Individual Components

Components work standalone without the orchestrator:

```typescript
import { EntityList, EntityForm, EntityView } from '@/components/new/entityManager';

// Use EntityList standalone
function UsersList() {
  return (
    <EntityList
      data={users}
      columns={columns}
      view="table"
      selectable
      pagination
      sortable
      searchable
    />
  );
}

// Use EntityForm standalone
function UserForm() {
  return (
    <EntityForm
      fields={fields}
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

// Use EntityView standalone
function UserDetail() {
  return (
    <EntityView
      entity={user}
      fields={viewFields}
      mode="detail"
    />
  );
}
```

## 📦 Features

### ✅ Implemented (Phases 1-3, 5)
- Zero circular dependencies
- 100% tree-shakeable
- Fully typed with TypeScript
- Standalone components
- Fluent builder API
- State management with caching
- API integration
- Schema adapters (JSON Schema, OpenAPI, TypeScript, Database)
- Thin orchestrator

### 🔄 Planned (Phases 4, 6-7)
- Offline mode
- Realtime updates
- Optimistic UI
- Collaborative editing
- Comprehensive documentation
- Example pages
- Test coverage (90%+ target)

## 🎯 Design Principles

1. **Zero Circular Dependencies**: Clean layer separation
2. **Component Independence**: Each component works standalone
3. **Tree-Shakeable**: Import only what you use
4. **Thin Orchestrator**: ~150 lines, logic delegated to hooks
5. **Type Safety**: Strict TypeScript throughout
6. **Pure Functions**: All utilities are pure
7. **Flexibility**: Use orchestrator or individual components

## 📊 Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Files | 53 | ✅ |
| Total Lines | ~10,423 | ✅ |
| Circular Dependencies | 0 | ✅ |
| Component Independence | 100% | ✅ |
| Type Safety | Strict | ✅ |
| Orchestrator Size | ~150 lines | ✅ |

## 🔧 Configuration

### Builders

```typescript
// Entity config builder
const config = EntityConfigBuilder.create<User>('User')
  .pluralName('Users')
  .column('name', 'Name')
  .field('name', 'Name')
  .action('create', 'Create')
  .build();

// Field builder
const field = FieldBuilder.create('email', 'Email')
  .type('email')
  .required()
  .email()
  .build();

// Column builder
const column = ColumnBuilder.create<User>('name', 'Name')
  .sortable()
  .filterable()
  .width(200)
  .build();

// Action builder
const action = ActionBuilder.confirm('delete', 'Delete', 'Are you sure?')
  .variant('danger')
  .position('row')
  .build();
```

### Adapters

```typescript
import { JsonSchemaAdapter, AdapterFactory } from '@/components/new/entityManager';

// Convert JSON Schema to entity config
const adapter = new JsonSchemaAdapter();
const config = adapter.adapt(jsonSchema);

// Auto-detect schema type
const config = AdapterFactory.adapt(unknownSchema);
```

## 📁 Directory Structure

```
entityManager/
├── primitives/          # Layer 1: Zero dependencies
│   ├── types/
│   ├── hooks/
│   └── utils/
├── components/          # Layer 2: Standalone UI
│   ├── list/
│   ├── form/
│   ├── view/
│   ├── actions/
│   └── exporter/
├── composition/         # Layer 3: Integration
│   ├── config/          # Builders & adapters
│   ├── state/           # State management
│   └── api/             # API integration
└── orchestrator/        # Layer 5: Coordinator
    ├── EntityManager.tsx
    └── types.ts
```

## 🤝 Contributing

This is a modular architecture designed for extensibility. Follow these principles:

1. Maintain layer separation (no upward dependencies)
2. Keep components standalone
3. Use pure functions in utilities
4. Add comprehensive TypeScript types
5. Keep orchestrator thin (~150 lines max)

## 📄 License

MIT
