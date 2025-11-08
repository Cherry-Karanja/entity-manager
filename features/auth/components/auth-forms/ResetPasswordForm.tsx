import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { AuthState, AuthFormData, AuthMode } from '../SimpleAuthPage';

interface ResetPasswordFormProps {
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

export default function ResetPasswordForm({ state, actions, onSubmit }: ResetPasswordFormProps) {
  const { formData, loading, errors, touched } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uid">User ID</Label>
            <Input
              id="uid"
              type="text"
              value={formData.uid}
              placeholder="User ID from reset link"
              onChange={(e) => actions.updateField('uid', e.target.value)}
              onBlur={() => actions.setTouched('uid')}
              className={errors.uid && touched.uid ? 'border-destructive' : ''}
              required
              disabled={loading.resetPassword}
            />
            {errors.uid && touched.uid && (
              <p className="text-sm text-destructive">{errors.uid}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resetToken">Reset Token</Label>
            <Input
              id="resetToken"
              type="text"
              value={formData.resetToken}
              placeholder="Reset token from email"
              onChange={(e) => actions.updateField('resetToken', e.target.value)}
              onBlur={() => actions.setTouched('resetToken')}
              className={errors.resetToken && touched.resetToken ? 'border-destructive' : ''}
              required
              disabled={loading.resetPassword}
            />
            {errors.resetToken && touched.resetToken && (
              <p className="text-sm text-destructive">{errors.resetToken}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              placeholder="Enter new password"
              onChange={(e) => actions.updateField('password', e.target.value)}
              onBlur={() => actions.setTouched('password')}
              className={errors.password && touched.password ? 'border-destructive' : ''}
              required
              disabled={loading.resetPassword}
            />
            {errors.password && touched.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="Confirm new password"
              onChange={(e) => actions.updateField('confirmPassword', e.target.value)}
              onBlur={() => actions.setTouched('confirmPassword')}
              className={errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''}
              required
              disabled={loading.resetPassword}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading.resetPassword || state.isSubmitting}
          >
            {loading.resetPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}