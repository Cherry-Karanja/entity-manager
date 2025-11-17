# Configuration Adapters

Generate entity configurations from external schemas and metadata sources.

## Overview

Adapters automatically convert external schema formats into Entity Manager configurations, reducing manual configuration work and ensuring consistency.

Available adapters:
- **JSON Schema Adapter** - Convert JSON Schema to entity config
- **OpenAPI Adapter** - Generate configs from OpenAPI/Swagger specs
- **TypeScript Adapter** - Infer configs from TypeScript types
- **Database Adapter** - Generate from database table metadata

## JSON Schema Adapter

Convert JSON Schema definitions to entity configurations.

### Basic Usage

```typescript
import { fromJSONSchema } from '@/components/new/entityManager';

const userSchema = {
  type: 'object',
  title: 'User',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 50
    },
    email: {
      type: 'string',
      format: 'email'
    },
    age: {
      type: 'integer',
      minimum: 18,
      maximum: 120
    },
    role: {
      type: 'string',
      enum: ['admin', 'user', 'guest']
    },
    active: {
      type: 'boolean',
      default: true
    }
  },
  required: ['name', 'email']
};

const config = fromJSONSchema<User>(userSchema, 'user');

// Use with EntityManager
<EntityManager config={config} />
```

### Field Type Mapping

JSON Schema types are automatically mapped to field types:

```typescript
// String types
{ type: 'string' } → text field
{ type: 'string', format: 'email' } → email field
{ type: 'string', format: 'uri' } → url field
{ type: 'string', format: 'date' } → date field
{ type: 'string', format: 'date-time' } → datetime field
{ type: 'string', enum: [...] } → select field

// Number types
{ type: 'integer' } → number field (step: 1)
{ type: 'number' } → number field (step: any)

// Boolean type
{ type: 'boolean' } → checkbox field

// Array type
{ type: 'array', items: { enum: [...] } } → multiselect field

// Complex nested objects
{ type: 'object' } → nested field group
```

### Validation Mapping

JSON Schema validation is converted to field validation:

```typescript
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,        // → minLength validation
      maxLength: 20,       // → maxLength validation
      pattern: '^[a-z]+$'  // → pattern validation
    },
    email: {
      type: 'string',
      format: 'email'      // → email validation
    },
    age: {
      type: 'integer',
      minimum: 18,         // → min validation
      maximum: 120         // → max validation
    },
    website: {
      type: 'string',
      format: 'uri'        // → url validation
    }
  },
  required: ['username', 'email']  // → required validation
};
```

### Options Configuration

```typescript
const config = fromJSONSchema<User>(userSchema, 'user', {
  // Include all properties as columns
  includeAllColumns: true,
  
  // Only include specific columns
  columns: ['name', 'email', 'role'],
  
  // Custom column configuration
  columnConfig: {
    name: { sortable: true, width: 200 },
    email: { sortable: true, filterable: true },
    role: { filterable: true }
  },
  
  // Include all properties as fields
  includeAllFields: true,
  
  // Only include specific fields
  fields: ['name', 'email', 'role', 'active'],
  
  // Custom field configuration
  fieldConfig: {
    name: { placeholder: 'Enter full name' },
    role: { defaultValue: 'user' }
  },
  
  // Add custom actions
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      type: 'immediate',
      onClick: (user) => navigate(`/users/${user.id}/edit`)
    }
  ]
});
```

## OpenAPI Adapter

Generate configurations from OpenAPI/Swagger specifications.

### Basic Usage

```typescript
import { fromOpenAPI } from '@/components/new/entityManager';

const openApiSpec = {
  openapi: '3.0.0',
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: {
            type: 'string',
            enum: ['admin', 'user']
          }
        },
        required: ['name', 'email']
      }
    }
  },
  paths: {
    '/users': {
      get: {
        summary: 'List users',
        operationId: 'listUsers'
      },
      post: {
        summary: 'Create user',
        operationId: 'createUser'
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Get user',
        operationId: 'getUser'
      },
      put: {
        summary: 'Update user',
        operationId: 'updateUser'
      },
      delete: {
        summary: 'Delete user',
        operationId: 'deleteUser'
      }
    }
  }
};

const config = fromOpenAPI<User>(openApiSpec, 'User', {
  basePath: '/users'
});

// Automatically includes API methods
<EntityManager config={config} />
```

### API Integration

The OpenAPI adapter automatically generates API integration:

```typescript
const config = fromOpenAPI<User>(openApiSpec, 'User', {
  basePath: '/users',
  
  // Custom API client
  apiClient: axios.create({
    baseURL: 'https://api.example.com',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  
  // Custom operation mapping
  operations: {
    list: 'listUsers',      // GET /users
    get: 'getUser',         // GET /users/{id}
    create: 'createUser',   // POST /users
    update: 'updateUser',   // PUT /users/{id}
    delete: 'deleteUser'    // DELETE /users/{id}
  }
});
```

### Actions from Operations

```typescript
// Automatically generates actions based on available operations
const config = fromOpenAPI<User>(openApiSpec, 'User', {
  basePath: '/users',
  
  // Generate standard CRUD actions
  generateActions: true,
  
  // Customize action configuration
  actionConfig: {
    edit: {
      visible: (user, context) => context.permissions.includes('edit')
    },
    delete: {
      confirm: {
        title: 'Delete User',
        message: 'This action cannot be undone.'
      }
    }
  }
});
```

## TypeScript Adapter

Infer configurations from TypeScript interfaces and types.

### Basic Usage

