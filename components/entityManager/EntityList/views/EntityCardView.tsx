'use client'

import React, { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'

interface EntityCardViewProps extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
}

const EntityCardViewComponent: React.FC<EntityCardViewProps> = ({
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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6", className)}>
      {data.map((item, index) => {
        const itemName = String(item.title || item.name || `Item ${index + 1}`)
        
        return (
          <Card 
            key={item.id || index} 
            className="h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group overflow-hidden"
          >
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {itemName}
                  </CardTitle>
                  {item.description && typeof item.description === 'string' ? (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {String(item.description)}
                    </p>
                  ) : null}
                </div>
                {item.id && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    #{String(item.id)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="space-y-3">
                {columns.slice(0, 6).map((column) => {
                  const value = item[column.accessorKey || column.id]
                  if (!value || column.id === 'title' || column.id === 'name' || column.id === 'description') return null

                  return (
                    <div key={column.id} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                      <span className="text-sm font-medium text-muted-foreground">{column.header}</span>
                      <span className="text-sm font-semibold text-right ml-2">
                        {typeof value === 'boolean' ? (
                          <Badge variant={value ? 'default' : 'secondary'} className="ml-auto">
                            {value ? 'Yes' : 'No'}
                          </Badge>
                        ) : column.cell ? (
                          column.cell(value, item, index)
                        ) : (
                          <span className="truncate max-w-[200px] inline-block">
                            {String(value)}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              {(actions.length > 0 || entityActions) && (
                <div className="mt-6 pt-4 border-t flex justify-center bg-accent/30 -mx-6 px-6 -mb-6 pb-4 group-hover:bg-accent/50 transition-colors">
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
                      maxVisible={2}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
const EntityCardView = memo(EntityCardViewComponent)

export default EntityCardView