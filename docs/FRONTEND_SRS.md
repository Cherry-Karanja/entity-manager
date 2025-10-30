# 🏠 MyLandlord - Frontend Specification (Next.js + TypeScript)

## Table of Contents
1. [Frontend Architecture](#frontend-architecture)
2. [Project Structure](#project-structure)
3. [Authentication System](#authentication-system)
4. [State Management](#state-management)
5. [UI Components](#ui-components)
6. [Page Specifications](#page-specifications)
7. [API Integration](#api-integration)
8. [File Handling](#file-handling)
9. [Responsive Design](#responsive-design)
10. [Testing & Deployment](#testing--deployment)

---

## 1. Frontend Architecture

### 1.1 Technology Stack
- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript for type safety
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** React Query (TanStack Query) + Context API
- **Forms:** React Hook Form + Zod validation
- **Authentication:** NextAuth.js or custom JWT implementation
- **Charts:** Recharts for analytics
- **File Uploads:** React Dropzone

### 1.2 Core Architecture Principles
- **Server-Side Rendering (SSR):** For better SEO and performance
- **Static Site Generation (SSG):** For public pages
- **Client-Side Rendering (CSR):** For dashboard and interactive features
- **Progressive Web App (PWA):** Offline capabilities
- **Responsive Design:** Mobile-first approach

---

## 2. Project Structure

### 2.1 Directory Structure
```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (dashboard)/
│   ├── admin/
│   │   └── page.tsx
│   ├── landlord/
│   │   └── page.tsx
│   ├── tenant/
│   │   └── page.tsx
│   ├── manager/
│   │   └── page.tsx
│   ├── caretaker/
│   │   └── page.tsx
│   └── layout.tsx
├── admin/
│   ├── subscriptions/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── support/
│       └── page.tsx
├── (public)/
│   ├── about/
│   ├── pricing/
│   └── contact/
├── api/
│   └── auth/
├── globals.css
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx

components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── dropdown-menu.tsx
│   ├── label.tsx
│   └── textarea.tsx
├── layout/
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── charts/
    ├── income-chart.tsx
    └── occupancy-chart.tsx

features/
├── admin/
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUserManagement.tsx
│   │   ├── AdminUserFormModal.tsx
│   │   ├── AdminPropertyManagement.tsx
│   │   └── AdminManagementRequests.tsx
│   └── index.ts
├── landlord/
│   ├── components/
│   │   ├── LandlordDashboard.tsx
│   │   ├── PropertyManagement.tsx
│   │   ├── TenantManagement.tsx
│   │   ├── BillingManagement.tsx
│   │   └── MaintenanceRequests.tsx
│   └── index.ts
├── tenant/
│   ├── components/
│   │   ├── TenantDashboard.tsx
│   │   ├── PaymentHistory.tsx
│   │   ├── MaintenanceRequests.tsx
│   │   └── LeaseAgreements.tsx
│   └── index.ts
├── manager/
│   ├── components/
│   │   ├── ManagerDashboard.tsx
│   │   ├── AssignedProperties.tsx
│   │   ├── TenantManagement.tsx
│   │   └── MaintenanceRequests.tsx
│   └── index.ts
├── caretaker/
│   ├── components/
│   │   ├── CaretakerDashboard.tsx
│   │   ├── PropertyOverview.tsx
│   │   ├── MaintenanceRequests.tsx
│   │   └── TenantAssistance.tsx
│   └── index.ts
└── auth/
    ├── components/
    │   └── SimpleAuthPage.tsx
    └── validation/
        └── schemas.ts

lib/
├── api.ts
├── auth.ts
├── utils.ts
├── validations.ts
├── constants.ts
└── react-query.ts

types/
├── auth.ts
├── property.ts
├── tenant.ts
├── billing.ts
└── api.ts

hooks/
├── use-auth.ts
├── use-properties.ts
├── use-tenants.ts
└── use-billing.ts

contexts/
├── simple-auth-context.tsx
└── app-context.tsx

utils/
├── api.tsx
└── rsaEncryption.ts

mock-data/
├── auth.ts
├── properties.ts
├── users.ts
└── index.ts

handler/
├── apiConfig.tsx
├── ApiService.tsx
└── AuthManager.tsx
```

### 2.2 Feature-Based Organization

The application follows a **feature-based architecture** where each user type has its own dedicated feature directory:

#### **Admin Features** (`features/admin/`)
- **AdminDashboard.tsx** - Main admin dashboard with tabs
- **AdminUserManagement.tsx** - User CRUD operations
- **AdminUserFormModal.tsx** - Add/Edit user forms
- **AdminPropertyManagement.tsx** - Property oversight and manager assignment
- **AdminManagementRequests.tsx** - Management request approval/rejection

#### **Landlord Features** (`features/landlord/`)
- **LandlordDashboard.tsx** - Property management dashboard
- **PropertyManagement.tsx** - Property CRUD operations
- **TenantManagement.tsx** - Tenant oversight
- **BillingManagement.tsx** - Invoice and payment management
- **MaintenanceRequests.tsx** - Maintenance request handling

#### **Tenant Features** (`features/tenant/`)
- **TenantDashboard.tsx** - Tenant portal dashboard
- **PaymentHistory.tsx** - Payment tracking
- **MaintenanceRequests.tsx** - Maintenance request submission
- **LeaseAgreements.tsx** - Lease document management

#### **Manager Features** (`features/manager/`)
- **ManagerDashboard.tsx** - Property manager dashboard
- **AssignedProperties.tsx** - Assigned property management
- **TenantManagement.tsx** - Tenant oversight for assigned properties
- **MaintenanceRequests.tsx** - Maintenance oversight

#### **Caretaker Features** (`features/caretaker/`)
- **CaretakerDashboard.tsx** - Caretaker task dashboard
- **PropertyOverview.tsx** - Assigned property overview
- **MaintenanceRequests.tsx** - Maintenance task management
- **TenantAssistance.tsx** - Tenant support and assistance

### 2.3 Route Groups
- **(auth):** Authentication-related pages
- **(dashboard):** Protected dashboard pages
- **(public):** Public marketing pages
- **admin:** Admin-specific pages (subscriptions, analytics, support)
- **api:** API routes for server-side logic

### 2.4 Page Structure

#### **Dashboard Pages**
```
app/dashboard/
├── admin/page.tsx          → AdminDashboard component
├── landlord/page.tsx       → LandlordDashboard component
├── tenant/page.tsx         → TenantDashboard component
├── manager/page.tsx        → ManagerDashboard component
├── caretaker/page.tsx      → CaretakerDashboard component
└── layout.tsx              → Dashboard layout with sidebar
```

#### **Admin Pages**
```
app/admin/
├── subscriptions/page.tsx  → Subscription management
├── analytics/page.tsx      → System analytics
└── support/page.tsx        → Support ticket management
```

### 2.5 Component Organization

#### **UI Components** (`components/ui/`)
- Reusable shadcn/ui components
- Consistent styling and behavior
- TypeScript interfaces for props

#### **Layout Components** (`components/layout/`)
- **sidebar.tsx** - Role-based navigation
- **header.tsx** - Top navigation bar
- **footer.tsx** - Footer component

#### **Feature Components** (`features/*/components/`)
- User-specific components
- Business logic components
- Feature-specific forms and modals

### 2.6 Import Structure

#### **Feature Imports**
```typescript
// Dashboard pages import from their respective feature directories
import { AdminDashboard } from '@/features/admin';
import { LandlordDashboard } from '@/features/landlord';
import { TenantDashboard } from '@/features/tenant';
import { ManagerDashboard } from '@/features/manager';
import { CaretakerDashboard } from '@/features/caretaker';
```

#### **Component Imports**
```typescript
// UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Layout components
import { Sidebar } from '@/components/layout/sidebar';

// Feature components
import { AdminUserManagement } from '@/features/admin/components/AdminUserManagement';
```

### 2.7 Navigation Structure

#### **Sidebar Navigation**
The sidebar dynamically shows different menu items based on user type:

- **Admin:** Dashboard, User Management, Property Management, Management Requests, System Settings, Subscriptions, Analytics, Support
- **Landlord:** Dashboard, Properties, Tenants, Billing, Maintenance, Reports, Notifications, Communication
- **Tenant:** My Unit, My Invoices, Payment History, Maintenance Requests, My Contract, Notifications, Communication
- **Manager:** Assigned Properties, Tenant Management, Maintenance Tasks, Basic Billing, Notifications
- **Caretaker:** Assigned Properties, Tenant Management, Maintenance Tasks, Basic Billing, Notifications

#### **URL Structure**
```
/dashboard/admin              → Admin dashboard
/dashboard/admin?tab=users    → Admin user management
/dashboard/admin?tab=properties → Admin property management
/dashboard/landlord           → Landlord dashboard
/dashboard/tenant             → Tenant dashboard
/dashboard/manager            → Manager dashboard
/dashboard/caretaker          → Caretaker dashboard
/admin/subscriptions          → Subscription management
/admin/analytics              → System analytics
/admin/support                → Support tickets
```

This structure ensures:
- **Clear separation of concerns** by user type
- **Scalable architecture** for adding new features
- **Consistent navigation** across all user types
- **Type-safe imports** with proper TypeScript support
- **Maintainable codebase** with organized feature directories

---

## 3. Authentication System

### 3.1 Authentication Types
```typescript
// types/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'LANDLORD' | 'TENANT' | 'CARETAKER' | 'PROPERTY_MANAGER' | 'ADMIN';
  isEmailVerified: boolean;
  subscription?: {
    tier: 'FREE' | 'STARTER' | 'GROWTH' | 'BUSINESS' | 'ENTERPRISE';
    expiresAt: string;
  };
  profile?: {
    phone?: string;
    avatar?: string;
    bio?: string;
  };
  managedProperties?: Property[]; // For property managers
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}
```

### 3.2 Auth Context
```typescript
// contexts/auth-context.tsx
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: false,
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Authentication logic implementation
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      // Redirect based on user type
      if (user.userType === 'LANDLORD') {
        router.push('/dashboard');
      } else if (user.userType === 'TENANT') {
        router.push('/tenant-dashboard');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3.3 Protected Routes
```typescript
// components/protected-route.tsx
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: ('LANDLORD' | 'TENANT' | 'CARETAKER' | 'PROPERTY_MANAGER' | 'ADMIN')[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    redirect('/login');
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.userType)) {
    return <UnauthorizedPage />;
  }
  
  return <>{children}</>;
};

// Role-based dashboard redirects
export const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      switch (user.userType) {
        case 'LANDLORD':
          router.push('/dashboard');
          break;
        case 'TENANT':
          router.push('/tenant-dashboard');
          break;
        case 'PROPERTY_MANAGER':
          router.push('/manager-dashboard');
          break;
        case 'ADMIN':
          router.push('/admin-dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [user]);
  
  return <LoadingSpinner />;
};
```

---

## 4. State Management

### 4.1 React Query Configuration
```typescript
// lib/react-query.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Custom hooks for data fetching
export const useProperties = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['properties', user?.id],
    queryFn: () => api.get('/properties/').then(res => res.data),
    enabled: !!user,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePropertyData) => api.post('/properties/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create property');
    },
  });
};
```

### 4.2 Global State Management
```typescript
// hooks/use-app-state.ts
interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

const useAppState = create<AppState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) => 
    set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (id) => 
    set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));
```

---

## 5. UI Components

### 5.1 Base Components (shadcn/ui)
```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
```

### 5.2 Form Components
```typescript
// components/forms/property-form.tsx
const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'FLAT', 'COMMERCIAL']),
  totalUnits: z.number().min(1, 'Must have at least 1 unit'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const PropertyForm: React.FC<{
  onSubmit: (data: PropertyFormData) => void;
  initialData?: PropertyFormData;
  loading?: boolean;
}> = ({ onSubmit, initialData, loading }) => {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData,
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter property name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter property address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Property' : 'Create Property'}
        </Button>
      </form>
    </Form>
  );
};
```

### 5.3 Dashboard Components
```typescript
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={cn(
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              {change.type === 'increase' ? '+' : '-'}{change.value}%
            </span>
            {' '}from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

### 5.4 Property Management Components
```typescript
// components/property-management-card.tsx
interface PropertyManagementCardProps {
  property: Property;
  onRequestManagement?: (propertyId: string) => void;
  onAssignManager?: (propertyId: string, managerId: string) => void;
}

export const PropertyManagementCard: React.FC<PropertyManagementCardProps> = ({
  property,
  onRequestManagement,
  onAssignManager
}) => {
  const { user } = useAuth();
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  
  const canRequestManagement = user?.userType === 'LANDLORD' && 
                               property.managementType === 'SELF_MANAGED';
  const canAssignManager = user?.userType === 'ADMIN';
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{property.name}</h3>
          <p className="text-gray-600">{property.address}</p>
        </div>
        <Badge variant={property.managementType === 'SYSTEM_MANAGED' ? 'default' : 'secondary'}>
          {property.managementType === 'SYSTEM_MANAGED' ? 'System Managed' : 'Self Managed'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Units</p>
          <p className="text-lg font-semibold">{property.totalUnits}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Occupied Units</p>
          <p className="text-lg font-semibold">{property.occupiedUnits}</p>
        </div>
      </div>
      
      {property.managementType === 'SYSTEM_MANAGED' && property.assignedManager && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <User className="inline w-4 h-4 mr-1" />
            Managed by: {property.assignedManager.name}
          </p>
          <p className="text-xs text-green-600">
            Management Fee: {property.managementFeePercentage}%
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        {canRequestManagement && (
          <Button 
            onClick={() => onRequestManagement?.(property.id)}
            variant="outline"
            className="flex-1"
          >
            <HandHeart className="w-4 h-4 mr-2" />
            Request Management
          </Button>
        )}
        
        {canAssignManager && (
          <Button 
            onClick={() => setShowManagerDialog(true)}
            variant="outline"
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Manager
          </Button>
        )}
      </div>
      
      {/* Manager Assignment Dialog */}
      <Dialog open={showManagerDialog} onOpenChange={setShowManagerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Property Manager</DialogTitle>
          </DialogHeader>
          <ManagerAssignmentForm 
            propertyId={property.id}
            onAssign={(managerId) => {
              onAssignManager?.(property.id, managerId);
              setShowManagerDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
```

### 5.5 Management Request Components
```typescript
// components/management-request-card.tsx
export const ManagementRequestCard: React.FC<{
  request: ManagementRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}> = ({ request, onApprove, onReject }) => {
  const { user } = useAuth();
  const canRespond = user?.userType === 'ADMIN' && request.status === 'PENDING';
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{request.property.name}</h3>
          <p className="text-gray-600">{request.property.address}</p>
          <p className="text-sm text-gray-500">
            Requested by: {request.landlord.firstName} {request.landlord.lastName}
          </p>
        </div>
        <Badge variant={
          request.status === 'PENDING' ? 'default' :
          request.status === 'APPROVED' ? 'success' : 'destructive'
        }>
          {request.status}
        </Badge>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Requested: {new Date(request.requestedAt).toLocaleDateString()}
        </p>
        {request.respondedAt && (
          <p className="text-sm text-gray-600">
            Responded: {new Date(request.respondedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {request.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm">{request.notes}</p>
        </div>
      )}
      
      {canRespond && (
        <div className="flex gap-2">
          <Button 
            onClick={() => onApprove?.(request.id)}
            variant="default"
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button 
            onClick={() => onReject?.(request.id)}
            variant="destructive"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
};
```

---

## 6. Page Specifications

### 6.1 Dashboard Layout
```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['LANDLORD', 'TENANT', 'CARETAKER', 'PROPERTY_MANAGER', 'ADMIN']}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

### 6.2 Admin Dashboard Page
```typescript
// app/dashboard/admin/page.tsx
import { AdminDashboard } from '@/features/admin';

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
```

### 6.3 Landlord Dashboard Page
```typescript
// app/dashboard/landlord/page.tsx
import { LandlordDashboard } from '@/features/landlord';

export default function LandlordDashboardPage() {
  return <LandlordDashboard />;
}
```

### 6.4 Tenant Dashboard Page
```typescript
// app/dashboard/tenant/page.tsx
import { TenantDashboard } from '@/features/tenant';

export default function TenantDashboardPage() {
  return <TenantDashboard />;
}
```

### 6.5 Manager Dashboard Page
```typescript
// app/dashboard/manager/page.tsx
import { ManagerDashboard } from '@/features/manager';

export default function ManagerDashboardPage() {
  return <ManagerDashboard />;
}
```

### 6.6 Caretaker Dashboard Page
```typescript
// app/dashboard/caretaker/page.tsx
import { CaretakerDashboard } from '@/features/caretaker';

export default function CaretakerDashboardPage() {
  return <CaretakerDashboard />;
}
```

### 6.7 Admin Feature Pages
```typescript
// app/admin/subscriptions/page.tsx
export default function AdminSubscriptionsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Subscription management interface */}
    </div>
  );
}

