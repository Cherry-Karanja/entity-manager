'use client'

import React from 'react'
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

const EntityCardView: React.FC<EntityCardViewProps> = ({
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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", className)}>
      {data.map((item, index) => (
        <Card key={item.id || index} className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {String(item.title || item.name || `Item ${index + 1}`)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {columns.slice(0, 4).map((column) => {
                const value = item[column.accessorKey || column.id]
                if (!value) return null

                return (
                  <div key={column.id} className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">{column.header}:</span>
                    <span className="text-sm font-medium">
                      {typeof value === 'boolean' ? (
                        <Badge variant={value ? 'default' : 'secondary'}>
                          {value ? 'Yes' : 'No'}
                        </Badge>
                      ) : (
                        String(value)
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
            {(actions.length > 0 || entityActions) && (
              <div className="mt-6 pt-4 border-t">
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
      ))}
    </div>
  )
}

export default EntityCardView