# Best Practices

Guidelines and recommendations for using the Entity Manager effectively.

## Architecture Principles

### 1. Component Independence

Each component should work standalone without dependencies on other components:

```typescript
// ✅ Good - Standalone component
<EntityList 
  data={users} 
  columns={columns}
  searchable
  sortable
/>

// ✅ Also good - With orchestrator
<EntityManager config={userConfig} />
```

### 2. Zero Circular Dependencies

Never import from higher layers:

```typescript
// ✅ Good - Import from lower layers only
import { useFilters } from '../primitives/hooks';
import { EntityList } from '../components/list';

// ❌ Bad - Circular dependency
// In primitives/hooks:
import { EntityList } from '../components/list'; // Don't do this!
```

### 3. Tree-Shakeable Exports

Import only what you need:

```typescript
// ✅ Good - Specific imports
import { EntityList, EntityForm } from '@/components/new/entityManager';

// ❌ Bad - Import everything
import * as EntityManager from '@/components/new/entityManager';
```

## Configuration Best Practices

### Use Builders for Type Safety

```typescript
// ✅ Good - Type-safe builder
const config = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .addColumn('name', 'Name', { sortable: true })
  .build();

// ❌ Bad - Manual object (error-prone)
const config = {
  entityName: 'user',
  label: 'User',
  columns: [{ key: 'name', lable: 'Name' }] // Typo!
};
```

### Reuse Configuration Patterns

```typescript
// Create reusable column builders
function createAuditColumns<T>() {
  return [
    new ColumnBuilder<T>('createdAt')
      .setLabel('Created')
      .setType('date')
      .setSortable(true)
      .build(),
    new ColumnBuilder<T>('updatedAt')
      .setLabel('Updated')
      .setType('date')
      .setSortable(true)
      .build()
  ];
}

// Use in multiple configs
const userConfig = new EntityConfigBuilder<User>('user')
  .addColumns(createAuditColumns<User>())
  .build();
```

### Extract Complex Configurations

```typescript
// ✅ Good - Separate config file
// config/userConfig.ts
export const userConfig = new EntityConfigBuilder<User>('user')
  // ... extensive configuration
  .build();

// pages/users.tsx
import { userConfig } from '@/config/userConfig';
<EntityManager config={userConfig} />

// ❌ Bad - Inline configuration
<EntityManager config={{
  // 100+ lines of config here...
}} />
```

## Performance Optimization

### Memoize Custom Renderers

```typescript
// ✅ Good - Memoized component
const UserAvatar = React.memo(({ user }: { user: User }) => (
  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
));

const columns = [
  {
    key: 'avatar',
    label: 'Avatar',
    render: (value, user) => <UserAvatar user={user} />
  }
];

// ❌ Bad - New component on every render
const columns = [
  {
    key: 'avatar',
    label: 'Avatar',
    render: (value, user) => (
      <img src={user.avatar} alt={user.name} />
    )
  }
];
```

### Use Pagination for Large Datasets

```typescript
// ✅ Good - Server-side pagination for large datasets
const config = new EntityConfigBuilder<User>('user')
  .enablePagination({
    pageSize: 25,
    serverSide: true // Let backend handle pagination
  })
  .build();

// ❌ Bad - Client-side pagination for 10,000+ records
<EntityList data={tenThousandUsers} pagination />
```

### Debounce Search Input

```typescript
// ✅ Good - Debounced search
import { useDebounce } from '@/hooks';

function UserList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredUsers = useMemo(() => 
    users.filter(u => u.name.includes(debouncedSearch)),
    [users, debouncedSearch]
  );

  return <EntityList data={filteredUsers} />;
}
```

### Virtualize Long Lists

```typescript
// ✅ Good - For 1000+ items, use virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

// Or use a virtualization library with EntityList
<EntityList
  data={largeDataset}
  virtualized // If implemented
  rowHeight={48}
/>
```

## State Management

### Use Caching Appropriately

