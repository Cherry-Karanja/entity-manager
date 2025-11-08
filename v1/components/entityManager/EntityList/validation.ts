import { z } from "zod"

// ===== ZOD SCHEMAS FOR RUNTIME VALIDATION =====

// Entity list item schema
export const EntityListItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
}).catchall(z.unknown())

// Entity list column schema
export const EntityListColumnSchema = z.object({
  id: z.string(),
  header: z.union([z.string(), z.any()]),
  accessorKey: z.string().optional(),
  accessorFn: z.function().optional(),
  cell: z.function().optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  searchable: z.boolean().optional(),
  width: z.union([z.string(), z.number()]).optional(),
  minWidth: z.union([z.string(), z.number()]).optional(),
  maxWidth: z.union([z.string(), z.number()]).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  className: z.string().optional(),
  hidden: z.boolean().optional(),
  pinned: z.enum(['left', 'right']).optional(),
  group: z.string().optional(),
  priority: z.number().optional(),
  helpText: z.union([z.string(), z.any()]).optional(),
  tooltip: z.string().optional(),
}).catchall(z.unknown())

// Entity list filter schema
export const EntityListFilterSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'select', 'multiselect', 'date', 'daterange', 'number', 'boolean', 'range']),
  field: z.string().optional(),
  options: z.array(z.object({
    value: z.union([z.string(), z.number()]),
    label: z.string(),
    disabled: z.boolean().optional(),
  })).optional(),
  placeholder: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.unknown().optional(),
  validation: z.function().optional(),
  helpText: z.union([z.string(), z.any()]).optional(),
  tooltip: z.string().optional(),
  icon: z.function().optional(),
  className: z.string().optional(),
  required: z.boolean().optional(),
}).catchall(z.unknown())

// Entity list sort schema
export const EntityListSortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
  priority: z.number().optional(),
  nullsFirst: z.boolean().optional(),
})

// Entity list pagination schema
export const EntityListPaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
  pageSizeOptions: z.array(z.number()).optional(),
  showSizeChanger: z.boolean().optional(),
  showQuickJumper: z.boolean().optional(),
  showTotal: z.function().optional(),
})

// Entity list selection schema
export const EntityListSelectionSchema = z.object({
  selectedKeys: z.array(z.union([z.string(), z.number()])),
  mode: z.enum(['single', 'multiple', 'none']),
  onChange: z.function().optional(),
  preserveSelectedRowKeys: z.boolean().optional(),
  getCheckboxProps: z.function().optional(),
})

// Entity list action schema
export const EntityListActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.function().optional(),
  type: z.enum(['primary', 'default', 'dashed', 'link', 'text']),
  danger: z.boolean().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  hidden: z.boolean().optional(),
  permission: z.string().optional(),
  condition: z.function().optional(),
  onClick: z.function().optional(),
  href: z.union([z.string(), z.function()]).optional(),
  target: z.enum(['_blank', '_self', '_parent', '_top']).optional(),
  confirm: z.object({
    title: z.string(),
    content: z.union([z.string(), z.any()]),
    okText: z.string().optional(),
    cancelText: z.string().optional(),
    okType: z.enum(['primary', 'danger']).optional(),
  }).optional(),
  group: z.string().optional(),
  priority: z.number().optional(),
  separator: z.boolean().optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).optional(),
  className: z.string().optional(),
}).catchall(z.unknown())

// Entity list bulk action schema
export const EntityListBulkActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.function().optional(),
  type: z.enum(['primary', 'default', 'dashed', 'link', 'text']),
  danger: z.boolean().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  hidden: z.boolean().optional(),
  permission: z.string().optional(),
  minSelection: z.number().optional(),
  maxSelection: z.number().optional(),
  confirm: z.object({
    title: z.union([z.string(), z.function()]),
    content: z.union([z.string(), z.any(), z.function()]),
    okText: z.string().optional(),
    cancelText: z.string().optional(),
    okType: z.enum(['primary', 'danger']).optional(),
  }).optional(),
  onClick: z.function().optional(),
  group: z.string().optional(),
  priority: z.number().optional(),
  separator: z.boolean().optional(),
  className: z.string().optional(),
}).catchall(z.unknown())

