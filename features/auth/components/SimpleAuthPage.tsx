'use client';

import React, { useReducer, useCallback, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { Loader2, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import authManager from '@/handler/AuthManager';

// ===== LAZY LOADED COMPONENTS =====
const LoginForm = lazy(() => import('./auth-forms/LoginForm'));
const RegisterForm = lazy(() => import('./auth-forms/RegisterForm'));
const ForgotPasswordForm = lazy(() => import('./auth-forms/ForgotPasswordForm'));
const ResetPasswordForm = lazy(() => import('./auth-forms/ResetPasswordForm'));

// ===== TYPES =====
export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  idNumber: string;
  userType: string;
  uid: string;
  resetToken: string;
}

export interface AuthState {
  mode: AuthMode;
  formData: AuthFormData;
  loading: {
    login: boolean;
    register: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

export interface AuthPageProps {
  initialMode?: AuthMode;
  onAuthSuccess: () => void;
}

// ===== ACTION TYPES =====
type AuthAction =
  | { type: 'SET_MODE'; payload: AuthMode }
  | { type: 'UPDATE_FIELD'; payload: { field: keyof AuthFormData; value: string } }
  | { type: 'SET_LOADING'; payload: { action: keyof AuthState['loading']; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_TOUCHED'; payload: { field: string } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' };

// ===== INITIAL STATE =====
const initialFormData: AuthFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  idNumber: '',
  userType: '',
  uid: '',
  resetToken: '',
};

const initialState: AuthState = {
  mode: 'login',
  formData: initialFormData,
  loading: {
    login: false,
    register: false,
    forgotPassword: false,
    resetPassword: false,
  },
  errors: {},
  touched: {},
  isSubmitting: false,
};

// ===== REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        errors: {},
        touched: {},
        isSubmitting: false,
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
        errors: {
          ...state.errors,
          [action.payload.field]: '', // Clear error when field is updated
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.action]: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.field]: true,
        },
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'RESET_FORM':
      return {
        ...state,
        formData: initialFormData,
        errors: {},
        touched: {},
        isSubmitting: false,
      };

    default:
      return state;
  }
}

// ===== CUSTOM HOOKS =====
function useAuthForm() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login } = useAuth();

  const updateField = useCallback((field: keyof AuthFormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }, []);

  const setMode = useCallback((mode: AuthMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setLoading = useCallback((action: keyof AuthState['loading'], loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { action, loading } });
  }, []);

  const setError = useCallback((field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', payload: { field, error } });
  }, []);

  const setTouched = useCallback((field: string) => {
    dispatch({ type: 'SET_TOUCHED', payload: { field } });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  return {
    state,
    actions: {
      updateField,
      setMode,
      setLoading,
      setError,
      setTouched,
      clearErrors,
      setSubmitting,
      resetForm,
    },
    login,
  };
}

// ===== VALIDATION =====
function validateField(field: keyof AuthFormData, value: string, mode: AuthMode): string {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
      return '';

    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';

    case 'confirmPassword':
      if (mode === 'register' || mode === 'reset-password') {
        if (!value) return 'Please confirm your password';
        return '';
      }
      return '';

    case 'firstName':
      if (mode === 'register' && !value) return 'First name is required';
      return '';

    case 'lastName':
      if (mode === 'register' && !value) return 'Last name is required';
      return '';

    case 'userType':
      if (mode === 'register' && !value) return 'Please select a user type';
      return '';

    case 'uid':
      if (mode === 'reset-password' && !value) return 'User ID is required';
      return '';

    case 'resetToken':
      if (mode === 'reset-password' && !value) return 'Reset token is required';
      return '';

    default:
      return '';
  }
}

function validateForm(formData: AuthFormData, mode: AuthMode): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate all relevant fields for current mode
  const fieldsToValidate: (keyof AuthFormData)[] = [];

  switch (mode) {
    case 'login':
      fieldsToValidate.push('email', 'password');
      break;
    case 'register':
      fieldsToValidate.push('firstName', 'lastName', 'email', 'password', 'confirmPassword', 'userType');
      break;
    case 'forgot-password':
      fieldsToValidate.push('email');
      break;
    case 'reset-password':
      fieldsToValidate.push('uid', 'resetToken', 'password', 'confirmPassword');
      break;
  }

  fieldsToValidate.forEach(field => {
    const error = validateField(field, formData[field], mode);
    if (error) errors[field] = error;
  });

  // Cross-field validation
  if (mode === 'register' || mode === 'reset-password') {
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
}

// ===== LOADING FALLBACK =====
const FormLoadingFallback = () => (
  <Card className="w-full max-w-md">
    <CardContent className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </CardContent>
  </Card>
);

