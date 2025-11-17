'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/contexts/auth-context'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // useEffect(() => {
  //   if (!isLoading) {
  //     // Check if user is not authenticated for protected routes
  //     if (requireAuth && (!isAuthenticated || !user)) {
  //       toast.error('🔐 Oops! Please login to gain access', {
  //         description: 'You need to be authenticated to view this page',
  //         duration: 4000,
  //       })
  //       // Redirect to login with the current path as redirect parameter
  //       router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`)
  //       return
  //     }
  //     // Check if user is authenticated for auth-only routes (like login/signup pages)
  //     else if (!requireAuth && isAuthenticated && user) {
  //       router.push('/dashboard')
  //       return
  //     }
  //   }
  // }, [isAuthenticated, isLoading, user, pathname, router, requireAuth, redirectTo])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if authentication requirements aren't met
  if (requireAuth && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted-foreground">You need to be logged in to access this page.</p>
          <button
            onClick={() => router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!requireAuth && isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-blue-600">Already Logged In</h2>
          <p className="text-muted-foreground">You are already authenticated. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}