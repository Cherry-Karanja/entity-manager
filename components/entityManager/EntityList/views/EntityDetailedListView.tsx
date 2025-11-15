'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListItem } from '../types'
import { EntityActionsConfig, EntityAction } from '../../EntityActions/types'
import { EntityActions } from '../../EntityActions'
import { BaseEntity } from '../../manager'

interface EntityDetailedListViewProps extends EntityListViewProps {
  entityActions?: EntityActionsConfig
  onAction?: (action: EntityAction, item: EntityListItem) => void
}

export const EntityDetailedListView: React.FC<EntityDetailedListViewProps> = ({
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
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => {
        const rowProps = onRow?.(item, index)
        
        return (
          <Card 
            key={item.id || index}
            className={cn(
              "hover:shadow-xl transition-all duration-300 hover:border-primary/50 group overflow-hidden",
              rowProps && "cursor-pointer"
            )}
            onClick={rowProps?.onClick}
          >
          <CardContent className="p-0">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg border-2 border-background">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {String(item.title || item.name || item.full_name || `Item ${index + 1}`).substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                      {String(item.title || item.name || item.full_name || `Item ${index + 1}`)}
                    </h3>
                    {item.description && typeof item.description === 'string' ? (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {String(item.description)}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Actions Section */}
                {entityActions && (
                  <div className="flex-shrink-0">
                    <EntityActions
                      config={entityActions as any}
                      context={{ entity: item }}
                      maxVisibleActions={2}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {columns.map((column) => {
                  const value = item[column.accessorKey || column.id]
                  if (!value || column.id === 'title' || column.id === 'name' || column.id === 'description') return null
                  
                  return (
                    <div key={column.id} className="space-y-2 p-3 rounded-lg bg-accent/30 border border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-colors">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold truncate">
                        {String(column.header)}
                      </div>
                      <div className="text-sm font-bold truncate">
                        {column.cell ? column.cell(value, item, index) : String(value)}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {(!!item.createdAt || !!item.updatedAt || !!item.status) && (
                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    {item.createdAt && typeof item.createdAt !== 'undefined' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Created:</span>
                        <Badge variant="outline" className="text-xs font-normal">
                          {String(item.createdAt)}
                        </Badge>
                      </div>
                    ) : null}
                    {item.updatedAt && typeof item.updatedAt !== 'undefined' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Updated:</span>
                        <Badge variant="outline" className="text-xs font-normal">
                          {String(item.updatedAt)}
                        </Badge>
                      </div>
                    ) : null}
                  </div>
                  {item.status && typeof item.status !== 'undefined' ? (
                    <Badge variant="default" className="text-xs">
                      {String(item.status)}
                    </Badge>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )
    })}
  </div>
  )
}

export default EntityDetailedListView