// app/admin/analytics/page.tsx
export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* System analytics dashboard */}
    </div>
  );
}

// app/admin/support/page.tsx
export default function AdminSupportPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Support ticket management */}
    </div>
  );
}
```

---

## 7. API Integration

### 7.1 API Client Configuration
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
  
  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
```

### 7.2 Service Layer
```typescript
// services/property-service.ts
export class PropertyService {
  static async getProperties(): Promise<Property[]> {
    return api.get('/properties/');
  }
  
  static async createProperty(data: CreatePropertyData): Promise<Property> {
    return api.post('/properties/', data);
  }
  
  static async updateProperty(id: string, data: UpdatePropertyData): Promise<Property> {
    return api.put(`/properties/${id}/`, data);
  }
  
  static async deleteProperty(id: string): Promise<void> {
    return api.delete(`/properties/${id}/`);
  }
  
  static async getPropertyUnits(propertyId: string): Promise<Unit[]> {
    return api.get(`/properties/${propertyId}/units/`);
  }
}
```

---

## 8. File Handling

### 8.1 File Upload Component
```typescript
// components/file-upload.tsx
interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  loading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = "image/*,.pdf,.doc,.docx",
  multiple = false,
  maxSize = 5,
  loading = false,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const fileSizeMB = file.size / (1024 * 1024);
      return fileSizeMB <= maxSize;
    });
    
    if (validFiles.length !== acceptedFiles.length) {
      toast.error(`Some files exceed ${maxSize}MB limit`);
    }
    
    onUpload(validFiles);
  }, [onUpload, maxSize]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as any),
    multiple,
  });
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors",
        isDragActive && "border-blue-500 bg-blue-50",
        loading && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Uploading...</span>
        </div>
      ) : (
        <div>
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse ({accept}, max {maxSize}MB)
          </p>
        </div>
      )}
    </div>
  );
};
```

