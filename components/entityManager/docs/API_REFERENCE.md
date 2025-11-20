# API Reference

Complete API reference for all components, hooks, types, and utilities in the Entity Manager system.

## Table of Contents

- [Components](#components)
  - [EntityManager](#entitymanager)
  - [EntityList](#entitylist)
  - [EntityForm](#entityform)
  - [EntityView](#entityview)
  - [EntityActions](#entityactions)
  - [EntityExporter](#entityexporter)
- [Builders](#builders)
  - [EntityConfigBuilder](#entityconfigbuilder)
  - [FieldBuilder](#fieldbuilder)
  - [ColumnBuilder](#columnbuilder)
  - [ActionBuilder](#actionbuilder)
- [Hooks](#hooks)
  - [State Management](#state-management-hooks)
  - [API Integration](#api-integration-hooks)
  - [Primitives](#primitive-hooks)
- [Providers](#providers)
  - [EntityStateProvider](#entitystateprovider)
  - [EntityApiProvider](#entityapiprovider)
- [Adapters](#adapters)
- [Types](#types)
- [Utilities](#utilities)

---

## Components

### EntityManager

Main orchestrator component that coordinates all entity operations.

```typescript
import { EntityManager } from '@/components/new/entityManager';

<EntityManager<T>
  config={entityConfig}
  context={context}
  className={className}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `EntityConfig<T>` | Yes | Complete entity configuration |
| `context` | `object` | No | Additional context (user, permissions, etc.) |
| `className` | `string` | No | Additional CSS classes |

**Generic Type Parameters:**

- `T` - The entity type

**Features:**
- Orchestrates list, form, view, and actions
- Manages internal state transitions
- Handles CRUD operations
- Coordinates with state and API providers

**Example:**

```typescript
const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .addColumn('name', 'Name')
  .addField('name', 'text', 'Name')
  .build();

<EntityManager 
  config={userConfig}
  context={{ user: currentUser, permissions: ['users:edit'] }}
/>
```

---

### EntityList

Displays entities in various view modes with search, filter, sort, and pagination.

```typescript
import { EntityList } from '@/components/new/entityManager';

<EntityList<T>
  data={entities}
  columns={columns}
  view={view}
  searchable={true}
  sortable={true}
  filterable={true}
  pagination={true}
  selectable={true}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | Yes | - | Array of entities to display |
| `columns` | `Column<T>[]` | Yes | - | Column definitions |
| `view` | `ViewMode` | No | `'table'` | Display mode |
| `searchable` | `boolean` | No | `false` | Enable search |
| `sortable` | `boolean` | No | `false` | Enable sorting |
| `filterable` | `boolean` | No | `false` | Enable filtering |
| `pagination` | `boolean \| PaginationConfig` | No | `false` | Enable pagination |
| `selectable` | `boolean` | No | `false` | Enable row selection |
| `multiSelect` | `boolean` | No | `false` | Allow multi-selection |
| `selectedIds` | `Set<string>` | No | - | Controlled selected IDs |
| `onSelectionChange` | `(ids: Set<string>) => void` | No | - | Selection change handler |
| `onRowClick` | `(entity: T) => void` | No | - | Row click handler |
| `emptyMessage` | `string` | No | - | Message when no data |
| `loading` | `boolean` | No | `false` | Show loading state |
| `className` | `string` | No | - | Additional CSS classes |

**View Modes:**

- `'table'` - Traditional data table
- `'card'` - Card grid layout
- `'list'` - Compact list view
- `'grid'` - Responsive grid
- `'compact'` - Dense table
- `'timeline'` - Timeline view
- `'detailed'` - Expanded details
- `'gallery'` - Image-focused gallery

**Column Definition:**

```typescript
interface Column<T> {
  key: keyof T | string;
  label: string;
  type?: FieldType;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: Array<{ label: string; value: any }>;
  render?: (value: any, entity: T) => ReactNode;
  format?: (value: any) => string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
```

See [EntityList.md](./EntityList.md) for detailed documentation.

---

### EntityForm

Renders a form with validation for creating or editing entities.

```typescript
import { EntityForm } from '@/components/new/entityManager';

<EntityForm<T>
  fields={fields}
  initialData={entity}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  layout={layout}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `Field[]` | Yes | - | Form field definitions |
| `initialData` | `Partial<T>` | No | `{}` | Initial form values |
| `onSubmit` | `(data: Partial<T>) => Promise<void> \| void` | Yes | - | Submit handler |
| `onCancel` | `() => void` | No | - | Cancel handler |
| `onChange` | `(data: Partial<T>) => void` | No | - | Change handler |
| `layout` | `FormLayout` | No | `'vertical'` | Form layout |
| `submitLabel` | `string` | No | `'Save'` | Submit button text |
| `cancelLabel` | `string` | No | `'Cancel'` | Cancel button text |
| `loading` | `boolean` | No | `false` | Show loading state |
| `disabled` | `boolean` | No | `false` | Disable all fields |
| `validateOnChange` | `boolean` | No | `false` | Validate on change |
| `validateOnBlur` | `boolean` | No | `true` | Validate on blur |
| `showDirtyIndicator` | `boolean` | No | `false` | Show unsaved changes |
| `autoSave` | `boolean \| AutoSaveConfig` | No | `false` | Enable auto-save |
| `className` | `string` | No | - | Additional CSS classes |

**Form Layouts:**

- `'vertical'` - Stacked fields
- `'horizontal'` - Label beside field
- `'grid'` - Responsive grid
- `'tabs'` - Grouped in tabs
- `'wizard'` - Multi-step wizard

**Field Types:**

`text`, `email`, `password`, `number`, `date`, `time`, `datetime`, `select`, `multiselect`, `checkbox`, `radio`, `switch`, `textarea`, `richtext`, `file`, `image`, `color`, `range`, `url`, `tel`, `json`

**Field Definition:**

```typescript
interface Field {
  key: string;
  type: FieldType;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  validation?: ValidationRule[];
  options?: Array<{ label: string; value: any }>;
  dependsOn?: string;
  showWhen?: (formData: any) => boolean;
  rows?: number; // textarea
  accept?: string; // file/image
  maxSize?: number; // file/image
  multiple?: boolean; // file/select
  min?: number; // number/range
  max?: number; // number/range
  step?: number; // number/range
  className?: string;
}
```

See [EntityForm.md](./EntityForm.md) for detailed documentation.

---

### EntityView

Displays entity details in various view modes.

```typescript
import { EntityView } from '@/components/new/entityManager';

<EntityView<T>
  data={entity}
  fields={fields}
  view={view}
  showMetadata={true}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T` | Yes | - | Entity data to display |
| `fields` | `Field[]` | Yes | - | Field definitions |
| `view` | `ViewMode` | No | `'detail'` | Display mode |
| `showMetadata` | `boolean` | No | `false` | Show metadata (created, updated) |
| `metadata` | `Metadata` | No | - | Metadata values |
| `groups` | `FieldGroup[]` | No | - | Group fields |
| `tabs` | `Tab[]` | No | - | Organize in tabs |
| `actions` | `Action<T>[]` | No | - | Inline actions |
| `className` | `string` | No | - | Additional CSS classes |

**View Modes:**

- `'detail'` - Full details view
- `'card'` - Card format
- `'summary'` - Key fields only
- `'timeline'` - Timeline format

See [EntityView.md](./EntityView.md) for detailed documentation.

---

### EntityActions

Renders action buttons with various types (immediate, confirm, form, modal).

```typescript
import { EntityActions } from '@/components/new/entityManager';

<EntityActions<T>
  entity={entity}
  actions={actions}
  layout={layout}
  size={size}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entity` | `T` | Yes | - | Entity to act on |
| `actions` | `Action<T>[]` | Yes | - | Action definitions |
| `context` | `object` | No | - | Additional context |
| `layout` | `'horizontal' \| 'vertical' \| 'dropdown'` | No | `'horizontal'` | Layout mode |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Button size |
| `align` | `'left' \| 'center' \| 'right'` | No | `'right'` | Alignment |
| `grouped` | `boolean` | No | `false` | Group related actions |
| `className` | `string` | No | - | Additional CSS classes |

**Action Types:**

- `'immediate'` - Execute immediately
- `'confirm'` - Show confirmation dialog
- `'form'` - Show form dialog
- `'modal'` - Open custom modal
- `'navigation'` - Navigate to URL
- `'bulk'` - Bulk operation
- `'download'` - Download file
- `'custom'` - Custom renderer

**Action Definition:**

```typescript
interface Action<T> {
  key: string;
  label: string;
  type: ActionType;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  visible?: (entity: T, context?: any) => boolean;
  disabled?: (entity: T, context?: any) => boolean;
  onClick: (entity: T, formData?: any) => Promise<void> | void;
  confirm?: ConfirmConfig;
  form?: FormConfig;
  modal?: ModalConfig;
  className?: string;
}
```

See [EntityActions.md](./EntityActions.md) for detailed documentation.

---

### EntityExporter

Exports entity data to various formats (CSV, JSON, XLSX).

```typescript
import { EntityExporter } from '@/components/new/entityManager';

<EntityExporter<T>
  data={entities}
  fields={fields}
  formats={['csv', 'xlsx', 'json']}
  filename="export"
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | Yes | - | Data to export |
| `fields` | `ExportField[]` | Yes | - | Field definitions |
| `formats` | `ExportFormat[]` | No | `['csv']` | Available formats |
| `filename` | `string` | No | `'export'` | Base filename |
| `fieldSelection` | `boolean` | No | `false` | Allow field selection |
| `layout` | `'single' \| 'separate' \| 'dropdown'` | No | `'dropdown'` | Button layout |
| `buttonLabel` | `string` | No | `'Export'` | Button text |
| `onExportStart` | `() => void` | No | - | Export start handler |
| `onExportComplete` | `(format: string) => void` | No | - | Export complete handler |
| `className` | `string` | No | - | Additional CSS classes |

**Export Formats:**

- `'csv'` - Comma-separated values
- `'json'` - JSON format
- `'xlsx'` - Excel spreadsheet

See [EntityExporter.md](./EntityExporter.md) for detailed documentation.

---

## Builders

### EntityConfigBuilder

Fluent API for building entity configurations.

```typescript
import { EntityConfigBuilder } from '@/components/new/entityManager';

const config = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .setIcon('user')
  .setDescription('User management')
  .addColumn('name', 'Name', { sortable: true })
  .addField('name', 'text', 'Name', { required: true })
  .addAction('edit', 'Edit', 'immediate', { onClick: handleEdit })
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25 })
  .setPermissions({ create: ['admin'], delete: ['admin'] })
  .build();
```

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setLabel` | `(singular: string, plural?: string)` | `this` | Set entity labels |
| `setIcon` | `(icon: string)` | `this` | Set entity icon |
| `setDescription` | `(description: string)` | `this` | Set description |
| `addColumn` | `(key, label, options?)` | `this` | Add list column |
| `addColumns` | `(columns: Column[])` | `this` | Add multiple columns |
| `addField` | `(key, type, label, options?)` | `this` | Add form field |
| `addFields` | `(fields: Field[])` | `this` | Add multiple fields |
| `addAction` | `(key, label, type, options)` | `this` | Add action |
| `addActions` | `(actions: Action[])` | `this` | Add multiple actions |
| `enableSearch` | `(options?)` | `this` | Enable search |
| `enableFilters` | `(options?)` | `this` | Enable filters |
| `enableSort` | `(options?)` | `this` | Enable sorting |
| `enablePagination` | `(options?)` | `this` | Enable pagination |
| `enableSelection` | `(options?)` | `this` | Enable selection |
| `enableExport` | `(formats?)` | `this` | Enable export |
| `setPermissions` | `(permissions)` | `this` | Set permissions |
| `setDefaultView` | `(view: ViewMode)` | `this` | Set default view |
| `build` | `()` | `EntityConfig<T>` | Build final config |

See [Builders.md](./Builders.md) for detailed documentation.

---

### FieldBuilder

Builder for individual form fields.

```typescript
import { FieldBuilder } from '@/components/new/entityManager';

const field = new FieldBuilder<User>('email')
  .setType('email')
  .setLabel('Email Address')
  .setRequired(true)
  .setPlaceholder('user@example.com')
  .addValidation({ type: 'email', message: 'Invalid email' })
  .addValidation({ type: 'required', message: 'Email is required' })
  .build();
```

**Methods:**

| Method | Parameters | Returns |
|--------|------------|---------|
| `setType` | `(type: FieldType)` | `this` |
| `setLabel` | `(label: string)` | `this` |
| `setRequired` | `(required: boolean)` | `this` |
| `setDisabled` | `(disabled: boolean)` | `this` |
| `setReadonly` | `(readonly: boolean)` | `this` |
| `setPlaceholder` | `(placeholder: string)` | `this` |
| `setDescription` | `(description: string)` | `this` |
| `setDefaultValue` | `(value: any)` | `this` |
| `addValidation` | `(rule: ValidationRule)` | `this` |
| `setOptions` | `(options: Option[])` | `this` |
| `showWhen` | `(condition: (data) => boolean)` | `this` |
| `build` | `()` | `Field` |

---

### ColumnBuilder

Builder for list columns.

```typescript
import { ColumnBuilder } from '@/components/new/entityManager';

const column = new ColumnBuilder<User>('name')
  .setLabel('Full Name')
  .setType('text')
  .setSortable(true)
  .setWidth(200)
  .setRender((value, user) => <strong>{value}</strong>)
  .build();
```

**Methods:**

| Method | Parameters | Returns |
|--------|------------|---------|
| `setLabel` | `(label: string)` | `this` |
| `setType` | `(type: FieldType)` | `this` |
| `setWidth` | `(width: number \| string)` | `this` |
| `setSortable` | `(sortable: boolean)` | `this` |
| `setFilterable` | `(filterable: boolean)` | `this` |
| `setFilterType` | `(type: FilterType)` | `this` |
| `setFilterOptions` | `(options: Option[])` | `this` |
| `setRender` | `(render: (value, entity) => ReactNode)` | `this` |
| `setFormat` | `(format: (value) => string)` | `this` |
| `setAlign` | `(align: 'left' \| 'center' \| 'right')` | `this` |
| `build` | `()` | `Column<T>` |

---

### ActionBuilder

Builder for actions.

```typescript
import { ActionBuilder } from '@/components/new/entityManager';

const action = new ActionBuilder<User>('delete')
  .setLabel('Delete User')
  .setType('confirm')
  .setIcon('trash')
  .setVariant('danger')
  .setConfirm({
    title: 'Delete User',
    message: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    confirmVariant: 'danger'
  })
  .setVisible((user) => user.status !== 'active')
  .setOnClick(async (user) => {
    await deleteUser(user.id);
  })
  .build();
```

**Methods:**

| Method | Parameters | Returns |
|--------|------------|---------|
| `setLabel` | `(label: string)` | `this` |
| `setType` | `(type: ActionType)` | `this` |
| `setIcon` | `(icon: string)` | `this` |
| `setVariant` | `(variant: Variant)` | `this` |
| `setVisible` | `(fn: (entity, context) => boolean)` | `this` |
| `setDisabled` | `(fn: (entity, context) => boolean)` | `this` |
| `setOnClick` | `(fn: (entity, data?) => Promise<void>)` | `this` |
| `setConfirm` | `(config: ConfirmConfig)` | `this` |
| `setForm` | `(config: FormConfig)` | `this` |
| `setModal` | `(config: ModalConfig)` | `this` |
| `build` | `()` | `Action<T>` |

---

## Hooks

### State Management Hooks

#### useEntityState

Main state management hook for entity CRUD operations.

```typescript
import { useEntityState } from '@/components/new/entityManager';

const {
  entities,
  loading,
  error,
  create,
  update,
  delete: deleteEntity,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  setFilter,
  setSort,
  setPagination
} = useEntityState<User>('users');
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `entities` | `T[]` | Array of entities |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error if any |
| `create` | `(data: Partial<T>) => Promise<T>` | Create entity |
| `update` | `(id: string, data: Partial<T>) => Promise<T>` | Update entity |
| `delete` | `(id: string) => Promise<void>` | Delete entity |
| `bulkCreate` | `(data: Partial<T>[]) => Promise<T[]>` | Bulk create |
| `bulkUpdate` | `(updates: Array<{id, data}>) => Promise<T[]>` | Bulk update |
| `bulkDelete` | `(ids: string[]) => Promise<void>` | Bulk delete |
| `setFilter` | `(filter: any) => void` | Set filters |
| `setSort` | `(sort: any) => void` | Set sorting |
| `setPagination` | `(page: number, pageSize: number) => void` | Set pagination |

See [StateManagement.md](./StateManagement.md) for detailed documentation.

---

#### useEntityCache

Advanced caching hook with TTL and invalidation.

```typescript
import { useEntityCache } from '@/components/new/entityManager';

const {
  data,
  loading,
  error,
  refetch,
  invalidate,
  prefetch
} = useEntityCache<User[]>(
  'users',
  fetchUsers,
  {
    ttl: 5 * 60 * 1000,
    staleWhileRevalidate: true,
    storage: 'memory'
  }
);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Cache key |
| `fetcher` | `() => Promise<T>` | Yes | Data fetcher function |
| `options` | `CacheOptions` | No | Cache configuration |

**Options:**

```typescript
interface CacheOptions {
  ttl?: number; // Time to live in ms
  staleWhileRevalidate?: boolean; // Return stale data while fetching
  storage?: 'memory' | 'session' | 'local'; // Storage type
  onError?: (error: Error) => void; // Error handler
}
```

---

### API Integration Hooks

#### useEntityApi

Hook for entity CRUD operations with API.

```typescript
import { useEntityApi } from '@/components/new/entityManager';

const {
  list,
  get,
  create,
  update,
  delete: deleteEntity,
  custom
} = useEntityApi<User>('users');

// Use the methods
const users = await list({ page: 1, search: 'john' });
const user = await get('123');
const newUser = await create({ name: 'John', email: 'john@example.com' });
await update('123', { name: 'Jane' });
await deleteEntity('123');
const result = await custom('activate', '123', { method: 'POST' });
```

See [APIIntegration.md](./APIIntegration.md) for detailed documentation.

---

#### useEntityMutations

Hook for mutations with optimistic updates and cache invalidation.

```typescript
import { useEntityMutations } from '@/components/new/entityManager';

const {
  create,
  update,
  delete: deleteEntity,
  loading,
  error
} = useEntityMutations<User>('users', {
  optimistic: true,
  invalidateCache: true,
  invalidateKeys: ['users', 'user-stats'],
  onSuccess: () => toast.success('Saved!'),
  onError: (type, error) => toast.error(`Failed: ${error.message}`)
});
```

---

### Primitive Hooks

#### useFilters

Manage filter state and operations.

```typescript
import { useFilters } from '@/components/new/entityManager/primitives';

const {
  filters,
  activeFilters,
  setFilter,
  removeFilter,
  clearFilters,
  applyFilters
} = useFilters<User>();

setFilter('role', 'admin');
setFilter('status', 'active');
const filtered = applyFilters(users);
```

---

#### usePagination

Manage pagination state.

```typescript
import { usePagination } from '@/components/new/entityManager/primitives';

const {
  page,
  pageSize,
  totalPages,
  setPage,
  setPageSize,
  nextPage,
  prevPage,
  goToPage,
  paginatedData
} = usePagination(users, { pageSize: 25 });
```

---

#### useSelection

Manage row selection.

```typescript
import { useSelection } from '@/components/new/entityManager/primitives';

const {
  selectedIds,
  selectedEntities,
  isSelected,
  isAllSelected,
  toggle,
  toggleAll,
  select,
  deselect,
  clear
} = useSelection<User>(users);
```

---

#### useSort

Manage sorting state and operations.

```typescript
import { useSort } from '@/components/new/entityManager/primitives';

const {
  sortField,
  sortOrder,
  setSort,
  toggleSort,
  sortedData
} = useSort<User>(users, { field: 'name', order: 'asc' });
```

---

#### useValidation

Form validation hook.

```typescript
import { useValidation } from '@/components/new/entityManager/primitives';

const {
  errors,
  validate,
  validateField,
  clearErrors,
  hasErrors
} = useValidation<User>(fields);

const isValid = await validate(formData);
const fieldValid = await validateField('email', 'user@example.com');
```

---

## Providers

### EntityStateProvider

Global state provider for entities.

```typescript
import { EntityStateProvider } from '@/components/new/entityManager';

<EntityStateProvider
  initialState={{
    users: { entities: [], loading: false },
    posts: { entities: [], loading: false }
  }}
>
  <App />
</EntityStateProvider>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `initialState` | `object` | No | Initial state for entities |
| `children` | `ReactNode` | Yes | Child components |

---

### EntityApiProvider

API configuration provider.

```typescript
import { EntityApiProvider } from '@/components/new/entityManager';
import axios from 'axios';

const apiConfig = {
  client: axios.create({ baseURL: '/api' }),
  entities: {
    users: {
      base: '/users',
      list: '/users',
      get: '/users/:id',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id',
      custom: {
        activate: { method: 'POST', path: '/users/:id/activate' }
      }
    }
  }
};

<EntityApiProvider config={apiConfig}>
  <App />
</EntityApiProvider>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ApiConfig` | Yes | API configuration |
| `children` | `ReactNode` | Yes | Child components |

---

## Adapters

### JSONSchemaAdapter

Generate entity config from JSON Schema.

```typescript
import { JSONSchemaAdapter } from '@/components/new/entityManager';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 0, maximum: 150 }
  },
  required: ['name', 'email']
};

const adapter = new JSONSchemaAdapter();
const config = adapter.fromSchema<User>(schema, 'user');
```

---

### OpenAPIAdapter

Generate entity config from OpenAPI specification.

```typescript
import { OpenAPIAdapter } from '@/components/new/entityManager';

const openApiSpec = {
  // OpenAPI 3.0 spec
};

const adapter = new OpenAPIAdapter();
const config = adapter.fromOpenAPI<User>(openApiSpec, 'User', '/users');
```

---

### TypeScriptAdapter

Generate entity config from TypeScript types.

```typescript
import { TypeScriptAdapter } from '@/components/new/entityManager';

interface User {
  name: string;
  email: string;
  age?: number;
}

const adapter = new TypeScriptAdapter();
const config = adapter.fromType<User>('user');
```

---

### DatabaseAdapter

Generate entity config from database schema.

```typescript
import { DatabaseAdapter } from '@/components/new/entityManager';

const dbSchema = {
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true },
    { name: 'name', type: 'VARCHAR(255)', nullable: false },
    { name: 'email', type: 'VARCHAR(255)', nullable: false, unique: true }
  ]
};

const adapter = new DatabaseAdapter();
const config = adapter.fromSchema<User>(dbSchema, 'user');
```

See [Adapters.md](./Adapters.md) for detailed documentation.

---

## Types

### Core Types

```typescript
// Entity configuration
interface EntityConfig<T> {
  entityName: string;
  label: string;
  labelPlural: string;
  icon?: string;
  description?: string;
  columns: Column<T>[];
  formFields: Field[];
  viewFields?: Field[];
  actions: Action<T>[];
  permissions?: Permissions;
  features?: Features;
}

// Field types
type FieldType = 
  | 'text' | 'email' | 'password' | 'number' 
  | 'date' | 'time' | 'datetime'
  | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'switch'
  | 'textarea' | 'richtext' | 'file' | 'image'
  | 'color' | 'range' | 'url' | 'tel' | 'json';

// Action types
type ActionType = 
  | 'immediate' | 'confirm' | 'form' | 'modal'
  | 'navigation' | 'bulk' | 'download' | 'custom';

// View modes
type ViewMode = 
  | 'table' | 'card' | 'list' | 'grid'
  | 'compact' | 'timeline' | 'detailed' | 'gallery';

// Validation rule types
type ValidationRuleType =
  | 'required' | 'email' | 'url' | 'min' | 'max'
  | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'async';
```

---

## Utilities

### Validation Utilities

```typescript
import { 
  validateEmail,
  validateURL,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateRange
} from '@/components/new/entityManager/primitives/utils';

const isValid = validateEmail('user@example.com'); // true
const isValidURL = validateURL('https://example.com'); // true
```

---

### Formatting Utilities

```typescript
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPhoneNumber
} from '@/components/new/entityManager/primitives/utils';

const formatted = formatDate(new Date()); // "Jan 15, 2025"
const price = formatCurrency(1234.56); // "$1,234.56"
```

---

### Array Utilities

```typescript
import {
  sortBy,
  filterBy,
  groupBy,
  uniqueBy,
  paginate
} from '@/components/new/entityManager/primitives/utils';

const sorted = sortBy(users, 'name', 'asc');
const filtered = filterBy(users, { role: 'admin' });
const grouped = groupBy(users, 'department');
const unique = uniqueBy(users, 'email');
const page = paginate(users, 1, 25);
```

---

### Object Utilities

```typescript
import {
  pick,
  omit,
  deepClone,
  deepMerge,
  getNestedValue,
  setNestedValue
} from '@/components/new/entityManager/primitives/utils';

const subset = pick(user, ['name', 'email']);
const without = omit(user, ['password']);
const clone = deepClone(user);
const merged = deepMerge(user, updates);
const value = getNestedValue(user, 'address.city');
setNestedValue(user, 'address.city', 'New York');
```

---

## See Also

- [Getting Started](./GettingStarted.md) - Quick start guide
- [Best Practices](./BestPractices.md) - Guidelines and patterns
- [Examples](../examples/) - Working examples
- [Migration Guide](./Migration.md) - Upgrade guide
