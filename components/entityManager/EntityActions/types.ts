import React from "react"

// ===== TYPE DEFINITIONS =====

export interface EntityAction {
  id: string
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  type: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  size?: 'small' | 'middle' | 'large'
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  hidden?: boolean

  // Permissions & visibility
  permission?: string
  condition?: (item: unknown, context?: unknown) => boolean
  visible?: (item: unknown, context?: unknown) => boolean

  // Action behavior
  actionType: 'immediate' | 'confirm' | 'form' | 'bulk' | 'async' | 'navigation' | 'modal' | 'drawer'

  // Execution
  onExecute?: (item: unknown | unknown[], context?: unknown) => void | Promise<void>

  // Navigation actions
  href?: string | ((item: unknown) => string)
  target?: '_blank' | '_self' | '_parent' | '_top'
  router?: 'next' | 'react-router' | 'window'

  // Confirmation actions
  confirm?: {
    title: string | ((item: unknown) => string)
    content: string | React.ReactNode | ((item: unknown) => string | React.ReactNode)
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
    centered?: boolean
  }

  // Form actions
  form?: {
    title: string | ((item: unknown) => string)
    width?: string | number
    fields: EntityActionFormField[]
    initialValues?: (item: unknown) => Record<string, unknown>
    validation?: Record<string, (value: unknown) => boolean | string>
    submitText?: string
    onSubmit: (values: Record<string, unknown>, item: unknown, context?: unknown) => Promise<void>
  }

  // Modal actions
  modal?: {
    title: string | ((item: unknown) => string)
    content: React.ComponentType<{ item: unknown; onClose: () => void }>
    width?: string | number
    footer?: React.ReactNode | ((item: unknown) => React.ReactNode)
  }

  // Drawer actions
  drawer?: {
    title: string | ((item: unknown) => string)
    content: React.ComponentType<{ item: unknown; onClose: () => void }>
    width?: string | number
    placement?: 'left' | 'right' | 'top' | 'bottom'
  }

  // Async actions
  async?: {
    loadingText?: string | ((item: unknown) => string)
    successMessage?: string | ((item: unknown, result: unknown) => string)
    errorMessage?: string | ((item: unknown, error: unknown) => string)
    showProgress?: boolean
    timeout?: number
  }

  // Bulk actions
  bulk?: {
    minItems?: number
    maxItems?: number
    confirmMessage?: (count: number) => string
    batchSize?: number
    parallel?: boolean
  }

  // Keyboard shortcuts
  shortcut?: string

  // Grouping & ordering
  group?: string
  priority?: number
  separator?: boolean

  // Styling
  className?: string
  style?: React.CSSProperties

  // Advanced features
  debounce?: number
  throttle?: number
  retry?: {
    attempts: number
    delay: number
    backoff: 'linear' | 'exponential'
  }
}

export interface EntityActionFormField {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'time' | 'boolean' | 'select' | 'multiselect' | 'textarea' | 'email' | 'url' | 'password' | 'file' | 'image' | 'custom'
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  validation?: (value: unknown) => boolean | string
  defaultValue?: unknown
  disabled?: boolean
  hidden?: boolean
  dependencies?: string[]
  customRenderer?: (field: EntityActionFormField, value: unknown, onChange: (value: unknown) => void) => React.ReactNode
}

export interface EntityBulkAction extends Omit<EntityAction, 'condition' | 'onExecute' | 'confirm' | 'form' | 'modal' | 'drawer'> {
  minSelection?: number
  maxSelection?: number
  confirm?: {
    title: string | ((count: number) => string)
    content: string | React.ReactNode | ((selectedItems: unknown[]) => string | React.ReactNode)
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
    centered?: boolean
  }
  onExecute?: (selectedItems: unknown[], context?: unknown) => void | Promise<void>
}

export interface EntityActionsConfig<TEntity = unknown> {
  actions: EntityAction[]
  bulkActions?: EntityBulkAction[]
  context?: TEntity | TEntity[]
  maxVisibleActions?: number
  showLabels?: boolean
  groupActions?: boolean
  showShortcuts?: boolean
  actionButtonVariant?: 'default' | 'outline' | 'ghost' | 'link'
  actionButtonSize?: 'sm' | 'default' | 'lg'
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  permissions?: {
    check: (permission: string) => boolean
    fallback?: 'hide' | 'disable'
  }
  hooks?: {
    onActionStart?: (action: EntityAction, item: TEntity) => void
    onActionComplete?: (action: EntityAction, item: TEntity, result: unknown) => void
    onActionError?: (action: EntityAction, item: TEntity, error: unknown) => void
    onBulkActionStart?: (action: EntityBulkAction, items: TEntity[]) => void
    onBulkActionComplete?: (action: EntityBulkAction, items: TEntity[], result: unknown) => void
    onBulkActionError?: (action: EntityBulkAction, items: TEntity[], error: unknown) => void
  }
}

export interface EntityActionsProps<TEntity = unknown> {
  config: EntityActionsConfig<TEntity>
  item?: TEntity
  selectedItems?: TEntity[]
  className?: string
  disabled?: boolean
}

// ===== UTILITY TYPES =====

export type EntityActionResult = {
  success: boolean
  data?: unknown
  error?: unknown
  action: EntityAction
  item: unknown
}

export type EntityBulkActionResult = {
  success: boolean
  data?: unknown
  error?: unknown
  action: EntityBulkAction
  items: unknown[]
  results?: EntityActionResult[]
}

// ===== PRESET ACTIONS =====

export const PRESET_ACTIONS = {
  VIEW: (overrides: Partial<EntityAction> = {}): EntityAction => ({
    id: 'view',
    label: 'View',
    type: 'default',
    actionType: 'modal',
    modal: {
      title: 'View Details',
      content: React.lazy(() => import('./components/ViewModal'))
    },
    ...overrides
  }),

  EDIT: (overrides: Partial<EntityAction> = {}): EntityAction => ({
    id: 'edit',
    label: 'Edit',
    type: 'default',
    actionType: 'modal',
    modal: {
      title: 'Edit Item',
      content: React.lazy(() => import('./components/EditModal'))
    },
    ...overrides
  }),

  DELETE: (overrides: Partial<EntityAction> = {}): EntityAction => ({
    id: 'delete',
    label: 'Delete',
    type: 'default',
    danger: true,
    actionType: 'confirm',
    confirm: {
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item? This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      okType: 'danger'
    },
    ...overrides
  }),

  DUPLICATE: (overrides: Partial<EntityAction> = {}): EntityAction => ({
    id: 'duplicate',
    label: 'Duplicate',
    type: 'default',
    actionType: 'immediate',
    ...overrides
  }),

  EXPORT: (overrides: Partial<EntityAction> = {}): EntityAction => ({
    id: 'export',
    label: 'Export',
    type: 'default',
    actionType: 'immediate',
    ...overrides
  }),

  BULK_DELETE: (overrides: Partial<EntityBulkAction> = {}): EntityBulkAction => ({
    id: 'bulk-delete',
    label: 'Delete Selected',
    type: 'default',
    danger: true,
    actionType: 'confirm',
    minSelection: 1,
    confirm: {
      title: (count) => `Delete ${count} Items`,
      content: (items) => `Are you sure you want to delete ${items.length} items? This action cannot be undone.`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okType: 'danger'
    },
    ...overrides
  }),

  BULK_EXPORT: (overrides: Partial<EntityBulkAction> = {}): EntityBulkAction => ({
    id: 'bulk-export',
    label: 'Export Selected',
    type: 'default',
    actionType: 'immediate',
    minSelection: 1,
    ...overrides
  })
} as const