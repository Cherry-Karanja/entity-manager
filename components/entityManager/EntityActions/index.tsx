// ===== ENTITY ACTIONS V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityActionsConfig<TEntity>

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {  EntityActionsConfig } from './types'
import { BaseEntity } from '../manager'

export interface EntityActionsProps<TEntity extends BaseEntity = BaseEntity> {
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

export const EntityActions = <TEntity extends BaseEntity = BaseEntity>({
  config,
  context,
}: EntityActionsProps<TEntity>) => {
  // Handle action click
  const handleActionClick = async (action: typeof config.actions[0]) => {
    try {
      if (action.onExecute) {
        await action.onExecute(context.entity || context.entities, context)
      }
    } catch (error) {
      console.error('Action error:', error)
    }
  }

  // Filter visible actions
  const visibleActions = config.actions.filter(action => {
    if (action.condition) {
      return action.condition(context.entity || context.entities, context)
    }
    if (typeof action.disabled === 'boolean') {
      return !action.disabled
    }
    if (action.visible) {
      return action.visible(context.entity || context.entities, context)
    }
    return true
  })

  if (visibleActions.length === 0) return null

  return (
    <div className="flex items-center gap-2 justify-start">
      {visibleActions.map(action => {
        // Map EntityAction type to Button variant
        const getVariant = (type?: string) => {
          switch (type) {
            case 'primary': return 'default'
            case 'dashed': return 'outline'
            case 'link': return 'link'
            case 'text': return 'ghost'
            default: return 'default'
          }
        }

        // Map EntityAction size to Button size
        const getSize = (size?: string) => {
          switch (size) {
            case 'small': return 'sm'
            case 'large': return 'lg'
            default: return 'default'
          }
        }

        return (
          <Button
            key={action.id}
            variant={getVariant(action.type)}
            size={getSize(action.size)}
            onClick={() => handleActionClick(action)}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

EntityActions.displayName = 'EntityActions'