---

## 9. Responsive Design

### 9.1 Breakpoint System
```typescript
// lib/utils.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints>('sm');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};
```

### 9.2 Mobile Navigation
```typescript
// components/layout/mobile-nav.tsx
export const MobileNav: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="text-lg font-semibold" onClick={onClose}>
            Dashboard
          </Link>
          <Link href="/properties" className="text-lg font-semibold" onClick={onClose}>
            Properties
          </Link>
          <Link href="/tenants" className="text-lg font-semibold" onClick={onClose}>
            Tenants
          </Link>
          <Link href="/billing" className="text-lg font-semibold" onClick={onClose}>
            Billing
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
```

---

## 10. Testing & Deployment

### 10.1 Testing Strategy
```typescript
// __tests__/components/property-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyForm } from '@/components/forms/property-form';

describe('PropertyForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('should render form fields', () => {
    render(<PropertyForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create property/i })).toBeInTheDocument();
  });
  
  it('should validate required fields', async () => {
    render(<PropertyForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create property/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/property name is required/i)).toBeInTheDocument();
    });
  });
});
```

### 10.2 Deployment Configuration
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

### 10.3 Production Checklist
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Authentication flow verified
- [ ] Responsive design tested
- [ ] SEO optimization implemented
- [ ] Performance optimization done
- [ ] Error boundaries implemented
- [ ] Loading states added
- [ ] Accessibility tested
- [ ] Analytics tracking configured

