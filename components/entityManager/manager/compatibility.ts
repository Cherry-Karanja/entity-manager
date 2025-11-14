/**
 * Configuration compatibility utilities
 * 
 * This module provides utilities to detect and convert between legacy EntityConfig
 * and new UnifiedEntityConfig formats, enabling smooth migration.
 * 
 * @module manager/compatibility
 */

import { EntityConfig, BaseEntity } from './types'
import { UnifiedEntityConfig, UnifiedFieldConfig, UnifiedActionConfig } from '../core/types'
import { toListConfig, toFormConfig, toViewConfig } from '../core/adapters'

/**
 * Check if a configuration is using the new unified format
 */
export function isUnifiedConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  config: EntityConfig<TEntity, TFormData> | UnifiedEntityConfig<TEntity, TFormData>
): config is UnifiedEntityConfig<TEntity, TFormData> {
  // Unified configs have the list/form/view properties as objects instead of separate configs
  return !!(config as any).list || !!(config as any).form || !!(config as any).view
}

/**
 * Convert legacy EntityConfig to UnifiedEntityConfig
 * This allows gradual migration - old configs can still work
 */
export function legacyToUnified<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  legacyConfig: EntityConfig<TEntity, TFormData>
): UnifiedEntityConfig<TEntity, TFormData> {
  // Map legacy EntityField to UnifiedFieldConfig
  const fields: UnifiedFieldConfig<TEntity, TFormData>[] = legacyConfig.fields.map(field => ({
    key: field.key,
    label: field.label,
    type: field.type as any,
    renderType: field.fieldType as any,
    required: field.required,
    nullable: field.nullable,
    min: field.min,
    max: field.max,
    minLength: field.minLength,
    maxLength: field.maxLength,
    pattern: field.pattern,
    validation: field.validation,
    validate: field.validationFn,
    description: field.description || field.helperText || field.helpText,
    placeholder: field.placeholder,
    defaultValue: field.defaultValue,
    disabled: field.disabled,
    readOnly: field.readOnly,
    hidden: field.hidden,
    gridSpan: field.gridSpan as any,
    className: field.className,
    icon: field.icon,
    options: field.options,
    searchable: field.searchable,
    multiple: field.multiple,
    maxSelections: field.maxSelections,
    relationship: field.foreignKey ? {
      entity: field.relatedEntity || '',
      displayField: field.displayField || 'name',
      endpoint: field.endpoint,
      valueField: field.relatedField || 'id',
      search: {
        enabled: field.searchable,
        fields: [],
        minLength: 2,
        debounceMs: 300
      }
    } : undefined,
    accept: field.accept,
    maxFileSize: field.maxFileSize,
    maxFiles: field.maxFiles,
    enableDragDrop: field.allowMultiple,
    showPreview: field.showPreview,
    uploadUrl: field.uploadUrl,
    condition: field.condition as any,
    dependsOn: field.dependsOn,
    transformInput: field.transformInput,
    transformOutput: field.transformOutput,
    format: field.format as any,
    parse: field.parse,
    sortable: true, // Default for legacy fields
    filterable: false,
    searchableInList: false,
    copyable: field.copyable,
    sensitive: field.sensitive,
    badge: false,
    renderCell: field.renderCell as any,
    renderForm: field.renderForm as any,
    renderView: field.renderView as any,
    exportable: field.exportable ?? true,
    exportLabel: field.exportLabel,
    exportTransform: field.exportTransform
  }))

  // Map legacy custom actions to unified actions
  const actions: UnifiedActionConfig<TEntity>[] = []
  
  if (legacyConfig.customActions?.item) {
    legacyConfig.customActions.item.forEach(action => {
      actions.push({
        id: action.id,
        label: action.label,
        description: action.description,
        icon: action.icon,
        type: action.actionType === 'confirm' ? 'confirm' : 
              action.actionType === 'form' ? 'form' :
              action.actionType === 'modal' ? 'modal' :
              action.actionType === 'navigation' ? 'navigation' : 'immediate',
        context: ['item'],
        variant: action.danger ? 'destructive' : 'default',
        danger: action.danger,
        disabled: action.disabled,
        hidden: action.hidden,
        permission: action.permission,
        condition: action.condition as any,
        onExecute: action.onExecute as any,
        href: action.href as any,
        target: action.target,
        confirm: action.confirm as any,
        group: action.group,
        priority: action.priority,
        separator: action.separator,
        className: action.className
      })
    })
  }

  if (legacyConfig.customActions?.bulk) {
    legacyConfig.customActions.bulk.forEach(action => {
      actions.push({
        id: action.id,
        label: action.label,
        description: action.description,
        icon: action.icon,
        type: 'confirm',
        context: ['bulk'],
        variant: action.danger ? 'destructive' : 'default',
        danger: action.danger,
        onExecute: action.onExecute as any,
        bulk: action.bulk as any
      })
    })
  }

  // Build unified config
  const unifiedConfig: UnifiedEntityConfig<TEntity, TFormData> = {
    name: legacyConfig.name,
    namePlural: legacyConfig.namePlural,
    displayName: legacyConfig.displayName,
    fields,
    endpoints: {
      list: legacyConfig.endpoints.list,
      create: legacyConfig.endpoints.create,
      update: legacyConfig.endpoints.update,
      delete: legacyConfig.endpoints.delete,
      bulkImport: legacyConfig.endpoints.bulkImport
    },
    permissions: {
      create: legacyConfig.permissions?.create,
      view: legacyConfig.permissions?.view,
      update: legacyConfig.permissions?.update,
      delete: legacyConfig.permissions?.delete,
      export: legacyConfig.permissions?.export
    },
    list: {
      defaultFields: legacyConfig.listConfig.columns.map(col => col.id),
      searchableFields: legacyConfig.listConfig.searchableFields,
      defaultSort: legacyConfig.listConfig.defaultSort,
      pageSize: legacyConfig.listConfig.pageSize,
      selectable: legacyConfig.listConfig.allowBatchActions,
      exportable: legacyConfig.listConfig.allowExport,
      filters: legacyConfig.listConfig.filters as any
    },
    form: {
      layout: legacyConfig.formConfig?.layout as any,
      columns: legacyConfig.formConfig?.columns,
      fieldGroups: legacyConfig.formConfig?.fieldGroups as any,
      submitLabel: legacyConfig.formConfig?.submitLabel,
      cancelLabel: legacyConfig.formConfig?.cancelLabel
    },
    view: {
      mode: 'detail',
      fieldGroups: legacyConfig.viewConfig?.fieldGroups as any,
      showMetadata: legacyConfig.viewConfig?.showMetadata,
      showActions: legacyConfig.viewConfig?.showActions,
      compact: legacyConfig.viewConfig?.compact
    },
    actions,
    bulkImport: legacyConfig.bulkImport
  }

  return unifiedConfig
}