// ===== MAIN COMPONENT =====
export function AuthPage({
  initialMode = 'login',
  onAuthSuccess,
}: AuthPageProps) {
  const { state, actions, login } = useAuthForm();
  const isMobile = useIsMobile();

  // Set initial mode
  useEffect(() => {
    if (initialMode !== state.mode) {
      actions.setMode(initialMode);
    }
  }, [initialMode, state.mode, actions]);

  // Handle authentication success
  const handleAuthSuccess = useCallback(async () => {
    if (typeof onAuthSuccess === 'function') {
      try {
        await onAuthSuccess();
      } catch (error) {
        console.error('Auth success callback failed:', error);
      }
    }
  }, [onAuthSuccess]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    actions.setSubmitting(true);
    actions.clearErrors();

    // Validate form
    const validationErrors = validateForm(state.formData, state.mode);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        actions.setError(field, error);
      });
      actions.setSubmitting(false);
      return;
    }

    try {
      switch (state.mode) {
        case 'login':
          actions.setLoading('login', true);
          const isAuthenticated = await login(state.formData.email, state.formData.password);
          if (isAuthenticated) {
            await handleAuthSuccess();
          }
          break;

        case 'register':
          actions.setLoading('register', true);
          // For now, simulate registration by logging in
          const registerSuccess = await login(state.formData.email, state.formData.password);
          if (registerSuccess) {
            toast.success('Account created successfully!');
            await handleAuthSuccess();
          }
          break;

        case 'forgot-password':
          actions.setLoading('forgotPassword', true);
          await authManager.forgotPassword(state.formData.email);
          toast.success('Password reset email sent! Check your inbox.');
          actions.setMode('login');
          break;

        case 'reset-password':
          actions.setLoading('resetPassword', true);
          await authManager.resetPassword(
            state.formData.uid,
            state.formData.resetToken,
            state.formData.password,
            state.formData.confirmPassword
          );
          toast.success('Password reset successfully! Please log in.');
          actions.setMode('login');
          actions.resetForm();
          break;
      }
    } catch (error) {
      console.error('Auth operation failed:', error);
      // Error handling is done by authManager and auth context
    } finally {
      actions.setLoading('login', false);
      actions.setLoading('register', false);
      actions.setLoading('forgotPassword', false);
      actions.setLoading('resetPassword', false);
      actions.setSubmitting(false);
    }
  }, [state.formData, state.mode, actions, login, handleAuthSuccess]);

  // Handle quick login for testing
  const handleQuickLogin = useCallback(async (email: string, password: string) => {
    actions.updateField('email', email);
    actions.updateField('password', password);
    actions.setLoading('login', true);

    try {
      const isAuthenticated = await login(email, password);
      if (isAuthenticated) {
        await handleAuthSuccess();
      }
    } catch (error) {
      console.error('Quick login failed:', error);
    } finally {
      actions.setLoading('login', false);
    }
  }, [actions, login, handleAuthSuccess]);

  // Render form based on mode
  const renderForm = () => {
    const commonProps = {
      state,
      actions,
      onSubmit: handleSubmit,
      onQuickLogin: handleQuickLogin,
      isMobile,
    };

    switch (state.mode) {
      case 'login':
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <LoginForm {...commonProps} />
          </Suspense>
        );

      case 'register':
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <RegisterForm {...commonProps} />
          </Suspense>
        );

      case 'forgot-password':
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <ForgotPasswordForm {...commonProps} />
          </Suspense>
        );

      case 'reset-password':
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <ResetPasswordForm {...commonProps} />
          </Suspense>
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
                onClick={() => actions.setMode('login')}
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <Logo width={120} height={60} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {state.mode === 'login' && 'Welcome back'}
            {state.mode === 'register' && 'Create your account'}
            {state.mode === 'forgot-password' && 'Reset your password'}
            {state.mode === 'reset-password' && 'Set new password'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {state.mode === 'login' && 'Sign in to your account to continue'}
            {state.mode === 'register' && 'Get started with MyLandlord today'}
            {state.mode === 'forgot-password' && "Enter your email address and we'll send you a reset link"}
            {state.mode === 'reset-password' && 'Enter your new password'}
          </p>
        </div>

        {/* Form */}
        {renderForm()}

        {/* Mode Switch Links */}
        <div className="mt-6 text-center space-y-2">
          {state.mode === 'login' && (
            <>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => actions.setMode('register')}
                  className="font-medium text-foreground underline underline-offset-4 hover:text-green-600"
                >
                  Sign up
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => actions.setMode('forgot-password')}
                  className="font-medium text-foreground underline underline-offset-4 hover:text-green-600"
                >
                  Forgot password?
                </button>
              </p>
            </>
          )}

          {(state.mode === 'register' || state.mode === 'forgot-password' || state.mode === 'reset-password') && (
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => actions.setMode('login')}
                className="font-medium text-foreground underline underline-offset-4 hover:text-green-600"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Global Error Display */}
        {Object.keys(state.errors).length > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">
                Please fix the errors above and try again.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
