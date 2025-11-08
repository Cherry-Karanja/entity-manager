/**
 * Nested Resource URL Building Utilities
 *
 * Provides utilities for building URLs for nested REST API resources.
 * Supports patterns like /api/properties/{id}/tenants/ and /api/users/{id}/permissions/
 */

import { EntityConfig } from '../components/entityManager/manager/types'

/**
 * Context for nested resource operations
 */
export interface NestedResourceContext {
  /** Parent entity type (e.g., 'property', 'user') */
  parentEntity: string
  /** Parent entity ID */
  parentId: string | number
  /** Relationship name (e.g., 'tenants', 'units') */
  relationship?: string
  /** Optional nested path segments */
  nestedPath?: string[]
}

/**
 * Builds a nested resource URL by replacing placeholders in the pattern
 */
export function buildNestedUrl(
  pattern: string,
  context: NestedResourceContext,
  entityId?: string | number
): string {
  let url = pattern

  // Replace parent entity placeholder
  url = url.replace('{parentEntity}', context.parentEntity)

  // Replace parent ID placeholder
  url = url.replace('{parentId}', String(context.parentId))

  // Replace entity ID placeholder if provided
  if (entityId !== undefined) {
    url = url.replace('{id}', String(entityId))
  }

  // Add nested path segments if provided
  if (context.nestedPath && context.nestedPath.length > 0) {
    const nestedPathStr = context.nestedPath.join('/')
    url = url.replace(/\/$/, '') + '/' + nestedPathStr + '/'
  }

  return url
}

/**
 * Determines if an entity configuration supports nested resources
 */
export function supportsNestedResources<TEntity>(
  config: EntityConfig<TEntity>
): boolean {
  return !!config.endpoints.nested
}

/**
 * Gets the appropriate endpoint URL based on context (nested vs top-level)
 */
export function getEndpointUrl<TEntity>(
  config: EntityConfig<TEntity>,
  operation: 'list' | 'create' | 'update' | 'delete',
  context?: NestedResourceContext,
  entityId?: string | number
): string {
  // If nested context is provided and entity supports nested resources
  if (context && supportsNestedResources(config) && config.endpoints.nested && context.relationship) {
    const nestedConfig = config.endpoints.nested[context.relationship]
    if (nestedConfig) {
      return buildNestedUrl(nestedConfig.endpoint, context, entityId)
    }
  }

  // Use top-level endpoints
  return config.endpoints[operation]
}

/**
 * Builds a complete nested resource path for navigation
 */
export function buildNestedResourcePath(
  parentEntity: string,
  parentId: string | number,
  childEntity: string,
  childId?: string | number,
  action?: string
): string {
  let path = `/${parentEntity}/${parentId}/${childEntity}`

  if (childId) {
    path += `/${childId}`
  }

  if (action) {
    path += `/${action}`
  }

  return path
}

/**
 * Extracts nested resource context from a URL path
 */
export function parseNestedResourcePath(path: string): NestedResourceContext | null {
  // Match patterns like /properties/123/tenants/ or /users/456/permissions/789
  const nestedPattern = /^\/([^\/]+)\/([^\/]+)\/([^\/]+)\/?([^\/]+)?\/?([^\/]+)?/

  const match = path.match(nestedPattern)
  if (!match) {
    return null
  }

  const [, parentEntity, parentId, childEntity, childId, action] = match

  return {
    parentEntity,
    parentId,
    nestedPath: childId ? [childEntity, childId, ...(action ? [action] : [])] : [childEntity, ...(action ? [action] : [])]
  }
}

/**
 * Validates that a nested resource configuration is properly set up
 */
export function validateNestedResourceConfig<TEntity>(
  config: EntityConfig<TEntity>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.endpoints.nested) {
    return { isValid: true, errors: [] } // Not using nested resources, so valid
  }

  const nested = config.endpoints.nested

  if (!nested.parentEntity) {
    errors.push('parentEntity is required for nested resource configuration')
  }

  if (!nested.parentIdField) {
    errors.push('parentIdField is required for nested resource configuration')
  }

  if (!nested.patterns) {
    errors.push('patterns are required for nested resource configuration')
  } else {
    const requiredPatterns = ['list', 'create', 'update', 'delete']
    for (const pattern of requiredPatterns) {
      if (!nested.patterns[pattern as keyof typeof nested.patterns]) {
        errors.push(`patterns.${pattern} is required for nested resource configuration`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Creates a nested resource context from parent entity data
 */
export function createNestedContext<TEntity extends Record<string, unknown>>(
  parentEntity: TEntity,
  parentEntityType: string,
  parentIdField: keyof TEntity = 'id' as keyof TEntity
): NestedResourceContext {
  const parentId = parentEntity[parentIdField]

  if (parentId === undefined || parentId === null) {
    throw new Error(`Parent entity ${parentEntityType} does not have a valid ${String(parentIdField)} field`)
  }

  return {
    parentEntity: parentEntityType,
    parentId: String(parentId)
  }
}