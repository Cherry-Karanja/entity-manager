/**
 * Configuration Builder
 * 
 * This module provides a fluent builder API for creating unified entity configurations.
 * It simplifies the process of creating complex configurations with intelligent defaults.
 * 
 * @module core/builder
 */

import {
  UnifiedEntityConfig,
  UnifiedFieldConfig,
  UnifiedActionConfig,
  UnifiedFilterConfig,
  UnifiedPermissionConfig,
  BaseEntity,
  FieldGroup,
  FieldDataType,
  ActionType,
  ActionContext
} from './types'
import React from 'react'

/**
 * Field builder for fluent field configuration
 */
export class FieldBuilder<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  private config: Partial<UnifiedFieldConfig<TEntity, TFormData>> = {}

  constructor(key: string, label: string, type: FieldDataType) {
    this.config = { key, label, type }
  }

  // Core properties
  required(required = true): this {
    this.config.required = required
    return this
  }

  nullable(nullable = true): this {
    this.config.nullable = nullable
    return this
  }

  disabled(disabled = true): this {
    this.config.disabled = disabled
    return this
  }

  readOnly(readOnly = true): this {
    this.config.readOnly = readOnly
    return this
  }

  hidden(hidden = true): this {
    this.config.hidden = hidden
    return this
  }

  // UI properties
  placeholder(placeholder: string): this {
    this.config.placeholder = placeholder
    return this
  }

  description(description: string): this {
    this.config.description = description
    return this
  }

  defaultValue(value: unknown): this {
    this.config.defaultValue = value
    return this
  }

  icon(icon: React.ComponentType<{ className?: string }>): this {
    this.config.icon = icon
    return this
  }

  gridSpan(span: 'full' | 'half' | 'third' | 'quarter' | number): this {
    this.config.gridSpan = span
    return this
  }

  // Validation
  min(min: number): this {
    this.config.min = min
    return this
  }

  max(max: number): this {
    this.config.max = max
    return this
  }

  minLength(length: number): this {
    this.config.minLength = length
    return this
  }

  maxLength(length: number): this {
    this.config.maxLength = length
    return this
  }

  pattern(pattern: RegExp): this {
    this.config.pattern = pattern
    return this
  }

  validate(fn: (value: unknown, formValues?: Partial<TFormData>) => boolean | string): this {
    this.config.validate = fn
    return this
  }

  // Options (for select fields)
  options(options: Array<{ value: string | number; label: string; disabled?: boolean; description?: string }>): this {
    this.config.options = options
    return this
  }

  searchable(searchable = true): this {
    this.config.searchable = searchable
    return this
  }

  multiple(multiple = true): this {
    this.config.multiple = multiple
    return this
  }

  // Relationship
  relationship(config: {
    entity: string
    displayField: string
    endpoint?: string
    valueField?: string
    allowCreate?: boolean
    allowEdit?: boolean
    search?: {
      enabled?: boolean
      fields?: string[]
      minLength?: number
      debounceMs?: number
    }
  }): this {
    this.config.relationship = config
    return this
  }

  // List properties
  sortable(sortable = true): this {
    this.config.sortable = sortable
    return this
  }

  filterable(filterable = true): this {
    this.config.filterable = filterable
    return this
  }

  width(width: string | number): this {
    this.config.width = width
    return this
  }

  align(align: 'left' | 'center' | 'right'): this {
    this.config.align = align
    return this
  }

  // View properties
  copyable(copyable = true): this {
    this.config.copyable = copyable
    return this
  }

  sensitive(sensitive = true): this {
    this.config.sensitive = sensitive
    return this
  }

  badge(badge = true): this {
    this.config.badge = badge
    return this
  }

  // Custom rendering
  renderCell(fn: (value: unknown, entity: TEntity, index: number) => React.ReactNode): this {
    this.config.renderCell = fn
    return this
  }

  renderForm(fn: any): this {
    this.config.renderForm = fn
    return this
  }

  renderView(fn: (value: unknown, entity: TEntity) => React.ReactNode): this {
    this.config.renderView = fn
    return this
  }

  // Transformation
  format(fn: (value: unknown, entity?: TEntity) => React.ReactNode): this {
    this.config.format = fn
    return this
  }

  transformInput(fn: (value: unknown) => unknown): this {
    this.config.transformInput = fn
    return this
  }

  transformOutput(fn: (value: unknown) => unknown): this {
    this.config.transformOutput = fn
    return this
  }

  // Export
  exportable(exportable = true): this {
    this.config.exportable = exportable
    return this
  }

  build(): UnifiedFieldConfig<TEntity, TFormData> {
    return this.config as UnifiedFieldConfig<TEntity, TFormData>
  }
}

