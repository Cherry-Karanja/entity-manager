# Configuration Builders

Fluent API for building entity configurations with type safety and validation.

## Overview

The Entity Manager provides four builder classes for creating configurations:

- **EntityConfigBuilder** - Complete entity configuration
- **FieldBuilder** - Form field definitions
- **ColumnBuilder** - List column definitions
- **ActionBuilder** - Action definitions

All builders use a fluent API pattern with method chaining and comprehensive type safety.

## EntityConfigBuilder

Build complete entity configurations for the EntityManager orchestrator.

### Basic Usage

```typescript
import { EntityConfigBuilder } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .setIcon('user')
  .addColumn('name', 'Name', { sortable: true, width: 200 })
  .addColumn('email', 'Email', { sortable: true })
  .addColumn('role', 'Role', { filterable: true })
  .addColumn('status', 'Status', {
    render: (value) => <Badge variant={value}>{value}</Badge>
  })
  .addField('name', 'text', 'Name', { required: true })
  .addField('email', 'email', 'Email', {
    required: true,
    validation: [{ type: 'email' }]
  })
  .addField('role', 'select', 'Role', {
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  })
  .addAction('edit', 'Edit', 'immediate', {
    icon: 'edit',
    onClick: (user) => navigate(`/users/${user.id}/edit`)
  })
  .addAction('delete', 'Delete', 'confirm', {
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Delete User',
      message: 'Are you sure?'
    },
    onClick: async (user) => deleteUser(user.id)
  })
  .build();

// Use with EntityManager
<EntityManager config={userConfig} />
```

### All Methods

```typescript
const config = new EntityConfigBuilder<User>('user')
  // Basic Info
  .setLabel('User', 'Users')
  .setIcon('user')
  .setDescription('User management')
  
  // Columns (for list view)
  .addColumn('name', 'Name', { sortable: true })
  .addColumns([
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ])
  
  // Fields (for form view)
  .addField('name', 'text', 'Name', { required: true })
  .addFields([
    { key: 'email', type: 'email', label: 'Email' },
    { key: 'role', type: 'select', label: 'Role', options: [] }
  ])
  
  // Actions
  .addAction('edit', 'Edit', 'immediate', { onClick: handleEdit })
  .addActions([
    { key: 'delete', label: 'Delete', type: 'confirm' }
  ])
  
  // View Configuration
  .setDefaultView('table')
  .setViews(['table', 'card', 'grid'])
  
  // Features
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25 })
  .enableSelection({ multiSelect: true })
  .enableExport(['csv', 'xlsx'])
  
  // Permissions
  .setPermissions({
    create: ['admin'],
    read: ['admin', 'user'],
    update: ['admin'],
    delete: ['admin']
  })
  
  // Build final config
  .build();
```

### Conditional Configuration

```typescript
const configBuilder = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .addColumn('name', 'Name')
  .addColumn('email', 'Email');

// Add columns conditionally
if (userHasPermission('viewRoles')) {
  configBuilder.addColumn('role', 'Role');
}

if (userHasPermission('viewStatus')) {
  configBuilder.addColumn('status', 'Status');
}

// Add actions based on permissions
if (userHasPermission('edit')) {
  configBuilder.addAction('edit', 'Edit', 'immediate', {
    onClick: handleEdit
  });
}

if (userHasPermission('delete')) {
  configBuilder.addAction('delete', 'Delete', 'confirm', {
    onClick: handleDelete
  });
}

const config = configBuilder.build();
```

## FieldBuilder

Build form field configurations with validation.

### Basic Usage

```typescript
import { FieldBuilder } from '@/components/new/entityManager';

const nameField = new FieldBuilder<User>('name')
  .setType('text')
  .setLabel('Name')
  .setPlaceholder('Enter name')
  .setRequired(true)
  .addValidation('required', { message: 'Name is required' })
  .addValidation('minLength', { value: 3, message: 'Min 3 characters' })
  .build();

const emailField = new FieldBuilder<User>('email')
  .setType('email')
  .setLabel('Email')
  .setRequired(true)
  .addValidation('email')
  .addValidation('async', {
    validate: async (value) => {
      const available = await checkEmailAvailable(value);
      return available || 'Email already taken';
    }
  })
  .build();

const roleField = new FieldBuilder<User>('role')
  .setType('select')
  .setLabel('Role')
  .setOptions([
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ])
  .setDefaultValue('user')
  .build();

const fields = [nameField, emailField, roleField];
```

### All Methods

