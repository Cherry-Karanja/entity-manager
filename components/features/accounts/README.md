# Accounts Module - User Management

This module provides comprehensive user management functionality for the Entity Manager system, integrated with the Django backend.

## Architecture

### Frontend (Entity Manager)
```
components/features/accounts/
├── types.tsx              # TypeScript type definitions
└── users/
    ├── api/
    │   └── client.ts      # Django REST API client
    └── config/
        ├── fields.tsx     # Form field definitions
        ├── list.tsx       # List column configurations
        ├── view.tsx       # Detail view fields
        ├── actions.tsx    # Action definitions
        ├── form.tsx       # Form layout
        └── index.tsx      # Main configuration export
```

### Backend (Django)
```
django_starter_template/apps/accounts/
├── models.py          # User, UserRole, UserProfile models
├── serializers.py     # DRF serializers
├── views.py           # API ViewSets
└── admin.py           # Django admin configuration
```

## Features

### User Management
- ✅ List users with pagination, search, and filtering
- ✅ Create new users
- ✅ Edit existing users
- ✅ View user details
- ✅ Delete users (single and bulk)
- ✅ Role-based access control
- ✅ User approval workflow
- ✅ Account locking/unlocking
- ✅ Password reset
- ✅ 2FA management

### Actions
1. **Approve User** - Approve pending users
2. **Reject User** - Reject user registration
3. **Activate User** - Activate inactive accounts
4. **Deactivate User** - Deactivate active accounts
5. **Unlock Account** - Unlock locked accounts
6. **Reset Password** - Send password reset email
7. **Change Role** - Modify user roles
8. **Send Email** - Send custom email to user
9. **Bulk Activate** - Activate multiple users
10. **Bulk Deactivate** - Deactivate multiple users
11. **Bulk Delete** - Delete multiple users
12. **Export Users** - Export user data

## Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```bash
# Django API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (if using JWT)
NEXT_PUBLIC_AUTH_TOKEN_KEY=authToken
```

### API Client
The API client (`components/features/accounts/users/api/client.ts`) provides:

- RESTful operations (list, get, create, update, delete)
- Bulk operations
- Custom actions (approve, changeRole, unlockAccount, resetPassword)
- Automatic authentication header injection
- Django REST Framework pagination support

## Usage

### Basic Usage
The users page is already set up at `/app/dashboard/(accounts)/users/page.tsx`:

```tsx
import { EntityManager } from '@/components/entityManager';
import { userConfig } from '@/components/features/accounts/users/config';
import { usersApiClient } from '@/components/features/accounts/users/api/client';

<EntityManager
  config={{
    config: userConfig,
    apiClient: usersApiClient,
    initialData: [],
  }}
/>
```

### Customizing Fields
Edit `components/features/accounts/users/config/fields.tsx` to modify form fields:

```tsx
export const userFields: FormField<User>[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email address' },
    ],
  },
  // Add more fields...
];
```

### Customizing Actions
Edit `components/features/accounts/users/config/actions.tsx` to modify actions:

```tsx
{
  id: 'customAction',
  label: 'Custom Action',
  icon: <Icon className="h-4 w-4" />,
  actionType: 'confirm',
  variant: 'primary',
  position: 'row',
  confirmMessage: 'Are you sure?',
  onConfirm: async (user?: User, context?) => {
    // Implement your action
    await context?.refresh();
  },
}
```

### Customizing List Columns
Edit `components/features/accounts/users/config/list.tsx`:

```tsx
export const userColumns: Column<User>[] = [
  {
    id: 'email',
    label: 'Email',
    accessor: 'email',
    sortable: true,
    width: 250,
  },
  // Add more columns...
];
```

## API Integration

### Django REST Framework Endpoints

```
GET    /api/v1/accounts/users/                   # List users
POST   /api/v1/accounts/users/                   # Create user
GET    /api/v1/accounts/users/{id}/              # Get user
PATCH  /api/v1/accounts/users/{id}/              # Update user
DELETE /api/v1/accounts/users/{id}/              # Delete user
POST   /api/v1/accounts/users/{id}/approve/      # Approve user
POST   /api/v1/accounts/users/{id}/change_role/  # Change role
POST   /api/v1/accounts/users/{id}/unlock/       # Unlock account
POST   /api/v1/accounts/users/bulk_delete/       # Bulk delete
```

### Request Examples

**List users with filtering:**
```bash
GET /api/v1/accounts/users/?search=john&is_active=true&page=1&page_size=10
```

**Create user:**
```bash
POST /api/v1/accounts/users/
Content-Type: application/json

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "SecurePassword123!",
  "role": "user"
}
```

**Update user:**
```bash
PATCH /api/v1/accounts/users/1/
Content-Type: application/json

{
  "is_active": true,
  "is_approved": true
}
```

## Type Definitions

### User Type
```typescript
interface User extends BaseEntity {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
  profile?: UserProfile;
  // ... and more
}
```

See `components/features/accounts/types.tsx` for complete type definitions.

## Next Steps

### TODO: Implement Real API Calls
The current action handlers use placeholder console.log statements. To implement real API calls:

1. Update action handlers in `actions.tsx` to use the API client:
   ```tsx
   onConfirm: async (user?: User, context?) => {
     if (!user) return;
     await userActions.approve(user.id);
     await context?.refresh();
   },
   ```

2. Add error handling:
   ```tsx
   try {
     const response = await userActions.approve(user.id);
     if (response.error) {
       toast.error(response.error.message);
     } else {
       toast.success('User approved successfully');
       await context?.refresh();
     }
   } catch (error) {
     toast.error('Failed to approve user');
   }
   ```

### TODO: Add Authentication
Update `api/client.ts` to use your actual authentication:

```tsx
function getAuthHeaders(): Record<string, string> {
  const { token } = useAuth(); // Use your auth provider
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
```

### TODO: Add Toast Notifications
Install a toast library (e.g., sonner, react-hot-toast) and add notifications:

```bash
npm install sonner
```

```tsx
import { toast } from 'sonner';

onConfirm: async (user?: User, context?) => {
  try {
    await userActions.approve(user.id);
    toast.success('User approved successfully');
    await context?.refresh();
  } catch (error) {
    toast.error('Failed to approve user');
  }
},
```

## Testing

### Manual Testing
1. Start the Django backend: `python manage.py runserver`
2. Start the Next.js frontend: `npm run dev`
3. Navigate to http://localhost:3000/dashboard/accounts/users
4. Test CRUD operations, filtering, searching, and actions

### API Testing
Use the Django admin to verify backend integration:
- http://localhost:8000/admin/accounts/user/

## Troubleshooting

### CORS Issues
If you encounter CORS errors, update Django settings:

```python
# django_starter_template/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Authentication Errors
Check that your token is being sent correctly in headers:
```tsx
headers: {
  'Authorization': `Bearer ${token}`,
}
```

### Type Errors
Ensure all types in `types.tsx` match your Django models exactly.

## Contributing

When adding new features:
1. Update type definitions in `types.tsx`
2. Add/modify fields in `config/fields.tsx`
3. Add/modify columns in `config/list.tsx`
4. Add/modify view fields in `config/view.tsx`
5. Add actions in `config/actions.tsx`
6. Update API client if needed
7. Test thoroughly
8. Update this README

## Support

For issues or questions:
- Check Django logs: `logs/django.log`
- Check browser console for frontend errors
- Review the Entity Manager documentation
- Check DRF API schema: http://localhost:8000/api/schema/swagger-ui/
