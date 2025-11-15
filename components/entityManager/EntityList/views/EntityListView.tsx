'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListItem } from '../types'
import { EntityActionsConfig } from '../../EntityActions/types'
import { EntityActions } from '../../EntityActions'
import { BaseEntity } from '../../manager'

interface EntityListViewPropsExtended extends EntityListViewProps {
  entityActions?: EntityActionsConfig
}

const EntityListViewComponent: React.FC<EntityListViewPropsExtended> = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyText = 'No data available',
  entityActions,
  onAction,
  onRow,
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
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => {
        const rowProps = onRow?.(item, index)
        
        return (
          <div 
            key={item.id || index} 
            className={cn(
              "flex items-start gap-4 p-5 border rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:bg-accent/5 group",
              rowProps && "cursor-pointer"
            )}
            onClick={rowProps?.onClick}
          >
          {/* Avatar/Icon Section */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
              <span className="text-lg font-bold text-primary">
                {String(item.title || item.name || item.full_name || `Item ${index + 1}`).substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate">
                  {String(item.title || item.name || item.full_name || `Item ${index + 1}`)}
                </h3>
                {(() => {
                  const desc = item.description
                  return desc && typeof desc === 'string' ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  ) : null
                })()}
              </div>

              {/* ID Badge */}
              {item.id && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                    #{String(item.id)}
                  </span>
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="flex flex-wrap gap-4 mt-3">
              {columns.slice(1, 4).map((column) => {
                const value = item[column.accessorKey || column.id]
                if (!value || column.id === 'description' || column.id === 'title' || column.id === 'name') return null
                return (
                  <div key={column.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {column.header}:
                    </span>
                    <span className="text-sm font-semibold">
                      {column.cell ? column.cell(value, item, index) : String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions Section */}
          {entityActions && (
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <EntityActions
                config={entityActions as any}
                context={{ entity: item }}
                maxVisibleActions={2}
              />
            </div>
          )}
        </div>
      )
    })}
  </div>
  )
}

// Memoize to prevent unnecessary re-renders
const EntityListView = memo(EntityListViewComponent)

export default EntityListView