---

## 11. Implementation Status

### 11.1 Completed Features

#### **✅ Admin Panel (100% Complete)**
- **Dashboard:** Overview with system stats, recent activity, quick actions
- **User Management:** CRUD operations with search, filters, and modal forms
- **Property Management:** Property oversight, manager assignment, management status
- **Management Requests:** Approval/rejection workflow with status tracking
- **System Settings:** System status, performance metrics, configuration
- **Subscriptions:** Plan management, payment tracking, revenue analytics
- **Analytics:** User growth, revenue trends, feature usage, system performance
- **Support Tickets:** Ticket management, priority levels, response tracking

#### **✅ Landlord Dashboard (100% Complete)**
- **Overview:** Property stats, recent payments, quick actions
- **Properties:** Property management with occupancy rates
- **Tenants:** Tenant oversight and management
- **Billing:** Payment tracking and invoice management
- **Maintenance:** Request handling and status tracking

#### **✅ Tenant Dashboard (100% Complete)**
- **Unit Information:** Current unit details and lease information
- **Payments:** Payment history and upcoming payments
- **Maintenance:** Request submission and status tracking
- **Lease:** Agreement details and document management

#### **✅ Manager Dashboard (100% Complete)**
- **Assigned Properties:** Property overview and management
- **Performance Metrics:** Collection rate, response time, satisfaction scores
- **Tenant Management:** Oversight of assigned properties
- **Maintenance Oversight:** Request management and task tracking

