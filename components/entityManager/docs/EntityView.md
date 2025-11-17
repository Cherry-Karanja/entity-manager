# EntityView Component

Display component with 4 view modes, field grouping, and tabs.

## Features

- **4 View Modes**: detail, card, summary, timeline
- **Field Grouping**: Organize fields into sections
- **Tabs**: Multi-tab layout for complex entities
- **Metadata**: Show creation/modification info
- **Actions**: Inline actions in view
- **Responsive**: Adapts to screen size

## Usage

### Basic Example

```typescript
import { EntityView } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'bio', label: 'Biography', type: 'longtext' }
];

function UserView({ user }: { user: User }) {
  return (
    <EntityView<User>
      data={user}
      fields={fields}
      view="detail"
    />
  );
}
```

### Different View Modes

```typescript
// Detail view (default - vertical layout)
<EntityView data={user} fields={fields} view="detail" />

// Card view (compact card)
<EntityView 
  data={user} 
  fields={fields} 
  view="card"
  avatar={user.avatar}
  title={user.name}
  subtitle={user.role}
/>

// Summary view (horizontal layout)
<EntityView data={user} fields={fields} view="summary" />

// Timeline view (chronological events)
<EntityView 
  data={user} 
  fields={activityFields} 
  view="timeline"
  dateField="createdAt"
/>
```

### Field Grouping

```typescript
const fieldGroups = [
  {
    key: 'basic',
    label: 'Basic Information',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone', type: 'tel' }
    ]
  },
  {
    key: 'profile',
    label: 'Profile',
    fields: [
      { key: 'bio', label: 'Biography', type: 'longtext' },
      { key: 'website', label: 'Website', type: 'url' },
      { key: 'location', label: 'Location' }
    ]
  },
  {
    key: 'settings',
    label: 'Settings',
    fields: [
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'permissions', label: 'Permissions', type: 'list' }
    ],
    collapsible: true,
    collapsed: false
  }
];

<EntityView
  data={user}
  fieldGroups={fieldGroups}
  view="detail"
/>
```

### With Tabs

```typescript
const tabs = [
  {
    key: 'overview',
    label: 'Overview',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ]
  },
  {
    key: 'profile',
    label: 'Profile',
    fields: [
      { key: 'bio', label: 'Biography', type: 'longtext' },
      { key: 'avatar', label: 'Avatar', type: 'image' }
    ]
  },
  {
    key: 'activity',
    label: 'Activity',
    content: <UserActivityTimeline userId={user.id} />
  }
];

<EntityView
  data={user}
  tabs={tabs}
  view="detail"
/>
```

### Custom Field Rendering

```typescript
const fields = [
  {
    key: 'name',
    label: 'Name',
    render: (value, entity) => (
      <div className="flex items-center">
        <img src={entity.avatar} className="w-10 h-10 rounded-full mr-3" />
        <span className="font-semibold text-lg">{value}</span>
      </div>
    )
  },
  {
    key: 'email',
    label: 'Email',
    render: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {value}
      </a>
    )
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`badge badge-${value}`}>
        {value}
      </span>
    )
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'list',
    render: (value: string[]) => (
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <span key={tag} className="badge">{tag}</span>
        ))}
      </div>
    )
  }
];
```

### With Metadata

```typescript
<EntityView
  data={user}
  fields={fields}
  view="detail"
  showMetadata
  metadata={{
    createdAt: user.createdAt,
    createdBy: user.createdBy,
    updatedAt: user.updatedAt,
    updatedBy: user.updatedBy,
    version: user.version
  }}
/>
```

### With Actions

```typescript
<EntityView
  data={user}
  fields={fields}
  view="detail"
  actions={[
    {
      label: 'Edit',
      icon: 'edit',
      onClick: () => navigate(`/users/${user.id}/edit`),
      primary: true
    },
    {
      label: 'Delete',
      icon: 'delete',
      onClick: handleDelete,
      variant: 'danger',
      confirm: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?'
      }
    },
    {
      label: 'Download',
      icon: 'download',
      onClick: () => exportUser(user)
    }
  ]}
/>
```

