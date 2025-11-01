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
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6", className)}>
      {data.map((item, index) => {
        const avatarName = String(item[avatarField] || item.name || item.title || `Item ${index + 1}`)
        const bgColor = getColorFromString(avatarName)
        
        return (
          <Card 
            key={item.id || index}
            className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-primary/60 group overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Header with gradient background and larger avatar */}
              <div className={cn("relative h-40 flex items-center justify-center", bgColor, "bg-gradient-to-br")}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                  <AvatarFallback className="bg-background text-foreground text-3xl font-bold">
                    {getInitials(avatarName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="p-6">
                {/* Title with better spacing */}
                <h3 className="font-bold text-xl text-center mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {String(item.title || item.name || `Item ${index + 1}`)}
                </h3>

                {/* Subtitle/Email with icon */}
                {item.email && typeof item.email !== 'undefined' ? (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground truncate">
                      {String(item.email)}
                    </p>
                  </div>
                ) : null}

                {/* Description with better visibility */}
                {item.description && typeof item.description === 'string' ? (
                  <p className="text-sm text-muted-foreground text-center line-clamp-3 mb-4 leading-relaxed">
                    {String(item.description)}
                  </p>
                ) : null}

                {/* Enhanced metadata grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {columns.slice(0, 4).map((column) => {
                    const value = item[column.accessorKey || column.id]
                    if (!value || column.id === 'name' || column.id === 'title' || column.id === 'email' || column.id === 'description') {
                      return null
                    }
                    
                    return (
                      <div key={column.id} className="text-center p-2 rounded-lg bg-accent/30 border border-border/50">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 truncate">
                          {column.header}
                        </div>
                        <div className="font-semibold text-sm truncate">
                          {column.cell ? (
                            column.cell(value, item, index)
                          ) : (
                            String(value)
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Badges row - show more fields as badges */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {columns.slice(4, 7).map((column) => {
                    const value = item[column.accessorKey || column.id]
                    if (!value || column.id === 'name' || column.id === 'title' || column.id === 'email' || column.id === 'description') {
                      return null
                    }
                    
                    return (
                      <Badge key={column.id} variant="secondary" className="text-xs font-medium">
                        {String(value)}
                      </Badge>
                    )
                  })}
                </div>

                {/* Actions with better visibility */}
                {(actions.length > 0 || entityActions) && (
                  <div className="pt-4 border-t flex justify-center group-hover:bg-accent/20 -mx-6 px-6 pb-2 transition-colors">
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
                        maxVisible={2}
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
