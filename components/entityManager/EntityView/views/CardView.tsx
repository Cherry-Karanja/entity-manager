'use client'

import React, { memo, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { EntityViewConfig, ViewField } from '../types'
import { FieldRenderer } from '../components/FieldRenderer'
import { ViewHeader } from '../components/ViewHeader'

export interface CardViewProps {
  data: unknown
  config: EntityViewConfig
  fields: ViewField[]
  className?: string
}

const CardViewComponent: React.FC<CardViewProps> = ({
  data,
  config,
  fields,
  className,
}) => {
  const visibleFields = useMemo(() =>
    fields.filter(field => !field.hidden && (!field.condition || field.condition(data))),
    [fields, data]
  )

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
      
      <CardContent className={cn('pt-6', spacing)}>
        {visibleFields.map(field => (
          <div 
            key={field.key} 
            className="flex justify-between items-start gap-4 hover:bg-accent/50 p-2 rounded-md transition-colors"
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
              className="text-sm flex-1"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Memoize to prevent unnecessary re-renders
export const CardView = memo(CardViewComponent)

export default CardView
