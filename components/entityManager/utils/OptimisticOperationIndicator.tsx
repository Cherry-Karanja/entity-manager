'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react'
import { OptimisticState } from './types/optimistic'

interface OptimisticOperationIndicatorProps {
  optimisticState: OptimisticState
  onRollback?: (operationId: string) => void
  onRetry?: (operationId: string) => void
  className?: string
}

export const OptimisticOperationIndicator: React.FC<OptimisticOperationIndicatorProps> = ({
  optimisticState,
  onRollback,
  onRetry,
  className = ''
}) => {
  const pendingCount = optimisticState.pendingCount
  const failedCount = optimisticState.failedCount

  if (pendingCount === 0 && failedCount === 0) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 animate-spin" />
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />
      case 'rolled_back':
        return <AlertCircle className="h-3 w-3 text-orange-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'rolled_back':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Summary badges */}
      <div className="flex gap-2 flex-wrap">
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

      {/* Individual operation details */}
      {Array.from(optimisticState.operations.values()).map((operation) => (
        <div
          key={operation.id}
          className={`flex items-center justify-between p-2 rounded-md border ${getStatusColor(operation.status)}`}
        >
          <div className="flex items-center gap-2">
            {getStatusIcon(operation.status)}
            <div className="text-sm">
              <div className="font-medium capitalize">
                {operation.type} {operation.entityType}
                {operation.entityId && ` #${operation.entityId}`}
                {operation.tempId && ` (temp: ${operation.tempId})`}
              </div>
              <div className="text-xs opacity-75">
                {new Date(operation.timestamp).toLocaleTimeString()}
                {operation.retryCount > 0 && ` • ${operation.retryCount} retries`}
              </div>
              {operation.error && (
                <div className="text-xs text-red-600 mt-1">
                  {operation.error}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1">
            {operation.status === 'failed' && onRetry && (
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
            {(operation.status === 'failed' || operation.status === 'pending') && onRollback && (
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
      ))}
    </div>
  )
}

export default OptimisticOperationIndicator