'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListItem } from '../types'
import { EntityActionsConfig } from '../../EntityActions/types'
import { EntityActions } from '../../EntityActions'
import { BaseEntity } from '../../manager'

interface EntityTimelineViewProps extends EntityListViewProps {
  entityActions?: EntityActionsConfig
  dateField?: string // Field to use for timeline dates (defaults to 'createdAt')
}

export const EntityTimelineView: React.FC<EntityTimelineViewProps> = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyText = 'No data available',
  entityActions,
  onAction,
  onRow,
  dateField = 'createdAt',
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

  // Sort data by date field
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(String(a[dateField] || 0)).getTime()
    const dateB = new Date(String(b[dateField] || 0)).getTime()
    return dateB - dateA // Most recent first
  })

  // Format date
  const formatDate = (dateStr: unknown): string => {
    if (!dateStr) return 'No date'
    try {
      const date = new Date(String(dateStr))
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return String(dateStr)
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className=" space-y-6 absolute left-8 top-0 bottom-0 w-0.5 bg-border">
        {sortedData.map((item, index) => {
          const rowProps = onRow?.(item, index)
          
          return (
            <div key={item.id || index} className="relative pl-20 group">
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all z-10" />
              
              {/* Date label */}
              <div className="absolute left-0 top-5 w-12 text-xs text-muted-foreground text-right">
                <Clock className="h-3 w-3 inline mr-1" />
              </div>

              <Card 
                className={cn(
                  "hover:shadow-lg transition-all duration-200 hover:border-primary/50",
                  rowProps && "cursor-pointer"
                )}
                onClick={rowProps?.onClick}
              >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {String(item.title || item.name || item.full_name || `Item ${index + 1}`)}
                      </h3>
                      {(() => {
                        const dateValue = item[dateField]
                        return dateValue && typeof dateValue !== 'undefined' ? (
                          <Badge variant="outline" className="text-xs">
                            {formatDate(dateValue)}
                          </Badge>
                        ) : null
                      })()}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {columns.slice(1, 5).map((column) => {
                        const value = item[column.accessorKey || column.id]
                        if (!value || column.id === dateField) return null
                        
                        return (
                          <div key={column.id} className="text-sm">
                            <span className="text-muted-foreground">{column.header}: </span>
                            <span className="font-medium">
                              {column.cell ? column.cell(value, item, index) : String(value)}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {(() => {
                      const desc = item.description
                      return desc && typeof desc === 'string' ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {String(desc)}
                        </p>
                      ) : null
                    })()}
                  </div>

                  {entityActions && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EntityActions
                        config={entityActions as any}
                        context={{ entity: item }}
                        maxVisibleActions={2}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default EntityTimelineView

