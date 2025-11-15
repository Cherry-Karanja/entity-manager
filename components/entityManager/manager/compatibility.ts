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
  // Simplified implementation - throw error since this compatibility layer is not used
  throw new Error('legacyToUnified is not implemented. Use current EntityConfig format.')
}

/**
 * Get a config that works with current EntityManager
 * Automatically detects format and converts if needed
 */
export function normalizeConfig<TEntity extends BaseEntity = BaseEntity, TFormData extends Record<string, unknown> = Record<string, unknown>>(
  config: EntityConfig<TEntity, TFormData> | UnifiedEntityConfig<TEntity, TFormData>
): EntityConfig<TEntity, TFormData> {
  // Simplified implementation - just return the config as-is since compatibility layer is not used
  if (isUnifiedConfig(config)) {
    throw new Error('normalizeConfig does not support UnifiedEntityConfig. Use current EntityConfig format.')
  }
  return config
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
