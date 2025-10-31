'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Users, 
  Receipt, 
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  FileText,
  Bell,
  CreditCard,
  Phone,
  MessageSquare,
  Database,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  children?: SidebarItem[];
  allowedRoles?: User['user_type'][];
}

interface SidebarProps {
  user: User;
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

// Sidebar navigation items based on user roles
const getSidebarItems = (userType: User['user_type']): SidebarItem[] => {
  // Normalize user type to uppercase to tolerate API variations like 'landlord' or 'Landlord'
  const normalizedUserType = (userType as string)?.toUpperCase();
  const baseItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      allowedRoles: ['LANDLORD', 'TENANT', 'CARETAKER', 'PROPERTY_MANAGER'],
    },
  ];

  const landlordItems: SidebarItem[] = [
    {
      id: 'properties',
      label: 'Properties',
      icon: Building,
      href: '/dashboard/new/property',
    },
    {
      id: 'tenants',
      label: 'Tenants',
      icon: Users,
      href: '/dashboard/new/tenant',
    },
    {
      id: 'billing',
      label: 'Billing & Payments',
      icon: Receipt,
      href: '/dashboard/billing',
      children: [
        {
          id: 'invoices',
          label: 'Invoices',
          icon: FileText,
          href: '/dashboard/billing/invoices',
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: CreditCard,
          href: '/dashboard/billing/payments',
        },
        {
          id: 'billing-templates',
          label: 'Billing Templates',
          icon: Receipt,
          href: '/dashboard/billing/templates',
        },
      ],
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      href: '/dashboard/maintenance',
      badge: '3',
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: FileText,
      href: '/dashboard/contracts',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      href: '/dashboard/reports',
      children: [
        {
          id: 'income-reports',
          label: 'Income Reports',
          icon: BarChart3,
          href: '/dashboard/reports/income',
        },
        {
          id: 'occupancy-reports',
          label: 'Occupancy Reports',
          icon: BarChart3,
          href: '/dashboard/reports/occupancy',
        },
        {
          id: 'payment-reports',
          label: 'Payment Reports',
          icon: BarChart3,
          href: '/dashboard/reports/payments',
        },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/dashboard/notifications',
      badge: '5',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      href: '/dashboard/communication',
    },
  ];

  const tenantItems: SidebarItem[] = [
    {
      id: 'my-unit',
      label: 'My Unit',
      icon: Home,
      href: '/dashboard/unit',
    },
    {
      id: 'my-invoices',
      label: 'My Invoices',
      icon: Receipt,
      href: '/dashboard/invoices',
    },
    {
      id: 'payment-history',
      label: 'Payment History',
      icon: CreditCard,
      href: '/dashboard/payments',
    },
    {
      id: 'maintenance-requests',
      label: 'Maintenance Requests',
      icon: Wrench,
      href: '/dashboard/maintenance',
    },
    {
      id: 'my-contract',
      label: 'My Contract',
      icon: FileText,
      href: '/dashboard/contract',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/dashboard/notifications',
      badge: '2',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      href: '/dashboard/communication',
    },
  ];

  const caretakerItems: SidebarItem[] = [
    {
      id: 'assigned-properties',
      label: 'Assigned Properties',
      icon: Building,
      href: '/dashboard/properties',
    },
    {
      id: 'tenant-management',
      label: 'Tenant Management',
      icon: Users,
      href: '/dashboard/tenants',
    },
    {
      id: 'maintenance-tasks',
      label: 'Maintenance Tasks',
      icon: Wrench,
      href: '/dashboard/maintenance',
      badge: '4',
    },
    {
      id: 'basic-billing',
      label: 'Basic Billing',
      icon: Receipt,
      href: '/dashboard/billing',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/dashboard/notifications',
    },
  ];

  const propertyManagerItems: SidebarItem[] = [
    {
      id: 'managed-properties',
      label: 'Managed Properties',
      icon: Building,
      href: '/dashboard/properties',
    },
    {
      id: 'all-tenants',
      label: 'All Tenants',
      icon: Users,
      href: '/dashboard/tenants',
    },
    {
      id: 'billing-management',
      label: 'Billing Management',
      icon: Receipt,
      href: '/dashboard/billing',
    },
    {
      id: 'maintenance-oversight',
      label: 'Maintenance Oversight',
      icon: Wrench,
      href: '/dashboard/maintenance',
    },
    {
      id: 'performance-reports',
      label: 'Performance Reports',
      icon: BarChart3,
      href: '/dashboard/reports',
    },
    {
      id: 'commission-tracking',
      label: 'Commission Tracking',
      icon: CreditCard,
      href: '/dashboard/commission',
    },
  ];

  const adminItems: SidebarItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Admin Dashboard',
      icon: Database,
      href: '/dashboard/admin',
      children: [
        {
          id: 'admin-overview',
          label: 'Overview',
          icon: Database,
          href: '/dashboard/admin',
        },
        {
          id: 'user-management',
          label: 'User Management',
          icon: Users,
          href: '/dashboard/admin?tab=users',
        },
        {
          id: 'property-management',
          label: 'Property Management',
          icon: Building,
          href: '/dashboard/admin?tab=properties',
        },
        {
          id: 'management-requests',
          label: 'Management Requests',
          icon: UserCheck,
          href: '/dashboard/admin?tab=management',
          badge: '2',
        },
        {
          id: 'system-settings',
          label: 'System Settings',
          icon: Settings,
          href: '/dashboard/admin?tab=settings',
        },
      ],
    },
    {
      id: 'subscription-management',
      label: 'Subscriptions',
      icon: CreditCard,
      href: '/dashboard/admin/subscriptions',
    },
    {
      id: 'system-analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/admin/analytics',
    },
    {
      id: 'support-tickets',
      label: 'Support Tickets',
      icon: Phone,
      href: '/dashboard/admin/support',
    },
  ];

  const commonItems: SidebarItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/settings',
      allowedRoles: ['LANDLORD', 'TENANT', 'CARETAKER', 'PROPERTY_MANAGER', 'ADMIN'],
    },
  ];

  let roleSpecificItems: SidebarItem[] = [];
  
  switch (normalizedUserType) {
    case 'LANDLORD':
      roleSpecificItems = landlordItems;
      break;
    case 'TENANT':
      roleSpecificItems = tenantItems;
      break;
    case 'CARETAKER':
      roleSpecificItems = caretakerItems;
      break;
    case 'PROPERTY_MANAGER':
      roleSpecificItems = propertyManagerItems;
      break;
    case 'ADMIN':
      roleSpecificItems = adminItems;
      break;
    default:
      roleSpecificItems = [];
  }

  return normalizedUserType === 'ADMIN'
    ? [...roleSpecificItems, ...commonItems]
    : [...baseItems, ...roleSpecificItems, ...commonItems];
};

