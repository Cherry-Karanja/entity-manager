'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'

interface EntityListViewPropsExtended extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
}

const EntityListViewComponent: React.FC<EntityListViewPropsExtended> = ({
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
    <div className={cn("space-y-2", className)}>
      {data.map((item, index) => (
        <div 
          key={item.id || index} 
          className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
              {String(item.title || item.name || `Item ${index + 1}`)}
            </div>
            {(() => {
              const desc = item.description
              return desc && typeof desc === 'string' ? (
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {desc}
                </div>
              ) : null
            })()}
          </div>
          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
            {columns.slice(1, 3).map((column) => {
              const value = item[column.accessorKey || column.id]
              if (!value) return null
              return (
                <div key={column.id} className="text-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    {column.header}
                  </div>
                  <div className="font-medium">
                    {column.cell ? column.cell(value, item, index) : String(value)}
                  </div>
                </div>
              )
            })}
            {(actions.length > 0 || entityActions) && (
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </div>
      ))}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
const EntityListView = memo(EntityListViewComponent)

export default EntityListView