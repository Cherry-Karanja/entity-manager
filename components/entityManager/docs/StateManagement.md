# State Management

Entity state management with caching, optimistic updates, and sync.

## Overview

The state management layer provides:
- **EntityStateProvider** - Global state context for entities
- **useEntityState** - Hook for accessing and updating entity state
- **useEntityCache** - Advanced caching with TTL and storage options

## EntityStateProvider

Context provider for managing entity state across components.

### Basic Usage

```typescript
import { EntityStateProvider } from '@/components/new/entityManager';

function App() {
  return (
    <EntityStateProvider>
      <UserManagement />
    </EntityStateProvider>
  );
}
```

### With Initial State

```typescript
const initialState = {
  users: {
    data: [],
    loading: false,
    error: null
  },
  posts: {
    data: [],
    loading: false,
    error: null
  }
};

<EntityStateProvider initialState={initialState}>
  <App />
</EntityStateProvider>
```

### With Persistence

```typescript
<EntityStateProvider
  persistence={{
    enabled: true,
    storage: 'localStorage', // or 'sessionStorage'
    key: 'entity-state'
  }}
>
  <App />
</EntityStateProvider>
```

## useEntityState

Hook for accessing and managing entity state.

### Basic Operations

```typescript
import { useEntityState } from '@/components/new/entityManager';

function UserList() {
  const {
    data: users,
    loading,
    error,
    setData,
    setLoading,
    setError,
    reset
  } = useEntityState<User>('users');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### CRUD Operations

```typescript
function UserManager() {
  const {
    data: users,
    addEntity,
    updateEntity,
    deleteEntity,
    setData
  } = useEntityState<User>('users');

  const handleCreate = async (userData: Partial<User>) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempUser = { ...userData, id: tempId } as User;
    addEntity(tempUser);

    try {
      const newUser = await createUser(userData);
      // Replace temp with real entity
      updateEntity(tempId, newUser);
    } catch (error) {
      // Rollback on error
      deleteEntity(tempId);
      throw error;
    }
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    const original = users.find(u => u.id === id);
    
    // Optimistic update
    updateEntity(id, updates);

    try {
      const updated = await updateUser(id, updates);
      updateEntity(id, updated);
    } catch (error) {
      // Rollback on error
      if (original) updateEntity(id, original);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    const original = users.find(u => u.id === id);
    
    // Optimistic delete
    deleteEntity(id);

    try {
      await deleteUser(id);
    } catch (error) {
      // Rollback on error
      if (original) addEntity(original);
      throw error;
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Bulk Operations

```typescript
function BulkUserManager() {
  const {
    data: users,
    bulkUpdate,
    bulkDelete,
    setData
  } = useEntityState<User>('users');

  const handleBulkDelete = async (ids: string[]) => {
    const toDelete = users.filter(u => ids.includes(u.id));
    
    // Optimistic bulk delete
    bulkDelete(ids);

    try {
      await bulkDeleteUsers(ids);
    } catch (error) {
      // Rollback on error
      setData([...users, ...toDelete]);
      throw error;
    }
  };

  const handleBulkUpdate = async (
    ids: string[],
    updates: Partial<User>
  ) => {
    const originals = users.filter(u => ids.includes(u.id));
    
    // Optimistic bulk update
    bulkUpdate(ids, updates);

    try {
      await bulkUpdateUsers(ids, updates);
    } catch (error) {
      // Rollback on error
      const rollback = users.map(user => {
        const original = originals.find(o => o.id === user.id);
        return original || user;
      });
      setData(rollback);
      throw error;
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Filter and Sort

```typescript
function UserListWithFilters() {
  const {
    data: users,
    filterBy,
    sortBy,
    reset
  } = useEntityState<User>('users');

  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sort, setSort] = useState<SortConfig | null>(null);

  // Apply filters
  useEffect(() => {
    if (filters.length > 0) {
      filterBy(filters);
    }
  }, [filters]);

  // Apply sorting
  useEffect(() => {
    if (sort) {
      sortBy(sort);
    }
  }, [sort]);

  return (
    <div>
      <FilterBar onChange={setFilters} />
      <SortBar onChange={setSort} />
      <EntityList data={users} />
    </div>
  );
}
```

## useEntityCache

Advanced caching with TTL, storage options, and invalidation.

### Basic Caching

```typescript
import { useEntityCache } from '@/components/new/entityManager';

function UserList() {
  const {
    data: users,
    loading,
    error,
    refetch,
    invalidate
  } = useEntityCache<User[]>('users', fetchUsers, {
    ttl: 5 * 60 * 1000, // 5 minutes
    storage: 'memory'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <button onClick={invalidate}>Clear Cache</button>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Cache Configuration

```typescript
const {
  data,
  loading,
  error,
  refetch,
  invalidate,
  isCached,
  isStale
} = useEntityCache<User[]>('users', fetchUsers, {
  // Cache duration (ms)
  ttl: 5 * 60 * 1000,
  
  // Storage type
  storage: 'memory', // 'memory' | 'localStorage' | 'sessionStorage'
  
  // Stale-while-revalidate
  staleWhileRevalidate: true,
  
  // Retry on error
  retry: 3,
  retryDelay: 1000,
  
  // Deduplicate concurrent requests
  dedupe: true,
  
  // Cache key (auto-generated if not provided)
  cacheKey: 'users-list',
  
  // Enable/disable cache
  enabled: true,
  
  // Invalidate on mount
  invalidateOnMount: false,
  
  // Refresh on window focus
  refreshOnFocus: true,
  
  // Refresh on network reconnect
  refreshOnReconnect: true
});
```

### Cache with Dependencies

```typescript
function UserPosts({ userId }: { userId: string }) {
  const {
    data: posts,
    loading,
    refetch
  } = useEntityCache<Post[]>(
    `user-${userId}-posts`, // Dynamic cache key
    () => fetchUserPosts(userId),
    {
      ttl: 2 * 60 * 1000,
      // Re-fetch when userId changes
      dependencies: [userId]
    }
  );

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Manual Cache Management

```typescript
import { useEntityCache, cacheManager } from '@/components/new/entityManager';

function App() {
  // Clear all cache
  const clearAllCache = () => {
    cacheManager.clear();
  };

  // Clear specific cache
  const clearUserCache = () => {
    cacheManager.invalidate('users');
  };

  // Invalidate by pattern
  const clearUserPosts = () => {
    cacheManager.invalidatePattern(/^user-.*-posts$/);
  };

  // Get cache stats
  const stats = cacheManager.getStats();
  console.log(`Cache hit rate: ${stats.hitRate}%`);
  console.log(`Total entries: ${stats.entries}`);
  console.log(`Memory usage: ${stats.size} bytes`);

  return (
    <div>
      <button onClick={clearAllCache}>Clear All Cache</button>
      <button onClick={clearUserCache}>Clear User Cache</button>
    </div>
  );
}
```

### Prefetching

```typescript
function UserList() {
  const { data: users } = useEntityCache('users', fetchUsers);

  // Prefetch user details on hover
  const prefetchUser = (userId: string) => {
    cacheManager.prefetch(
      `user-${userId}`,
      () => fetchUser(userId),
      { ttl: 5 * 60 * 1000 }
    );
  };

  return (
    <div>
      {users?.map(user => (
        <Link
          key={user.id}
          to={`/users/${user.id}`}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          {user.name}
        </Link>
      ))}
    </div>
  );
}
```

### Cache Synchronization

```typescript
function MultipleUserLists() {
  // Both components share the same cache
  const list1 = useEntityCache('users', fetchUsers);
  const list2 = useEntityCache('users', fetchUsers);

  // Updating in one component updates both
  const handleUpdate = async (userId: string, updates: Partial<User>) => {
    await updateUser(userId, updates);
    
    // Invalidate cache to trigger refetch in both components
    cacheManager.invalidate('users');
  };

  return (
    <div>
      <UserList data={list1.data} onUpdate={handleUpdate} />
      <UserList data={list2.data} onUpdate={handleUpdate} />
    </div>
  );
}
```

## Advanced Patterns

### Optimistic UI Updates

```typescript
function OptimisticUserUpdater() {
  const {
    data: users,
    updateEntity
  } = useEntityState<User>('users');

  const { invalidate } = useEntityCache('users', fetchUsers);

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    // 1. Optimistic update in state
    updateEntity(id, updates);

    try {
      // 2. Send to server
      await updateUser(id, updates);
      
      // 3. Invalidate cache to refetch fresh data
      await invalidate();
    } catch (error) {
      // 4. Rollback on error
      await invalidate(); // Refetch to get original data
      throw error;
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Pagination with Cache

```typescript
function PaginatedUserList() {
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const {
    data: users,
    loading
  } = useEntityCache(
    `users-page-${page}`,
    () => fetchUsers({ page, pageSize }),
    {
      ttl: 5 * 60 * 1000,
      // Keep previous page data while loading next page
      staleWhileRevalidate: true
    }
  );

  // Prefetch next page
  useEffect(() => {
    cacheManager.prefetch(
      `users-page-${page + 1}`,
      () => fetchUsers({ page: page + 1, pageSize }),
      { ttl: 5 * 60 * 1000 }
    );
  }, [page]);

  return (
    <div>
      <EntityList data={users} />
      <Pagination
        page={page}
        onChange={setPage}
        loading={loading}
      />
    </div>
  );
}
```

### Real-time Updates

```typescript
function RealtimeUserList() {
  const { data: users, setData } = useEntityState<User>('users');
  const { invalidate } = useEntityCache('users', fetchUsers);

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('ws://api.example.com/users');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'user.created':
          // Invalidate cache to refetch with new user
          invalidate();
          break;

        case 'user.updated':
          // Update specific user in state
          const updatedUsers = users.map(u =>
            u.id === message.data.id ? message.data : u
          );
          setData(updatedUsers);
          break;

        case 'user.deleted':
          // Remove user from state
          const filtered = users.filter(u => u.id !== message.data.id);
          setData(filtered);
          break;
      }
    };

    return () => ws.close();
  }, [users]);

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## See Also

- [API Integration](./APIIntegration.md) - Using with API providers
- [EntityManager](./EntityManager.md) - Orchestrator integration