#### **✅ Caretaker Dashboard (100% Complete)**
- **Assigned Properties:** Property overview and task management
- **Maintenance Tasks:** Task tracking and completion
- **Tenant Assistance:** Request handling and support
- **Performance Tracking:** Response time and satisfaction metrics

### 11.2 Navigation & Routing

#### **✅ Sidebar Integration**
- Role-based navigation with dynamic menu items
- URL parameter support for tab switching
- Active state highlighting
- Responsive design for mobile devices

#### **✅ URL Structure**
```
/dashboard/admin              → Admin dashboard
/dashboard/admin?tab=users    → Admin user management
/dashboard/admin?tab=properties → Admin property management
/dashboard/landlord           → Landlord dashboard
/dashboard/tenant             → Tenant dashboard
/dashboard/manager            → Manager dashboard
/dashboard/caretaker          → Caretaker dashboard
/admin/subscriptions          → Subscription management
/admin/analytics              → System analytics
/admin/support                → Support tickets
```

### 11.3 Mock Data Integration

#### **✅ Comprehensive Mock Data**
- **50+ Users:** Different roles with realistic data
- **20+ Properties:** Various management types and statuses
- **Management Requests:** Pending approval workflows
- **Subscriptions:** All plan types with payment data
- **Analytics:** Growth charts and system metrics
- **Support Tickets:** Multiple categories and priorities
- **Maintenance:** Tasks and requests with status tracking