```typescript
const field = new FieldBuilder<User>('name')
  // Basic
  .setType('text')
  .setLabel('Name')
  .setPlaceholder('Enter name')
  .setDescription('User full name')
  .setDefaultValue('John Doe')
  
  // State
  .setRequired(true)
  .setDisabled(false)
  .setReadOnly(false)
  .setVisible(true)
  
  // Conditional State
  .setRequiredIf((data) => data.accountType === 'business')
  .setDisabledIf((data) => data.status === 'locked')
  .setVisibleIf((data) => data.role === 'admin')
  
  // Validation
  .addValidation('required')
  .addValidation('minLength', { value: 3 })
  .addValidation('pattern', { value: /^[A-Z]/, message: 'Must start with capital' })
  .addValidation('custom', {
    validate: (value) => value.length > 0 || 'Required'
  })
  
  // Type-specific
  .setOptions([/* ... */]) // For select/radio
  .setMin(0) // For number/date
  .setMax(100)
  .setStep(1)
  .setRows(5) // For textarea
  .setAccept('image/*') // For file/image
  .setMaxSize(5 * 1024 * 1024) // For file
  
  // Layout
  .setOrder(1)
  .setGridColumn('span 2')
  
  // Custom rendering
  .setRender((value, onChange) => (
    <CustomInput value={value} onChange={onChange} />
  ))
  
  .build();
```

### Field Groups

```typescript
function createUserFormFields() {
  // Basic info fields
  const basicFields = [
    new FieldBuilder<User>('name')
      .setType('text')
      .setLabel('Name')
      .setRequired(true)
      .setOrder(1)
      .build(),
    
    new FieldBuilder<User>('email')
      .setType('email')
      .setLabel('Email')
      .setRequired(true)
      .setOrder(2)
      .build()
  ];

  // Profile fields
  const profileFields = [
    new FieldBuilder<User>('bio')
      .setType('textarea')
      .setLabel('Biography')
      .setRows(4)
      .setOrder(3)
      .build(),
    
    new FieldBuilder<User>('avatar')
      .setType('image')
      .setLabel('Avatar')
      .setAccept('image/*')
      .setMaxSize(2 * 1024 * 1024)
      .setOrder(4)
      .build()
  ];

  return [...basicFields, ...profileFields];
}
```

## ColumnBuilder

Build list column configurations.

### Basic Usage

```typescript
import { ColumnBuilder } from '@/components/new/entityManager';

const nameColumn = new ColumnBuilder<User>('name')
  .setLabel('Name')
  .setWidth(200)
  .setSortable(true)
  .build();

const emailColumn = new ColumnBuilder<User>('email')
  .setLabel('Email')
  .setSortable(true)
  .setFilterable(true)
  .build();

const statusColumn = new ColumnBuilder<User>('status')
  .setLabel('Status')
  .setFilterable(true)
  .setFilterType('select')
  .setFilterOptions([
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ])
  .setRender((value) => <Badge variant={value}>{value}</Badge>)
  .build();

const columns = [nameColumn, emailColumn, statusColumn];
```

### All Methods

```typescript
const column = new ColumnBuilder<User>('name')
  // Basic
  .setLabel('Name')
  .setWidth(200) // or '20%'
  .setAlign('left') // left, center, right
  
  // Features
  .setSortable(true)
  .setFilterable(true)
  .setResizable(true)
  
  // Filter config
  .setFilterType('text') // text, number, date, select
  .setFilterOptions([/* ... */]) // For select filter
  
  // Display
  .setVisible(true)
  .setFixed('left') // left, right
  .setOrder(1)
  
  // Formatting
  .setFormatter((value, entity) => value.toUpperCase())
  .setRender((value, entity, index) => (
    <CustomCell value={value} entity={entity} />
  ))
  
  // Type
  .setType('text') // text, number, date, boolean
  
  .build();
```

### Nested & Computed Columns

```typescript
// Nested field column
const cityColumn = new ColumnBuilder<User>('address.city')
  .setLabel('City')
  .setSortable(true)
  .build();

// Computed column
const fullNameColumn = new ColumnBuilder<User>('fullName')
  .setLabel('Full Name')
  .setRender((value, user) => `${user.firstName} ${user.lastName}`)
  .build();

// Custom rendering with logic
const actionsColumn = new ColumnBuilder<User>('actions')
  .setLabel('Actions')
  .setWidth(120)
  .setAlign('right')
  .setRender((value, user) => (
    <div>
      <button onClick={() => handleEdit(user)}>Edit</button>
      <button onClick={() => handleDelete(user)}>Delete</button>
    </div>
  ))
  .build();
```

## ActionBuilder

Build action configurations with modals and confirmations.

### Basic Usage

```typescript
import { ActionBuilder } from '@/components/new/entityManager';

const editAction = new ActionBuilder<User>('edit')
  .setLabel('Edit')
  .setType('immediate')
  .setIcon('edit')
  .setPrimary(true)
  .setOnClick((user) => navigate(`/users/${user.id}/edit`))
  .build();

const deleteAction = new ActionBuilder<User>('delete')
  .setLabel('Delete')
  .setType('confirm')
  .setIcon('delete')
  .setVariant('danger')
  .setConfirm({
    title: 'Delete User',
    message: 'Are you sure you want to delete this user?',
    confirmLabel: 'Delete',
    confirmVariant: 'danger'
  })
  .setOnClick(async (user) => deleteUser(user.id))
  .build();

const actions = [editAction, deleteAction];
```

