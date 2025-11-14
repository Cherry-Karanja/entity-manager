# UserProfile Entity Configuration (V3)

This directory contains the complete V3 configuration for the UserProfile entity, following the standardized Entity Manager V3 pattern.

## Overview

The UserProfile entity manages user profile information including personal details, preferences, and approval status. This is a fully CRUD-enabled entity with support for bulk operations, export/import, and custom workflows.

## Files Structure

```
userProfile-v3/
├── index.ts         # Main configuration & centralized endpoints
├── types.ts         # UserProfileEntity type definition
├── fields.ts        # Form field definitions (Single source of truth)
├── form.ts          # Form configuration
├── list.ts          # List/table configuration
├── view.ts          # Detail view configuration
├── actions.ts       # Actions configuration (global, row, bulk)
├── exporter.ts      # Export configuration
└── README.md        # This file
```

## Key Features

### Entity Capabilities
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Bulk operations (approve, reject, delete)
- ✅ Export to CSV, Excel, JSON
- ✅ Import from CSV, JSON
- ✅ Advanced filtering and search
- ✅ Approval workflow (pending → approved/rejected/suspended)
- ✅ Audit logging support

### Fields
- **Basic Information**: User reference, job title, department, phone, bio
- **Status**: Pending, Approved, Rejected, Suspended
- **Preferences**: Language (EN/ES/FR/DE/SW), Theme (Light/Dark/System)
- **Privacy**: Notifications, email/phone visibility
- **Approval**: Approved by, approved at timestamps
- **Timestamps**: Created at, updated at

### Custom Actions
- **Approve Profile**: Approve pending user profiles
- **Reject Profile**: Reject pending user profiles with confirmation
- **Suspend Profile**: Suspend approved profiles
- **Send Notification**: Send custom notifications to profile owners

## API Endpoints

All endpoints are centralized in `index.ts`:

```typescript
endpoints: {
  list: '/api/v1/accounts/user-profiles/',
  create: '/api/v1/accounts/user-profiles/',
  read: '/api/v1/accounts/user-profiles/:id/',
  update: '/api/v1/accounts/user-profiles/:id/',
  delete: '/api/v1/accounts/user-profiles/:id/',
  export: '/api/v1/accounts/user-profiles/export/',
  import: '/api/v1/accounts/user-profiles/import/',
  bulk: '/api/v1/accounts/user-profiles/bulk/',
}
```

## Usage

### Import the complete configuration

```typescript
import { userProfileEntityConfig } from '@/components/features/accounts/configs/userProfile-v3'

// Use with EntityManager orchestrator
<EntityManager config={userProfileEntityConfig} />
```

### Import individual components

```typescript
import { 
  formConfig,
  listConfig,
  viewConfig,
  actionsConfig,
  exporterConfig,
  userProfileFields,
  UserProfileEntity 
} from '@/components/features/accounts/configs/userProfile-v3'
```

## Lifecycle Hooks

The configuration includes comprehensive lifecycle hooks:

- `beforeCreate` / `afterCreate`: Execute logic before/after profile creation
- `beforeUpdate` / `afterUpdate`: Execute logic before/after profile updates
- `beforeDelete` / `afterDelete`: Execute logic before/after profile deletion
- `beforeFetch` / `afterFetch`: Execute logic before/after data fetching
- `validateCreate` / `validateUpdate`: Custom validation logic

## Permissions

Permissions are managed at both global and action levels:

```typescript
permissions: {
  create: true,
  read: true,
  update: true,
  delete: true,
  export: true,
  import: true,
  bulk: true,
}
```

## Form Layout

The form uses a 2-column grid layout with the following field groups:

1. **Basic Information**: User, job title, department, phone
2. **Biography**: User bio text area
3. **Preferences**: Language, theme, notification settings
4. **Privacy**: Email/phone visibility settings
5. **Status**: Approval status (read-only for regular users)

## List Configuration

The list view displays:
- ID, User, Job Title, Department
- Status (with visual indicators)
- Preferred Language (with flag emojis)
- Created date

Supports:
- Global search across user, job title, department, bio
- Filtering by status, department, language, notifications
- Sorting by any column
- Pagination (20 items per page)
- Bulk selection and actions

## View Configuration

The detail view organizes information into collapsible groups:
1. User Information
2. Contact Information
3. Interface Preferences
4. Privacy Settings
5. Approval Information
6. Timeline (timestamps)

## Migration from V2

Key changes from V2:
1. ✅ Converted `EntityField` → `FormField`
2. ✅ Centralized all endpoints in `index.ts`
3. ✅ Added type-safe `UserProfileEntity` extending `Entity`
4. ✅ Standardized actions configuration
5. ✅ Added comprehensive export configuration
6. ✅ Implemented lifecycle hooks
7. ✅ Enhanced validation and permissions

## Related Files

- Types: `components/features/accounts/types/userProfile.types.ts`
- V2 Config: `components/features/accounts/configs/userProfile/`
- API Integration: Backend endpoints at `/api/v1/accounts/user-profiles/`

## Notes

- This configuration is fully compatible with the Entity Manager V3 orchestrator
- All field definitions are centralized in `fields.ts` (single source of truth)
- Status-based conditional actions (approve/reject only for pending profiles)
- Theme preferences support system detection
- Multi-language support (EN, ES, FR, DE, SW)
