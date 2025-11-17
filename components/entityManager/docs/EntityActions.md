# EntityActions Component

Action system with 8 action types, modals, and bulk operations.

## Features

- **8 Action Types**: immediate, confirm, form, modal, navigation, bulk, download, custom
- **Modals**: Built-in modal system for confirm/form actions
- **Bulk Operations**: Handle multiple entities at once
- **Permissions**: Action visibility based on permissions
- **Disabled States**: Context-aware disabled states
- **Custom Rendering**: Full control over action appearance

## Usage

### Basic Example

```typescript
import { EntityActions } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const actions = [
  {
    key: 'edit',
    label: 'Edit',
    type: 'immediate',
    icon: 'edit',
    onClick: (user) => navigate(`/users/${user.id}/edit`)
  },
  {
    key: 'delete',
    label: 'Delete',
    type: 'confirm',
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    },
    onClick: async (user) => {
      await deleteUser(user.id);
    }
  }
];

function UserActions({ user }: { user: User }) {
  return (
    <EntityActions<User>
      entity={user}
      actions={actions}
    />
  );
}
```

### All Action Types

```typescript
const allActionTypes = [
  {
    // Immediate action - executes immediately
    key: 'edit',
    type: 'immediate',
    label: 'Edit',
    icon: 'edit',
    onClick: (entity) => navigate(`/edit/${entity.id}`)
  },
  {
    // Confirm action - shows confirmation dialog
    key: 'delete',
    type: 'confirm',
    label: 'Delete',
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Confirm Delete',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmVariant: 'danger'
    },
    onClick: async (entity) => {
      await deleteEntity(entity.id);
    }
  },
  {
    // Form action - shows form in modal
    key: 'assign',
    type: 'form',
    label: 'Assign',
    icon: 'assign',
    form: {
      title: 'Assign User',
      fields: [
        {
          key: 'assignee',
          type: 'select',
          label: 'Assign To',
          options: userOptions,
          required: true
        },
        {
          key: 'notes',
          type: 'textarea',
          label: 'Notes'
        }
      ],
      submitLabel: 'Assign'
    },
    onClick: async (entity, formData) => {
      await assignUser(entity.id, formData);
    }
  },
  {
    // Modal action - custom modal content
    key: 'details',
    type: 'modal',
    label: 'View Details',
    icon: 'info',
    modal: {
      title: 'User Details',
      content: (entity) => <UserDetails user={entity} />,
      size: 'large'
    }
  },
  {
    // Navigation action - link to another page
    key: 'view',
    type: 'navigation',
    label: 'View',
    icon: 'eye',
    href: (entity) => `/users/${entity.id}`
  },
  {
    // Bulk action - operates on multiple entities
    key: 'bulkDelete',
    type: 'bulk',
    label: 'Delete Selected',
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Delete Users',
      message: (entities) => 
        `Delete ${entities.length} users?`
    },
    onClick: async (entities) => {
      await bulkDeleteUsers(entities.map(e => e.id));
    }
  },
  {
    // Download action - triggers file download
    key: 'export',
    type: 'download',
    label: 'Export',
    icon: 'download',
    download: {
      filename: (entity) => `user-${entity.id}.json`,
      data: (entity) => JSON.stringify(entity, null, 2),
      mimeType: 'application/json'
    }
  },
  {
    // Custom action - full control over rendering
    key: 'custom',
    type: 'custom',
    render: (entity, { onClick }) => (
      <CustomActionButton entity={entity} onClick={onClick} />
    ),
    onClick: (entity) => handleCustomAction(entity)
  }
];
```

### Action Visibility & Permissions

```typescript
const actions = [
  {
    key: 'edit',
    label: 'Edit',
    type: 'immediate',
    // Show only if user has permission
    visible: (entity, context) => 
      context.permissions.includes('edit'),
    onClick: handleEdit
  },
  {
    key: 'approve',
    label: 'Approve',
    type: 'confirm',
    // Show only for pending items
    visible: (entity) => entity.status === 'pending',
    // Disable if already processing
    disabled: (entity) => entity.processing,
    confirm: {
      title: 'Approve Item',
      message: 'Approve this item?'
    },
    onClick: handleApprove
  },
  {
    key: 'delete',
    label: 'Delete',
    type: 'confirm',
    variant: 'danger',
    // Show only if user is admin or owner
    visible: (entity, context) => 
      context.user.isAdmin || entity.ownerId === context.user.id,
    confirm: {
      title: 'Delete Item',
      message: 'This cannot be undone.'
    },
    onClick: handleDelete
  }
];

<EntityActions
  entity={item}
  actions={actions}
  context={{
    user: currentUser,
    permissions: userPermissions
  }}
/>
```

### Bulk Actions

