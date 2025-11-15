'use client'

import React from 'react'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { EntityListAction, EntityListItem } from '../types'
import { EntityAction } from '../../EntityActions/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { PermissionedAction } from '../../utils/PermissionedActions'

interface EntityListActionsProps {
  actions: (EntityAction | EntityListAction)[]
  item: EntityListItem
  onAction?: (action: EntityAction | EntityListAction, item: EntityListItem) => void
  maxVisible?: number
  className?: string
  entityType?: string
}

export const EntityListActions: React.FC<EntityListActionsProps> = ({
  actions,
  item,
  onAction,
  maxVisible = 2,
  className,
  entityType = 'entity'
}) => {
  const isMobile = useIsMobile()

  // Always show actions in dropdown for better UX
  const effectiveMaxVisible = 0 // Always hide primary actions, show only in dropdown

  // Filter visible actions based on conditions
  const visibleActions = actions.filter(action => {
    if (action.hidden) return false
    if (action.condition && !action.condition(item)) return false
    if ('visible' in action && action.visible && !action.visible(item)) return false
    return true
  })

  // Separate primary actions from dropdown actions
  const primaryActions = visibleActions.slice(0, effectiveMaxVisible)
  const dropdownActions = visibleActions.slice(effectiveMaxVisible)

  // Handle action click
  const handleActionClick = (action: EntityAction | EntityListAction) => async () => {
    if (action.disabled) return

    try {
      if (action.confirm) {
        // Handle confirmation dialog
        const confirmed = window.confirm(
          typeof action.confirm.content === 'string'
            ? action.confirm.content
            : 'Are you sure you want to perform this action?'
        )
        if (!confirmed) return
      }

      if (action.href) {
        // Handle navigation
        const url = typeof action.href === 'function' ? action.href(item) : action.href
        if (action.target === '_blank') {
          window.open(url, '_blank')
        } else {
          window.location.href = url
        }
      } else if ('onExecute' in action && action.onExecute) {
        // Handle EntityAction execution
        await action.onExecute(item)
      } else if ('onClick' in action && action.onClick) {
        // Handle EntityListAction execution
        await action.onClick(item)
      }

      // Call the onAction callback
      onAction?.(action, item)
    } catch (error) {
      console.error('Action execution failed:', error)
    }
  }

  // Get action icon
  const getActionIcon = (action: EntityAction | EntityListAction) => {
    if (action.icon) return action.icon

    // Default icons based on action id
    switch (action.id) {
      case 'view':
      case 'show':
        return Eye
      case 'edit':
      case 'update':
        return Edit
      case 'delete':
      case 'remove':
        return Trash2
      default:
        return null
    }
  }

  // Get button variant
  const getButtonVariant = (action: EntityAction | EntityListAction) => {
    if (action.danger) return 'destructive'
    if (action.type === 'link') return 'link'
    if (action.type === 'text') return 'ghost'
    if ('variant' in action) return action.variant || 'default'
    return 'default'
  }

  if (visibleActions.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1", className)}>
        {/* Primary actions */}
        {primaryActions.map((action) => {
          const Icon = getActionIcon(action)
          const variant = getButtonVariant(action)

          return (
            <PermissionedAction
              key={action.id}
              action={action.id}
              entityType={entityType}
              entityId={item.id?.toString()}
              showTooltip={true}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={variant as any}
                    size="sm"
                    onClick={handleActionClick(action)}
                    disabled={action.disabled || action.loading}
                    className={cn(
                      action.type === 'text' && 'h-auto p-1',
                      action.className
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {action.loading && <div className="animate-spin rounded-full h-3 w-3 border-b border-current ml-1" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </PermissionedAction>
          )
        })}

        {/* Dropdown for additional actions */}
        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto bg-background border shadow-md">
              {dropdownActions.map((action, index) => {
                const Icon = getActionIcon(action)

                return (
                  <React.Fragment key={action.id}>
                    {action.separator && index > 0 && <DropdownMenuSeparator />}
                    <PermissionedAction
                      action={action.id}
                      entityType={entityType}
                      entityId={item.id?.toString()}
                      showTooltip={false}
                    >
                      <DropdownMenuItem
                        onClick={handleActionClick(action)}
                        disabled={action.disabled || action.loading}
                        className={cn(
                          action.danger && 'text-destructive focus:text-destructive',
                          action.className
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {action.label}
                        {action.loading && <div className="animate-spin rounded-full h-3 w-3 border-b border-current ml-auto" />}
                      </DropdownMenuItem>
                    </PermissionedAction>
                  </React.Fragment>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  )
}