# Migration Guide

Guide for migrating from legacy systems or upgrading between versions.

## Table of Contents

- [From Legacy CRUD Systems](#from-legacy-crud-systems)
- [From Other Entity Managers](#from-other-entity-managers)
- [Version Upgrades](#version-upgrades)
- [Breaking Changes](#breaking-changes)

## From Legacy CRUD Systems

### Migrating from Custom CRUD Components

If you have custom CRUD components scattered throughout your app:

#### Before (Legacy)

```typescript
// UserList.tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers({ search, sort, filters, page }).then(setUsers);
  }, [search, sort, filters, page]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {/* Custom table implementation */}
      {/* Custom sorting logic */}
      {/* Custom filtering UI */}
      {/* Custom pagination */}
    </div>
  );
}

// UserForm.tsx
function UserForm({ user, onSave }) {
  const [formData, setFormData] = useState(user || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    // Custom validation logic
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Custom form fields */}
      {/* Custom validation */}
      {/* Custom error display */}
    </form>
  );
}
```

#### After (Entity Manager)

```typescript
import { EntityManager, EntityConfigBuilder } from '@/components/new/entityManager';

const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  
  // List columns (replaces custom table)
  .addColumn('name', 'Name', { sortable: true })
  .addColumn('email', 'Email', { sortable: true })
  .addColumn('role', 'Role', { filterable: true })
  
  // Form fields (replaces custom form)
  .addField('name', 'text', 'Name', {
    required: true,
    validation: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 3 }
    ]
  })
  .addField('email', 'email', 'Email', {
    required: true,
    validation: [{ type: 'email' }]
  })
  
  // Built-in features
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25 })
  
  .build();

// Single component replaces UserList + UserForm + UserDetail
export default function UsersPage() {
  return <EntityManager config={userConfig} />;
}
```

**Migration Steps:**

1. **Extract entity type definition**
   ```typescript
   interface User {
     id: string;
     name: string;
     email: string;
     role: string;
   }
   ```

2. **Map columns** - Convert your table columns to EntityManager columns
3. **Map form fields** - Convert your form inputs to EntityManager fields
4. **Add validation** - Move validation rules to field configuration
5. **Replace components** - Swap legacy components with EntityManager
6. **Test thoroughly** - Verify all functionality works

### Migrating API Calls

#### Before

```typescript
// api/users.ts
export async function fetchUsers(params) {
  const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
  return response.json();
}

export async function createUser(data) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Similar for update, delete...
```

#### After

```typescript
import { EntityApiProvider } from '@/components/new/entityManager';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api'
});

const apiConfig = {
  client: apiClient,
  entities: {
    users: {
      base: '/users',
      list: '/users',
      get: '/users/:id',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id'
    }
  }
};

// Wrap your app
<EntityApiProvider config={apiConfig}>
  <EntityManager config={userConfig} />
</EntityApiProvider>
```

## From Other Entity Managers

### From React Admin

#### React Admin

```typescript
<List>
  <Datagrid>
    <TextField source="name" />
    <EmailField source="email" />
    <EditButton />
  </Datagrid>
</List>

<Edit>
  <SimpleForm>
    <TextInput source="name" validate={required()} />
    <EmailInput source="email" validate={email()} />
  </SimpleForm>
</Edit>
```

#### Entity Manager Equivalent

```typescript
const config = new EntityConfigBuilder<User>('user')
  .addColumn('name', 'Name')
  .addColumn('email', 'Email')
  .addField('name', 'text', 'Name', { 
    required: true 
  })
  .addField('email', 'email', 'Email', { 
    validation: [{ type: 'email' }] 
  })
  .addAction('edit', 'Edit', 'immediate')
  .build();

<EntityManager config={config} />
```

**Key Differences:**
- Configuration-based instead of component-based
- Type-safe with TypeScript
- More flexible field types
- Standalone components available

### From Refine

#### Refine

```typescript
import { useTable } from "@refinedev/core";

const { tableQueryResult } = useTable<IUser>();

<Table dataSource={tableQueryResult.data?.data}>
  <Table.Column dataIndex="name" title="Name" />
  <Table.Column dataIndex="email" title="Email" />
</Table>
```

#### Entity Manager Equivalent

```typescript
import { useEntityState } from '@/components/new/entityManager';

const { entities } = useEntityState<User>('users');

<EntityList
  data={entities}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
/>
```

### From AdminJS

#### AdminJS

```typescript
{
  resource: User,
  options: {
    properties: {
      name: { isTitle: true },
      email: { type: 'email' }
    }
  }
}
```

#### Entity Manager Equivalent

```typescript
const config = new EntityConfigBuilder<User>('user')
  .addColumn('name', 'Name')
  .addField('name', 'text', 'Name', { required: true })
  .addField('email', 'email', 'Email')
  .build();
```

## Version Upgrades

### From v1.x to v2.x

#### Breaking Changes

1. **Import paths changed**
   ```typescript
   // v1.x
   import { EntityManager } from '@/components/entityManager';
   
   // v2.x
   import { EntityManager } from '@/components/new/entityManager';
   ```

2. **Config builder required**
   ```typescript
   // v1.x - Plain object
   const config = {
     entityName: 'user',
     columns: [...]
   };
   
   // v2.x - Builder pattern
   const config = new EntityConfigBuilder<User>('user')
     .addColumn(...)
     .build();
   ```

3. **Actions restructured**
   ```typescript
   // v1.x
   actions: {
     edit: { handler: () => {} },
     delete: { handler: () => {} }
   }
   
   // v2.x
   .addAction('edit', 'Edit', 'immediate', {
     onClick: () => {}
   })
   .addAction('delete', 'Delete', 'confirm', {
     confirm: { title: 'Delete?', message: 'Are you sure?' },
     onClick: () => {}
   })
   ```

4. **State management changed**
   ```typescript
   // v1.x - Context only
   import { useEntityContext } from '@/components/entityManager';
   
   // v2.x - Separate state and cache hooks
   import { useEntityState, useEntityCache } from '@/components/new/entityManager';
   ```

#### Migration Steps

1. **Update imports**
   ```bash
   # Find and replace
   @/components/entityManager → @/components/new/entityManager
   ```

2. **Convert configs to builders**
   ```typescript
   // Create a migration script
   function convertToBuilder(oldConfig) {
     const builder = new EntityConfigBuilder(oldConfig.entityName);
     
     oldConfig.columns.forEach(col => {
       builder.addColumn(col.key, col.label, col.options);
     });
     
     oldConfig.fields.forEach(field => {
       builder.addField(field.key, field.type, field.label, field.options);
     });
     
     return builder.build();
   }
   ```

3. **Update action handlers**
   ```typescript
   // Old
   { edit: { handler: handleEdit } }
   
   // New
   .addAction('edit', 'Edit', 'immediate', { onClick: handleEdit })
   ```

4. **Update state hooks**
   ```typescript
   // Old
   const { entities, loading } = useEntityContext();
   
   // New
   const { entities, loading } = useEntityState('users');
   ```

5. **Test thoroughly**

### From v2.0 to v2.1

#### New Features (Non-Breaking)

1. **Export functionality added**
   ```typescript
   // Now available
   .enableExport(['csv', 'xlsx', 'json'])
   ```

2. **Improved caching**
   ```typescript
   // New cache options
   const { data } = useEntityCache('users', fetchUsers, {
     ttl: 5 * 60 * 1000,
     staleWhileRevalidate: true,
     storage: 'session' // New!
   });
   ```

3. **Adapters introduced**
   ```typescript
   // Generate configs from schemas
   import { JSONSchemaAdapter } from '@/components/new/entityManager';
   
   const config = new JSONSchemaAdapter().fromSchema(schema);
   ```

No breaking changes - safe to upgrade.

## Breaking Changes Log

### v2.1.0 (Latest)

**New Features:**
- Export functionality
- Schema adapters
- Improved caching
- Session storage support

**No Breaking Changes**

### v2.0.0

**Breaking Changes:**
- ✅ Moved to builder pattern for configuration
- ✅ Restructured action types (immediate, confirm, form, modal, etc.)
- ✅ Split state management into separate hooks
- ✅ Changed import paths to `/new/entityManager`
- ✅ Removed deprecated `useEntityContext` hook
- ✅ Changed column/field option names for consistency

**Migration Path:**
1. Update imports
2. Convert configs to builders
3. Update action definitions
4. Replace `useEntityContext` with `useEntityState`/`useEntityCache`

### v1.5.0

**Deprecated (Still Working):**
- `useEntityContext` - Use `useEntityState` instead
- Plain object configs - Use builders instead

**New Features:**
- Builder pattern (optional in v1.5, required in v2.0)
- Standalone component exports

## Common Migration Patterns

### Pattern 1: Incremental Migration

Don't migrate everything at once. Start with one entity:

```typescript
// Step 1: Create config for most important entity
const userConfig = new EntityConfigBuilder<User>('user')
  // ... configuration
  .build();

// Step 2: Replace just the user management page
// Keep other pages as-is for now

// Step 3: Migrate next entity once confident

// Step 4: Eventually migrate all entities
```

### Pattern 2: Parallel Implementation

Run old and new side-by-side:

```typescript
// Add feature flag
const useNewEntityManager = process.env.NEXT_PUBLIC_USE_NEW_EM === 'true';

export default function UsersPage() {
  return useNewEntityManager 
    ? <EntityManager config={userConfig} />
    : <LegacyUserManagement />;
}
```

### Pattern 3: Adapter Pattern

Wrap legacy API with new interface:

```typescript
// Legacy API adapter
class LegacyApiAdapter {
  async list(params) {
    // Transform new params to legacy format
    const legacyParams = this.transformParams(params);
    const result = await legacyApi.fetchUsers(legacyParams);
    return this.transformResponse(result);
  }
  
  // ... other methods
}

// Use with EntityManager
const apiConfig = {
  client: new LegacyApiAdapter(),
  // ...
};
```

## Troubleshooting

### Issue: Types Don't Match

```typescript
// Error: Type 'OldUser' is not assignable to type 'User'

// Solution: Create type adapter
interface User extends OldUser {
  // Add any new required fields
  createdAt: Date;
}

function adaptOldUser(old: OldUser): User {
  return {
    ...old,
    createdAt: new Date(old.created_at)
  };
}
```

### Issue: Custom Validation Not Working

```typescript
// Old custom validation
const validate = (value) => {
  // custom logic
};

// New - use custom validation type
.addField('field', 'text', 'Field', {
  validation: [
    {
      type: 'custom',
      validate: (value, formData) => {
        // Your custom logic
        return valid || 'Error message';
      }
    }
  ]
})
```

### Issue: Actions Not Appearing

```typescript
// Check permissions
.addAction('edit', 'Edit', 'immediate', {
  visible: (entity, context) => {
    // Make sure this returns true
    console.log('Action visible?', context.permissions);
    return true;
  }
})
```

## Getting Help

- Check [documentation](./README.md)
- Review [examples](../examples/)
- See [best practices](./BestPractices.md)
- Open an issue on GitHub

## See Also

- [Getting Started](./GettingStarted.md)
- [Best Practices](./BestPractices.md)
- [API Reference](./API_REFERENCE.md)
