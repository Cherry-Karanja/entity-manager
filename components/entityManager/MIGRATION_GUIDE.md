# Migration Guide: From Legacy to Unified Configuration

This guide shows how to migrate an existing entity configuration from the legacy format (5-6 files) to the new unified format (1-2 files).

## Example: User Entity Migration

### Before: Legacy Configuration (Multiple Files)

#### File Structure
```
components/features/accounts/configs/user/
├── index.ts        # Main export
├── fields.ts       # Field definitions
├── form.ts         # Form configuration
├── list.ts         # List configuration
├── view.ts         # View configuration
└── actions.ts      # Custom actions
```

#### fields.ts
```typescript
import { EntityField } from '@/components/entityManager/manager/types'

export const userFields: EntityField[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: {
      customValidate: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
          return 'Please enter a valid email'
        }
        return true
      }
    },
    fieldType: 'input',
    placeholder: 'Enter email address'
  },
  // ... more fields
]
```

#### form.ts
```typescript
export const userFormConfig = {
  title: 'User Information',
  createTitle: 'Create New User',
  editTitle: 'Edit User',
  layout: 'grid',
  columns: 2,
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      fields: ['email', 'first_name', 'last_name'],
      layout: 'grid',
      columns: 2
    }
  ]
}
```

#### list.ts
```typescript
export const userListConfig = {
  columns: [
    { id: 'email', header: 'Email', accessorKey: 'email' },
    { id: 'first_name', header: 'First Name', accessorKey: 'first_name' },
    // ... more columns
  ],
  searchableFields: ['email', 'first_name', 'last_name'],
  pageSize: 20
}
```

#### actions.ts
```typescript
export const userCustomActions = {
  item: [
    {
      id: 'view',
      label: 'View',
      type: 'default',
      actionType: 'navigation'
    },
    {
      id: 'edit',
      label: 'Edit',
      type: 'default',
      actionType: 'navigation'
    },
    // ... more actions
  ]
}
```

#### index.ts
```typescript
import { userFields } from './fields'
import { userListConfig } from './list'
import { userFormConfig } from './form'
import { userViewConfig } from './view'
import { userCustomActions } from './actions'

export const userConfig: EntityConfig = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'User',
  fields: userFields,
  endpoints: {
    list: '/api/v1/accounts/users/',
    create: '/api/v1/accounts/users/',
    update: '/api/v1/accounts/users/{id}/',
    delete: '/api/v1/accounts/users/{id}/'
  },
  listConfig: userListConfig,
  formConfig: userFormConfig,
  viewConfig: userViewConfig,
  customActions: userCustomActions
}
```

---

### After: Unified Configuration (Single File)

#### File Structure
```
components/features/accounts/configs/user/
├── config.ts       # Complete unified configuration
└── types.ts        # TypeScript types (optional, can be in separate file)
```

#### config.ts
```typescript
import { 
  createEntityConfig, 
  createField, 
  commonFields, 
  commonActions,
  UnifiedEntityConfig 
} from '@/components/entityManager/core'
import { User, UserFormData } from '../types'

/**
 * Complete user entity configuration
 */
export const userConfig: UnifiedEntityConfig<User, UserFormData> = 
  createEntityConfig<User, UserFormData>('User', 'Users')
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
    .listConfig({
      defaultFields: ['email', 'first_name', 'last_name', 'role_name', 'is_active'],
      searchableFields: ['email', 'first_name', 'last_name'],
      pageSize: 20,
      selectable: true,
      exportable: true
    })
    .formConfig({
      layout: 'grid',
      columns: 2,
      submitLabel: 'Save User',
      fieldGroups: [
        {
          id: 'basic-info',
          title: 'Basic Information',
          fields: ['email', 'first_name', 'last_name'],
          layout: 'grid',
          columns: 2
        }
      ]
    })
    .build()

// Define fields once - used in list, form, and view
userConfig.fields = [
  commonFields.id().build(),
  
  commonFields.email()
    .sortable()
    .filterable()
    .copyable()
    .build(),
  
  commonFields.name('first_name', 'First Name')
    .sortable()
    .build(),
  
  commonFields.name('last_name', 'Last Name')
    .sortable()
    .build(),
  
  createField<User, UserFormData>('role_name', 'Role', 'select')
    .required()
    .relationship({
      entity: 'user-role',
      displayField: 'display_name',
      endpoint: '/api/v1/accounts/user-roles/'
    })
    .sortable()
    .filterable()
    .badge()
    .build(),
  
  commonFields.isActive()
    .sortable()
    .filterable()
    .build()
]

// Define actions
userConfig.actions = [
  commonActions.view<User>().build(),
  commonActions.edit<User>().build(),
  commonActions.delete<User>().build()
]

export default userConfig
```

---

## Step-by-Step Migration Process

### Step 1: Install and Setup

No installation needed - the core module is already in the codebase.

### Step 2: Create New Config File

1. Create a new file: `components/features/accounts/configs/user/config.ts`
2. Import the builder utilities:

```typescript
import { 
  createEntityConfig, 
  createField, 
  commonFields, 
  commonActions
} from '@/components/entityManager/core'
import { User, UserFormData } from '../types'
```

### Step 3: Migrate Basic Configuration

Convert the main entity configuration:

```typescript
// OLD (index.ts)
export const userConfig: EntityConfig = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'User',
  endpoints: { /* ... */ }
}

// NEW (config.ts)
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

### Step 4: Migrate Fields

Convert each field definition:

```typescript
// OLD (fields.ts)
{
  key: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  placeholder: 'Enter email address'
}

// NEW (config.ts)
commonFields.email()
  .placeholder('Enter email address')
  .sortable()  // Can add list-specific properties
  .copyable()  // Can add view-specific properties
  .build()
