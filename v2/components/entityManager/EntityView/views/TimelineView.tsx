'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityViewConfig, ViewField, ViewFieldGroup } from '../types'
import { FieldRenderer } from '../components/FieldRenderer'
import { ViewHeader } from '../components/ViewHeader'

export interface TimelineViewProps {
  data: unknown
  config: EntityViewConfig
  fieldGroups: ViewFieldGroup[]
  className?: string
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  data,
  config,
  fieldGroups,
  className,
}) => {
  return (
    <Card className={cn('w-full', className, config.className)}>
      {config.showHeader && (
        <ViewHeader data={data} config={config} />
      )}
      
      <CardContent className="pt-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {fieldGroups.map((group, index) => {
              const visibleFields = group.fields.filter(
                field => !field.hidden && (!field.condition || field.condition(data))
              )

              if (visibleFields.length === 0) return null

              return (
                <div key={group.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background ring-4 ring-primary/20" />
                  
                  {/* Content */}
                  <div className="bg-accent/30 rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    {group.title && (
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-sm">{group.title}</h4>
                        {group.description && (
                          <Badge variant="outline" className="text-xs">
                            {group.description}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {visibleFields.map(field => (
                        <div key={field.key} className="flex items-center gap-3 text-sm">
                          {field.icon && <field.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                          <span className="text-muted-foreground min-w-[100px]">
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
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TimelineView
