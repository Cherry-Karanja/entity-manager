'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import {  Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// import authManager


export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  initialMode?: AuthMode;
  onAuthSuccess: () => void;
}

export function AuthPage({ 
  initialMode = 'login', 
  onAuthSuccess, 
}: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const isMobile = useIsMobile();

const handleLogin = async (email: string, password: string) => {
    const isAuthenticated = await login(email, password);
    if (isAuthenticated) {
        // Add the check here:
        if (typeof onAuthSuccess === 'function') {
            console.log('is function')
            await onAuthSuccess();
        }
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
        const isAuthenticated = await login(email, password);
        if (isAuthenticated) {
            // Add the check here:
            if (typeof onAuthSuccess === 'function') {
                await onAuthSuccess();
            }
        }
    } else if (mode === 'register') {
        // For now, just simulate registration by logging in
        const isAuthenticated = await login(email, password);
        if (isAuthenticated) {
            // Add the check here:
            if (typeof onAuthSuccess === 'function') {
                await onAuthSuccess();
            }
        }
    }
};
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <div className="w-full max-w-md">

            <div className="mb-8 text-center">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center">
                  <Logo width={120} height={60} />
                </div>
              <h1 className="mt-0 text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="mt-1 text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder='Enter your email'
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      placeholder='Enter your password'
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  
                  {/* Test User Buttons */}
                  <div className="space-y-2 border-t pt-4">
                    <p className="text-sm text-gray-600 text-center">Quick Test Login:</p>
                    <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogin('test.landlord@gmail.com', 'user@12345')}
                        disabled={isLoading}
                      >
                        Landlord
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogin('test.tenant@gmail.com', 'user@12345')}
                        disabled={isLoading}
                      >
                        Tenant
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogin('test.propertyManager@gmail.com', 'user@12345')}
                        disabled={isLoading}
                      >
                        Manager
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogin('test.caretaker@gmail.com', 'user@12345')}
                        disabled={isLoading}
                      >
                        Caretaker
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogin('admin@gmail.com', 'admin123')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Admin
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => setMode('register')} className="font-medium text-foreground underline underline-offset-4 hover:text-green-600">
                Sign up
              </button>
            </p>
          </div>
        );
      
      case 'register':
        return (
          <div className="w-full max-w-md">

             <div className="mb-8 text-center">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center">
                  <Logo width={120} height={60} />
                </div>
              <h1 className="mt-0 text-3xl font-bold text-foreground">Create your account</h1>
              <p className="mt-1 text-muted-foreground">Get started with MyLandlord today</p>
            </div>

            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Fill in your details to get started with MyLandlord</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter your ID number"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a...</Label>
                    <Select
                      disabled={isLoading}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="property_manager">Property Manager</SelectItem>
                        <SelectItem value="caretaker">Caretaker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      // value={confirmPassword}
                      // onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Make sure to type the same password</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => setMode('login')} className="font-medium text-foreground underline underline-offset-4 hover:text-green-600">
                  Sign in
                </button>
            </p>
          </div>
        );
      
      default:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Feature Not Available</CardTitle>
              <CardDescription>This feature is not implemented yet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setMode('login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {renderForm()}
    </div>
  );
}
