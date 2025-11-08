'use client'

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  EntityViewConfig,
  EntityViewProps,
  ViewAction,
  DEFAULT_VIEW_CONFIG,
  DEFAULT_VIEW_ACTIONS,
} from './types'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

// Import modular components
import { ViewHeader } from './components/ViewHeader'
import { CardView } from './views/CardView'
import { DetailView } from './views/DetailView'
import { SummaryView } from './views/SummaryView'
import { TimelineView } from './views/TimelineView'

// ===== MAIN COMPONENT =====

const EntityViewComponent: React.FC<EntityViewProps> = ({
  config,
  data: initialData,
  onActionClick,
  onNavigate,
  className,
}) => {
  const [data, setData] = useState<unknown>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mobile detection
  const isMobile = useIsMobile()

  const mergedConfig = useMemo(() => ({
    ...DEFAULT_VIEW_CONFIG,
    ...config,
    actions: config.actions || DEFAULT_VIEW_ACTIONS,
  }), [config])

  // Load data if dataFetcher is provided
  useEffect(() => {
    if (mergedConfig.dataFetcher && !initialData) {
      setLoading(true)
      setError(null)
      mergedConfig.dataFetcher()
        .then(fetchedData => {
          const transformedData = mergedConfig.dataTransformer
            ? mergedConfig.dataTransformer(fetchedData)
            : fetchedData
          setData(transformedData)
          mergedConfig.hooks?.onViewLoad?.(transformedData)
        })
        .catch(err => {
          setError(err.message || 'Failed to load data')
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (initialData) {
      setData(initialData)
    }
  }, [mergedConfig, initialData])

  // Call onViewChange hook when data changes
  useEffect(() => {
    if (data && mergedConfig.hooks?.onViewChange) {
      mergedConfig.hooks.onViewChange(data)
    }
  }, [data, mergedConfig])

  const handleActionClick = useCallback((action: ViewAction) => {
    mergedConfig.hooks?.onActionClick?.(action, data)
    onActionClick?.(action, data)
  }, [mergedConfig, data, onActionClick])

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    mergedConfig.hooks?.onNavigate?.(direction)
    onNavigate?.(direction)
  }, [mergedConfig, onNavigate])

  const processedFields = useMemo(() => {
    const fields = mergedConfig.fields || []
    return fields.filter(field => !field.hidden && (!field.condition || field.condition(data)))
  }, [mergedConfig.fields, data])

  const processedFieldGroups = useMemo(() => {
    const groups = mergedConfig.fieldGroups || []
    return groups.map(group => ({
      ...group,
      fields: group.fields.filter(field =>
        !field.hidden && (!field.condition || field.condition(data))
      ),
    })).filter(group => group.fields.length > 0)
  }, [mergedConfig.fieldGroups, data])

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert className={className}>
        <AlertDescription>No data to display</AlertDescription>
      </Alert>
    )
  }

  // Render the appropriate view based on mode
  const renderView = () => {
    const viewProps = {
      data,
      config: mergedConfig,
      onActionClick: handleActionClick,
    }

    switch (mergedConfig.mode) {
      case 'card':
        return (
          <CardView
            {...viewProps}
            fields={processedFields}
          />
        )

      case 'summary':
        // For summary view, extract fields from fieldGroups or use fields directly
        const summaryFields = processedFieldGroups.length > 0
          ? processedFieldGroups.flatMap(group => group.fields)
          : processedFields
        return (
          <SummaryView
            {...viewProps}
            fields={summaryFields}
          />
        )

      case 'timeline':
        return (
          <TimelineView
            {...viewProps}
            fieldGroups={processedFieldGroups}
          />
        )

      case 'detail':
      default:
        return (
          <DetailView
            {...viewProps}
            fieldGroups={processedFieldGroups}
          />
        )
    }
  }

  return (
    <div 
      className={cn('w-full', className)}
      role="article"
      aria-label="Entity details"
    >
      {/* Navigation */}
      {mergedConfig.showNavigation && mergedConfig.navigation && (
        <nav 
          className={`flex items-center mb-4 ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}
          aria-label="Entity navigation"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={!mergedConfig.navigation.canGoPrev}
            onClick={() => handleNavigate('prev')}
            className={isMobile ? 'w-full' : ''}
            aria-label="Go to previous entity"
          >
            <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!mergedConfig.navigation.canGoNext}
            onClick={() => handleNavigate('next')}
            className={isMobile ? 'w-full' : ''}
            aria-label="Go to next entity"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        </nav>
      )}

      {/* Custom Header */}
      {mergedConfig.showHeader && mergedConfig.customComponents?.header && (
        <mergedConfig.customComponents.header
          data={data}
          config={mergedConfig}
        />
      )}

      {/* Main Content */}
      <ScrollArea className="w-full">
        {renderView()}
      </ScrollArea>

      {/* Metadata */}
      {mergedConfig.showMetadata && mergedConfig.customComponents?.metadata && (
        <div className="mt-4">
          <mergedConfig.customComponents.metadata
            data={data}
            config={mergedConfig}
          />
        </div>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const EntityView = memo(EntityViewComponent)

export default EntityView