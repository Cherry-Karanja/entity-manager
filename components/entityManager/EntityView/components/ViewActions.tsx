'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { EntityActions } from '../../EntityActions'
import { EntityActionsConfig } from '../../EntityActions/types'
import { BaseEntity } from '../../manager'
import { ViewAction } from '../types'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export interface ViewActionsProps {
  data: unknown
  actions?: ViewAction[] // Legacy support
  entityActions?: EntityActionsConfig // New EntityActions config
  onActionClick?: (action: ViewAction) => void
  className?: string
  compact?: boolean
}

export const ViewActions: React.FC<ViewActionsProps> = ({
  data,
  actions = [],
  entityActions,
  onActionClick,
  className,
  compact = false,
}) => {
  const pathname = usePathname()

  // If EntityActions config is provided, use it
  if (entityActions) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <EntityActions
          config={entityActions as any}
          context={{ entity: data as BaseEntity, pathname }}
        />
      </div>
    )
  }

  // Otherwise, use legacy ViewAction buttons
  if (actions.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {actions
        .filter(action => !action.condition || action.condition(data))
        .map(action => (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            size={compact ? 'sm' : (action.size || 'default')}
            disabled={action.disabled || action.loading}
            onClick={() => {
              if (action.onClick) {
                action.onClick(data)
              }
              onActionClick?.(action)
            }}
            className={cn(action.loading && 'opacity-50 cursor-wait')}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        ))}
    </div>
  )
}

export default ViewActions
