'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock, XCircle, RotateCcw, Loader2 } from 'lucide-react'
import { OptimisticState } from './types/optimistic'

interface OptimisticStatusBadgeProps {
  optimisticState: OptimisticState
  className?: string
}

export const OptimisticStatusBadge: React.FC<OptimisticStatusBadgeProps> = ({
  optimisticState,
  className = ''
}) => {
  const pendingCount = optimisticState.pendingCount
  const failedCount = optimisticState.failedCount

  if (pendingCount === 0 && failedCount === 0) {
    return null
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {pendingCount > 0 && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1 animate-spin" />
          {pendingCount} Pending
        </Badge>
      )}
      {failedCount > 0 && (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          {failedCount} Failed
        </Badge>
      )}
    </div>
  )
}

interface OptimisticOperationOverlayProps {
  operationId?: string
  optimisticState: OptimisticState
  onRollback?: (operationId: string) => void
  onRetry?: (operationId: string) => void
  children: React.ReactNode
  className?: string
}

export const OptimisticOperationOverlay: React.FC<OptimisticOperationOverlayProps> = ({
  operationId,
  optimisticState,
  onRollback,
  onRetry,
  children,
  className = ''
}) => {
  const operation = operationId ? optimisticState.operations.get(operationId) : undefined

  if (!operation) {
    return <>{children}</>
  }

  const isPending = operation.status === 'pending'
  const isFailed = operation.status === 'failed'

  return (
    <div className={`relative ${className}`}>
      {children}

      {/* Loading overlay for pending operations */}
      {isPending && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Updating...</span>
          </div>
        </div>
      )}

      {/* Error overlay for failed operations */}
      {isFailed && (
        <div className="absolute inset-0 bg-red-50/90 border border-red-200 rounded-md flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-700 mb-2">Update Failed</div>
            <div className="text-xs text-red-600 mb-3 max-w-32 truncate">
              {operation.error || 'Unknown error'}
            </div>
            <div className="flex gap-2 justify-center">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry(operation.id)}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
              {onRollback && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRollback(operation.id)}
                  className="h-6 px-2 text-xs"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Rollback
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface OptimisticOperationToastProps {
  optimisticState: OptimisticState
  onRollback?: (operationId: string) => void
  onRetry?: (operationId: string) => void
  onClearFailed?: () => void
  className?: string
}

export const OptimisticOperationToast: React.FC<OptimisticOperationToastProps> = ({
  optimisticState,
  onRollback,
  onRetry,
  onClearFailed,
  className = ''
}) => {
  const failedOperations = Array.from(optimisticState.operations.values())
    .filter(op => op.status === 'failed')

  if (failedOperations.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">
              {failedOperations.length} Operation{failedOperations.length > 1 ? 's' : ''} Failed
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Some changes couldn&apos;t be saved to the server.
            </div>
            <div className="flex gap-2 mt-3">
              {onRetry && failedOperations.length === 1 && (
                <Button
                  size="sm"
                  onClick={() => onRetry(failedOperations[0].id)}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
              {onRollback && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => failedOperations.forEach(op => onRollback(op.id))}
                  className="text-xs"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Rollback All
                </Button>
              )}
              {onClearFailed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClearFailed}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OptimisticUI = {
  OptimisticStatusBadge,
  OptimisticOperationOverlay,
  OptimisticOperationToast
}

export default OptimisticUI