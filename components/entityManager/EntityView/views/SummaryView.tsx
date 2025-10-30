'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EntityViewConfig, ViewField } from '../types'
import { FieldRenderer } from '../components/FieldRenderer'
import { ViewHeader } from '../components/ViewHeader'

export interface SummaryViewProps {
  data: unknown
  config: EntityViewConfig
  fields: ViewField[]
  className?: string
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  data,
  config,
  fields,
  className,
}) => {
  const visibleFields = fields.filter(
    field => !field.hidden && (!field.condition || field.condition(data))
  )

  // Split fields into primary (first 3) and secondary (rest)
  const primaryFields = visibleFields.slice(0, 3)
  const secondaryFields = visibleFields.slice(3)

  return (
    <Card className={cn('w-full', className, config.className)}>
      {config.showHeader && (
        <ViewHeader data={data} config={config} />
      )}
      
      <CardContent className="pt-6">
        {/* Primary Fields - Large and prominent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {primaryFields.map(field => (
            <div key={field.key} className="text-center space-y-2">
              <div className="text-3xl font-bold">
                <FieldRenderer
                  field={field}
                  value={
                    data && typeof data === 'object' && data !== null
                      ? (data as Record<string, unknown>)[field.key]
                      : undefined
                  }
                  data={data}
                />
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {field.label}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Fields - Compact badges */}
        {secondaryFields.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {secondaryFields.map(field => {
              const value = data && typeof data === 'object' && data !== null
                ? (data as Record<string, unknown>)[field.key]
                : undefined

              return (
                <div key={field.key} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {field.label}:
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    <FieldRenderer
                      field={field}
                      value={value}
                      data={data}
                    />
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SummaryView
