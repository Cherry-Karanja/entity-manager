# API Integration

Integrate with REST APIs using providers, hooks, and automatic request management.

## Overview

The API integration layer provides:
- **EntityApiProvider** - Context provider for API configuration
- **useEntityApi** - Hook for CRUD operations
- **useEntityMutations** - Hook for create/update/delete with optimistic updates

## EntityApiProvider

Context provider for configuring API endpoints and clients.

### Basic Usage

```typescript
import { EntityApiProvider } from '@/components/new/entityManager';

const apiConfig = {
  baseURL: 'https://api.example.com',
  entities: {
    users: '/users',
    posts: '/posts',
    comments: '/comments'
  }
};

function App() {
  return (
    <EntityApiProvider config={apiConfig}>
      <UserManagement />
    </EntityApiProvider>
  );
}
```

### With Custom Client

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiConfig = {
  client: apiClient,
  entities: {
    users: '/users'
  }
};

<EntityApiProvider config={apiConfig}>
  <App />
</EntityApiProvider>
```

### Advanced Configuration

```typescript
const apiConfig = {
  baseURL: 'https://api.example.com',
  
  // Entity endpoints
  entities: {
    users: {
      base: '/users',
      list: '/users',
      get: '/users/:id',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id',
      
      // Custom endpoints
      custom: {
        activate: { method: 'POST', path: '/users/:id/activate' },
        deactivate: { method: 'POST', path: '/users/:id/deactivate' }
      }
    }
  },
  
  // Global request config
  timeout: 10000,
  retry: {
    attempts: 3,
    delay: 1000
  },
  
  // Response transformation
  transformResponse: (data) => data.data || data,
  
  // Error handling
  onError: (error) => {
    console.error('API Error:', error);
    if (error.status === 401) {
      // Handle unauthorized
      redirectToLogin();
    }
  }
};
```

## useEntityApi

Hook for performing CRUD operations.

### Basic CRUD

```typescript
import { useEntityApi } from '@/components/new/entityManager';

