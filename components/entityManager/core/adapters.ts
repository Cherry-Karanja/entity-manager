/**
 * Configuration Adapters
 * 
 * This module provides adapter functions to convert the unified configuration
 * to the formats expected by existing components (EntityList, EntityForm, EntityView).
 * This ensures backward compatibility while allowing for the new unified approach.
 * 
 * @module core/adapters
 */

import {
  UnifiedEntityConfig,
  UnifiedFieldConfig,
  UnifiedActionConfig,
  UnifiedFilterConfig,
  BaseEntity,
  FieldGroup
} from './types'
import { EntityListColumn, EntityListFilter, EntityListAction } from '../EntityList/types'
import { FormField, EntityFormConfig } from '../EntityForm/types'
import { EntityViewConfig, ViewField, ViewFieldGroup } from '../EntityView/types'
import { EntityAction } from '../EntityActions/types'

/**
 * Convert unified field to EntityListColumn
 */
export function fieldToListColumn<TEntity extends BaseEntity>(
  field: UnifiedFieldConfig<TEntity>,
  entity?: TEntity
): EntityListColumn {
  return {
    id: field.key,
    header: field.label,
    accessorKey: field.key,
    cell: field.renderCell
      ? (value: unknown, item: any, index: number) => field.renderCell!(value, item, index)
      : undefined,
    sortable: field.sortable ?? true,
    filterable: field.filterable ?? false,
    searchable: field.searchableInList ?? false,
    width: field.width,
    minWidth: field.minWidth,
    maxWidth: field.maxWidth,
    align: field.align,
    className: field.className,
    hidden: field.hidden,
    priority: field.priority,
    helpText: field.description
  }
}

/**
 * Convert unified field to FormField
 */
export function fieldToFormField<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>(
  field: UnifiedFieldConfig<TEntity, TFormData>
): FormField {
  // Map unified type to form type
  let formType: FormField['type'] = 'text'
  
  switch (field.type) {
    case 'string':
    case 'text':
      formType = field.renderType === 'textarea' ? 'textarea' : 'text'
      break
    case 'email':
      formType = 'email'
      break
    case 'password':
      formType = 'password'
      break
    case 'number':
      formType = 'number'
      break
    case 'boolean':
      formType = field.renderType === 'switch' ? 'switch' : 'checkbox'
      break
    case 'date':
      formType = 'date'
      break
    case 'datetime':
      formType = 'datetime'
      break
    case 'time':
      formType = 'time'
      break
    case 'select':
      formType = field.multiple ? 'multiselect' : 'select'
      break
    case 'multiselect':
      formType = 'multiselect'
      break
    case 'file':
    case 'image':
    case 'video':
      formType = 'file'
      break
    case 'url':
      formType = 'url'
      break
    case 'richtext':
      formType = 'custom'
      break
    case 'json':
      formType = 'json'
      break
    default:
      formType = field.renderType as FormField['type'] || 'text'
  }

  return {
    name: field.key,
    label: field.label,
    type: formType,
    required: field.required,
    disabled: field.disabled,
    hidden: field.hidden,
    placeholder: field.placeholder,
    description: field.description,
    helpText: field.description,
    options: field.options,
    multiple: field.multiple,
    min: field.min,
    max: field.max,
    minLength: field.minLength,
    maxLength: field.maxLength,
    pattern: field.pattern?.source,
    validation: field.validation,
    className: field.className,
    icon: field.icon,
    dependsOn: field.dependsOn,
    condition: field.condition as any,
    transform: field.transformInput,
    format: field.format as any,
    parse: field.parse,
    render: field.renderForm as any,
    foreignKey: !!field.relationship,
    relatedEntity: field.relationship?.entity,
    endpoint: field.relationship?.endpoint,
    relatedField: field.relationship?.valueField || 'id',
    displayField: field.relationship?.displayField,
    relationshipType: field.relationship ? 'many-to-one' as const : undefined,
    searchable: field.relationship?.search?.enabled ?? field.searchable,
    enableDragDrop: field.enableDragDrop,
    showPreview: field.showPreview,
    maxSize: field.maxFileSize,
  }
}

/**
 * Convert unified field to ViewField
 */
export function fieldToViewField<TEntity extends BaseEntity>(
  field: UnifiedFieldConfig<TEntity>,
  entity?: TEntity
): ViewField {
  // Map unified type to view display type
  let viewType: ViewField['type'] = 'text'
  
  switch (field.type) {
    case 'string':
    case 'text':
      viewType = 'text'
      break
    case 'number':
      viewType = 'number'
      break
    case 'email':
      viewType = 'email'
      break
    case 'url':
      viewType = 'url'
      break
    case 'boolean':
      viewType = 'boolean'
      break
    case 'date':
      viewType = 'date'
      break
    case 'datetime':
      viewType = 'datetime'
      break
    case 'image':
      viewType = 'image'
      break
    case 'json':
      viewType = 'json'
      break
    default:
      viewType = 'text'
  }

  return {
    key: field.key,
    label: field.label,
    type: viewType,
    value: entity?.[field.key as keyof TEntity],
    format: field.format as any,
    condition: field.condition as any,
    hidden: field.hidden,
    align: field.align,
    icon: field.icon,
    badge: field.badge,
    copyable: field.copyable,
    link: field.link,
    render: field.renderView as any
  }
}