// Entity list export config schema
export const EntityListExportConfigSchema = z.object({
  enabled: z.boolean().optional(),
  formats: z.array(z.enum(['csv', 'xlsx', 'pdf', 'json'])).optional(),
  filename: z.string().optional(),
  includeFilters: z.boolean().optional(),
  customTransformers: z.record(z.function()).optional(),
})

// Entity list config schema
export const EntityListConfigSchema = z.object({
  // Basic configuration
  id: z.string().optional(),
  title: z.union([z.string(), z.any()]).optional(),
  description: z.union([z.string(), z.any()]).optional(),

  // Data configuration
  data: z.array(EntityListItemSchema),
  columns: z.array(EntityListColumnSchema),
  rowKey: z.union([z.string(), z.function()]).optional(),

  // Loading and error states
  loading: z.boolean().optional(),
  error: z.string().nullable().optional(),

  // View configuration
  views: z.array(z.any()).optional(), // EntityListViewConfig
  defaultView: z.string().optional(),

  // Search configuration
  searchable: z.boolean().optional(),
  searchPlaceholder: z.string().optional(),
  globalSearch: z.boolean().optional(),
  searchFields: z.array(z.string()).optional(),
  searchTransform: z.function().optional(),

  // Filter configuration
  filters: z.array(EntityListFilterSchema).optional(),
  filterLayout: z.enum(['horizontal', 'vertical', 'inline', 'compact']).optional(),
  showFilterReset: z.boolean().optional(),
  collapsibleFilters: z.boolean().optional(),
  defaultFiltersCollapsed: z.boolean().optional(),
  savedFiltersKey: z.string().optional(),

  // Sort configuration
  sortable: z.boolean().optional(),
  defaultSort: z.array(EntityListSortSchema).optional(),
  multiSort: z.boolean().optional(),
  sortDirections: z.array(z.enum(['asc', 'desc'])).optional(),

  // Pagination configuration
  paginated: z.boolean().optional(),
  pagination: z.any().optional(), // Partial<EntityListPagination>
  serverSidePagination: z.boolean().optional(),

  // Selection configuration
  selection: EntityListSelectionSchema.optional(),

  // Actions configuration
  actions: z.array(EntityListActionSchema).optional(),
  entityActions: z.any().optional(), // EntityActionsConfig
  bulkActions: z.array(EntityListBulkActionSchema).optional(),
  actionColumnWidth: z.union([z.string(), z.number()]).optional(),
  showActions: z.boolean().optional(),

  // Export configuration
  export: EntityListExportConfigSchema.optional(),

  // UI configuration
  size: z.enum(['small', 'middle', 'large']).optional(),
  bordered: z.boolean().optional(),
  showHeader: z.boolean().optional(),
  showFooter: z.boolean().optional(),
  scroll: z.object({
    x: z.union([z.string(), z.number()]).optional(),
    y: z.union([z.string(), z.number()]).optional(),
  }).optional(),
  sticky: z.union([z.boolean(), z.object({
    offsetHeader: z.number().optional(),
    offsetScroll: z.number().optional(),
  })]).optional(),

  // Empty state
  emptyText: z.union([z.string(), z.any()]).optional(),

  // Permissions
  permissions: z.object({
    view: z.union([z.string(), z.boolean()]).optional(),
    create: z.union([z.string(), z.boolean()]).optional(),
    edit: z.union([z.string(), z.boolean()]).optional(),
    delete: z.union([z.string(), z.boolean()]).optional(),
    export: z.union([z.string(), z.boolean()]).optional(),
  }).optional(),

  // Event handlers
  onRow: z.function().optional(),
  onChange: z.function().optional(),
  onRefresh: z.function().optional(),
  onCreate: z.function().optional(),

  // Custom components
  components: z.object({
    header: z.function().optional(),
    footer: z.function().optional(),
    empty: z.function().optional(),
    loading: z.function().optional(),
  }).optional(),

  // Styling
  className: z.string().optional(),
  style: z.any().optional(),
  rowClassName: z.union([z.string(), z.function()]).optional(),
}).catchall(z.unknown())

// ===== VALIDATION FUNCTIONS =====

/**
 * Result of validation operation
 */
export interface ValidationResult {
  readonly success: boolean
  readonly errors?: z.ZodError[]
  readonly data?: unknown
}