### Nested Objects

```typescript
const fields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  
  // Nested object fields
  { key: 'address.street', label: 'Street' },
  { key: 'address.city', label: 'City' },
  { key: 'address.zip', label: 'ZIP Code' },
  
  // Array fields
  { key: 'roles', label: 'Roles', type: 'list' },
  
  // Related entity
  {
    key: 'company',
    label: 'Company',
    render: (company) => (
      <a href={`/companies/${company.id}`}>
        {company.name}
      </a>
    )
  }
];
```

### Loading & Error States

```typescript
function UserDetail({ userId }: { userId: string }) {
  const { data: user, loading, error } = useUser(userId);

  return (
    <EntityView
      data={user}
      fields={fields}
      loading={loading}
      error={error}
      emptyMessage="User not found"
    />
  );
}
```

## Props

### EntityViewProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T` | required | Entity to display |
| `fields` | `Field[]` | - | Field definitions |
| `fieldGroups` | `FieldGroup[]` | - | Grouped fields |
| `tabs` | `TabConfig[]` | - | Tab configuration |
| `view` | `'detail'\|'card'\|'summary'\|'timeline'` | `'detail'` | View mode |
| `title` | `string \| ReactNode` | - | Custom title |
| `subtitle` | `string \| ReactNode` | - | Custom subtitle |
| `avatar` | `string \| ReactNode` | - | Avatar image or component |
| `dateField` | `keyof T` | - | Date field for timeline view |
| `showMetadata` | `boolean` | `false` | Show creation/update metadata |
| `metadata` | `Metadata` | - | Custom metadata |
| `actions` | `Action[]` | - | View actions |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `Error \| string` | - | Error state |
| `emptyMessage` | `string` | `'No data'` | Empty state message |
| `className` | `string` | `''` | Custom CSS class |
| `bordered` | `boolean` | `true` | Show border |
| `shadowed` | `boolean` | `false` | Show shadow |

### Field Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `keyof T \| string` | Field key (supports nested paths) |
| `label` | `string` | Field label |
| `type` | `'text'\|'longtext'\|'number'\|'date'\|'boolean'\|'list'\|'image'\|'url'\|'tel'\|'email'` | Field type (affects formatting) |
| `formatter` | `(value, entity) => string` | Value formatter |
| `render` | `(value, entity) => ReactNode` | Custom field renderer |
| `visible` | `boolean \| (entity) => boolean` | Field visibility |
| `order` | `number` | Display order |
| `className` | `string` | Field CSS class |

### FieldGroup Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Group key |
| `label` | `string` | Group label |
| `fields` | `Field[]` | Fields in group |
| `collapsible` | `boolean` | Allow collapse |
| `collapsed` | `boolean` | Initial collapsed state |
| `order` | `number` | Group display order |

### Tab Configuration

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Tab key |
| `label` | `string` | Tab label |
| `icon` | `string \| ReactNode` | Tab icon |
| `fields` | `Field[]` | Fields in tab |
| `content` | `ReactNode` | Custom tab content |
| `badge` | `string \| number` | Badge value |

### Metadata

| Prop | Type | Description |
|------|------|-------------|
| `createdAt` | `Date` | Creation date |
| `createdBy` | `string` | Creator name/ID |
| `updatedAt` | `Date` | Last update date |
| `updatedBy` | `string` | Last updater name/ID |
| `version` | `number` | Version number |

## Examples

See the [demo page](../examples/EntityViewDemo.tsx) for live examples.

## Styling

```css
.entity-view { }
.entity-view-detail { }
.entity-view-card { }
.entity-view-summary { }
.entity-view-timeline { }
.entity-view-field { }
.entity-view-field-label { }
.entity-view-field-value { }
.entity-view-group { }
.entity-view-tabs { }
.entity-view-metadata { }
.entity-view-actions { }
```

## Performance

- Use `memo` for custom field renderers
- Avoid inline functions for `visible` prop
- Lazy load tab content if complex