/**
 * Convert unified action to EntityListAction
 */
export function actionToListAction<TEntity extends BaseEntity>(
  action: UnifiedActionConfig<TEntity>
): EntityListAction {
  return {
    id: action.id,
    label: action.label,
    icon: action.icon,
    type: action.variant === 'primary' ? 'primary' : 'default',
    danger: action.danger || action.variant === 'destructive',
    disabled: action.disabled,
    hidden: action.hidden,
    permission: action.permission,
    condition: action.condition as any,
    onClick: action.onExecute as any,
    href: action.href as any,
    target: action.target,
    confirm: action.confirm ? {
      title: typeof action.confirm.title === 'function' ? (action.confirm.title as any)({}) : action.confirm.title,
      content: typeof action.confirm.content === 'function' ? (action.confirm.content as any)({}) : action.confirm.content,
      okText: action.confirm.okText,
      cancelText: action.confirm.cancelText,
      okType: action.confirm.okType
    } : undefined,
    group: action.group,
    priority: action.priority,
    separator: action.separator,
    variant: action.variant,
    className: action.className
  }
}

/**
 * Convert unified action to EntityAction
 */
export function actionToEntityAction<TEntity extends BaseEntity>(
  action: UnifiedActionConfig<TEntity>
): EntityAction {
  let actionType: EntityAction['actionType'] = 'immediate'
  
  switch (action.type) {
    case 'immediate':
      actionType = 'immediate'
      break
    case 'confirm':
      actionType = 'confirm'
      break
    case 'form':
      actionType = 'form'
      break
    case 'modal':
      actionType = 'modal'
      break
    case 'drawer':
      actionType = 'drawer'
      break
    case 'navigation':
      actionType = 'navigation'
      break
  }

  return {
    id: action.id,
    label: action.label,
    description: action.description,
    icon: action.icon,
    type: action.variant === 'primary' ? 'primary' : 'default',
    size: action.size === 'sm' ? 'small' : action.size === 'lg' ? 'large' : 'middle',
    danger: action.danger || action.variant === 'destructive',
    disabled: action.disabled,
    hidden: action.hidden,
    permission: action.permission,
    condition: action.condition as any,
    visible: action.condition as any,
    actionType,
    onExecute: action.onExecute as any,
    href: action.href as any,
    target: action.target,
    router: 'next',
    confirm: action.confirm ? {
      title: action.confirm.title as any,
      content: action.confirm.content as any,
      okText: action.confirm.okText,
      cancelText: action.confirm.cancelText,
      okType: action.confirm.okType
    } : undefined,
    form: action.form ? {
      title: action.form.title as any,
      fields: [] as any, // Would need to convert fields
      initialValues: action.form.initialValues as any,
      onSubmit: action.form.onSubmit as any
    } : undefined,
    modal: action.modal ? {
      title: action.modal.title as any,
      content: action.modal.content as any,
      width: action.modal.width
    } : undefined,
    drawer: action.drawer ? {
      title: action.drawer.title as any,
      content: action.drawer.content as any,
      width: action.drawer.width,
      placement: action.drawer.placement
    } : undefined,
    bulk: action.bulk ? {
      minItems: action.bulk.minItems,
      maxItems: action.bulk.maxItems,
      batchSize: action.bulk.batchSize,
      parallel: action.bulk.parallel
    } : undefined,
    shortcut: action.shortcut,
    group: action.group,
    priority: action.priority,
    separator: action.separator,
    className: action.className
  }
}

/**
 * Convert unified filter to EntityListFilter
 */
export function filterToListFilter(filter: UnifiedFilterConfig): EntityListFilter {
  return {
    id: filter.id,
    label: filter.label,
    type: filter.type,
    field: filter.field,
    operator: filter.operator as any,
    operators: filter.operators as any,
    options: filter.options,
    placeholder: filter.placeholder,
    min: filter.min,
    max: filter.max,
    step: filter.step,
    defaultValue: filter.defaultValue,
    validation: filter.validate,
    transform: filter.transform as any,
    helpText: filter.helpText as any,
    icon: filter.icon,
    required: filter.required,
    className: filter.className
  }
}

/**
 * Convert unified config to EntityListConfig
 */
