import React from "react"
import { EntityActionsConfig } from "../EntityActions/types"

// ===== TYPE DEFINITIONS =====

export interface EntityViewConfig<TEntity = unknown> {
  // View mode and layout
  mode?: ViewMode
  layout?: ViewLayout
  theme?: ViewTheme

  // Data display configuration
  fields?: ViewField[]
  fieldGroups?: ViewFieldGroup[]
  data?: TEntity
  dataFetcher?: () => Promise<TEntity>

  // Display options
  showHeader?: boolean
  showActions?: boolean
  showMetadata?: boolean
  showNavigation?: boolean
  compact?: boolean

  // View components
  customComponents?: {
    header?: React.ComponentType<ViewHeaderProps<TEntity>>
    content?: React.ComponentType<ViewContentProps<TEntity>>
    actions?: React.ComponentType<ViewActionsProps<TEntity>>
    metadata?: React.ComponentType<ViewMetadataProps<TEntity>>
  }

  // Data transformation
  dataTransformer?: (data: TEntity) => TEntity
  fieldMapper?: (data: TEntity) => Record<string, unknown>

  // Navigation and actions
  actions?: ViewAction[] // Legacy support
  entityActions?: EntityActionsConfig<TEntity> // New EntityActions config
  navigation?: {
    prev?: () => void | Promise<void>
    next?: () => void | Promise<void>
    canGoPrev?: boolean
    canGoNext?: boolean
  }

  // Permissions & hooks
  permissions?: {
    view?: boolean
    edit?: boolean
    delete?: boolean
    navigate?: boolean
  }
  hooks?: {
    onViewLoad?: (data: TEntity) => void
    onViewChange?: (data: TEntity) => void
    onActionClick?: (action: ViewAction, data: TEntity) => void
    onNavigate?: (direction: 'prev' | 'next') => void
  }

  // Styling and customization
  className?: string
  style?: React.CSSProperties
  fieldSpacing?: 'sm' | 'md' | 'lg'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export type ViewMode = 'card' | 'list' | 'table' | 'detail' | 'summary' | 'timeline' | 'gallery' | 'custom'
export type ViewLayout = 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'
export type ViewTheme = 'default' | 'minimal' | 'card' | 'bordered' | 'flat'

export interface ViewField {
  key: string
  label: string
  type?: FieldDisplayType
  value?: unknown
  format?: (value: unknown, data: unknown) => React.ReactNode
  condition?: (data: unknown) => boolean
  hidden?: boolean

  // Display options
  width?: number | string
  align?: 'left' | 'center' | 'right'
  bold?: boolean
  italic?: boolean
  color?: string
  backgroundColor?: string

  // Advanced features
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  badge?: boolean
  copyable?: boolean
  link?: {
    href: string | ((data: unknown) => string)
    target?: '_blank' | '_self'
  }

  // Custom rendering
  render?: (value: unknown, data: unknown) => React.ReactNode
  component?: React.ComponentType<FieldRenderProps>
}

export interface ViewFieldGroup {
  id: string
  title?: string
  description?: string
  fields: ViewField[]
  collapsed?: boolean
  collapsible?: boolean
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number
  className?: string
}

export type FieldDisplayType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'currency'
  | 'percentage'
  | 'email'
  | 'phone'
  | 'url'
  | 'image'
  | 'avatar'
  | 'badge'
  | 'tags'
  | 'json'
  | 'markdown'
  | 'html'
  | 'custom'

export interface ViewAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  loading?: boolean
  condition?: (data: unknown) => boolean
  onClick?: (data: unknown) => void | Promise<void>
  href?: string | ((data: unknown) => string)
  target?: '_blank' | '_self'
  confirm?: {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
  }
}

export interface FieldRenderProps {
  field: ViewField
  value: unknown
  data: unknown
}

export interface ViewHeaderProps<TEntity = unknown> {
  data: TEntity
  config: EntityViewConfig<TEntity>
  title?: string
  subtitle?: string
}

export interface ViewContentProps<TEntity = unknown> {
  data: TEntity
  config: EntityViewConfig<TEntity>
  fields: ViewField[]
  fieldGroups: ViewFieldGroup[]
}

export interface ViewActionsProps<TEntity = unknown> {
  data: TEntity
  config: EntityViewConfig<TEntity>
  actions: ViewAction[]
}

export interface ViewMetadataProps<TEntity = unknown> {
  data: TEntity
  config: EntityViewConfig<TEntity>
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

// ===== VIEW MODE COMPONENTS =====

export interface CardViewProps {
  data: unknown
  config: EntityViewConfig
  fields: ViewField[]
  onActionClick?: (action: ViewAction) => void
}

export interface ListViewProps {
  data: unknown[]
  config: EntityViewConfig
  fields: ViewField[]
  onItemClick?: (item: unknown) => void
  onActionClick?: (action: ViewAction, item: unknown) => void
}

export interface TableViewProps {
  data: unknown[]
  config: EntityViewConfig
  fields: ViewField[]
  sortable?: boolean
  selectable?: boolean
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  onSelect?: (items: unknown[]) => void
  onActionClick?: (action: ViewAction, item: unknown) => void
}

export interface DetailViewProps {
  data: unknown
  config: EntityViewConfig
  fieldGroups: ViewFieldGroup[]
  onActionClick?: (action: ViewAction) => void
}

export interface TimelineViewProps {
  data: unknown[]
  config: EntityViewConfig
  dateField: string
  titleField: string
  descriptionField?: string
  groupBy?: string
}

export interface GalleryViewProps {
  data: unknown[]
  config: EntityViewConfig
  imageField: string
  titleField?: string
  descriptionField?: string
  onItemClick?: (item: unknown) => void
}

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_VIEW_CONFIG: Partial<EntityViewConfig> = {
  mode: 'detail',
  layout: 'single',
  theme: 'default',
  showHeader: true,
  showActions: true,
  showMetadata: false,
  showNavigation: false,
  compact: false,
  fieldSpacing: 'md',
  borderRadius: 'md',
  shadow: 'sm',
  permissions: {
    view: true,
    edit: false,
    delete: false,
    navigate: false,
  },
}

export const DEFAULT_VIEW_ACTIONS: ViewAction[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: () => React.createElement('span', null, '✏️'),
    variant: 'outline',
    condition: () => true,
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: () => React.createElement('span', null, '🗑️'),
    variant: 'destructive',
    condition: () => true,
    confirm: {
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    },
  },
]

// ===== UTILITY TYPES =====

export interface EntityViewProps<TEntity = unknown> {
  config: EntityViewConfig<TEntity>
  data?: TEntity
  onActionClick?: (action: ViewAction, data?: TEntity) => void
  onNavigate?: (direction: 'prev' | 'next') => void
  className?: string
}

export type ViewFieldSpacing = 'sm' | 'md' | 'lg'
export type ViewBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type ViewShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl'