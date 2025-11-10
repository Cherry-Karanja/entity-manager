'use client'

import React, { useState, useMemo, useCallback, memo } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { useIsMobile } from '@/hooks/use-mobile'
import { EntityActionsProps, EntityAction, EntityBulkAction, EntityActionResult, EntityBulkActionResult } from './types'
import { ActionForm } from './components/ActionForm'
import { ActionModal } from './components/ActionModal'
import { ActionDrawer } from './components/ActionDrawer'

// ===== MAIN COMPONENT =====

const EntityActionsComponent: React.FC<EntityActionsProps> = ({
  config,
  item,
  selectedItems = [],
  className,
  disabled = false
}) => {
  const { hasPermission } = usePermissions()
  const isMobile = useIsMobile()

  // State for modals and dialogs
  const [activeAction, setActiveAction] = useState<EntityAction | EntityBulkAction | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  // Filter and prepare actions
  const { visibleActions, dropdownActions, bulkActions } = useMemo(() => {
    const checkPermission = (permission?: string) => {
      if (!permission) return true
      return config.permissions?.check?.(permission) ?? hasPermission(permission)
    }

    const checkCondition = (action: EntityAction | EntityBulkAction, targetItem?: unknown) => {
      // EntityBulkAction doesn't have condition, form, modal, drawer properties
      if ('condition' in action && action.condition && !action.condition(targetItem || item, config.context)) return false
      if ('visible' in action && action.visible && !action.visible(targetItem || item, config.context)) return false
      return true
    }

    const actions = config.actions.filter(action =>
      !action.hidden &&
      checkPermission(action.permission) &&
      checkCondition(action, item)
    )

    const bulkActionsList = (config.bulkActions || []).filter(action =>
      !action.hidden &&
      checkPermission(action.permission) &&
      checkCondition(action, selectedItems)
    )

    const maxVisible = 0 // Always hide primary actions, show only in dropdown for better UX
    const visibleActions = actions.slice(0, maxVisible)
    const dropdownActions = actions.slice(maxVisible)

    return { visibleActions, dropdownActions, bulkActions: bulkActionsList }
  }, [config, item, selectedItems, hasPermission])

  // Handle action execution
  const executeAction = useCallback(async (action: EntityAction | EntityBulkAction, targetItem?: unknown, targetItems?: unknown[]) => {
    setIsExecuting(true)

    try {
      // Call start hook
      if ('bulk' in action && action.bulk) {
        config.hooks?.onBulkActionStart?.(action as EntityBulkAction, targetItems || [])
      } else {
        config.hooks?.onActionStart?.(action as EntityAction, targetItem || item)
      }

      let result: unknown

      switch (action.actionType) {
        case 'immediate':
          if ('bulk' in action && action.bulk) {
            result = await (action as EntityBulkAction).onExecute?.(targetItems || [], config.context)
          } else {
            result = await (action as EntityAction).onExecute?.(targetItem || item, config.context)
          }
          break

        case 'navigation':
          if (action.href) {
            const url = typeof action.href === 'function' ? action.href(targetItem || item) : action.href
            // Use window.location for navigation (simplified approach)
            if (action.target === '_blank') {
              window.open(url, '_blank')
            } else {
              window.location.href = url
            }
          }
          break

        case 'async':
          // Handle async actions with progress
          if (action.async?.showProgress) {
            // Show progress indicator
          }
          if ('bulk' in action && action.bulk) {
            result = await (action as EntityBulkAction).onExecute?.(targetItems || [], config.context)
          } else {
            result = await (action as EntityAction).onExecute?.(targetItem || item, config.context)
          }
          break

        default:
          if ('bulk' in action && action.bulk) {
            result = await (action as EntityBulkAction).onExecute?.(targetItems || [], config.context)
          } else {
            result = await (action as EntityAction).onExecute?.(targetItem || item, config.context)
          }
      }

      // Call complete hook
      if ('bulk' in action && action.bulk) {
        config.hooks?.onBulkActionComplete?.(action as EntityBulkAction, targetItems || [], result)
      } else {
        config.hooks?.onActionComplete?.(action as EntityAction, targetItem || item, result)
      }

      return { success: true, data: result }

    } catch (error) {
      // Call error hook
      if ('bulk' in action && action.bulk) {
        config.hooks?.onBulkActionError?.(action as EntityBulkAction, targetItems || [], error)
      } else {
        config.hooks?.onActionError?.(action as EntityAction, targetItem || item, error)
      }

      return { success: false, error }
    } finally {
      setIsExecuting(false)
      setActiveAction(null)
      setShowConfirm(false)
      setShowForm(false)
      setShowModal(false)
      setShowDrawer(false)
    }
  }, [config, item])

  // Handle action click
  const handleActionClick = useCallback((action: EntityAction | EntityBulkAction) => {
    setActiveAction(action)

    switch (action.actionType) {
      case 'confirm':
        setShowConfirm(true)
        break
      case 'form':
        setShowForm(true)
        break
      case 'modal':
        setShowModal(true)
        break
      case 'drawer':
        setShowDrawer(true)
        break
      default:
        executeAction(action)
    }
  }, [executeAction])

  // Handle confirm
  const handleConfirm = useCallback(async () => {
    if (!activeAction) return
    await executeAction(activeAction, item, selectedItems)
  }, [activeAction, executeAction, item, selectedItems])

  // Handle form submit
  const handleFormSubmit = useCallback(async (values: Record<string, unknown>) => {
    if (!activeAction || !('form' in activeAction)) return
    await executeAction(activeAction, item, selectedItems)
  }, [activeAction, executeAction, item, selectedItems])

  // Render action button
  const renderActionButton = (action: EntityAction | EntityBulkAction, isDropdown = false) => {
    const Icon = action.icon
    const variant = action.danger ? 'destructive' : (config.actionButtonVariant || 'ghost')
    const size = config.actionButtonSize || 'sm'
    const isDisabled = disabled || action.disabled || isExecuting

    const button = (
      <Button
        key={action.id}
        variant={variant as any}
        size={size as any}
        onClick={() => handleActionClick(action)}
        disabled={isDisabled || isExecuting}
        className={cn(action.className)}
        style={action.style}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {config.showLabels !== false && action.label}
        {action.shortcut && config.showShortcuts && (
          <Badge variant="outline" className="ml-2 text-xs">
            {action.shortcut}
          </Badge>
        )}
      </Button>
    )

    if (isDropdown) {
      return (
        <DropdownMenuItem
          key={action.id}
          onClick={() => handleActionClick(action)}
          disabled={isDisabled}
          className={cn(action.danger && 'text-destructive')}
        >
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {action.label}
        </DropdownMenuItem>
      )
    }

    if (config.showLabels === false && action.description) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{action.description}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  // Group actions if needed
  const groupedActions = useMemo(() => {
    if (!config.groupActions) return { default: visibleActions }

    const groups: Record<string, (EntityAction | EntityBulkAction)[]> = {}
    visibleActions.forEach(action => {
      const group = action.group || 'default'
      if (!groups[group]) groups[group] = []
      groups[group].push(action)
    })

    return groups
  }, [visibleActions, config.groupActions])

  return (
    <TooltipProvider>
      <div 
        className={cn("flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1", className)}
        role="toolbar"
        aria-label="Entity actions"
        aria-orientation="horizontal"
      >
        {/* Render grouped actions */}
        {Object.entries(groupedActions).map(([groupName, actions]) => (
          <React.Fragment key={groupName}>
            {actions.map((action, index) => (
              <React.Fragment key={action.id}>
                {action.separator && index > 0 && <div className="w-px h-6 bg-border mx-1" role="separator" aria-orientation="vertical" />}
                {renderActionButton(action)}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}

        {/* Dropdown for additional actions */}
        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="sr-only">More actions</span>
                ⋯
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto bg-background border shadow-md">
              {dropdownActions.map((action, index) => (
                <React.Fragment key={action.id}>
                  {action.separator && index > 0 && <DropdownMenuSeparator />}
                  {renderActionButton(action, true)}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Bulk actions */}
        {bulkActions.length > 0 && selectedItems.length > 0 && (
          <div className="ml-4 pl-4 border-l flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} selected
            </span>
            {bulkActions.map(action => renderActionButton(action))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {activeAction?.confirm?.title
                  ? typeof activeAction.confirm.title === 'function'
                    ? 'bulk' in activeAction && activeAction.bulk
                      ? (activeAction.confirm.title as (count: number) => string)(selectedItems.length)
                      : (activeAction.confirm.title as (item: unknown) => string)(item)
                    : activeAction.confirm.title
                  : 'Confirm Action'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {activeAction?.confirm?.content
                  ? typeof activeAction.confirm.content === 'function'
                    ? 'bulk' in activeAction && activeAction.bulk
                      ? (activeAction.confirm.content as (selectedItems: unknown[]) => string | React.ReactNode)(selectedItems)
                      : (activeAction.confirm.content as (item: unknown) => string | React.ReactNode)(item)
                    : activeAction.confirm.content
                  : 'Are you sure you want to proceed?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {activeAction?.confirm?.okText || 'OK'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Form Dialog */}
        {showForm && activeAction && 'form' in activeAction && activeAction.form && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent style={{ width: activeAction.form.width || 520 }}>
              <DialogHeader>
                <DialogTitle>
                  {typeof activeAction.form.title === 'function'
                    ? activeAction.form.title(item)
                    : activeAction.form.title}
                </DialogTitle>
              </DialogHeader>
              <ActionForm
                fields={activeAction.form.fields}
                onSubmit={async (data: Record<string, any>) => {
                  try {
                    if (activeAction.form?.onSubmit) {
                      await activeAction.form.onSubmit(data, item, config.context)
                    }
                    setShowForm(false)
                    setActiveAction(null)
                  } catch (error) {
                    console.error('Form submission failed:', error)
                  }
                }}
                onCancel={() => {
                  setShowForm(false)
                  setActiveAction(null)
                }}
                isLoading={isExecuting}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal */}
        {showModal && activeAction && 'modal' in activeAction && activeAction.modal && (
          <ActionModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
              setActiveAction(null)
            }}
            title={typeof activeAction.modal.title === 'function'
              ? activeAction.modal.title(item)
              : activeAction.modal.title}
            content={activeAction.modal.content}
            footer={activeAction.modal.footer}
            width={activeAction.modal.width}
            item={item}
          />
        )}

        {/* Drawer */}
        {showDrawer && activeAction && 'drawer' in activeAction && activeAction.drawer && (
          <ActionDrawer
            isOpen={showDrawer}
            onClose={() => {
              setShowDrawer(false)
              setActiveAction(null)
            }}
            title={typeof activeAction.drawer.title === 'function'
              ? activeAction.drawer.title(item)
              : activeAction.drawer.title}
            content={activeAction.drawer.content}
            width={activeAction.drawer.width}
            placement={activeAction.drawer.placement}
            item={item}
          />
        )}
      </div>
    </TooltipProvider>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const EntityActions = memo(EntityActionsComponent)

export default EntityActions