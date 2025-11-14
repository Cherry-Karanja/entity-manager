// ===== ENTITY ACTIONS V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityActionsConfig<TEntity>

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Entity, EntityActionsConfig } from '../types'

export interface EntityActionsProps<TEntity extends Entity = Entity> {
  config: EntityActionsConfig<TEntity>
  context: {
    entity?: TEntity
    entities?: TEntity[]
    refresh?: () => void | Promise<void>
    showList?: () => void
    showForm?: (entity?: TEntity) => void
    showView?: (entity: TEntity) => void
    onCreate?: (data: Partial<TEntity>) => void | Promise<void>
    onUpdate?: (data: Partial<TEntity>) => void | Promise<void>
    onDelete?: (entity: TEntity) => void | Promise<void>
  }
}

export const EntityActions = <TEntity extends Entity = Entity>({
  config,
  context,
}: EntityActionsProps<TEntity>) => {
  // Handle action click
  const handleActionClick = async (action: typeof config.actions[0]) => {
    try {
      await action.onClick(context)
    } catch (error) {
      console.error('Action error:', error)
    }
  }

  // Filter visible actions
  const visibleActions = config.actions.filter(action => {
    if (typeof action.disabled === 'function') {
      return !action.disabled(context)
    }
    if (typeof action.disabled === 'boolean') {
      return !action.disabled
    }
    if (action.condition) {
      return action.condition(context)
    }
    return true
  })

  if (visibleActions.length === 0) return null

  return (
    <div className={`flex items-center gap-2 ${
      config.align === 'center' ? 'justify-center' :
      config.align === 'end' ? 'justify-end' :
      'justify-start'
    }`}>
      {visibleActions.map(action => (
        <Button
          key={action.id}
          variant={action.variant || 'default'}
          size={action.size || 'default'}
          onClick={() => handleActionClick(action)}
        >
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
          {action.badge && (
            <span className="ml-2 rounded-full bg-background px-2 py-0.5 text-xs">
              {action.badge}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}

EntityActions.displayName = 'EntityActions'
