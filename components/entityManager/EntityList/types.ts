import React from "react"
import { EntityActionsConfig } from "../EntityActions/types"

// ===== TYPE DEFINITIONS =====

export interface EntityListItem {
  id: string | number
  [key: string]: unknown
}

export interface EntityListColumn {
  id: string
  header: string | React.ReactNode
  accessorKey?: string
  accessorFn?: (item: EntityListItem) => unknown
  cell?: (value: unknown, item: EntityListItem, index: number) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  className?: string
  hidden?: boolean
  pinned?: 'left' | 'right'
  group?: string
  priority?: number
  helpText?: string | React.ReactNode
  tooltip?: string
}

export interface EntityListFilter {
  id: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean' | 'range'
  field?: string
  operator?: DjangoLookupOperator
  operators?: DjangoLookupOperator[] // Available operators for this filter
  djangoField?: string // Override for backend field name
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  placeholder?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: unknown
  validation?: (value: unknown) => boolean | string
  transform?: (value: unknown, operator: DjangoLookupOperator) => unknown // Enhanced transform with operator
  helpText?: string | React.ReactNode
  tooltip?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  required?: boolean
}

// Django REST Framework lookup operators
export type DjangoLookupOperator =
  // String lookups
  | 'exact' | 'iexact' | 'contains' | 'icontains' | 'startswith' | 'istartswith' | 'endswith' | 'iendswith'
  // Numeric lookups
  | 'gt' | 'gte' | 'lt' | 'lte'
  // Array lookups
  | 'in' | 'range'
  // Null lookups
  | 'isnull'
  // Date/time lookups
  | 'date' | 'year' | 'month' | 'day' | 'week_day' | 'hour' | 'minute' | 'second'
  // Special lookups
  | 'regex' | 'iregex'

export interface EntityListSort {
  field: string
  direction: 'asc' | 'desc'
  priority?: number
  nullsFirst?: boolean
}

export interface EntityListPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => string
}

export interface EntityListSelection {
  selectedKeys: (string | number)[]
  mode: 'single' | 'multiple' | 'none'
  onChange?: (selectedKeys: (string | number)[], selectedItems: EntityListItem[]) => void
  preserveSelectedRowKeys?: boolean
  getCheckboxProps?: (item: EntityListItem) => { disabled?: boolean; name?: string }
}

export interface EntityListAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  type: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  hidden?: boolean
  permission?: string
  condition?: (item: EntityListItem, context?: unknown) => boolean
  onClick?: (item: EntityListItem, context?: unknown) => void | Promise<void>
  href?: string | ((item: EntityListItem) => string)
  target?: '_blank' | '_self' | '_parent' | '_top'
  confirm?: {
    title: string
    content: string | React.ReactNode
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
  }
  group?: string
  priority?: number
  separator?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
}

export interface EntityListBulkAction extends Omit<EntityListAction, 'condition' | 'onClick' | 'confirm'> {
  minSelection?: number
  maxSelection?: number
  confirm?: {
    title: string | ((count: number) => string)
    content: string | React.ReactNode | ((selectedItems: EntityListItem[]) => string | React.ReactNode)
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
  }
  onClick?: (selectedItems: EntityListItem[], context?: unknown) => void | Promise<void>
}

export interface EntityListViewConfig {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  component: React.ComponentType<EntityListViewProps>
  default?: boolean
  disabled?: boolean
  permission?: string
}

export interface EntityListViewProps {
  data: EntityListItem[]
  columns: EntityListColumn[]
  loading?: boolean
  error?: string | null
  emptyText?: string | React.ReactNode
  selection?: EntityListSelection & { selectedKeys: (string | number)[]; onChange: (keys: (string | number)[], items: EntityListItem[]) => void }
  actions?: EntityListAction[]
  entityActions?: EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
  rowKey?: string | ((item: EntityListItem) => string | number)
  onRow?: (record: EntityListItem, index?: number) => {
    onClick?: (event: React.MouseEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
    onContextMenu?: (event: React.MouseEvent) => void
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
  }
  scroll?: { x?: string | number; y?: string | number }
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
  className?: string
}

export interface EntityListExportConfig {
  enabled?: boolean
  formats?: ('csv' | 'xlsx' | 'pdf' | 'json')[]
  filename?: string
  includeFilters?: boolean
  customTransformers?: Record<string, (data: EntityListItem[]) => unknown>
}

export interface EntityListConfig {
  // Basic configuration
  id?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode

