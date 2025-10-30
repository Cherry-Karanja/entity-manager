/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes and handles authentication redirects.
 * Use this to wrap any component that requires authentication.
 */

"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Add redirect parameter to return to original page after login
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Show fallback or nothing if not authenticated
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Redirecting to sign in...</p>
          </div>
        </div>
      )
    );
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Role-based access control component
 * Protects content based on user roles
 */
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const hasAllowedRole = allowedRoles.includes(user.user_type);

  if (!hasAllowedRole) {
    return (
      fallback || (
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this content.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}