/**
 * List Error State
 * 
 * Error display component for lists when data fails to load.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  WifiOff,
  ServerCrash,
  Lock,
  RefreshCw,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message?: string;
  /** Error type */
  type?: 'network' | 'server' | 'permission' | 'validation' | 'unknown';
  /** Error object (for details) */
  error?: Error | string;
  /** Retry action */
  onRetry?: () => void;
  /** Go back action */
  onGoBack?: () => void;
  /** Contact support action */
  onContactSupport?: () => void;
  /** Show error details */
  showDetails?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Error content based on type
 */
const errorContent: Record<
  NonNullable<ErrorStateProps['type']>,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    message: string;
  }
> = {
  network: {
    icon: WifiOff,
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
  },
  server: {
    icon: ServerCrash,
    title: 'Server Error',
    message: 'The server encountered an error. Our team has been notified and is working on a fix.',
  },
  permission: {
    icon: Lock,
    title: 'Access Denied',
    message: "You don't have permission to view this data. Contact your administrator for access.",
  },
  validation: {
    icon: AlertTriangle,
    title: 'Validation Error',
    message: 'There was a problem with the request. Please check your input and try again.',
  },
  unknown: {
    icon: XCircle,
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  },
};

/**
 * Error state component (full page)
 */
export function ErrorState({
  title,
  message,
  type = 'unknown',
  error,
  onRetry,
  onGoBack,
  onContactSupport,
  showDetails = false,
  className,
}: ErrorStateProps) {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);
  
  const defaultContent = errorContent[type];
  const Icon = defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;
  
  // Get error details
  const errorDetails = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {/* Icon */}
      <div className="mb-4 rounded-full bg-destructive/10 p-6">
        <Icon className="h-12 w-12 text-destructive" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{displayTitle}</h3>

      {/* Message */}
      <p className="text-sm text-muted-foreground max-w-md mb-6">{displayMessage}</p>

      {/* Error details */}
      {showDetails && errorDetails && (
        <div className="w-full max-w-2xl mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="mb-2"
          >
            {showErrorDetails ? 'Hide' : 'Show'} Error Details
          </Button>
          
          {showErrorDetails && (
            <Alert variant="destructive" className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                <pre className="text-xs overflow-auto max-h-40 p-2 bg-destructive/5 rounded">
                  {errorDetails}
                  {errorStack && `\n\n${errorStack}`}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} size="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoBack && (
          <Button onClick={onGoBack} variant="outline" size="default">
            Go Back
          </Button>
        )}
        {onContactSupport && (
          <Button onClick={onContactSupport} variant="ghost" size="default">
            Contact Support
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline error state (for within lists/forms)
 */
export function InlineErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn('my-4', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="ml-4">
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Compact error state (minimal)
 */
export function CompactErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between py-4 px-4 bg-destructive/5 rounded-lg border border-destructive/20', className)}>
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        <p className="text-sm text-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" size="sm">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

/**
 * Network error state
 */
export function NetworkErrorState({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
      className={className}
    />
  );
}

/**
 * Permission error state
 */
export function PermissionErrorState({
  onGoBack,
  onContactSupport,
  className,
}: {
  onGoBack?: () => void;
  onContactSupport?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      type="permission"
      onGoBack={onGoBack}
      onContactSupport={onContactSupport}
      className={className}
    />
  );
}