### 11.4 UI/UX Features

#### **✅ Modern Design System**
- Responsive design (mobile, tablet, desktop)
- Tab navigation with URL synchronization
- Search and filtering capabilities
- Status badges with color coding
- Action buttons for CRUD operations
- Loading states and error handling
- Consistent styling with Tailwind CSS

#### **✅ Component Library**
- Reusable UI components (Button, Card, Input, etc.)
- Layout components (Sidebar, Header)
- Feature-specific components
- Form components with validation
- Modal and dialog components

### 11.5 Technical Implementation

#### **✅ TypeScript Integration**
- Full type safety across the application
- Interface definitions for all data structures
- Type-safe component props
- API response typing

#### **✅ State Management**
- React Query for server state
- Context API for global state
- Local state for component-specific data
- Form state management with React Hook Form

#### **✅ Code Organization**
- Feature-based architecture
- Clear separation of concerns
- Scalable directory structure
- Consistent import patterns

---

## 12. Type Definitions

### 12.1 Authentication Types
```typescript
// types/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'LANDLORD' | 'TENANT' | 'CARETAKER' | 'PROPERTY_MANAGER' | 'ADMIN';
  isEmailVerified: boolean;
  subscription?: {
    tier: 'FREE' | 'STARTER' | 'GROWTH' | 'BUSINESS' | 'ENTERPRISE';
    expiresAt: string;
  };
  profile?: {
    phone?: string;
    avatar?: string;
    bio?: string;
  };
  managedProperties?: Property[]; // For property managers
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}
```

### 11.2 Property Types
```typescript
// types/property.ts
export interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: 'APARTMENT' | 'HOUSE' | 'FLAT' | 'COMMERCIAL';
  managementType: 'SELF_MANAGED' | 'SYSTEM_MANAGED';
  totalUnits: number;
  occupiedUnits: number;
  landlord: {
    id: string;
    name: string;
    email: string;
  };
  assignedManager?: {
    id: string;
    name: string;
    email: string;
  };
  managementFeePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManagementRequest {
  id: string;
  property: Property;
  landlord: User;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  respondedAt?: string;
  notes?: string;
}