  // Data configuration
  data: EntityListItem[]
  columns: EntityListColumn[]
  rowKey?: string | ((item: EntityListItem) => string | number)

  // Loading and error states
  loading?: boolean
  error?: string | null

  // View configuration
  views?: EntityListViewConfig[]
  defaultView?: string

  // Search configuration
  searchable?: boolean
  searchPlaceholder?: string
  globalSearch?: boolean
  searchFields?: string[]
  searchTransform?: (query: string) => unknown

  // Filter configuration
  filters?: EntityListFilter[]
  filterLayout?: 'horizontal' | 'vertical' | 'inline' | 'compact'
  showFilterReset?: boolean
  collapsibleFilters?: boolean
  defaultFiltersCollapsed?: boolean
  savedFiltersKey?: string

  // Sort configuration
  sortable?: boolean
  defaultSort?: EntityListSort[]
  multiSort?: boolean
  sortDirections?: ('asc' | 'desc')[]

  // Pagination configuration
  paginated?: boolean
  pagination?: Partial<EntityListPagination>
  serverSidePagination?: boolean

  // Selection configuration
  selection?: EntityListSelection

  // Actions configuration
  actions?: EntityListAction[]
  entityActions?: EntityActionsConfig
  bulkActions?: EntityListBulkAction[]
  actionColumnWidth?: string | number
  showActions?: boolean

  // Export configuration
  export?: EntityListExportConfig

  // UI configuration
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
  showHeader?: boolean
  showFooter?: boolean
  scroll?: { x?: string | number; y?: string | number }
  sticky?: boolean | { offsetHeader?: number; offsetScroll?: number }

  // Empty state
  emptyText?: string | React.ReactNode

  // Permissions
  permissions?: {
    view?: string | boolean
    create?: string | boolean
    edit?: string | boolean
    delete?: string | boolean
    export?: string | boolean
  }

  // Event handlers
  onRow?: (record: EntityListItem, index?: number) => {
    onClick?: (event: React.MouseEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
    onContextMenu?: (event: React.MouseEvent) => void
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
  }
  onChange?: (
    pagination: EntityListPagination,
    filters: Record<string, unknown>,
    sorter: EntityListSort[],
    extra: { currentDataSource: EntityListItem[]; action: 'paginate' | 'sort' | 'filter' }
  ) => void
  onRefresh?: () => void
  onCreate?: () => void

  // Custom components
  components?: {
    header?: React.ComponentType<{ config: EntityListConfig }>
    footer?: React.ComponentType<{ config: EntityListConfig }>
    empty?: React.ComponentType<{ config: EntityListConfig }>
    loading?: React.ComponentType<{ config: EntityListConfig }>
  }

  // Styling
  className?: string
  style?: React.CSSProperties
  rowClassName?: string | ((record: EntityListItem, index: number) => string)

  // Field selection configuration
  fields?: string | string[]
  fieldSelection?: boolean

  // Related object expansion configuration
  expand?: string | string[]
  expandable?: boolean
}

export interface EntityListProps {
  config: EntityListConfig
  // Override props
  data?: EntityListItem[]
  loading?: boolean
  error?: string | null
  selectedKeys?: (string | number)[]
  searchTerm?: string
  activeFilters?: Record<string, unknown>
  sortConfig?: EntityListSort[]
  pagination?: Partial<EntityListPagination>
  fields?: string | string[]
  expand?: string | string[]
  // Event handlers
  onDataChange?: (data: EntityListItem[]) => void
  onSelectionChange?: (selectedKeys: (string | number)[], selectedItems: EntityListItem[]) => void
  onSearch?: (term: string) => void
  onFilter?: (filters: Record<string, unknown>) => void
  onSort?: (sort: EntityListSort[]) => void
  onPageChange?: (page: number, pageSize: number) => void
  onAction?: (action: EntityListAction, item: EntityListItem) => void
  onBulkAction?: (action: EntityListBulkAction, items: EntityListItem[]) => void
  onExport?: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void
}