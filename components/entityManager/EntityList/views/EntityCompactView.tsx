'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActionsConfig } from '../../EntityActions/types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'
import { BaseEntity } from '../../manager'

interface EntityCompactViewProps extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
}

const EntityCompactViewComponent: React.FC<EntityCompactViewProps> = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyText = 'No data available',
  actions = [],
  entityActions,
  onAction,
  className
}) => {
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-destructive">
        <span>{error}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        {emptyText}
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      {data.map((item, index) => (
        <div 
          key={item.id || index} 
          className="flex items-center gap-2 p-3 text-sm border-b last:border-b-0 bg-card rounded-md hover:bg-accent/50 transition-colors duration-150 group cursor-pointer"
        >
          <div className="flex-1 font-medium truncate group-hover:text-primary transition-colors">
            {String(item.title || item.name || `Item ${index + 1}`)}
          </div>
          {columns.slice(1, 3).map((column) => {
            const value = item[column.accessorKey || column.id]
            if (!value) return null
            return (
              <div key={column.id} className="text-muted-foreground truncate max-w-32">
                {column.cell ? column.cell(value, item, index) : String(value)}
              </div>
            )
          })}
          {(actions.length > 0 || entityActions) && (
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {entityActions ? (
                <EntityActions
                  config={entityActions as any}
                  context={{ entity: item }}
                />
              ) : (
                <EntityListActions
                  actions={actions}
                  item={item}
                  onAction={onAction}
                  maxVisible={0}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export const EntityCompactView = memo(EntityCompactViewComponent)

export default EntityCompactView