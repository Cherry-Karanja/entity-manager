import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AuthState, AuthFormData, AuthMode } from '../SimpleAuthPage';

interface RegisterFormProps {
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

export default function RegisterForm({ state, actions, onSubmit, isMobile }: RegisterFormProps) {
  const { formData, loading, errors, touched } = state;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Fill in your details to get started with MyLandlord</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                placeholder="First name"
                onChange={(e) => actions.updateField('firstName', e.target.value)}
                onBlur={() => actions.setTouched('firstName')}
                className={errors.firstName && touched.firstName ? 'border-destructive' : ''}
                required
                disabled={loading.register}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                placeholder="Last name"
                onChange={(e) => actions.updateField('lastName', e.target.value)}
                onBlur={() => actions.setTouched('lastName')}
                className={errors.lastName && touched.lastName ? 'border-destructive' : ''}
                required
                disabled={loading.register}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              disabled={loading.register}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              placeholder="Enter your phone number"
              onChange={(e) => actions.updateField('phoneNumber', e.target.value)}
              onBlur={() => actions.setTouched('phoneNumber')}
              disabled={loading.register}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              type="text"
              value={formData.idNumber}
              placeholder="Enter your ID number"
              onChange={(e) => actions.updateField('idNumber', e.target.value)}
              onBlur={() => actions.setTouched('idNumber')}
              disabled={loading.register}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">I am a...</Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => actions.updateField('userType', value)}
              disabled={loading.register}
            >
              <SelectTrigger id="userType" className={errors.userType && touched.userType ? 'border-destructive' : ''}>
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
            {errors.userType && touched.userType && (
              <p className="text-sm text-destructive">{errors.userType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              placeholder="Create a password"
              onChange={(e) => actions.updateField('password', e.target.value)}
              onBlur={() => actions.setTouched('password')}
              className={errors.password && touched.password ? 'border-destructive' : ''}
              required
              disabled={loading.register}
            />
            <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
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
              placeholder="Confirm your password"
              onChange={(e) => actions.updateField('confirmPassword', e.target.value)}
              onBlur={() => actions.setTouched('confirmPassword')}
              className={errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''}
              required
              disabled={loading.register}
            />
            <p className="text-xs text-muted-foreground">Make sure to type the same password</p>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading.register || state.isSubmitting}
          >
            {loading.register ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}