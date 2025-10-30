'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListAction, EntityListItem } from '../types'
import { EntityActions } from '../../EntityActions'
import { EntityListActions } from '../components/EntityListActions'

interface EntityGalleryViewProps extends EntityListViewProps {
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
  avatarField?: string // Field to use for avatar initials (defaults to 'name')
}

export const EntityGalleryView: React.FC<EntityGalleryViewProps> = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyText = 'No data available',
  actions = [],
  entityActions,
  onAction,
  avatarField = 'name',
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

  // Get initials from name
  const getInitials = (name: unknown): string => {
    if (!name) return '?'
    const nameStr = String(name)
    const parts = nameStr.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return nameStr.substring(0, 2).toUpperCase()
  }

  // Generate color from string
  const getColorFromString = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ]
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {data.map((item, index) => {
        const avatarName = String(item[avatarField] || item.name || item.title || `Item ${index + 1}`)
        const bgColor = getColorFromString(avatarName)
        
        return (
          <Card 
            key={item.id || index}
            className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 group overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Header with gradient background */}
              <div className={cn("relative h-32 flex items-center justify-center", bgColor)}>
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-background text-foreground text-2xl font-bold">
                    {getInitials(avatarName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="p-5">
                {/* Title */}
                <h3 className="font-semibold text-lg text-center mb-1 group-hover:text-primary transition-colors truncate">
                  {String(item.title || item.name || `Item ${index + 1}`)}
                </h3>

                {/* Subtitle/Email */}
                {item.email && typeof item.email !== 'undefined' ? (
                  <p className="text-sm text-muted-foreground text-center mb-3 truncate">
                    {String(item.email)}
                  </p>
                ) : null}

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {columns.slice(0, 3).map((column) => {
                    const value = item[column.accessorKey || column.id]
                    if (!value || column.id === 'name' || column.id === 'title' || column.id === 'email' || column.id === 'description') {
                      return null
                    }
                    
                    return (
                      <div key={column.id}>
                        {column.cell ? (
                          column.cell(value, item, index)
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            {String(value)}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Description */}
                {item.description && typeof item.description === 'string' ? (
                  <p className="text-sm text-muted-foreground text-center line-clamp-2 mb-4">
                    {String(item.description)}
                  </p>
                ) : null}

                {/* Actions */}
                {(actions.length > 0 || entityActions) && (
                  <div className="pt-3 border-t flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                        maxVisible={0}
                      />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default EntityGalleryView
