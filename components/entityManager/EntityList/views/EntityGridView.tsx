'use client'

import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListItem } from '../types'
import { EntityActionsConfig } from '../../EntityActions/types'
import { EntityActions } from '../../EntityActions'
import { BaseEntity } from '../../manager'

interface EntityGridViewProps extends EntityListViewProps {
  entityActions?: EntityActionsConfig
}

const EntityGridViewComponent: React.FC<EntityGridViewProps> = ({
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

  // Get color for each item
  const getColorFromString = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colors = [
      'from-blue-500/10 to-blue-500/5',
      'from-purple-500/10 to-purple-500/5',
      'from-green-500/10 to-green-500/5',
      'from-orange-500/10 to-orange-500/5',
      'from-pink-500/10 to-pink-500/5',
      'from-indigo-500/10 to-indigo-500/5',
    ]
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4", className)}>
      {data.map((item, index) => {
        const itemName = String(item.title || item.name || item.full_name  || `Item ${index + 1}`)
        const gradient = getColorFromString(itemName)
        const rowProps = onRow?.(item, index)
        
        return (
          <Card 
            key={item.id || index} 
            className={cn(
              "h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group overflow-hidden",
              rowProps && "cursor-pointer"
            )}
            onClick={rowProps?.onClick}
          >
            {/* Gradient header */}
            <div className={cn("h-20 bg-gradient-to-br", gradient, "relative")}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                  <span className="text-2xl font-bold text-primary">
                    {itemName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4 text-center">
              <div className="space-y-3 mt-2">
                {/* Title */}
                <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {itemName}
                </div>
                
                {/* Additional fields */}
                <div className="space-y-2">
                  {columns.slice(1, 3).map((column) => {
                    const value = item[column.accessorKey || column.id]
                    if (!value || column.id === 'name' || column.id === 'title') return null
                    return (
                      <div key={column.id} className="text-xs">
                        <div className="text-muted-foreground uppercase tracking-wide mb-0.5 truncate">
                          {column.header}
                        </div>
                        <div className="font-medium truncate">
                          {column.cell ? column.cell(value, item, index) : String(value)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Description preview */}
                {item.description && typeof item.description === 'string' ? (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                    {String(item.description)}
                  </p>
                ) : null}
              </div>
              
              {entityActions && (
                <div className="mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                  <EntityActions
                    config={entityActions as any}
                    context={{ entity: item }}
                    maxVisibleActions={0}
                  />
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
export const EntityGridView = memo(EntityGridViewComponent)

export default EntityGridView