"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  Settings,
  Database,
  BarChart3,
  Shield,
  Bell,
  Search,
  User,
  UserCog,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useConnectionStatusColor } from "@/components/connectionManager/http";
import { useTheme } from "next-themes";
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/theme-toggle-button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

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
    title: "Accounts",
    icon: Users,
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
      },
      {
        title: "Roles",
        href: "/dashboard/roles",
      },
      {
        title: "Profiles",
        href: "/dashboard/profiles",
      },
    ],
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
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs = [],
  className,
  user,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const connectionStatus = useConnectionStatusColor();
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  const handleThemeToggle = React.useCallback(() => {
    startTransition(() => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    });
  }, [theme, setTheme, startTransition]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-auto">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Database className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Entity Manager
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  v2.0
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    // Collapsible group for items with subitems
                    <div className="py-2">
                      <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-sidebar-foreground">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      <div className="ml-7 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Regular menu button for items without subitems
                    <SidebarMenuButton asChild>
                      <Link href={item.href!} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  <Separator />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-sidebar-accent rounded-md transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
                  {user?.first_name?.[0] || 'U'}
                  {user?.last_name?.[0] || ''}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">
                    {user?.email}
                  </span>
                </div>
              </div>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger className="-ml-1" />

              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-sidebar-foreground/70">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span>/</span>}
                      {breadcrumb.href ? (
                        <Link
                          href={breadcrumb.href}
                          className="hover:text-sidebar-foreground transition-colors"
                        >
                          {breadcrumb.label}
                        </Link>
                      ) : (
                        <span className="text-sidebar-foreground font-medium">
                          {breadcrumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}

              <div className="ml-auto flex items-center gap-2">
                {/* Command Palette */}
                <Button
                  variant="outline"
                  className="relative h-8 w-full justify-start rounded-[0.5rem] bg-sidebar-accent text-sm font-normal text-sidebar-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                  onClick={() => setOpen(true)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline-flex">Search...</span>
                  <span className="inline-flex lg:hidden">Search</span>
                  <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="h-8 w-8" asChild>
                  <Link href="/dashboard/notifications">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Profile */}
                <Button variant="ghost" size="sm" className="h-8 w-8" asChild>
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Connection Status */}
                <div className={cn(
                  "hidden sm:flex items-center gap-2 px-2 py-1 rounded-md border",
                  connectionStatus.bgColor,
                  connectionStatus.borderColor
                )}>
                  <div className={cn("h-2 w-2 rounded-full", connectionStatus.dotColor)} />
                  <span className={cn("text-xs", connectionStatus.textColor)}>
                    {connectionStatus.status}
                  </span>
                </div>

                {/* Theme Toggle */}
                <ThemeToggleButton
                  theme={theme as 'light' | 'dark'}
                  onClick={handleThemeToggle}
                  variant="circle"
                  start="bottom-right"
                  className="h-8 w-8"
                />
              </div>
            </div>
          </header>

          {/* Page Header */}
          {(title || subtitle || actions) && (
            <div className="border-b border-sidebar-border bg-sidebar/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-sidebar-foreground">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-sidebar-foreground/70 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center gap-2">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className={cn("flex-1 overflow-y-auto p-3", className)}>
            {children}
          </main>
        </SidebarInset>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard'; }}>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/entities'; }}>
              <Database className="mr-2 h-4 w-4" />
              <span>Entities</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/users'; }}>
              <Users className="mr-2 h-4 w-4" />
              <span>Users</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/roles'; }}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Roles</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/profiles'; }}>
              <User className="mr-2 h-4 w-4" />
              <span>Profiles</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/analytics'; }}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/security'; }}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/settings'; }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/profile'; }}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/notifications'; }}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/users'; }}>
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Users</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.location.href = '/dashboard/roles'; }}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Manage Roles</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}