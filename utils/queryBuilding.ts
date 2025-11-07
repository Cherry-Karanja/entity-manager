/**
 * Query Building Utilities for Django REST Framework
 *
 * Provides utilities for building query strings compatible with Django REST Framework,
 * including filtering, sorting, searching, field selection, and related object expansion.
 */

import { EntityListFilter, DjangoLookupOperator } from '../components/entityManager/EntityList/types'

/**
 * Builds a Django-compatible query string from filter parameters
 */
export function buildDjangoQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays (e.g., __in lookups)
        value.forEach(v => searchParams.append(key, String(v)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  return searchParams.toString() ? `?${searchParams.toString()}` : ''
}

/**
 * Builds filter query parameters from EntityListFilter configurations and their values
 */
export function buildFilterQueryParams(
  filters: EntityListFilter[],
  filterValues: Record<string, unknown>
): Record<string, unknown> {
  const params: Record<string, unknown> = {}

  Object.entries(filterValues).forEach(([filterId, value]) => {
    if (value === undefined || value === null || value === '') {
      return // Skip empty values
    }

    const filter = filters.find(f => f.id === filterId)
    if (!filter) {
      // Fallback: use filter ID as field name with exact lookup
      params[filterId] = value
      return
    }

    // Use djangoField override if provided, otherwise use field
    const field = filter.djangoField || filter.field || filterId
    const operator = filter.operator || 'exact'

    // Apply custom transformation if provided
    let processedValue: unknown = value
    if (filter.transform) {
      processedValue = filter.transform(value, operator as DjangoLookupOperator)
    }

    // Handle different operators and value types
    switch (operator) {
      case 'in':
        // For __in lookups, ensure value is an array
        if (Array.isArray(processedValue)) {
          params[`${field}__in`] = processedValue
        } else if (typeof processedValue === 'string' && processedValue.includes(',')) {
          // Handle comma-separated string values
          params[`${field}__in`] = processedValue.split(',').map((v: string) => v.trim())
        } else {
          params[`${field}__in`] = [processedValue]
        }
        break

      case 'range':
        if (Array.isArray(processedValue) && processedValue.length === 2) {
          params[`${field}__range`] = processedValue
        } else if (typeof processedValue === 'string' && processedValue.includes(',')) {
          const [start, end] = processedValue.split(',').map((v: string) => v.trim())
          params[`${field}__range`] = [start, end]
        }
        break

      case 'isnull':
        params[`${field}__isnull`] = processedValue === 'true' || processedValue === true
        break

      default:
        params[`${field}__${operator}`] = processedValue
    }
  })

  return params
}

/**
 * Formats a value for query string based on its type
 */
export function formatValueForQuery(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (typeof value === 'number') {
    return value.toString()
  }

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(v => formatValueForQuery(v)).join(',')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  // Fallback to string conversion
  return String(value)
}

/**
 * Builds field selection parameters for sparse fieldsets
 */
export function buildFieldSelectionParams(fields?: string | string[]): Record<string, unknown> {
  if (!fields) return {}

  const fieldList = Array.isArray(fields) ? fields : fields.split(',').map(f => f.trim())
  return {
    fields: fieldList.join(',')
  }
}

/**
 * Builds related object expansion parameters
 */
export function buildExpansionParams(expand?: string | string[]): Record<string, unknown> {
  if (!expand) return {}

  const expandList = Array.isArray(expand) ? expand : expand.split(',').map(e => e.trim())
  return {
    expand: expandList.join(',')
  }
}

/**
 * Builds complete query parameters including all supported features
 */
export function buildCompleteQueryParams(options: {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  filters?: EntityListFilter[]
  filterValues?: Record<string, unknown>
  fields?: string | string[]
  expand?: string | string[]
  additionalParams?: Record<string, unknown>
}): Record<string, unknown> {
  const params: Record<string, unknown> = {}

  // Pagination
  if (options.page !== undefined) params.page = options.page
  if (options.pageSize !== undefined) params.page_size = options.pageSize

  // Search
  if (options.search) params.search = options.search

  // Sorting
  if (options.sortBy) params.ordering = options.sortBy

  // Filters
  if (options.filters && options.filterValues && Object.keys(options.filterValues).length > 0) {
    Object.assign(params, buildFilterQueryParams(options.filters, options.filterValues))
  }

  // Field selection
  if (options.fields) {
    Object.assign(params, buildFieldSelectionParams(options.fields))
  }

  // Related object expansion
  if (options.expand) {
    Object.assign(params, buildExpansionParams(options.expand))
  }

  // Additional custom parameters
  if (options.additionalParams) {
    Object.assign(params, options.additionalParams)
  }

  return params
}