export function toListConfig<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>(
  config: UnifiedEntityConfig<TEntity, TFormData>
): {
  columns: EntityListColumn[]
  searchableFields?: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  pageSize?: number
  allowBatchActions?: boolean
  allowExport?: boolean
  filters?: EntityListFilter[]
} {
  const listFields = config.list?.defaultFields
    ? config.fields.filter(f => config.list!.defaultFields!.includes(f.key))
    : config.fields.filter(f => !f.hidden)

  return {
    columns: listFields.map(f => fieldToListColumn(f)),
    searchableFields: config.list?.searchableFields || config.fields.filter(f => f.searchableInList).map(f => f.key),
    defaultSort: config.list?.defaultSort,
    pageSize: config.list?.pageSize || 10,
    allowBatchActions: config.list?.selectable ?? false,
    allowExport: config.list?.exportable ?? false,
    filters: config.list?.filters?.map(filterToListFilter)
  }
}

/**
 * Convert unified config to EntityFormConfig
 */
export function toFormConfig<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>(
  config: UnifiedEntityConfig<TEntity, TFormData>,
  mode: 'create' | 'edit' = 'create'
): EntityFormConfig {
  const formFields = config.fields.filter(f => !f.hidden && !f.readOnly)

  return {
    fields: formFields.map(f => fieldToFormField(f)),
    mode,
    layout: config.form?.layout === 'grid' ? 'grid' : config.form?.layout === 'horizontal' ? 'horizontal' : 'vertical',
    columns: config.form?.columns || 1,
    validateOnChange: config.form?.validateOnChange ?? true,
    validateOnBlur: config.form?.validateOnBlur ?? true,
    submitButtonText: config.form?.submitLabel,
    cancelButtonText: config.form?.cancelLabel,
    autoFocus: config.form?.autoFocus ?? true,
    showProgress: config.form?.showProgress ?? true,
    showValidationErrors: true,
    permissions: config.permissions as any
  }
}

/**
 * Convert unified config to EntityViewConfig
 */
export function toViewConfig<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>(
  config: UnifiedEntityConfig<TEntity, TFormData>,
  entity?: TEntity
): EntityViewConfig {
  // Create field groups
  let fieldGroups: ViewFieldGroup[] = []
  
  if (config.view?.fieldGroups) {
    fieldGroups = config.view.fieldGroups.map(group => ({
      id: group.id,
      title: group.title,
      description: group.description,
      fields: group.fields
        .map(fieldKey => config.fields.find(f => f.key === fieldKey))
        .filter((f): f is UnifiedFieldConfig<TEntity, TFormData> => f !== undefined)
        .map(f => fieldToViewField(f, entity)),
      collapsed: group.collapsed,
      collapsible: group.collapsible,
      layout: group.layout,
      columns: group.columns,
      className: group.className
    }))
  } else {
    // Default: single group with all non-hidden fields
    fieldGroups = [{
      id: 'default',
      title: 'Details',
      fields: config.fields
        .filter(f => !f.hidden)
        .map(f => fieldToViewField(f, entity)),
      layout: 'vertical',
      collapsible: false
    }]
  }

  return {
    mode: config.view?.mode || 'detail',
    layout: 'single',
    fieldGroups,
    showHeader: true,
    showActions: config.view?.showActions ?? true,
    showMetadata: config.view?.showMetadata ?? true,
    compact: config.view?.compact,
    permissions: config.permissions as any,
    className: config.className
  }
}

/**
 * Convert field groups from unified to form field groups
 */
export function convertFieldGroups(
  fieldGroups: FieldGroup[],
  allFields: UnifiedFieldConfig[]
): FieldGroup[] {
  return fieldGroups.map(group => ({
    ...group,
    fields: group.fields.filter(fieldKey => 
      allFields.some(f => f.key === fieldKey)
    )
  }))
}

/**
 * Get fields for a specific context (list, form, or view)
 */
export function getFieldsForContext<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>(
  config: UnifiedEntityConfig<TEntity, TFormData>,
  context: 'list' | 'form' | 'view'
): UnifiedFieldConfig<TEntity, TFormData>[] {
  switch (context) {
    case 'list':
      if (config.list?.defaultFields) {
        return config.fields.filter(f => config.list!.defaultFields!.includes(f.key))
      }
      return config.fields.filter(f => !f.hidden)
      
    case 'form':
      return config.fields.filter(f => !f.hidden && !f.readOnly)
      
    case 'view':
      return config.fields.filter(f => !f.hidden)
      
    default:
      return config.fields
  }
}

/**
 * Get actions for a specific context
 */
export function getActionsForContext<TEntity extends BaseEntity>(
  config: UnifiedEntityConfig<TEntity>,
  context: 'item' | 'bulk' | 'toolbar' | 'view'
): UnifiedActionConfig<TEntity>[] {
  if (!config.actions) return []
  
  return config.actions.filter(action => 
    action.context.includes(context)
  )
}
