import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { AuthState, AuthFormData, AuthMode } from '../SimpleAuthPage';

interface ForgotPasswordFormProps {
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

export default function ForgotPasswordForm({ state, actions, onSubmit }: ForgotPasswordFormProps) {
  const { formData, loading, errors, touched } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link</CardDescription>
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
              disabled={loading.forgotPassword}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading.forgotPassword || state.isSubmitting}
          >
            {loading.forgotPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}