```typescript
import { fromTypeScript } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: Date;
}

// TypeScript type is passed at compile time
const config = fromTypeScript<User>('user', {
  // Metadata for fields not inferable from TS
  metadata: {
    name: { required: true, minLength: 3 },
    email: { required: true, format: 'email' },
    age: { min: 18, max: 120 },
    role: { enum: ['admin', 'user'] }
  },
  
  // Configure which fields to include
  columns: ['name', 'email', 'role', 'active'],
  fields: ['name', 'email', 'age', 'role', 'active']
});
```

### With Decorators (if using experimental decorators)

```typescript
import { Entity, Field, Column } from '@/components/new/entityManager';

@Entity('user')
class User {
  @Column({ sortable: true })
  @Field({ type: 'text', required: true })
  name: string;

  @Column({ sortable: true, filterable: true })
  @Field({ type: 'email', required: true })
  email: string;

  @Column({ filterable: true })
  @Field({ type: 'select', options: ['admin', 'user'] })
  role: string;

  @Column()
  active: boolean;
}

const config = fromTypeScript(User);
```

## Database Adapter

Generate configurations from database table metadata.

### Basic Usage

```typescript
import { fromDatabase } from '@/components/new/entityManager';

// PostgreSQL example
const tableMetadata = {
  tableName: 'users',
  columns: [
    {
      name: 'id',
      type: 'uuid',
      nullable: false,
      primaryKey: true
    },
    {
      name: 'name',
      type: 'varchar',
      length: 255,
      nullable: false
    },
    {
      name: 'email',
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true
    },
    {
      name: 'age',
      type: 'integer',
      nullable: true
    },
    {
      name: 'role',
      type: 'varchar',
      length: 50,
      nullable: false,
      default: 'user'
    },
    {
      name: 'active',
      type: 'boolean',
      nullable: false,
      default: true
    },
    {
      name: 'created_at',
      type: 'timestamp',
      nullable: false,
      default: 'CURRENT_TIMESTAMP'
    }
  ]
};

const config = fromDatabase<User>(tableMetadata, {
  // Map DB types to field types
  typeMapping: {
    'varchar': 'text',
    'integer': 'number',
    'boolean': 'checkbox',
    'timestamp': 'datetime',
    'uuid': 'text'
  },
  
  // Exclude system columns
  excludeColumns: ['id', 'created_at', 'updated_at'],
  
  // Required fields based on NOT NULL
  inferRequired: true,
  
  // Default values from DB defaults
  inferDefaults: true
});
```

### Database Type Mapping

Common database type conversions:

```typescript
// String types
VARCHAR, TEXT → text field
UUID → text field (with pattern validation)

// Number types
INTEGER, BIGINT → number field (step: 1)
DECIMAL, NUMERIC, FLOAT → number field

// Boolean
BOOLEAN → checkbox field

// Date/Time
DATE → date field
TIME → time field
TIMESTAMP, DATETIME → datetime field

// Enum
ENUM → select field

// JSON
JSON, JSONB → json field
```

### Foreign Key Relations

```typescript
const tableMetadata = {
  tableName: 'posts',
  columns: [
    { name: 'id', type: 'uuid', primaryKey: true },
    { name: 'title', type: 'varchar' },
    { name: 'author_id', type: 'uuid' }
  ],
  foreignKeys: [
    {
      column: 'author_id',
      referencedTable: 'users',
      referencedColumn: 'id'
    }
  ]
};

const config = fromDatabase<Post>(tableMetadata, {
  // Configure foreign key fields
  foreignKeyConfig: {
    author_id: {
      type: 'select',
      label: 'Author',
      // Load options from referenced table
      optionsLoader: async () => {
        const users = await fetchUsers();
        return users.map(u => ({ label: u.name, value: u.id }));
      }
    }
  }
});
```

## Combining Adapters

You can combine multiple adapters or extend generated configs:

```typescript
import { fromJSONSchema, EntityConfigBuilder } from '@/components/new/entityManager';

// Start with JSON Schema
const baseConfig = fromJSONSchema<User>(userSchema, 'user');

// Extend with custom configuration
const config = new EntityConfigBuilder<User>('user')
  // Copy base configuration
  .setLabel(baseConfig.label, baseConfig.pluralLabel)
  .addColumns(baseConfig.columns)
  .addFields(baseConfig.fields)
  
  // Add custom columns
  .addColumn('actions', 'Actions', {
    render: (value, user) => <UserActions user={user} />
  })
  
  // Add custom fields
  .addField('avatar', 'image', 'Avatar', {
    accept: 'image/*',
    maxSize: 2 * 1024 * 1024
  })
  
  // Add actions
  .addAction('edit', 'Edit', 'immediate', {
    onClick: handleEdit
  })
  
  .build();
```

## Custom Adapters

Create custom adapters for your own schema formats:

```typescript
import { EntityConfigBuilder } from '@/components/new/entityManager';

function fromCustomSchema<T>(schema: CustomSchema, entityName: string) {
  const builder = new EntityConfigBuilder<T>(entityName);
  
  // Set basic info
  builder.setLabel(schema.title, schema.pluralTitle);
  
  // Convert fields
  for (const [key, field] of Object.entries(schema.fields)) {
    builder.addColumn(key, field.label, {
      sortable: field.sortable,
      filterable: field.filterable
    });
    
    builder.addField(key, mapFieldType(field.type), field.label, {
      required: field.required,
      validation: mapValidation(field.validation)
    });
  }
  
  return builder.build();
}

// Helper functions
function mapFieldType(type: string): FieldType {
  const typeMap = {
    'string': 'text',
    'email': 'email',
    'number': 'number',
    // ...
  };
  return typeMap[type] || 'text';
}

function mapValidation(rules: any[]): ValidationRule[] {
  return rules.map(rule => ({
    type: rule.type,
    value: rule.value,
    message: rule.message
  }));
}
```

## See Also

- [Builders](./Builders.md) - Manual configuration building
- [EntityManager](./EntityManager.md) - Using configurations
