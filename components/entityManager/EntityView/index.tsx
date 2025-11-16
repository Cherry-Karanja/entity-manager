// ===== ENTITY VIEW V3 - COMPREHENSIVE COMPONENT =====
// Full-featured component that supports all EntityViewConfig<TEntity> features

'use client'

import React, { useEffect, useMemo } from 'react'
import { CardFooter } from '@/components/ui/card'
import { Calendar, Clock, User } from 'lucide-react'
import { EntityViewConfig } from './types'
import { BaseEntity } from '../manager'
import { DetailView, CardView, SummaryView, TimelineView } from './views'
import { cn } from '@/lib/utils'

export interface EntityViewProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityViewConfig<TEntity>
  data: TEntity
  className?: string
}

export const EntityView = <TEntity extends BaseEntity = BaseEntity>({
  config,
  data,
  className,
}: EntityViewProps<TEntity>) => {
  // ===== HOOKS & EFFECTS =====

  // Call onViewLoad hook when component mounts
  useEffect(() => {
    if (config.hooks?.onViewLoad) {
      config.hooks.onViewLoad(data)
    }
  }, [config.hooks, data])

  // ===== COMPUTED VALUES =====

  // Process field groups with data transformation
  const processedFieldGroups = useMemo(() => {
    if (!config.fieldGroups) return []

    return config.fieldGroups.map(group => ({
      ...group,
      fields: group.fields.map(field => ({
        ...field,
        value: data && typeof data === 'object' ? (data as Record<string, unknown>)[field.key] : undefined,
      }))
    }))
  }, [config.fieldGroups, data])

  // Transform data if transformer is provided
  const transformedData = useMemo(() => {
    if (config.dataTransformer) {
      return config.dataTransformer(data)
    }
    return data
  }, [config, data])

  // ===== STYLING =====

  const spacingClasses = useMemo(() => {
    const spacings = {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
    }
    return spacings[config.fieldSpacing || 'md']
  }, [config.fieldSpacing])

  // ===== RENDER HELPERS =====

  // Render metadata section
  const renderMetadata = () => {
    if (!config.showMetadata) return null

    const data = transformedData as Record<string, unknown>

    return (
      <CardFooter className="pt-6 border-t">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {data.createdAt ? (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(String(data.createdAt)).toLocaleDateString()}</span>
              </div>
            ) : null}
            {data.updatedAt ? (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated: {new Date(String(data.updatedAt)).toLocaleDateString()}</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            {data.createdBy ? (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Created by: {String(data.createdBy)}</span>
              </div>
            ) : null}
            {data.updatedBy ? (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Updated by: {String(data.updatedBy)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </CardFooter>
    )
  }

  // ===== MAIN RENDER =====

  // Render based on mode
  const renderContent = () => {
    const mode = config.mode || 'detail'

    switch (mode) {
      case 'card':
        return (
          <CardView
            data={transformedData}
            config={config as unknown as EntityViewConfig}
            fields={processedFieldGroups.flatMap(g => g.fields)}
          />
        )

      case 'summary':
        return (
          <SummaryView
            data={transformedData}
            config={config as unknown as EntityViewConfig}
            fields={processedFieldGroups.flatMap(g => g.fields)}
          />
        )

      case 'timeline':
        return (
          <TimelineView
            data={transformedData}
            config={config as unknown as EntityViewConfig}
            fieldGroups={processedFieldGroups}
          />
        )

      case 'detail':
      default:
        return (
          <DetailView
            data={transformedData}
            config={config as unknown as EntityViewConfig}
            fieldGroups={processedFieldGroups}
          />
        )
    }
  }

  return (
    <div className={cn('w-full', spacingClasses, className)}>
      {renderContent()}
      {renderMetadata()}
    </div>
  )
}

EntityView.displayName = 'EntityView'