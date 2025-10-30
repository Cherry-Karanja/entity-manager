'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'

interface EntityDetailedListViewProps extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
}

export const EntityDetailedListView: React.FC<EntityDetailedListViewProps> = ({
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
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => (
        <Card 
          key={item.id || index}
          className="hover:shadow-lg transition-all duration-200 hover:border-primary/50 group"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {String(item.title || item.name || `Item ${index + 1}`)}
                </h3>
                {item.description && typeof item.description === 'string' ? (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {String(item.description)}
                  </p>
                ) : null}
              </div>

              {(actions.length > 0 || entityActions) && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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

            <Separator className="my-3" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {columns.map((column) => {
                const value = item[column.accessorKey || column.id]
                if (!value || column.id === 'title' || column.id === 'name' || column.id === 'description') return null
                
                return (
                  <div key={column.id} className="space-y-1">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {String(column.header)}
                    </div>
                    <div className="text-sm font-medium">
                      {column.cell ? column.cell(value, item, index) : String(value)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional metadata row */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>ID:</span>
                <Badge variant="secondary" className="text-xs">
                  {String(item.id)}
                </Badge>
              </div>
              {item.createdAt && typeof item.createdAt !== 'undefined' ? (
                <div>
                  Created: {String(item.createdAt)}
                </div>
              ) : null}
              {item.updatedAt && typeof item.updatedAt !== 'undefined' ? (
                <div>
                  Updated: {String(item.updatedAt)}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default EntityDetailedListView
