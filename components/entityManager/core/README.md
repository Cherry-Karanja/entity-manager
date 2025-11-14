# Unified Entity Manager - Developer Guide

## Overview

The Unified Entity Manager provides a streamlined, type-safe approach to managing entities in your application. Instead of maintaining separate configuration files for lists, forms, views, and actions, you define everything in a single, cohesive configuration.

## Key Benefits

- **Single Source of Truth**: Define fields once, use everywhere
- **Reduced Redundancy**: No more duplicating field definitions across files
- **Better Type Safety**: Full TypeScript support with IntelliSense
- **Easier Maintenance**: Update one place to affect all views
- **Intelligent Defaults**: Smart defaults reduce boilerplate
- **Fluent API**: Builder pattern for clean, readable configurations

## Quick Start

### Basic Example

```typescript
import { createEntityConfig, commonFields, commonActions } from '@/components/entityManager/core'
import { User, UserFormData } from './types'

const userConfig = createEntityConfig<User, UserFormData>('User', 'Users')
  .displayName('User Management')
  .endpoints({
    list: '/api/v1/accounts/users/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  })
  .permissions({
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true
  })
  .build()

// Add fields using the fluent API
userConfig.fields = [
  commonFields.id().build(),
  commonFields.email().build(),
  commonFields.name('first_name', 'First Name').build(),
  commonFields.name('last_name', 'Last Name').build(),
  commonFields.isActive().build(),
  commonFields.createdAt().build()
]

// Add actions
userConfig.actions = [
  commonActions.view().build(),
  commonActions.edit().build(),
  commonActions.delete().build()
]
```

### Using the Configuration

```typescript
import { EntityManager } from '@/components/entityManager/manager'
import { userConfig } from './config'

export default function UsersPage() {
  return <EntityManager config={userConfig} />
}
```

## Field Configuration

### Basic Field Definition

```typescript
import { createField } from '@/components/entityManager/core'

const emailField = createField('email', 'Email Address', 'email')
  .required()
  .placeholder('user@example.com')
  .validate((value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
      return 'Please enter a valid email'
    }
    return true
  })
  .build()
```

### Field Properties

#### Core Properties
- `key`: Unique identifier (matches entity property)
- `label`: Display label
- `type`: Data type (string, number, email, date, etc.)
- `required`: Whether field is required
- `disabled`: Whether field is disabled
- `readOnly`: Whether field is read-only
- `hidden`: Whether field is hidden

#### Validation
- `min/max`: Min/max values for numbers
- `minLength/maxLength`: String length constraints
- `pattern`: Regex validation pattern
- `validate`: Custom validation function

#### UI Configuration
- `placeholder`: Placeholder text
- `description`: Help text
- `defaultValue`: Default value
- `gridSpan`: Column span (full, half, third, quarter)
- `icon`: Icon component

#### List Configuration
- `sortable`: Enable sorting
- `filterable`: Enable filtering
- `width`: Column width
- `align`: Text alignment (left, center, right)
- `renderCell`: Custom cell renderer

#### View Configuration
- `copyable`: Enable copy button
- `sensitive`: Mask sensitive data
- `badge`: Display as badge
- `renderView`: Custom view renderer

#### Form Configuration
- `renderForm`: Custom form renderer
- `condition`: Conditional display function
- `transformInput`: Transform before save
- `transformOutput`: Transform for display

### Relationship Fields

```typescript
const roleField = createField('role_id', 'Role', 'select')
  .required()
  .relationship({
    entity: 'user-role',
    displayField: 'display_name',
    endpoint: '/api/v1/accounts/user-roles/',
    search: {
      enabled: true,
      fields: ['name', 'display_name'],
      minLength: 2,
      debounceMs: 300
    }
  })
  .build()
```

### Select Fields

```typescript
const statusField = createField('status', 'Status', 'select')
  .required()
  .options([
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ])
  .badge()
  .build()
```

### Custom Renderers

```typescript
const avatarField = createField('avatar_url', 'Avatar', 'image')
  .renderCell((value, entity) => (
    <img 
      src={value as string} 
      alt={entity.name} 
      className="w-10 h-10 rounded-full"
    />
  ))
  .renderView((value) => (
    <img 
      src={value as string} 
      className="w-24 h-24 rounded-full"
    />
  ))
  .build()
```

## Action Configuration

### Basic Actions

```typescript
import { createAction } from '@/components/entityManager/core'

const viewAction = createAction('view', 'View Details')
  .type('navigation')
  .context('item')
  .variant('outline')
  .href((entity) => `/users/${entity.id}`)
  .build()

const editAction = createAction('edit', 'Edit')
  .type('navigation')
  .context('item', 'view')
  .variant('default')
  .permission('user.edit')
  .build()
```

