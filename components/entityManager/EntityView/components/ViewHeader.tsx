'use client'

import React from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BaseEntity } from '../../manager/types'
import { cn } from '@/lib/utils'
import { EntityActionsConfig } from '../../EntityActions/types'
import { EntityViewConfig } from '../types'
import { ViewActions } from './ViewActions'

export interface ViewHeaderProps {
  data: unknown
  config: EntityViewConfig
  title?: string
  subtitle?: string
  className?: string
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  data,
  config,
  title,
  subtitle,
  className,
}) => {
  const showNavigation = config.showNavigation && config.navigation
  const showActions = config.showActions && (config.actions || config.entityActions)

  return (
    <CardHeader className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <CardTitle className="flex items-center gap-2">
            {title || 'Entity Details'}
            {subtitle && (
              <Badge variant="outline" className="text-xs font-normal">
                {subtitle}
              </Badge>
            )}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Navigation */}
          {showNavigation && (
            <div className="flex items-center gap-1 border rounded-md">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!config.navigation?.canGoPrev}
                    onClick={() => {
                      config.navigation?.prev?.()
                      config.hooks?.onNavigate?.('prev')
                    }}
                    className="rounded-none first:rounded-l-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous</p>
                </TooltipContent>
              </Tooltip>
              
              <Separator orientation="vertical" className="h-8" />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!config.navigation?.canGoNext}
                    onClick={() => {
                      config.navigation?.next?.()
                      config.hooks?.onNavigate?.('next')
                    }}
                    className="rounded-none last:rounded-r-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <ViewActions
              data={data}
              actions={config.actions}
              entityActions={config.entityActions as EntityActionsConfig<unknown>}
              onActionClick={(action) => config.hooks?.onActionClick?.(action, data as BaseEntity)}
              compact
            />
          )}
        </div>
      </div>
    </CardHeader>
  )
}

export default ViewHeader
