// ===== ENTITY ACTIONS V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityActionsConfig<TEntity>

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { MoreHorizontal } from 'lucide-react'
import { EntityActionsConfig, EntityAction } from './types'
import { BaseEntity } from '../manager'
import { useIsMobile } from '../../../hooks/use-mobile'
import { ActionModal } from './components/ActionModal'
import { ActionForm } from './components/ActionForm'

export interface EntityActionsProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityActionsConfig<TEntity>
  context: {
    entity?: TEntity
    entities?: TEntity[]
    refresh?: () => void | Promise<void>
    showList?: () => void
    showForm?: (entity?: TEntity) => void
    showView?: (entity: TEntity) => void
    onCreate?: (data: Partial<TEntity>) => void | Promise<void>
    onUpdate?: (data: Partial<TEntity>) => void | Promise<void>
    onDelete?: (entity: TEntity) => void | Promise<void>
  }
  maxVisibleActions?: number
}

export const EntityActions = <TEntity extends BaseEntity = BaseEntity>({
  config,
  context,
  maxVisibleActions = 2,
}: EntityActionsProps<TEntity>) => {
  const isMobile = useIsMobile()
  const router = useRouter()

  // Modal state management
  const [confirmAction, setConfirmAction] = useState<EntityAction | null>(null)
  const [formAction, setFormAction] = useState<EntityAction | null>(null)
  const [modalAction, setModalAction] = useState<EntityAction | null>(null)

  // Handle confirm action
  const handleConfirmAction = async () => {
    if (confirmAction?.onExecute) {
      await confirmAction.onExecute(context.entity || context.entities, context)
    }
    setConfirmAction(null)
  }

  // Handle form submit
  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (formAction?.form?.onSubmit) {
      await formAction.form.onSubmit(values, context.entity, context)
    }
    setFormAction(null)
  }

  // Handle modal close
  const handleModalClose = () => {
    setModalAction(null)
  }
  const handleActionClick = async (action: EntityAction) => {
    try {
      switch (action.actionType) {
        case 'immediate':
          if (action.onExecute) {
            await action.onExecute(context.entity || context.entities, context)
          }
          break

        case 'confirm':
          setConfirmAction(action)
          break

        case 'form':
          setFormAction(action)
          break

        case 'modal':
          setModalAction(action)
          break

        case 'navigation':
          if (action.href) {
            const href = typeof action.href === 'function'
              ? action.href(context.entity)
              : action.href

            if (action.router === 'next') {
              // Use Next.js router for client-side navigation
              router.push(href)
            } else if (action.router === 'window' || !action.router) {
              // Default to window navigation
              window.open(href, action.target || '_self')
            }
          }
          break

        default:
          if (action.onExecute) {
            await action.onExecute(context.entity || context.entities, context)
          }
      }
    } catch (error) {
      console.error('Action error:', error)
    }
  }

  // Filter visible actions
  const visibleActions = config.actions.filter(action => {
    if (action.condition) {
      return action.condition(context.entity || context.entities, context)
    }
    if (typeof action.disabled === 'boolean') {
      return !action.disabled
    }
    if (action.visible) {
      return action.visible(context.entity || context.entities, context)
    }
    return true
  })

  if (visibleActions.length === 0) return null

  const visibleCount = Math.min(visibleActions.length, maxVisibleActions)
  const visibleButtons = visibleActions.slice(0, visibleCount)
  const dropdownActions = visibleActions.slice(visibleCount)

  return (
    <div className="flex items-center gap-2 justify-start">
      {visibleButtons.map(action => {
        // Map EntityAction type to Button variant
        const getVariant = (type?: string) => {
          switch (type) {
            case 'primary': return 'default'
            case 'dashed': return 'outline'
            case 'link': return 'link'
            case 'text': return 'ghost'
            default: return 'default'
          }
        }

        // Map EntityAction size to Button size
        const getSize = (size?: string) => {
          switch (size) {
            case 'small': return 'sm'
            case 'large': return 'lg'
            default: return 'default'
          }
        }

        return (
          <Button
            key={action.id}
            variant={getVariant(action.type)}
            size={getSize(action.size)}
            onClick={() => handleActionClick(action)}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        )
      })}
      
      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dropdownActions.map(action => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => handleActionClick(action)}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    
      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.confirm?.title
                ? (typeof confirmAction.confirm.title === 'function'
                    ? confirmAction.confirm.title(context.entity)
                    : confirmAction.confirm.title)
                : 'Confirm Action'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirm?.content
                ? (typeof confirmAction.confirm.content === 'function'
                    ? confirmAction.confirm.content(context.entity)
                    : confirmAction.confirm.content)
                : 'Are you sure you want to perform this action?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction?.confirm?.okText || 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Modal */}
      {formAction?.form && (
        <ActionModal
          isOpen={!!formAction}
          onClose={() => setFormAction(null)}
          title={typeof formAction.form.title === 'function'
            ? formAction.form.title(context.entity)
            : formAction.form.title}
          width={formAction.form.width}
          item={context.entity}
          content={({ onClose }) => (
            <ActionForm
              fields={formAction.form!.fields}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          )}
        />
      )}

      {/* Custom Modal */}
      {modalAction?.modal && (
        <ActionModal
          isOpen={!!modalAction}
          onClose={handleModalClose}
          title={typeof modalAction.modal.title === 'function'
            ? modalAction.modal.title(context.entity)
            : modalAction.modal.title}
          width={modalAction.modal.width}
          footer={modalAction.modal.footer}
          item={context.entity}
          content={modalAction.modal.content}
        />
      )}
    </div>
  )
}

EntityActions.displayName = 'EntityActions'