### Confirmation Actions

```typescript
const deleteAction = createAction('delete', 'Delete')
  .type('confirm')
  .context('item', 'view')
  .variant('destructive')
  .danger()
  .confirm({
    title: 'Delete User',
    content: (entity) => `Are you sure you want to delete ${entity.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    okType: 'danger'
  })
  .onExecute(async (entity) => {
    await deleteUser(entity.id)
  })
  .build()
```

### Bulk Actions

```typescript
const bulkDeleteAction = createAction('bulkDelete', 'Delete Selected')
  .type('confirm')
  .context('bulk')
  .variant('destructive')
  .confirm({
    title: (entities) => `Delete ${entities.length} Users`,
    content: 'This action cannot be undone.',
    okType: 'danger'
  })
  .onExecute(async (entities) => {
    await Promise.all(entities.map(e => deleteUser(e.id)))
  })
  .build()
```

### Conditional Actions

```typescript
const approveAction = createAction('approve', 'Approve')
  .type('immediate')
  .context('item')
  .variant('primary')
  .condition((entity) => entity.status === 'pending')
  .onExecute(async (entity) => {
    await approveUser(entity.id)
  })
  .build()
```

## List Configuration

```typescript
const config = createEntityConfig('User', 'Users')
  .listConfig({
    defaultFields: ['email', 'first_name', 'last_name', 'status', 'created_at'],
    searchableFields: ['email', 'first_name', 'last_name'],
    defaultSort: { field: 'created_at', direction: 'desc' },
    pageSize: 20,
    selectable: true,
    exportable: true,
    filters: [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        field: 'status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      }
    ]
  })
  .build()
```

## Form Configuration

### Basic Form Layout

```typescript
const config = createEntityConfig('User', 'Users')
  .formConfig({
    layout: 'grid',
    columns: 2,
    validateOnChange: true,
    validateOnBlur: true,
    submitLabel: 'Save User',
    cancelLabel: 'Cancel',
    autoFocus: true,
    showProgress: true
  })
  .build()
```

### Field Groups

```typescript
const config = createEntityConfig('User', 'Users')
  .formConfig({
    layout: 'grid',
    columns: 2,
    fieldGroups: [
      {
        id: 'basic',
        title: 'Basic Information',
        description: 'User identification details',
        fields: ['email', 'first_name', 'last_name'],
        layout: 'grid',
        columns: 2,
        collapsible: false
      },
      {
        id: 'permissions',
        title: 'Permissions',
        description: 'User role and permissions',
        fields: ['role_id', 'is_active'],
        layout: 'vertical',
        collapsible: true,
        collapsed: false
      },
      {
        id: 'metadata',
        title: 'Metadata',
        fields: ['created_at', 'updated_at'],
        layout: 'grid',
        columns: 2,
        collapsible: true,
        collapsed: true
      }
    ]
  })
  .build()
```

## View Configuration

```typescript
const config = createEntityConfig('User', 'Users')
  .viewConfig({
    mode: 'detail',
    showMetadata: true,
    showActions: true,
    compact: false,
    fieldGroups: [
      {
        id: 'profile',
        title: 'Profile',
        fields: ['email', 'first_name', 'last_name', 'avatar'],
        layout: 'vertical',
        collapsible: false
      },
      {
        id: 'system',
        title: 'System Information',
        fields: ['created_at', 'updated_at', 'last_login'],
        layout: 'grid',
        columns: 2,
        collapsible: true
      }
    ]
  })
  .build()
```

## Advanced Features

### Conditional Fields

```typescript
const config = createEntityConfig('User', 'Users')

config.fields = [
  createField('type', 'User Type', 'select')
    .options([
      { value: 'employee', label: 'Employee' },
      { value: 'contractor', label: 'Contractor' }
    ])
    .build(),
  
  createField('employee_id', 'Employee ID', 'string')
    .condition((formValues) => formValues.type === 'employee')
    .build(),
  
  createField('contract_end_date', 'Contract End Date', 'date')
    .condition((formValues) => formValues.type === 'contractor')
    .build()
]
```

### Custom Hooks

```typescript
const config = createEntityConfig('User', 'Users')
  .build()

