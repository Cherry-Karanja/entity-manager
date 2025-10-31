"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId?: string
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Store error info in state
    this.setState({ errorInfo })

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Reset error state if resetKeys changed
    if (hasError && resetOnPropsChange && resetKeys) {
      const prevResetKeys = prevProps.resetKeys
      const hasResetKeyChanged = resetKeys.some((key, index) =>
        prevResetKeys?.[index] !== key
      )

      if (hasResetKeyChanged) {
        this.resetError()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId)
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Here you could integrate with error reporting services like Sentry, LogRocket, etc.
    // For now, we'll just log to console with structured data
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    }

    console.error('Error Report:', errorReport)

    // You could send this to your error tracking service:
    // errorTrackingService.captureException(error, { extra: errorReport })
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined
    })
  }

  private handleRetry = () => {
    this.resetError()
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-destructive/20 bg-destructive/5 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
              <CardDescription className="text-muted-foreground">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error details (only in development or when showDetails is true) */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && (
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Error Details</span>
                  </div>

                  {this.state.error && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Message:</span>
                        <p className="text-sm text-foreground mt-1 font-mono break-all">
                          {this.state.error.message}
                        </p>
                      </div>

                      {this.state.errorId && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Error ID:</span>
                          <p className="text-sm text-foreground mt-1 font-mono">
                            {this.state.errorId}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Support information */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  If this problem continues, please contact our support team with the error details above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Suspense wrapper with error boundary
export function SuspenseWithErrorBoundary({
  children,
  fallback,
  errorFallback,
  ...errorBoundaryProps
}: {
  children: ReactNode
  fallback: ReactNode
  errorFallback?: ReactNode
} & Omit<Props, 'children' | 'fallback'>) {
  return (
    <ErrorBoundary fallback={errorFallback} {...errorBoundaryProps}>
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  )
}