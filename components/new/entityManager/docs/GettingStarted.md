# Getting Started

Quick start guide for using the Entity Manager in your project.

## Installation

```bash
# The Entity Manager is part of your project
# No installation needed - it's in components/new/entityManager
```

## Your First Entity Manager

Let's build a complete user management system in just a few minutes.

### Step 1: Define Your Entity Type

```typescript
// types/user.ts
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: Date;
}
```

### Step 2: Create Configuration

```typescript
// config/userConfig.ts
import { EntityConfigBuilder } from '@/components/new/entityManager';
import type { User } from '@/types/user';

export const userConfig = new EntityConfigBuilder<User>('user')
  // Basic info
  .setLabel('User', 'Users')
  .setIcon('user')
  
  // List columns
  .addColumn('name', 'Name', { sortable: true, width: 200 })
  .addColumn('email', 'Email', { sortable: true })
  .addColumn('role', 'Role', { 
    filterable: true,
    render: (value) => (
      <span className={`badge badge-${value}`}>
        {value}
      </span>
    )
  })
  .addColumn('status', 'Status', {
    filterable: true,
    render: (value) => (
      <span className={`status-${value}`}>
        {value}
      </span>
    )
  })
  
  // Form fields
  .addField('name', 'text', 'Name', {
    required: true,
    placeholder: 'Enter full name'
  })
  .addField('email', 'email', 'Email', {
    required: true,
    validation: [{ type: 'email' }]
  })
  .addField('role', 'select', 'Role', {
    options: [
      { label: 'Administrator', value: 'admin' },
      { label: 'User', value: 'user' }
    ],
    defaultValue: 'user'
  })
  .addField('status', 'select', 'Status', {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ],
    defaultValue: 'active'
  })
  
  // Actions
  .addAction('edit', 'Edit', 'immediate', {
    icon: 'edit',
    onClick: (user) => console.log('Edit', user)
  })
  .addAction('delete', 'Delete', 'confirm', {
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?'
    },
    onClick: async (user) => {
      // Handle delete
      console.log('Delete', user);
    }
  })
  
  // Features
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25 })
  .enableExport(['csv', 'xlsx'])
  
  .build();
```

### Step 3: Use EntityManager

```typescript
// app/users/page.tsx
import { EntityManager } from '@/components/new/entityManager';
import { userConfig } from '@/config/userConfig';

export default function UsersPage() {
  return (
    <div className="container">
      <h1>User Management</h1>
      <EntityManager config={userConfig} />
    </div>
  );
}
```

That's it! You now have a fully functional user management system with:
- ✅ List view with search, filter, sort, and pagination
- ✅ Create/edit forms with validation
- ✅ Detail view
- ✅ Actions (edit, delete)
- ✅ Export to CSV/Excel

## Adding API Integration

### Step 1: Configure API

```typescript
// lib/api/config.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

export const apiConfig = {
  client: apiClient,
  entities: {
    users: '/users'
  }
};
```

### Step 2: Wrap with Providers

```typescript
// app/layout.tsx (Next.js) or app/App.tsx (React)
import { 
  EntityApiProvider, 
  EntityStateProvider 
} from '@/components/new/entityManager';
import { apiConfig } from '@/lib/api/config';

export default function RootLayout({ children }) {
  return (
    <EntityApiProvider config={apiConfig}>
      <EntityStateProvider>
        {children}
      </EntityStateProvider>
    </EntityApiProvider>
  );
}
```

### Step 3: EntityManager Automatically Uses API

```typescript
// app/users/page.tsx
import { EntityManager } from '@/components/new/entityManager';
import { userConfig } from '@/config/userConfig';

export default function UsersPage() {
  return (
    <EntityManager config={userConfig} />
  );
}
```

The EntityManager will automatically:
- Load data from `GET /users`
- Create users via `POST /users`
- Update users via `PUT /users/:id`
- Delete users via `DELETE /users/:id`

## Using Standalone Components

You don't have to use the full EntityManager. You can use components individually:

### EntityList Only

```typescript
import { EntityList } from '@/components/new/entityManager';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  return (
    <EntityList
      data={users}
      columns={columns}
      view="table"
      searchable
      sortable
      pagination
    />
  );
}
```

### EntityForm Only

```typescript
import { EntityForm } from '@/components/new/entityManager';

function CreateUserForm() {
  const fields = [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      required: true
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: [{ type: 'email' }]
    }
  ];

  const handleSubmit = async (data: Partial<User>) => {
    await createUser(data);
  };

  return (
    <EntityForm
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Create User"
    />
  );
}
```

### EntityView Only

```typescript
import { EntityView } from '@/components/new/entityManager';

function UserProfile({ user }: { user: User }) {
  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'createdAt', label: 'Created', type: 'date' }
  ];

  return (
    <EntityView
      data={user}
      fields={fields}
      view="detail"
    />
  );
}
```

## Using with JSON Schema

If you have a JSON Schema, you can auto-generate the configuration:

```typescript
import { fromJSONSchema } from '@/components/new/entityManager';

const userSchema = {
  type: 'object',
  title: 'User',
  properties: {
    name: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'user'] }
  },
  required: ['name', 'email']
};

const config = fromJSONSchema<User>(userSchema, 'user');

<EntityManager config={config} />
```

## Next Steps

Now that you have the basics, explore:

1. **[Component Documentation](./EntityList.md)** - Learn about each component in detail
2. **[Builders](./Builders.md)** - Advanced configuration building
3. **[Adapters](./Adapters.md)** - Generate configs from schemas
4. **[State Management](./StateManagement.md)** - Advanced state and caching
5. **[API Integration](./APIIntegration.md)** - Complete API setup

## Common Patterns

### Custom Actions

```typescript
const config = new EntityConfigBuilder<User>('user')
  // ... other config
  .addAction('resetPassword', 'Reset Password', 'form', {
    icon: 'key',
    form: {
      title: 'Reset Password',
      fields: [
        {
          key: 'newPassword',
          type: 'password',
          label: 'New Password',
          required: true
        }
      ]
    },
    onClick: async (user, formData) => {
      await resetPassword(user.id, formData.newPassword);
    }
  })
  .build();
```

### Conditional Fields

```typescript
const config = new EntityConfigBuilder<User>('user')
  .addField('role', 'select', 'Role', {
    options: roleOptions
  })
  .addField('department', 'select', 'Department', {
    // Only show if role is 'admin'
    visible: (data) => data.role === 'admin',
    options: departmentOptions
  })
  .build();
```

### Custom Cell Rendering

```typescript
const config = new EntityConfigBuilder<User>('user')
  .addColumn('avatar', 'Avatar', {
    render: (value, user) => (
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
    )
  })
  .addColumn('name', 'Name', {
    render: (value, user) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    )
  })
  .build();
```

## Troubleshooting

### Components not rendering

Make sure you've wrapped your app with providers:

```typescript
<EntityApiProvider config={apiConfig}>
  <EntityStateProvider>
    <App />
  </EntityStateProvider>
</EntityApiProvider>
```

### API requests failing

Check your API configuration and CORS settings:

```typescript
const apiConfig = {
  baseURL: 'https://api.example.com',
  entities: {
    users: '/users'
  },
  // Add credentials if needed
  withCredentials: true
};
```

### TypeScript errors

Make sure your entity type is properly defined:

```typescript
interface User {
  id: string;  // Required
  // ... other fields
}
```

## Support

- 📖 [Full Documentation](../README.md)
- 💡 [Examples](../examples/)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
