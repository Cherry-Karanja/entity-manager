# Adding Profile Link to Navigation

## Option 1: Add to Sidebar (Dashboard Layout)

Edit `d:\entity-manager\v2\components\layouts\dashboard-layout.tsx`:

```tsx
import { User } from "lucide-react"  // Add to imports

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Entities",
    icon: Database,
    href: "/dashboard/entities",
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    title: "Security",
    icon: Shield,
    href: "/dashboard/security",
  },
  {
    title: "Profile",  // Add this
    icon: User,
    href: "/dashboard/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];
```

## Option 2: Add to User Dropdown Menu

If you have a user dropdown menu in the header, add:

```tsx
import { User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.email} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56" align="end" forceMount>
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{user?.first_name} {user?.last_name}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link href="/dashboard/profile">
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/dashboard/settings">
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Route

The profile page is already created at:
- **Route**: `/dashboard/profile`
- **File**: `d:\entity-manager\v2\app\dashboard\profile\page.tsx`

## Testing

1. Navigate to `http://localhost:3000/dashboard/profile`
2. Test each tab:
   - Profile information form
   - Security settings (password change)
   - Notification preferences

## Next Steps

1. **Connect to API**: Update the handlers in `page.tsx` to call your Django backend
2. **Add Authentication**: Ensure routes are protected with your auth middleware
3. **Fetch User Data**: Load actual user data from your API on page load
4. **Add Avatar Upload**: Implement actual file upload to your backend/storage
5. **Add Validation**: Customize validation rules based on your requirements