```typescript
// ✅ Good - Cache frequently accessed data
const { data: users } = useEntityCache('users', fetchUsers, {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true
});

// ❌ Bad - Cache volatile data
const { data: realtimeData } = useEntityCache('realtime', fetchRealtime, {
  ttl: 60 * 60 * 1000 // 1 hour - too long for realtime!
});
```

### Invalidate Cache After Mutations

```typescript
// ✅ Good - Invalidate after updates
const { create, update, delete: deleteUser } = useEntityMutations<User>('users', {
  invalidateCache: true,
  invalidateKeys: ['users', 'user-stats']
});

// ❌ Bad - Stale data after mutations
const handleUpdate = async (id, data) => {
  await updateUser(id, data);
  // Cache still has old data!
};
```

### Use Optimistic Updates Wisely

```typescript
// ✅ Good - Optimistic for simple updates
const { update } = useEntityMutations<User>('users', {
  optimistic: true, // Fast UI, rollback on error
  onError: (type, error, original) => {
    toast.error('Update failed');
  }
});

// ❌ Bad - Optimistic for complex operations
const { delete: deleteUser } = useEntityMutations<User>('users', {
  optimistic: true // Don't use for destructive operations
});
```

## Validation

### Provide Clear Error Messages

```typescript
// ✅ Good - Specific error messages
.addField('email', 'email', 'Email', {
  validation: [
    { 
      type: 'required', 
      message: 'Email address is required' 
    },
    { 
      type: 'email', 
      message: 'Please enter a valid email address (e.g., user@example.com)' 
    }
  ]
})

// ❌ Bad - Generic messages
.addField('email', 'email', 'Email', {
  validation: [
    { type: 'required', message: 'Required' },
    { type: 'email', message: 'Invalid' }
  ]
})
```

### Validate Early

```typescript
// ✅ Good - Validate on blur
<EntityForm
  fields={fields}
  validateOnBlur={true}
  validateOnChange={false} // Don't spam user
/>

// ❌ Bad - Validate on every keystroke
<EntityForm
  fields={fields}
  validateOnChange={true} // Annoying!
/>
```

### Use Async Validation Sparingly

```typescript
// ✅ Good - Debounced async validation
.addField('username', 'text', 'Username', {
  validation: [
    {
      type: 'async',
      debounce: 500, // Wait 500ms after typing
      validate: async (value) => {
        const available = await checkUsername(value);
        return available || 'Username already taken';
      }
    }
  ]
})

// ❌ Bad - Immediate async validation
.addField('username', 'text', 'Username', {
  validation: [
    {
      type: 'async',
      validate: async (value) => {
        // Fires on every keystroke!
        return await checkUsername(value);
      }
    }
  ]
})
```

## API Integration

### Use Interceptors for Auth

```typescript
// ✅ Good - Centralized auth
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ Bad - Auth in every request
const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  return axios.get('/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

### Handle Errors Globally

```typescript
// ✅ Good - Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    } else if (error.response?.status === 500) {
      showErrorNotification('Server error');
    }
    return Promise.reject(error);
  }
);

// ❌ Bad - Handle in every component
const handleUpdate = async () => {
  try {
    await updateUser();
  } catch (error) {
    if (error.status === 401) redirectToLogin();
    if (error.status === 500) showError();
  }
};
```

### Use Request Cancellation

```typescript
// ✅ Good - Cancel on unmount
useEffect(() => {
  const controller = new AbortController();

  fetchUsers({ signal: controller.signal })
    .then(setUsers);

  return () => controller.abort();
}, []);

// ❌ Bad - Memory leak
useEffect(() => {
  fetchUsers().then(setUsers);
  // Component unmounts but request continues
}, []);
```

## Security

### Sanitize User Input

```typescript
// ✅ Good - Sanitize HTML content
.addField('bio', 'richtext', 'Biography', {
  sanitize: true, // Remove dangerous HTML
  allowedTags: ['b', 'i', 'u', 'a', 'p']
})