function UserList() {
  const {
    list,
    get,
    create,
    update,
    delete: deleteUser,
    loading,
    error
  } = useEntityApi<User>('users');

  const [users, setUsers] = useState<User[]>([]);

  // List all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await list();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  // Get single user
  const loadUser = async (id: string) => {
    const user = await get(id);
    return user;
  };

  // Create user
  const handleCreate = async (userData: Partial<User>) => {
    const newUser = await create(userData);
    setUsers([...users, newUser]);
  };

  // Update user
  const handleUpdate = async (id: string, updates: Partial<User>) => {
    const updated = await update(id, updates);
    setUsers(users.map(u => u.id === id ? updated : u));
  };

  // Delete user
  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### With Query Parameters

```typescript
function UserList() {
  const { list } = useEntityApi<User>('users');

  // List with filters
  const loadActiveUsers = async () => {
    const users = await list({
      params: {
        status: 'active',
        role: 'user'
      }
    });
    return users;
  };

  // List with pagination
  const loadPage = async (page: number, pageSize: number) => {
    const users = await list({
      params: {
        page,
        pageSize,
        sort: 'name',
        order: 'asc'
      }
    });
    return users;
  };

  // List with search
  const searchUsers = async (query: string) => {
    const users = await list({
      params: {
        search: query
      }
    });
    return users;
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Custom Endpoints

```typescript
function UserManager() {
  const { custom } = useEntityApi<User>('users');

  const activateUser = async (id: string) => {
    // Calls POST /users/:id/activate
    await custom('activate', { id });
  };

  const deactivateUser = async (id: string) => {
    // Calls POST /users/:id/deactivate
    await custom('deactivate', { id });
  };

  const bulkUpdate = async (ids: string[], updates: Partial<User>) => {
    // Custom bulk endpoint
    await custom('bulkUpdate', {
      method: 'POST',
      path: '/users/bulk',
      data: { ids, updates }
    });
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## useEntityMutations

Hook for mutations with optimistic updates, caching, and error handling.

### Basic Mutations

```typescript
import { useEntityMutations } from '@/components/new/entityManager';

function UserForm() {
  const {
    create,
    update,
    delete: deleteUser,
    loading,
    error
  } = useEntityMutations<User>('users');

  const handleSubmit = async (data: Partial<User>) => {
    try {
      if (data.id) {
        // Update existing
        await update(data.id, data);
      } else {
        // Create new
        await create(data);
      }
      // Success notification
      toast.success('User saved');
    } catch (err) {
      // Error notification
      toast.error('Failed to save user');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### Optimistic Updates

```typescript
function OptimisticUserList() {
  const {
    create,
    update,
    delete: deleteUser
  } = useEntityMutations<User>('users', {
    // Enable optimistic updates
    optimistic: true,
    
    // Callbacks
    onMutate: (type, data) => {
      console.log(`Optimistically ${type}ing:`, data);
    },
    onSuccess: (type, data) => {
      console.log(`${type} succeeded:`, data);
      toast.success(`User ${type}d successfully`);
    },
    onError: (type, error, original) => {
      console.log(`${type} failed, rolled back to:`, original);
      toast.error(`Failed to ${type} user`);
    }
  });

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    // UI updates immediately (optimistic)
    // Automatically rolled back if API fails
    await update(id, updates);
  };

  const handleDelete = async (id: string) => {
    // User removed from UI immediately
    // Restored if API fails
    await deleteUser(id);
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Cache Invalidation

```typescript
function UserMutations() {
  const {
    create,
    update,
    delete: deleteUser
  } = useEntityMutations<User>('users', {
    // Invalidate cache on mutations
    invalidateCache: true,
    
    // Specific cache keys to invalidate
    invalidateKeys: ['users', 'user-stats'],
    
    // Refetch after mutation
    refetchOnSuccess: true
  });

  const handleCreate = async (data: Partial<User>) => {
    // Creates user and invalidates cache
    // All components using 'users' cache will refetch
    await create(data);
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Batch Mutations

```typescript
function BulkUserOperations() {
  const { batch } = useEntityMutations<User>('users');

  const handleBulkUpdate = async (
    ids: string[],
    updates: Partial<User>
  ) => {
    // Execute all updates in parallel
    await batch(
      ids.map(id => ({
        type: 'update',
        id,
        data: updates
      }))
    );
  };

  const handleBulkDelete = async (ids: string[]) => {
    // Delete multiple users
    await batch(
      ids.map(id => ({
        type: 'delete',
        id
      }))
    );
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## Complete Integration Example

```typescript
import {
  EntityApiProvider,
  EntityStateProvider,
  useEntityApi,
  useEntityMutations,
  useEntityCache,
  EntityManager
} from '@/components/new/entityManager';

// 1. Configure API
const apiConfig = {
  baseURL: 'https://api.example.com',
  entities: {
    users: '/users'
  }
};

// 2. App with providers
function App() {
  return (
    <EntityApiProvider config={apiConfig}>
      <EntityStateProvider>
        <UserManagement />
      </EntityStateProvider>
    </EntityApiProvider>
  );
}

// 3. User management with full integration
function UserManagement() {
  // API operations
  const { list } = useEntityApi<User>('users');
  
  // Mutations with optimistic updates
  const {
    create,
    update,
    delete: deleteUser
  } = useEntityMutations<User>('users', {
    optimistic: true,
    invalidateCache: true
  });

  // Cached data
  const {
    data: users,
    loading,
    error,
    refetch
  } = useEntityCache('users', list, {
    ttl: 5 * 60 * 1000
  });

  const handleCreate = async (data: Partial<User>) => {
    await create(data);
    await refetch(); // Refresh list
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    await update(id, updates);
    // Cache automatically invalidated
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    // Cache automatically invalidated
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Add User</button>
      <button onClick={refetch}>Refresh</button>
      {users?.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleUpdate(user.id, { status: 'active' })}>
            Activate
          </button>
          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Using with EntityManager

The EntityManager automatically integrates with the API layer:

```typescript
import { EntityManager, EntityConfigBuilder } from '@/components/new/entityManager';

const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .addColumn('name', 'Name')
  .addColumn('email', 'Email')
  .addField('name', 'text', 'Name', { required: true })
  .addField('email', 'email', 'Email', { required: true })
  .build();

function UserManagement() {
  return (
    <EntityApiProvider config={apiConfig}>
      <EntityStateProvider>
        {/* EntityManager automatically uses API and state */}
        <EntityManager config={userConfig} />
      </EntityStateProvider>
    </EntityApiProvider>
  );
}
```

## Error Handling

```typescript
function UserManager() {
  const { create, update } = useEntityMutations<User>('users', {
    onError: (type, error, original) => {
      // Global error handler
      if (error.status === 401) {
        redirectToLogin();
      } else if (error.status === 403) {
        toast.error('Permission denied');
      } else if (error.status === 422) {
        // Validation errors
        const errors = error.data.errors;
        showValidationErrors(errors);
      } else {
        toast.error(`Failed to ${type} user`);
      }
    }
  });

  const handleCreate = async (data: Partial<User>) => {
    try {
      await create(data);
    } catch (error) {
      // Error already handled by onError
      // Additional error handling if needed
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## Request Cancellation

```typescript
function SearchUsers() {
  const { list } = useEntityApi<User>('users');
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const search = async () => {
      try {
        const data = await list({
          params: { search: query },
          signal: controller.signal
        });
        setResults(data);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Request cancelled
          return;
        }
        // Handle other errors
      }
    };

    search();

    // Cancel on unmount or query change
    return () => controller.abort();
  }, [query]);

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## See Also

- [State Management](./StateManagement.md) - State and cache management
- [EntityManager](./EntityManager.md) - Orchestrator usage
