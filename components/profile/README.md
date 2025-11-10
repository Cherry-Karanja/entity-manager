# Profile Management Module

A modern, fully-featured profile management system built with Next.js, React Hook Form, and shadcn/ui components.

## Features

### 1. **Profile Information**
- Avatar upload with preview
- Personal details (name, email, phone)
- Department and bio management
- Form validation with Zod
- Real-time field validation

### 2. **Security Settings**
- Password change functionality
- Current password verification
- Password strength requirements
- Secure password visibility toggle
- Confirmation field matching validation

### 3. **Notification Preferences**
- Email notification controls
- Push notification settings
- Privacy preferences
- Granular control over notification types
- Individual toggle switches for each preference

## File Structure

```
components/profile/
├── profile-manager.tsx          # Main component with tabs
├── profile-form.tsx             # Profile information form
├── security-settings.tsx        # Password change form
├── notification-preferences.tsx # Notification settings
└── index.ts                     # Exports

app/dashboard/profile/
└── page.tsx                     # Profile page route

hooks/
└── use-toast.ts                 # Toast notifications hook

components/ui/
├── toast.tsx                    # Toast component
└── toaster.tsx                  # Toast provider
```

## Usage

### Basic Implementation

```tsx
import { ProfileManager } from "@/components/profile"

export default function ProfilePage() {
  const handleProfileUpdate = async (data) => {
    const response = await fetch('/api/v1/accounts/users/me/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update profile')
  }

  const handlePasswordUpdate = async (data) => {
    const response = await fetch('/api/v1/core/auth/password/change/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update password')
  }

  const handleNotificationUpdate = async (preferences) => {
    const response = await fetch('/api/v1/accounts/users/me/preferences/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications: preferences })
    })
    if (!response.ok) throw new Error('Failed to update preferences')
  }

  return (
    <ProfileManager
      initialData={userData}
      onProfileUpdate={handleProfileUpdate}
      onPasswordUpdate={handlePasswordUpdate}
      onNotificationUpdate={handleNotificationUpdate}
    />
  )
}
```

### Integration with Auth Context

```tsx
import { useAuth } from "@/components/auth/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProfileManager
      initialData={{
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.profile?.phone,
        department: user.profile?.department,
        avatar: user.profile?.avatar,
      }}
      // ... handlers
    />
  )
}
```

## API Integration

### Expected API Endpoints

1. **Update Profile**: `PATCH /api/v1/accounts/users/me/`
   ```json
   {
     "first_name": "John",
     "last_name": "Doe",
     "email": "john.doe@example.com",
     "phone": "+1 (555) 123-4567",
     "department": "Engineering",
     "bio": "Senior Software Engineer...",
     "avatar": "base64_encoded_image_or_url"
   }
   ```

2. **Change Password**: `POST /api/v1/core/auth/password/change/`
   ```json
   {
     "current_password": "old_password",
     "new_password": "new_password",
     "confirm_password": "new_password"
   }
   ```

3. **Update Preferences**: `PATCH /api/v1/accounts/users/me/preferences/`
   ```json
   {
     "notifications": {
       "email_updates": true,
       "email_security": true,
       "push_messages": true,
       ...
     }
   }
   ```

## Components

### ProfileManager
Main container component with tab navigation.

**Props:**
- `initialData`: Initial profile data
- `onProfileUpdate`: Handler for profile updates
- `onPasswordUpdate`: Handler for password changes
- `onNotificationUpdate`: Handler for notification preference changes

### ProfileForm
Form for editing profile information.

**Features:**
- Avatar upload with preview
- Form validation
- Auto-generated initials fallback
- Responsive grid layout

### SecuritySettings
Password change form.

**Features:**
- Current password verification
- Password visibility toggle
- Confirmation field validation
- Secure input handling

### NotificationPreferences
Notification and privacy settings.

**Features:**
- Categorized preferences (email, push, privacy)
- Toggle switches
- Real-time updates
- Visual grouping

## Styling

All components use Tailwind CSS and shadcn/ui design system. The module is fully responsive and supports:
- Light/dark theme
- Mobile-first design
- Accessible components
- Consistent spacing and typography

## Validation

Form validation is handled by Zod schemas:

```typescript
// Profile validation
const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
})

// Security validation
const securityFormSchema = z.object({
  current_password: z.string().min(8, "Current password is required"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})
```

## Customization

### Adding Custom Fields

```tsx
// In profile-form.tsx, add new field:
<FormField
  control={form.control}
  name="custom_field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Custom Field</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Update schema:
const profileFormSchema = z.object({
  // ... existing fields
  custom_field: z.string().optional(),
})
```

### Customizing Notifications

Edit the `NotificationPreferences` component to add/remove notification types:

```tsx
const [emailNotifications, setEmailNotifications] = useState([
  // Add your custom notification preferences
  {
    id: "custom_notification",
    label: "Custom Notifications",
    description: "Description of custom notification",
    enabled: false,
  },
])
```

## Toast Notifications

The module uses a toast system for user feedback:

```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "Success!",
  description: "Your changes have been saved.",
})

toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
})
```

## Accessibility

All components follow accessibility best practices:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Next.js 14+
- React Hook Form
- Zod
- shadcn/ui components
- Radix UI primitives
- Lucide icons