/**
 * Get a config that works with current EntityManager
 * Automatically detects format and converts if needed
 */
export function normalizeConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  config: EntityConfig<TEntity, TFormData> | UnifiedEntityConfig<TEntity, TFormData>
): EntityConfig<TEntity, TFormData> {
  // If it's already a legacy config, return as-is
  if (!isUnifiedConfig(config)) {
    return config as EntityConfig<TEntity, TFormData>
  }

  // Convert unified to legacy format for current orchestrator
  const unifiedConfig = config as UnifiedEntityConfig<TEntity, TFormData>
  
  // Use adapters to convert to legacy formats
  const listConfig = toListConfig(unifiedConfig)
  const formConfig = toFormConfig(unifiedConfig)
  const viewConfig = toViewConfig(unifiedConfig)

  // Build legacy EntityConfig
  const legacyConfig: EntityConfig<TEntity, TFormData> = {
    name: unifiedConfig.name,
    namePlural: unifiedConfig.namePlural,
    displayName: unifiedConfig.displayName,
    fields: unifiedConfig.fields as any, // Fields are compatible
    endpoints: unifiedConfig.endpoints,
    listConfig,
    formConfig: formConfig as any,
    viewConfig,
    permissions: unifiedConfig.permissions,
    customActions: {
      item: unifiedConfig.actions
        ?.filter(a => a.context.includes('item'))
        .map(a => ({
          ...a,
          type: a.variant === 'primary' ? 'primary' as const : 'default' as const,
          actionType: a.type === 'confirm' ? 'confirm' as const :
                      a.type === 'form' ? 'form' as const :
                      a.type === 'modal' ? 'modal' as const :
                      a.type === 'navigation' ? 'navigation' as const : 'immediate' as const
        } as any)),
      bulk: unifiedConfig.actions
        ?.filter(a => a.context.includes('bulk'))
        .map(a => ({
          ...a,
          type: a.variant === 'primary' ? 'primary' as const : 'default' as const
        } as any))
    },
    bulkImport: unifiedConfig.bulkImport
  }

  return legacyConfig
}

/**
 * Validate a unified configuration
 * Returns validation errors or empty array if valid
 */
export function validateUnifiedConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  config: UnifiedEntityConfig<TEntity, TFormData>
): string[] {
  const errors: string[] = []

  // Required fields
  if (!config.name) errors.push('name is required')
  if (!config.namePlural) errors.push('namePlural is required')
  if (!config.displayName) errors.push('displayName is required')
  if (!config.fields || config.fields.length === 0) errors.push('at least one field is required')
  
  // Endpoints validation
  if (!config.endpoints) {
    errors.push('endpoints are required')
  } else {
    if (!config.endpoints.list) errors.push('endpoints.list is required')
    if (!config.endpoints.create) errors.push('endpoints.create is required')
    if (!config.endpoints.update) errors.push('endpoints.update is required')
    if (!config.endpoints.delete) errors.push('endpoints.delete is required')
  }

  // Field validation
  config.fields.forEach((field, index) => {
    if (!field.key) errors.push(`field[${index}].key is required`)
    if (!field.label) errors.push(`field[${index}].label is required`)
    if (!field.type) errors.push(`field[${index}].type is required`)
    
    // Relationship validation
    if (field.relationship) {
      if (!field.relationship.entity) errors.push(`field[${field.key}].relationship.entity is required`)
      if (!field.relationship.displayField) errors.push(`field[${field.key}].relationship.displayField is required`)
    }
  })

  // Action validation
  if (config.actions) {
    config.actions.forEach((action, index) => {
      if (!action.id) errors.push(`action[${index}].id is required`)
      if (!action.label) errors.push(`action[${index}].label is required`)
      if (!action.type) errors.push(`action[${index}].type is required`)
      if (!action.context || action.context.length === 0) {
        errors.push(`action[${action.id}].context is required and must not be empty`)
      }
    })
  }

  return errors
}