config.hooks = {
  beforeCreate: async (data) => {
    // Hash password before creating
    return {
      ...data,
      password: await hashPassword(data.password)
    }
  },
  
  afterCreate: (entity) => {
    // Send welcome email
    sendWelcomeEmail(entity.email)
  },
  
  beforeDelete: async (id) => {
    // Check if user can be deleted
    const hasOrders = await checkUserOrders(id)
    if (hasOrders) {
      throw new Error('Cannot delete user with existing orders')
    }
    return true
  }
}
```

### Bulk Import

```typescript
const config = createEntityConfig('User', 'Users')
  .bulkImport({
    enabled: true,
    templateName: 'user_import_template',
    formats: ['csv', 'xlsx', 'json'],
    sampleData: [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'employee'
      }
    ]
  })
  .build()
```

## Migration Guide

### From Old Configuration

**Before (5 separate files):**

```
configs/user/
  ├── index.ts
  ├── fields.ts
  ├── form.ts
  ├── list.ts
  ├── view.ts
  └── actions.ts
```

**After (1-2 files):**

```
configs/user/
  ├── config.ts       # Main unified config
  └── types.ts        # TypeScript types (optional)
```

### Step-by-Step Migration

1. **Create the new config file:**

```typescript
// configs/user/config.ts
import { createEntityConfig, commonFields, commonActions } from '@/components/entityManager/core'
import { User, UserFormData } from './types'

export const userConfig = createEntityConfig<User, UserFormData>('User', 'Users')
  .displayName('User Management')
  .endpoints({
    list: '/api/v1/accounts/users/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  })
  .build()
```

2. **Migrate fields from fields.ts:**

```typescript
// Old: fields.ts
export const userFields = [
  { key: 'email', label: 'Email', type: 'email', required: true },
  // ...
]

// New: Add to config.ts
userConfig.fields = [
  commonFields.email().build(),
  // ...
]
```

3. **Migrate form config from form.ts:**

```typescript
// Old: form.ts
export const userFormConfig = {
  layout: 'grid',
  columns: 2,
  // ...
}

// New: Add to config builder
createEntityConfig('User', 'Users')
  .formConfig({
    layout: 'grid',
    columns: 2
  })
```

4. **Update imports in your pages:**

```typescript
// Old
import { userConfig } from './configs/user'

// New (same!)
import { userConfig } from './configs/user/config'
```

## Best Practices

### 1. Use Common Field Helpers

```typescript
// Good
commonFields.email().build()
commonFields.name('first_name', 'First Name').build()

// Instead of
createField('email', 'Email', 'email')
  .required()
  .validate(/* email validation */)
  .build()
```

### 2. Group Related Fields

```typescript
// Use field groups for better UX
.formConfig({
  fieldGroups: [
    {
      id: 'contact',
      title: 'Contact Information',
      fields: ['email', 'phone'],
      collapsible: true
    }
  ]
})
```

### 3. Set Appropriate Defaults

```typescript
// Set sensible defaults for list views
.listConfig({
  defaultFields: ['name', 'status', 'created_at'], // Most important fields
  pageSize: 20, // Reasonable page size
  exportable: true // Enable if needed
})
```

### 4. Use Type Safety

```typescript
// Define your entity and form types
interface User extends BaseEntity {
  email: string
  first_name: string
  last_name: string
}

interface UserFormData {
  email: string
  first_name: string
  last_name: string
}

// Use them in your config
const config = createEntityConfig<User, UserFormData>('User', 'Users')
```

### 5. Validate Early

```typescript
// Add validation at the field level
createField('email', 'Email', 'email')
  .required()
  .validate((value) => {
    // Custom validation logic
    return true // or error message
  })
```

## Common Patterns

### Master-Detail Views

```typescript
const config = createEntityConfig('Invoice', 'Invoices')
  .build()

config.relatedEntities = [
  {
    name: 'line_item',
    displayName: 'Line Items',
    type: 'one-to-many',
    foreignKey: 'invoice_id',
    config: lineItemConfig,
    showInDetail: true,
    detailPosition: 'tabs'
  }
]
```

### Status Workflows

```typescript
const statusField = createField('status', 'Status', 'select')
  .options([
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ])
  .badge()
  .build()

const approveAction = createAction('approve', 'Approve')
  .condition((entity) => entity.status === 'pending')
  .onExecute(async (entity) => {
    await updateStatus(entity.id, 'approved')
  })
  .build()
```

## Troubleshooting

### Common Issues

1. **Fields not showing in list:**
   - Check `hidden` property
   - Verify `defaultFields` in list config
   - Ensure field key matches entity property

2. **Actions not appearing:**
   - Check `context` property
   - Verify `condition` function
   - Check `permission` requirements

3. **Validation not working:**
   - Ensure `validateOnChange` is true
   - Check field `required` property
   - Verify custom validation function

## API Reference

See the TypeScript definitions in `core/types.ts` for complete API documentation with JSDoc comments.
