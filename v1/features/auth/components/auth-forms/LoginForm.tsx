import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { AuthState, AuthFormData, AuthMode } from '../SimpleAuthPage';

interface LoginFormProps {
  state: AuthState;
  actions: {
    updateField: (field: keyof AuthFormData, value: string) => void;
    setMode: (mode: AuthMode) => void;
    setTouched: (field: string) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
  onQuickLogin: (email: string, password: string) => void;
  isMobile: boolean;
}

export default function LoginForm({ state, actions, onSubmit, onQuickLogin, isMobile }: LoginFormProps) {
  const { formData, loading, errors, touched } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={(e) => actions.updateField('email', e.target.value)}
              onBlur={() => actions.setTouched('email')}
              className={errors.email && touched.email ? 'border-destructive' : ''}
              required
              disabled={loading.login}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={(e) => actions.updateField('password', e.target.value)}
              onBlur={() => actions.setTouched('password')}
              className={errors.password && touched.password ? 'border-destructive' : ''}
              required
              disabled={loading.login}
            />
            {errors.password && touched.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading.login || state.isSubmitting}
          >
            {loading.login ? (
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
                onClick={() => onQuickLogin('test.landlord@gmail.com', 'user@12345')}
                disabled={loading.login}
              >
                Landlord
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuickLogin('test.tenant@gmail.com', 'user@12345')}
                disabled={loading.login}
              >
                Tenant
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuickLogin('test.propertyManager@gmail.com', 'user@12345')}
                disabled={loading.login}
              >
                Manager
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuickLogin('test.caretaker@gmail.com', 'user@12345')}
                disabled={loading.login}
              >
                Caretaker
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onQuickLogin('admin@gmail.com', 'admin123')}
              disabled={loading.login}
              className="w-full"
            >
              Admin
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}