/**
 * Validate entity list item
 */
export function validateEntityListItem(item: unknown): boolean {
  try {
    EntityListItemSchema.parse(item)
    return true
  } catch (error) {
    console.error('EntityListItem validation failed:', error)
    return false
  }
}

/**
 * Validate entity list column
 */
export function validateEntityListColumn(column: unknown): boolean {
  try {
    EntityListColumnSchema.parse(column)
    return true
  } catch (error) {
    console.error('EntityListColumn validation failed:', error)
    return false
  }
}

/**
 * Validate entity list filter
 */
export function validateEntityListFilter(filter: unknown): boolean {
  try {
    EntityListFilterSchema.parse(filter)
    return true
  } catch (error) {
    console.error('EntityListFilter validation failed:', error)
    return false
  }
}

/**
 * Validate entity list sort
 */
export function validateEntityListSort(sort: unknown): boolean {
  try {
    EntityListSortSchema.parse(sort)
    return true
  } catch (error) {
    console.error('EntityListSort validation failed:', error)
    return false
  }
}

/**
 * Validate entity list action
 */
export function validateEntityListAction(action: unknown): boolean {
  try {
    EntityListActionSchema.parse(action)
    return true
  } catch (error) {
    console.error('EntityListAction validation failed:', error)
    return false
  }
}

/**
 * Validate entity list bulk action
 */
export function validateEntityListBulkAction(action: unknown): boolean {
  try {
    EntityListBulkActionSchema.parse(action)
    return true
  } catch (error) {
    console.error('EntityListBulkAction validation failed:', error)
    return false
  }
}

/**
 * Validate entity list config
 */
export function validateEntityListConfig(config: unknown): boolean {
  try {
    EntityListConfigSchema.parse(config)
    return true
  } catch (error) {
    console.error('EntityListConfig validation failed:', error)
    return false
  }
}

// ===== TYPE-SAFE VALIDATION WITH DETAILED ERRORS =====

/**
 * Validate entity list item with detailed error information
 */
export function validateEntityListItemWithErrors(item: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListItemSchema.safeParse(item)
}

/**
 * Validate entity list column with detailed error information
 */
export function validateEntityListColumnWithErrors(column: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListColumnSchema.safeParse(column)
}

/**
 * Validate entity list filter with detailed error information
 */
export function validateEntityListFilterWithErrors(filter: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListFilterSchema.safeParse(filter)
}

/**
 * Validate entity list sort with detailed error information
 */
export function validateEntityListSortWithErrors(sort: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListSortSchema.safeParse(sort)
}

/**
 * Validate entity list action with detailed error information
 */
export function validateEntityListActionWithErrors(action: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListActionSchema.safeParse(action)
}

/**
 * Validate entity list bulk action with detailed error information
 */
export function validateEntityListBulkActionWithErrors(action: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListBulkActionSchema.safeParse(action)
}

/**
 * Validate entity list config with detailed error information
 */
export function validateEntityListConfigWithErrors(config: unknown): z.SafeParseReturnType<unknown, unknown> {
  return EntityListConfigSchema.safeParse(config)
}

// ===== ADVANCED VALIDATION UTILITIES =====

/**
 * Validate an array of entity list items
 */
export function validateEntityListItems(items: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validItems: unknown[] = []

  items.forEach((item, index) => {
    const result = EntityListItemSchema.safeParse(item)
    if (result.success) {
      validItems.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityListItem validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validItems
  }
}

/**
 * Validate an array of entity list columns
 */
export function validateEntityListColumns(columns: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validColumns: unknown[] = []

  columns.forEach((column, index) => {
    const result = EntityListColumnSchema.safeParse(column)
    if (result.success) {
      validColumns.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityListColumn validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validColumns
  }
}

/**
 * Validate an array of entity list filters
 */
export function validateEntityListFilters(filters: unknown[]): ValidationResult {
  const errors: z.ZodError[] = []
  const validFilters: unknown[] = []

  filters.forEach((filter, index) => {
    const result = EntityListFilterSchema.safeParse(filter)
    if (result.success) {
      validFilters.push(result.data)
    } else {
      errors.push(result.error)
      console.error(`EntityListFilter validation failed at index ${index}:`, result.error)
    }
  })

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: validFilters
  }
}