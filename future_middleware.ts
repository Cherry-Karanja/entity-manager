/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware protects authenticated routes and redirects users
 * based on their authentication status.
 */

import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/landlord',
  '/dashboard/tenant',
  '/dashboard/manager',
  '/dashboard/caretaker',
  '/dashboard/admin',
  '/profile',
  '/exams',
  '/settings',
];

// Define public routes that should redirect authenticated users
const authRoutes = [
  '/auth',
  '/login',
  '/register',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies or headers
  const token = request.cookies.get('token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Check if user is authenticated (has valid token)
  const isAuthenticated = !!token;
  console.log(`User is ${isAuthenticated ? 'authenticated' : 'not authenticated'}. Token: ${token}`);
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect unauthenticated users from protected routes to auth
  if (isProtectedRoute && !isAuthenticated) {
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(authUrl);
  }
  
  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    // Try to get userType from cookies for more accurate redirection
    const userType = request.cookies.get('userType')?.value;
    let dashboardPath = '/dashboard';
    switch (userType) {
      case 'LANDLORD':
        dashboardPath = '/dashboard/landlord';
        break;
      case 'TENANT':
        dashboardPath = '/dashboard/tenant';
        break;
      case 'PROPERTY_MANAGER':
        dashboardPath = '/dashboard/manager';
        break;
      case 'CARETAKER':
        dashboardPath = '/dashboard/caretaker';
        break;
      case 'ADMIN':
        dashboardPath = '/dashboard/admin';
        break;
      default:
        dashboardPath = '/dashboard';
    }
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }
  
  // Redirect authenticated users from /dashboard to their specific dashboard
  if (pathname === '/dashboard' && isAuthenticated) {
    const userType = request.cookies.get('userType')?.value;
    let dashboardPath = '/dashboard';
    switch (userType) {
      case 'LANDLORD':
        dashboardPath = '/dashboard/landlord';
        break;
      case 'TENANT':
        dashboardPath = '/dashboard/tenant';
        break;
      case 'PROPERTY_MANAGER':
        dashboardPath = '/dashboard/manager';
        break;
      case 'CARETAKER':
        dashboardPath = '/dashboard/caretaker';
        break;
      case 'ADMIN':
        dashboardPath = '/dashboard/admin';
        break;
      default:
        dashboardPath = '/dashboard';
    }
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};