/**
 * Action builder for fluent action configuration
 */
export class ActionBuilder<TEntity extends BaseEntity = BaseEntity> {
  private config: Partial<UnifiedActionConfig<TEntity>> = {}

  constructor(id: string, label: string) {
    this.config = { id, label, type: 'immediate', context: [] }
  }

  type(type: ActionType): this {
    this.config.type = type
    return this
  }

  context(...contexts: ActionContext[]): this {
    this.config.context = contexts
    return this
  }

  variant(variant: 'default' | 'primary' | 'destructive' | 'outline' | 'ghost' | 'link'): this {
    this.config.variant = variant
    return this
  }

  icon(icon: React.ComponentType<{ className?: string }>): this {
    this.config.icon = icon
    return this
  }

  description(description: string): this {
    this.config.description = description
    return this
  }

  danger(danger = true): this {
    this.config.danger = danger
    return this
  }

  permission(permission: string): this {
    this.config.permission = permission
    return this
  }

  condition(fn: (entity: TEntity | TEntity[], context?: unknown) => boolean): this {
    this.config.condition = fn
    return this
  }

  onExecute(fn: (entity: TEntity | TEntity[], context?: unknown) => void | Promise<void>): this {
    this.config.onExecute = fn
    return this
  }

  href(href: string | ((entity: TEntity) => string)): this {
    this.config.href = href
    return this
  }

  confirm(config: {
    title: string | ((entity: TEntity | TEntity[]) => string)
    content: string | React.ReactNode | ((entity: TEntity | TEntity[]) => string | React.ReactNode)
    okText?: string
    cancelText?: string
    okType?: 'primary' | 'danger'
  }): this {
    this.config.confirm = config
    return this
  }

  group(group: string): this {
    this.config.group = group
    return this
  }

  priority(priority: number): this {
    this.config.priority = priority
    return this
  }

  build(): UnifiedActionConfig<TEntity> {
    return this.config as UnifiedActionConfig<TEntity>
  }
}

/**
 * Entity configuration builder
 */
export class EntityConfigBuilder<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>> {
  private config: Partial<UnifiedEntityConfig<TEntity, TFormData>> = {
    fields: [],
    actions: [],
    endpoints: {
      list: '',
      create: '',
      update: '',
      delete: ''
    }
  }

  constructor(name: string, namePlural: string) {
    this.config.name = name
    this.config.namePlural = namePlural
    this.config.displayName = name
  }

  displayName(displayName: string): this {
    this.config.displayName = displayName
    return this
  }

  description(description: string): this {
    this.config.description = description
    return this
  }

  icon(icon: React.ComponentType<{ className?: string }>): this {
    this.config.icon = icon
    return this
  }

  // Fields
  field(key: string, label: string, type: FieldDataType): FieldBuilder<TEntity, TFormData> {
    const builder = new FieldBuilder<TEntity, TFormData>(key, label, type)
    // Store the builder's build function to be called later
    const originalBuild = builder.build.bind(builder)
    builder.build = () => {
      const field = originalBuild()
      this.config.fields!.push(field)
      return field
    }
    return builder
  }

  addField(field: UnifiedFieldConfig<TEntity, TFormData>): this {
    this.config.fields!.push(field)
    return this
  }

  addFields(...fields: UnifiedFieldConfig<TEntity, TFormData>[]): this {
    this.config.fields!.push(...fields)
    return this
  }

  // Endpoints
  endpoints(endpoints: {
    list: string
    create: string
    update: string
    delete: string
    bulkImport?: string
  }): this {
    this.config.endpoints = endpoints
    return this
  }

  // Actions
  action(id: string, label: string): ActionBuilder<TEntity> {
    const builder = new ActionBuilder<TEntity>(id, label)
    // Store the builder's build function to be called later
    const originalBuild = builder.build.bind(builder)
    builder.build = () => {
      const action = originalBuild()
      this.config.actions!.push(action)
      return action
    }
    return builder
  }

  addAction(action: UnifiedActionConfig<TEntity>): this {
    this.config.actions!.push(action)
    return this
  }

  addActions(...actions: UnifiedActionConfig<TEntity>[]): this {
    this.config.actions!.push(...actions)
    return this
  }

  // Permissions
  permissions(permissions: UnifiedPermissionConfig): this {
    this.config.permissions = permissions
    return this
  }

  // List configuration
  listConfig(config: {
    defaultFields?: string[]
    searchableFields?: string[]
    defaultSort?: { field: string; direction: 'asc' | 'desc' }
    pageSize?: number
    selectable?: boolean
    exportable?: boolean
    filters?: UnifiedFilterConfig[]
  }): this {
    this.config.list = config
    return this
  }

