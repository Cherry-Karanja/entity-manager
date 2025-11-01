'use client'

import React, { useState, memo, useMemo, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EntityViewConfig, ViewFieldGroup } from '../types'
import { FieldRenderer } from '../components/FieldRenderer'
import { ViewHeader } from '../components/ViewHeader'

export interface DetailViewProps {
  data: unknown
  config: EntityViewConfig
  fieldGroups: ViewFieldGroup[]
  className?: string
}

const DetailViewComponent: React.FC<DetailViewProps> = ({
  data,
  config,
  fieldGroups,
  className,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() =>
    new Set(fieldGroups.filter(g => g.collapsed).map(g => g.id))
  )

  const toggleGroup = useCallback((groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  const spacing = useMemo(() => ({
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  }[config.fieldSpacing || 'md']), [config.fieldSpacing])

  return (
    <Card className={cn('w-full', className, config.className)}>
      {config.showHeader && (
        <ViewHeader data={data} config={config} />
      )}
      
      <CardContent className="pt-6 space-y-6">
        {fieldGroups.map((group, groupIndex) => {
          const visibleFields = group.fields.filter(
            field => !field.hidden && (!field.condition || field.condition(data))
          )

          if (visibleFields.length === 0) return null

          const isCollapsed = collapsedGroups.has(group.id)
          const canCollapse = group.collapsible !== false

          return (
            <div key={group.id} className={cn(group.className)}>
              {/* Group Header */}
              {group.title && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                  {canCollapse && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Group Content */}
              {!isCollapsed && (
                <div
                  className={cn(
                    spacing,
                    group.layout === 'grid' && 'grid gap-4',
                    group.columns && `grid-cols-${group.columns}`,
                    !group.columns && group.layout === 'grid' && 'grid-cols-1 md:grid-cols-2'
                  )}
                >
                  {visibleFields.map(field => (
                    <div
                      key={field.key}
                      className={cn(
                        'flex items-start gap-4 hover:bg-accent/50 p-2 rounded-md transition-colors',
                        group.layout === 'horizontal' && 'justify-between',
                        group.layout === 'vertical' && 'flex-col gap-1'
                      )}
                    >
                      <span className="font-medium text-sm text-muted-foreground flex-shrink-0">
                        {field.label}:
                      </span>
                      <FieldRenderer
                        field={field}
                        value={
                          data && typeof data === 'object' && data !== null
                            ? (data as Record<string, unknown>)[field.key]
                            : undefined
                        }
                        data={data}
                        className={cn(
                          'text-sm',
                          group.layout !== 'vertical' && 'flex-1'
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Separator between groups */}
              {groupIndex < fieldGroups.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Memoize to prevent unnecessary re-renders
export const DetailView = memo(DetailViewComponent)

export default DetailView