```

For custom fields:

```typescript
// OLD
{
  key: 'role_name',
  label: 'Role',
  type: 'select',
  foreignKey: true,
  relatedEntity: 'user-role',
  endpoint: '/api/v1/accounts/user-roles/',
  displayField: 'display_name'
}

// NEW
createField<User, UserFormData>('role_name', 'Role', 'select')
  .required()
  .relationship({
    entity: 'user-role',
    displayField: 'display_name',
    endpoint: '/api/v1/accounts/user-roles/'
  })
  .sortable()    // Works in lists
  .filterable()  // Can be filtered
  .badge()       // Shows as badge in views
  .build()
```

### Step 5: Migrate List Configuration

```typescript
// OLD (list.ts)
export const userListConfig = {
  columns: [...],
  searchableFields: ['email', 'first_name'],
  pageSize: 20
}

// NEW (in builder chain)
.listConfig({
  defaultFields: ['email', 'first_name', 'last_name'],
  searchableFields: ['email', 'first_name'],
  pageSize: 20,
  selectable: true,
  exportable: true
})
```

### Step 6: Migrate Form Configuration

```typescript
// OLD (form.ts)
export const userFormConfig = {
  layout: 'grid',
  columns: 2,
  fieldGroups: [...]
}

// NEW (in builder chain)
.formConfig({
  layout: 'grid',
  columns: 2,
  submitLabel: 'Save User',
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      fields: ['email', 'first_name', 'last_name']
    }
  ]
})
```

### Step 7: Migrate Actions

```typescript
// OLD (actions.ts)
{
  id: 'delete',
  label: 'Delete',
  type: 'default',
  actionType: 'confirm',
  danger: true,
  confirm: { /* ... */ }
}

// NEW
userConfig.actions = [
  commonActions.delete<User>().build(),
  // Or custom:
  createAction<User>('approve', 'Approve')
    .type('immediate')
    .context('item', 'view')
    .variant('primary')
    .onExecute(async (user) => {
      // Handle approval
    })
    .build()
]
```

### Step 8: Update Component Usage

```typescript
// OLD
import { EntityManager } from '@/components/entityManager/manager'
import { userConfig } from './configs/user'

export default function UsersPage() {
  return <EntityManager config={userConfig} />
}

// NEW - Two options:

// Option 1: Use UnifiedEntityManager (recommended for new code)
import { UnifiedEntityManager } from '@/components/entityManager/manager'
import { userConfig } from './configs/user/config'

export default function UsersPage() {
  return <UnifiedEntityManager config={userConfig} />
}

// Option 2: Keep using EntityManager (backward compatible)
import { EntityManager } from '@/components/entityManager/manager'
import { userConfig } from './configs/user/config'

export default function UsersPage() {
  return <EntityManager config={userConfig} />
  // Will automatically detect and convert unified config
}
```

### Step 9: Clean Up Old Files

Once migrated and tested, you can safely delete:
- `fields.ts`
- `form.ts`
- `list.ts`
- `view.ts`
- `actions.ts`
- Old `index.ts`

Keep only:
- `config.ts` (new unified config)
- `types.ts` (if separate from config)

## Benefits After Migration

### Before
- **6 files** per entity
- **~500-1000 lines** of configuration code
- **Duplicate field definitions** in multiple places
- **Hard to maintain** consistency
- **Scattered documentation**

### After
- **1-2 files** per entity
- **~200-400 lines** of configuration code
- **Single field definition** used everywhere
- **Easy to maintain** - update once
- **Centralized** and clear

## Common Patterns

### Pattern 1: Field with Different Behavior in Different Contexts

```typescript
createField<User, UserFormData>('status', 'Status', 'select')
  .required()                    // Required in forms
  .options(statusOptions)         // Options for select
  .sortable()                    // Sortable in lists
  .filterable()                  // Filterable in lists
  .badge()                       // Display as badge in views
  .renderCell((value) => (       // Custom rendering in lists
    <StatusBadge status={value as string} />
  ))
  .build()
```

### Pattern 2: Conditional Field Visibility

```typescript
createField<User, UserFormData>('contract_end_date', 'Contract End Date', 'date')
  .condition((formValues) => formValues.type === 'contractor')
  .build()
```

### Pattern 3: Custom Validation

```typescript
createField<User, UserFormData>('employee_id', 'Employee ID', 'string')
  .validate((value) => {
    if (!value) return true
    if (!/^[A-Z0-9-]+$/.test(value as string)) {
      return 'Employee ID must contain only uppercase letters, numbers, and hyphens'
    }
    return true
  })
  .build()
```

## Troubleshooting

### Issue: Types Not Working

**Solution**: Make sure to provide type parameters to builders:

```typescript
// ❌ Bad
const field = createField('email', 'Email', 'email')

// ✅ Good
const field = createField<User, UserFormData>('email', 'Email', 'email')
```

### Issue: Fields Not Showing in List

**Solution**: Check `defaultFields` in list config:

```typescript
.listConfig({
  defaultFields: ['email', 'first_name', 'last_name'], // Must match field keys
  // ...
})
```

### Issue: Actions Not Appearing

**Solution**: Check action context:

```typescript
createAction<User>('approve', 'Approve')
  .context('item', 'view')  // Specify where action should appear
  // ...
```

## Testing Your Migration

1. **Visual Test**: Open the entity list/form/view and verify everything displays correctly
2. **Functional Test**: Try creating, editing, and deleting entities
3. **Filter Test**: Test list filters and search
4. **Action Test**: Test all custom actions
5. **Export Test**: Test export functionality if enabled

## Need Help?

- Check the [Developer Guide](./core/README.md)
- Review the [Example Configuration](./core/examples/unified-user-config.example.ts)
- Examine type definitions in `core/types.ts`