```typescript
function UserList() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const bulkActions = [
    {
      key: 'bulkDelete',
      type: 'bulk',
      label: 'Delete',
      icon: 'delete',
      variant: 'danger',
      confirm: {
        title: 'Delete Users',
        message: (users) => 
          `Delete ${users.length} user(s)?`
      },
      onClick: async (users) => {
        await bulkDeleteUsers(users.map(u => u.id));
        setSelectedUsers([]);
      }
    },
    {
      key: 'bulkExport',
      type: 'bulk',
      label: 'Export',
      icon: 'download',
      onClick: async (users) => {
        const csv = usersToCSV(users);
        downloadFile(csv, 'users.csv');
      }
    },
    {
      key: 'bulkUpdate',
      type: 'form',
      label: 'Update Status',
      form: {
        title: 'Bulk Update',
        fields: [
          {
            key: 'status',
            type: 'select',
            label: 'New Status',
            options: statusOptions
          }
        ]
      },
      onClick: async (users, formData) => {
        await bulkUpdateStatus(
          users.map(u => u.id),
          formData.status
        );
        setSelectedUsers([]);
      }
    }
  ];

  return (
    <div>
      {selectedUsers.length > 0 && (
        <EntityActions
          entities={selectedUsers}
          actions={bulkActions}
        />
      )}
      <EntityList
        data={users}
        columns={columns}
        selectable
        multiSelect
        selectedIds={new Set(selectedUsers.map(u => u.id))}
        onSelectionChange={(ids) => {
          const selected = users.filter(u => ids.has(u.id));
          setSelectedUsers(selected);
        }}
      />
    </div>
  );
}
```

### Action Groups & Menus

```typescript
const actionGroups = [
  {
    key: 'primary',
    actions: [
      {
        key: 'edit',
        label: 'Edit',
        type: 'immediate',
        primary: true,
        onClick: handleEdit
      }
    ]
  },
  {
    key: 'secondary',
    label: 'More Actions',
    menu: true, // Show as dropdown menu
    actions: [
      {
        key: 'duplicate',
        label: 'Duplicate',
        icon: 'copy',
        onClick: handleDuplicate
      },
      {
        key: 'archive',
        label: 'Archive',
        icon: 'archive',
        onClick: handleArchive
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: 'delete',
        variant: 'danger',
        type: 'confirm',
        confirm: { /* ... */ },
        onClick: handleDelete
      }
    ]
  }
];

<EntityActions
  entity={item}
  actionGroups={actionGroups}
/>
```

### With Loading States

```typescript
function UserActions({ user }: { user: User }) {
  const [loading, setLoading] = useState<string | null>(null);

  const actions = [
    {
      key: 'approve',
      label: 'Approve',
      type: 'confirm',
      loading: loading === 'approve',
      onClick: async (user) => {
        setLoading('approve');
        try {
          await approveUser(user.id);
        } finally {
          setLoading(null);
        }
      }
    },
    {
      key: 'reject',
      label: 'Reject',
      type: 'confirm',
      variant: 'danger',
      loading: loading === 'reject',
      onClick: async (user) => {
        setLoading('reject');
        try {
          await rejectUser(user.id);
        } finally {
          setLoading(null);
        }
      }
    }
  ];

  return <EntityActions entity={user} actions={actions} />;
}
```

## Props

### EntityActionsProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entity` | `T` | - | Single entity for actions |
| `entities` | `T[]` | - | Multiple entities for bulk actions |
| `actions` | `Action<T>[]` | required | Action definitions |
| `actionGroups` | `ActionGroup<T>[]` | - | Grouped actions |
| `context` | `Record<string, any>` | `{}` | Context for visibility/disabled checks |
| `layout` | `'horizontal'\|'vertical'\|'dropdown'` | `'horizontal'` | Layout style |
| `align` | `'left'\|'center'\|'right'` | `'right'` | Alignment |
| `size` | `'small'\|'medium'\|'large'` | `'medium'` | Button size |
| `className` | `string` | `''` | Custom CSS class |

### Action Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique action key |
| `type` | `ActionType` | Action type (immediate, confirm, form, modal, navigation, bulk, download, custom) |
| `label` | `string` | Action label |
| `icon` | `string \| ReactNode` | Action icon |
| `variant` | `'default'\|'primary'\|'secondary'\|'danger'\|'success'\|'warning'` | Visual variant |
| `primary` | `boolean` | Primary action styling |
| `visible` | `boolean \| (entity, context) => boolean` | Visibility condition |
| `disabled` | `boolean \| (entity, context) => boolean` | Disabled condition |
| `loading` | `boolean` | Loading state |
| `tooltip` | `string` | Tooltip text |
| `onClick` | `(entity, data?) => Promise<void>` | Click handler |
| `confirm` | `ConfirmConfig` | Confirmation dialog config |
| `form` | `FormConfig` | Form modal config |
| `modal` | `ModalConfig` | Custom modal config |
| `href` | `string \| (entity) => string` | Navigation URL |
| `download` | `DownloadConfig` | Download config |
| `render` | `Component` | Custom renderer |

## Examples

See the [demo page](../examples/EntityActionsDemo.tsx) for live examples.

## Styling

```css
.entity-actions { }
.entity-action-button { }
.entity-action-menu { }
.entity-action-modal { }
.entity-action-confirm { }
```
