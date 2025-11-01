'use client'

import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'

interface EntityGridViewProps extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
}

const EntityGridViewComponent: React.FC<EntityGridViewProps> = ({
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
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
      {data.map((item, index) => (
        <Card 
          key={item.id || index} 
          className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 hover:border-primary/50 group cursor-pointer"
        >
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {String(item.title || item.name || `Item ${index + 1}`)}
              </div>
              {columns.slice(1, 2).map((column) => {
                const value = item[column.accessorKey || column.id]
                if (!value) return null
                return (
                  <div key={column.id} className="text-xs text-muted-foreground truncate">
                    {column.cell ? column.cell(value, item, index) : String(value)}
                  </div>
                )
              })}
            </div>
            {(actions.length > 0 || entityActions) && (
              <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                {entityActions ? (
                  <EntityActions
                    config={entityActions}
                    item={item}
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export const EntityGridView = memo(EntityGridViewComponent)

export default EntityGridView