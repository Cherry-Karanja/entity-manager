'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { EntityListBulkAction, EntityListItem } from '../types'

interface EntityListBulkActionsProps {
  actions: EntityListBulkAction[]
  selectedItems: EntityListItem[]
  onAction: (action: EntityListBulkAction, items: EntityListItem[]) => void
  className?: string
}

export const EntityListBulkActions: React.FC<EntityListBulkActionsProps> = ({
  actions,
  selectedItems,
  onAction,
  className
}) => {
  if (actions.length === 0 || selectedItems.length === 0) return null

  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action) => {
        const isDisabled = Boolean(action.disabled) ||
          Boolean(action.minSelection && selectedItems.length < action.minSelection) ||
          Boolean(action.maxSelection && selectedItems.length > action.maxSelection)

        return (
          <Button
            key={action.id}
            variant={action.danger ? 'destructive' : 'default'}
            size="sm"
            onClick={() => onAction(action, selectedItems)}
            disabled={isDisabled}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}