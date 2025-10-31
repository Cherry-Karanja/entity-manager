'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is not authenticated
      if (!isAuthenticated || !user) {
        toast.error('Please login to access the dashboard', {
          description: 'You need to be authenticated to view this page',
          duration: 4000,
        });
        // Redirect to login with the current path as redirect parameter
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
} 