### All Action Types

```typescript
// Immediate action
const viewAction = new ActionBuilder<User>('view')
  .setType('immediate')
  .setLabel('View')
  .setOnClick((user) => navigate(`/users/${user.id}`))
  .build();

// Confirm action
const archiveAction = new ActionBuilder<User>('archive')
  .setType('confirm')
  .setLabel('Archive')
  .setConfirm({
    title: 'Archive User',
    message: 'Archive this user?'
  })
  .setOnClick(async (user) => archiveUser(user.id))
  .build();

// Form action
const assignAction = new ActionBuilder<User>('assign')
  .setType('form')
  .setLabel('Assign')
  .setForm({
    title: 'Assign User',
    fields: [
      {
        key: 'assignee',
        type: 'select',
        label: 'Assign To',
        options: userOptions,
        required: true
      }
    ]
  })
  .setOnClick(async (user, formData) => {
    await assignUser(user.id, formData.assignee);
  })
  .build();

// Modal action
const detailsAction = new ActionBuilder<User>('details')
  .setType('modal')
  .setLabel('Details')
  .setModal({
    title: 'User Details',
    content: (user) => <UserDetails user={user} />,
    size: 'large'
  })
  .build();

// Navigation action
const profileAction = new ActionBuilder<User>('profile')
  .setType('navigation')
  .setLabel('View Profile')
  .setHref((user) => `/users/${user.id}`)
  .build();

// Bulk action
const bulkDeleteAction = new ActionBuilder<User>('bulkDelete')
  .setType('bulk')
  .setLabel('Delete Selected')
  .setVariant('danger')
  .setOnClick(async (users) => {
    await bulkDeleteUsers(users.map(u => u.id));
  })
  .build();
```

### Conditional Actions

```typescript
const approveAction = new ActionBuilder<User>('approve')
  .setLabel('Approve')
  .setType('confirm')
  .setVariant('success')
  // Only show for pending users
  .setVisibleIf((user) => user.status === 'pending')
  // Disable while processing
  .setDisabledIf((user) => user.processing)
  .setConfirm({
    title: 'Approve User',
    message: 'Approve this user account?'
  })
  .setOnClick(async (user) => approveUser(user.id))
  .build();

const adminOnlyAction = new ActionBuilder<User>('admin')
  .setLabel('Admin Action')
  .setVisibleIf((user, context) => context.user.isAdmin)
  .setOnClick(handleAdminAction)
  .build();
```

## Complete Example

```typescript
import {
  EntityConfigBuilder,
  FieldBuilder,
  ColumnBuilder,
  ActionBuilder
} from '@/components/new/entityManager';

function createUserConfig() {
  // Build columns
  const columns = [
    new ColumnBuilder<User>('name')
      .setLabel('Name')
      .setSortable(true)
      .setWidth(200)
      .build(),
    
    new ColumnBuilder<User>('email')
      .setLabel('Email')
      .setSortable(true)
      .build(),
    
    new ColumnBuilder<User>('role')
      .setLabel('Role')
      .setFilterable(true)
      .setFilterType('select')
      .setFilterOptions(roleOptions)
      .build()
  ];

  // Build fields
  const fields = [
    new FieldBuilder<User>('name')
      .setType('text')
      .setLabel('Name')
      .setRequired(true)
      .addValidation('minLength', { value: 3 })
      .build(),
    
    new FieldBuilder<User>('email')
      .setType('email')
      .setLabel('Email')
      .setRequired(true)
      .addValidation('email')
      .build(),
    
    new FieldBuilder<User>('role')
      .setType('select')
      .setLabel('Role')
      .setOptions(roleOptions)
      .build()
  ];

  // Build actions
  const actions = [
    new ActionBuilder<User>('edit')
      .setLabel('Edit')
      .setType('immediate')
      .setIcon('edit')
      .setOnClick((user) => navigate(`/users/${user.id}/edit`))
      .build(),
    
    new ActionBuilder<User>('delete')
      .setLabel('Delete')
      .setType('confirm')
      .setIcon('delete')
      .setVariant('danger')
      .setConfirm({
        title: 'Delete User',
        message: 'Are you sure?'
      })
      .setOnClick(async (user) => deleteUser(user.id))
      .build()
  ];

  // Build complete config
  return new EntityConfigBuilder<User>('user')
    .setLabel('User', 'Users')
    .setIcon('user')
    .addColumns(columns)
    .addFields(fields)
    .addActions(actions)
    .enableSearch()
    .enableFilters()
    .enablePagination({ pageSize: 25 })
    .enableExport(['csv', 'xlsx'])
    .build();
}
```

## See Also

- [Adapters](./Adapters.md) - Generate configurations from external schemas
- [EntityManager](./EntityManager.md) - Use configurations with the orchestrator