  // Form configuration
  formConfig(config: {
    layout?: 'vertical' | 'horizontal' | 'grid'
    columns?: number
    fieldGroups?: FieldGroup[]
    validateOnChange?: boolean
    validateOnBlur?: boolean
    submitLabel?: string
    cancelLabel?: string
    autoFocus?: boolean
    showProgress?: boolean
  }): this {
    this.config.form = config
    return this
  }

  // View configuration
  viewConfig(config: {
    mode?: 'detail' | 'card' | 'summary'
    fieldGroups?: FieldGroup[]
    showMetadata?: boolean
    showActions?: boolean
    compact?: boolean
  }): this {
    this.config.view = config
    return this
  }

  // Bulk import
  bulkImport(config: {
    enabled: boolean
    templateName?: string
    sampleData?: Record<string, unknown>[]
    formats?: ('csv' | 'xlsx' | 'json')[]
  }): this {
    this.config.bulkImport = config
    return this
  }

  build(): UnifiedEntityConfig<TEntity, TFormData> {
    // Validate required fields
    if (!this.config.name) {
      throw new Error('Entity name is required')
    }
    if (!this.config.namePlural) {
      throw new Error('Entity namePlural is required')
    }
    if (!this.config.endpoints?.list || !this.config.endpoints?.create) {
      throw new Error('Endpoints are required')
    }

    return this.config as UnifiedEntityConfig<TEntity, TFormData>
  }
}

/**
 * Create a new entity configuration builder
 */
export function createEntityConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  namePlural: string
): EntityConfigBuilder<TEntity, TFormData> {
  return new EntityConfigBuilder<TEntity, TFormData>(name, namePlural)
}

/**
 * Create a new field builder
 */
export function createField<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  key: string,
  label: string,
  type: FieldDataType
): FieldBuilder<TEntity, TFormData> {
  return new FieldBuilder<TEntity, TFormData>(key, label, type)
}

/**
 * Create a new action builder
 */
export function createAction<TEntity extends BaseEntity = BaseEntity>(
  id: string,
  label: string
): ActionBuilder<TEntity> {
  return new ActionBuilder<TEntity>(id, label)
}

// Pre-configured field helpers for common use cases

export const commonFields = {
  id: () => createField('id', 'ID', 'string').readOnly().hidden(),
  
  email: (key = 'email', label = 'Email') =>
    createField(key, label, 'email')
      .required()
      .placeholder('Enter email address')
      .validate((value) => {
        if (typeof value !== 'string') return 'Email must be a string'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return true
      }),
  
  name: (key = 'name', label = 'Name') =>
    createField(key, label, 'string')
      .required()
      .minLength(1)
      .maxLength(100)
      .placeholder(`Enter ${label.toLowerCase()}`),
  
  description: (key = 'description', label = 'Description') =>
    createField(key, label, 'text')
      .placeholder(`Enter ${label.toLowerCase()}`)
      .maxLength(500),
  
  status: (key = 'status', label = 'Status', options: Array<{ value: string | number; label: string }>) =>
    createField(key, label, 'select')
      .required()
      .options(options)
      .badge(),
  
  isActive: (key = 'is_active', label = 'Active') =>
    createField(key, label, 'boolean')
      .defaultValue(true),
  
  createdAt: (key = 'created_at', label = 'Created At') =>
    createField(key, label, 'datetime')
      .readOnly()
      .sortable(),
  
  updatedAt: (key = 'updated_at', label = 'Updated At') =>
    createField(key, label, 'datetime')
      .readOnly()
      .sortable()
}

// Pre-configured action helpers for common use cases

export const commonActions = {
  view: <TEntity extends BaseEntity>() =>
    createAction<TEntity>('view', 'View')
      .type('navigation')
      .context('item')
      .variant('outline'),
  
  edit: <TEntity extends BaseEntity>() =>
    createAction<TEntity>('edit', 'Edit')
      .type('navigation')
      .context('item', 'view')
      .variant('default'),
  
  delete: <TEntity extends BaseEntity>() =>
    createAction<TEntity>('delete', 'Delete')
      .type('confirm')
      .context('item', 'view')
      .variant('destructive')
      .danger()
      .confirm({
        title: 'Delete Item',
        content: 'Are you sure you want to delete this item? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger'
      }),
  
  bulkDelete: <TEntity extends BaseEntity>() =>
    createAction<TEntity>('bulkDelete', 'Delete Selected')
      .type('confirm')
      .context('bulk')
      .variant('destructive')
      .danger()
      .confirm({
        title: (entity: TEntity | TEntity[]) => `Delete ${Array.isArray(entity) ? entity.length : 1} Item${Array.isArray(entity) ? 's' : ''}`,
        content: 'Are you sure you want to delete the selected items? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger'
      })
}