const SidebarItem: React.FC<{
  item: SidebarItem;
  isCollapsed: boolean;
  level?: number;
  currentPath: string;
  currentTab?: string;
  allHrefs: string[];
}> = ({ item, isCollapsed, level = 0, currentPath, currentTab, allHrefs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  // Enhanced active logic for admin tab children: highlight only one (parent or child, never both)
  function normalizePath(path: string) {
    if (!path) return '';
    const base = path.split('?')[0];
    return base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base;
  }
  const normalizedPath = normalizePath(currentPath || '/dashboard');
  const normalizedHref = normalizePath(item.href);
  // Special highlight logic for Dashboard root
  let isActive;
  if (item.href === '/dashboard') {
    // Active on exact /dashboard or /dashboard/
    isActive = (normalizedPath === '/dashboard' || normalizedPath === '/dashboard/');
    // Also active on any /dashboard/* path that doesn't exactly match another sidebar href
    if (!isActive && normalizedPath.startsWith('/dashboard')) {
      const others = (allHrefs || []).filter(h => h !== '/dashboard');
      const normalizedOthers = others.map(normalizePath);
      const exactOtherMatch = normalizedOthers.includes(normalizedPath);
      isActive = !exactOtherMatch; // highlight dashboard when no other exact match exists
    }
  } else {
    isActive = normalizedPath === normalizedHref;
  }
  if (item.href.includes('?tab=')) {
    const tabValue = item.href.split('?tab=')[1];
    isActive = currentPath.startsWith('/dashboard/admin') && currentTab === tabValue;
  }
  const isChildActive = hasChildren && item.children?.some(child => {
    if (child.href.includes('?tab=')) {
      const tabValue = child.href.split('?tab=')[1];
      return currentPath.startsWith('/dashboard/admin') && currentTab === tabValue;
    }
    return currentPath === child.href;
  });

  // Highlight only if active and no child is active (ensures only one highlight at a time)
  const shouldHighlight = isActive && !isChildActive;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          level > 0 && 'ml-4',
          shouldHighlight
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          'group cursor-pointer'
        )}
        onClick={hasChildren ? handleToggle : undefined}
      >
        <Link
          href={item.href}
          className={cn(
            'flex items-center flex-1 min-w-0',
            hasChildren && 'pointer-events-none'
          )}
        >
          <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
        {hasChildren && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 ml-auto"
            onClick={handleToggle}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>
      
      {hasChildren && !isCollapsed && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
              level={level + 1}
              currentPath={currentPath}
              currentTab={currentTab}
              allHrefs={allHrefs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isCollapsed = false, 
  onToggle, 
  className 
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || '';
  // Normalize user_type to uppercase to handle APIs that return lowercase role strings
  const normalizedUserType = (user?.user_type || '').toUpperCase() as User['user_type'];
  const sidebarItems = getSidebarItems(normalizedUserType);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-card border-r border-border h-full transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 w-fit">
            {/* Logo */}
            <div className="flex items-center justify-center w-8 h-8">
              <Logo width={32} height={32} className="object-contain" />
            </div>

            <h1 className="text-base font-semibold text-foreground whitespace-nowrap">
              MyLandlord
            </h1>
          </div>


        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-8 h-8 p-0"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">
              {user?.first_name?.[0] || 'U'}{user?.last_name?.[0] || ''}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.user_type.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              currentPath={pathname}
              currentTab={currentTab}
              allHrefs={sidebarItems.map(i => i.href)}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start',
            isCollapsed && 'justify-center'
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