// ❌ Bad - Raw HTML
.addField('bio', 'richtext', 'Biography', {
  sanitize: false // XSS vulnerability!
})
```

### Use Permission Checks

```typescript
// ✅ Good - Check permissions
.addAction('delete', 'Delete', 'confirm', {
  visible: (entity, context) => 
    context.permissions?.includes('users:delete'),
  onClick: handleDelete
})

// ❌ Bad - No permission check
.addAction('delete', 'Delete', 'confirm', {
  onClick: handleDelete // Anyone can delete!
})
```

### Validate on Backend Too

```typescript
// ✅ Good - Frontend AND backend validation
// Frontend (UX)
.addField('email', 'email', 'Email', {
  validation: [{ type: 'email' }]
})

// Backend (Security)
app.post('/users', (req, res) => {
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // ...
});

// ❌ Bad - Frontend only
// Never trust client-side validation alone!
```

## Testing

### Test Components Independently

```typescript
// ✅ Good - Test components in isolation
describe('EntityList', () => {
  it('renders data correctly', () => {
    render(<EntityList data={mockUsers} columns={columns} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// Test orchestrator separately
describe('EntityManager', () => {
  it('orchestrates components', () => {
    render(<EntityManager config={userConfig} />);
  });
});
```

### Mock API Calls

```typescript
// ✅ Good - Mock API in tests
jest.mock('@/lib/api', () => ({
  fetchUsers: jest.fn(() => Promise.resolve(mockUsers))
}));

test('loads users', async () => {
  render(<UserList />);
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Accessibility

### Use Semantic HTML

```typescript
// ✅ Good - Semantic elements
<EntityList
  data={users}
  columns={columns}
  ariaLabel="Users table"
  role="table"
/>

// Add labels to forms
<EntityForm
  fields={fields}
  ariaDescribedBy="user-form-description"
/>
```

### Keyboard Navigation

```typescript
// ✅ Good - Keyboard accessible actions
.addAction('edit', 'Edit', 'immediate', {
  icon: 'edit',
  keyboardShortcut: 'e',
  onClick: handleEdit
})
```

### Screen Reader Support

```typescript
// ✅ Good - Descriptive labels
.addColumn('status', 'Status', {
  ariaLabel: (value) => `Status: ${value}`,
  render: (value) => <StatusBadge value={value} />
})
```

## Monitoring

### Track Performance

```typescript
// ✅ Good - Monitor render performance
const config = new EntityConfigBuilder<User>('user')
  .enablePerformanceMonitoring({
    onSlowRender: (componentName, duration) => {
      console.warn(`${componentName} took ${duration}ms to render`);
    }
  })
  .build();
```

### Log Errors

```typescript
// ✅ Good - Error tracking
const { update } = useEntityMutations<User>('users', {
  onError: (type, error, original) => {
    // Send to error tracking service
    Sentry.captureException(error, {
      extra: { type, original }
    });
  }
});
```

## Common Pitfalls

### ❌ Don't: Inline Large Objects

```typescript
// ❌ Bad - New object on every render
<EntityList
  columns={[
    { key: 'name', label: 'Name' },
    // 50 more columns...
  ]}
/>

// ✅ Good - Define outside component
const columns = [
  { key: 'name', label: 'Name' },
  // ...
];

<EntityList columns={columns} />
```

### ❌ Don't: Mutate Props

```typescript
// ❌ Bad - Mutating data
const handleSort = () => {
  data.sort((a, b) => a.name.localeCompare(b.name));
};

// ✅ Good - Create new array
const handleSort = () => {
  const sorted = [...data].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  setData(sorted);
};
```

### ❌ Don't: Over-Optimize

```typescript
// ❌ Bad - Premature optimization
const MemoizedEverything = React.memo(
  React.memo(
    React.memo(SimpleComponent)
  )
);

// ✅ Good - Optimize when needed
const ExpensiveComponent = React.memo(({ data }) => {
  // Complex rendering logic
});
```

## See Also

- [Getting Started](./GettingStarted.md) - Quick start guide
- [Architecture](../README.md) - System architecture
- [Examples](../examples/) - Working examples
