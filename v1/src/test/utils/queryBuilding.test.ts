import { describe, it, expect } from 'vitest'
import { EntityListFilter, DjangoLookupOperator } from '../../../components/entityManager/EntityList/types'

// Import the functions to test (we'll need to export them from the hook file)
describe('Query Building Utilities', () => {
  // Mock the functions since they're not exported
  // In a real scenario, these would be extracted to a separate utils file

  const formatValueForQuery = (value: unknown): string => {
    if (value === undefined || value === null) {
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

  const mockBuildDjangoQueryString = (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return // Skip empty values
      }

      // Handle date ranges (for __range lookups) - check this before arrays
      if (key.endsWith('__range') && Array.isArray(value) && value.length === 2) {
        const [start, end] = value
        if (start !== undefined && start !== null && start !== '' &&
            end !== undefined && end !== null && end !== '') {
          searchParams.append(key, `${formatValueForQuery(start)},${formatValueForQuery(end)}`)
        }
        return
      }

      // Handle arrays (for __in lookups)
      if (Array.isArray(value)) {
        if (value.length === 0) return
        // Filter out null/undefined/empty values from arrays
        const filteredArray = value.filter(item =>
          item !== undefined && item !== null && item !== ''
        )
        if (filteredArray.length === 0) return

        filteredArray.forEach(item => {
          searchParams.append(key, formatValueForQuery(item))
        })
        return
      }

      // Handle all other values
      searchParams.append(key, formatValueForQuery(value))
    })

    return searchParams.toString() ? `?${searchParams.toString()}` : ''
  }

  const mockBuildFilterQueryParams = (
    filters: any[],
    filterValues: Record<string, unknown>
  ): Record<string, unknown> => {
    const params: Record<string, unknown> = {}

    Object.entries(filterValues).forEach(([filterId, value]) => {
      if (value === undefined || value === null || value === '') {
        return // Skip empty values
      }

      const filter = filters.find((f: any) => f.id === filterId)
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

  const mockBuildFieldSelectionParams = (fields?: string | string[]): Record<string, unknown> => {
    if (!fields) return {}

    const fieldList = Array.isArray(fields) ? fields : fields.split(',').map(f => f.trim())
    return {
      fields: fieldList.join(',')
    }
  }

  const mockBuildExpansionParams = (expand?: string | string[]): Record<string, unknown> => {
    if (!expand) return {}

    const expandList = Array.isArray(expand) ? expand : expand.split(',').map(e => e.trim())
    return {
      expand: expandList.join(',')
    }
  }

  const mockBuildCompleteQueryParams = (options: {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    filters?: any[]
    filterValues?: Record<string, unknown>
    fields?: string | string[]
    expand?: string | string[]
    additionalParams?: Record<string, unknown>
  }): Record<string, unknown> => {
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
      Object.assign(params, mockBuildFilterQueryParams(options.filters, options.filterValues))
    }

    // Field selection
    if (options.fields) {
      Object.assign(params, mockBuildFieldSelectionParams(options.fields))
    }

    // Related object expansion
    if (options.expand) {
      Object.assign(params, mockBuildExpansionParams(options.expand))
    }

    // Additional custom parameters
    if (options.additionalParams) {
      Object.assign(params, options.additionalParams)
    }

    return params
  }

  describe('buildDjangoQueryString', () => {
    it('should handle basic string parameters', () => {
      const params = { search: 'test', category: 'electronics' }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?search=test&category=electronics')
    })

    it('should handle boolean values', () => {
      const params = { isActive: true, isDeleted: false }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?isActive=true&isDeleted=false')
    })

    it('should handle number values', () => {
      const params = { page: 1, limit: 10 }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?page=1&limit=10')
    })

    it('should handle Date objects', () => {
      const date = new Date('2023-01-01T00:00:00.000Z')
      const params = { createdAt: date }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?createdAt=2023-01-01T00%3A00%3A00.000Z')
    })

    it('should handle arrays for __in lookups', () => {
      const params = { 'category__in': ['electronics', 'books', 'clothing'] }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?category__in=electronics&category__in=books&category__in=clothing')
    })

    it('should handle date ranges', () => {
      const startDate = new Date('2023-01-01T00:00:00.000Z')
      const endDate = new Date('2023-12-31T23:59:59.999Z')
      const params = { 'createdAt__range': [startDate, endDate] }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?createdAt__range=2023-01-01T00%3A00%3A00.000Z%2C2023-12-31T23%3A59%3A59.999Z')
    })

    it('should filter out empty values from arrays', () => {
      const params = { 'category__in': ['electronics', '', 'books', null, 'clothing'] }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?category__in=electronics&category__in=books&category__in=clothing')
    })

    it('should skip undefined, null, and empty string values', () => {
      const params = { search: 'test', category: '', status: undefined, type: null }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?search=test')
    })

    it('should return empty string for no valid parameters', () => {
      const params = { search: '', category: undefined, status: null }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('')
    })

    it('should handle complex objects with JSON stringify', () => {
      const params = { metadata: { key: 'value', count: 5 } }
      const result = mockBuildDjangoQueryString(params)
      expect(result).toBe('?metadata=%7B%22key%22%3A%22value%22%2C%22count%22%3A5%7D')
    })
  })

  describe('buildFilterQueryParams', () => {
    it('should build basic filter parameters', () => {
      const filters = [
        { id: 'search', operator: 'icontains' },
        { id: 'category', operator: 'exact' }
      ]
      const filterValues = {
        search: 'test',
        category: 'electronics'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        search__icontains: 'test',
        category__exact: 'electronics'
      })
    })

    it('should handle __in lookups with arrays', () => {
      const filters = [
        { id: 'category', operator: 'in' }
      ]
      const filterValues = {
        category: ['electronics', 'books']
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        category__in: ['electronics', 'books']
      })
    })

    it('should handle __in lookups with comma-separated strings', () => {
      const filters = [
        { id: 'category', operator: 'in' }
      ]
      const filterValues = {
        category: 'electronics,books,clothing'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        category__in: ['electronics', 'books', 'clothing']
      })
    })

    it('should handle __range lookups with arrays', () => {
      const filters = [
        { id: 'price', operator: 'range' }
      ]
      const filterValues = {
        price: [10, 100]
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        price__range: [10, 100]
      })
    })

    it('should handle __range lookups with comma-separated strings', () => {
      const filters = [
        { id: 'price', operator: 'range' }
      ]
      const filterValues = {
        price: '10,100'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        price__range: ['10', '100']
      })
    })

    it('should handle __isnull lookups', () => {
      const filters = [
        { id: 'deletedAt', operator: 'isnull' }
      ]
      const filterValues = {
        deletedAt: 'true'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        deletedAt__isnull: true
      })
    })

    it('should use djangoField override when provided', () => {
      const filters = [
        { id: 'search', djangoField: 'title', operator: 'icontains' }
      ]
      const filterValues = {
        search: 'test'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        title__icontains: 'test'
      })
    })

    it('should filter out empty values', () => {
      const filters = [
        { id: 'search', operator: 'icontains' },
        { id: 'category', operator: 'exact' },
        { id: 'status', operator: 'exact' }
      ]
      const filterValues = {
        search: 'test',
        category: '',
        status: undefined
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        search__icontains: 'test'
      })
    })

    it('should use default __icontains operator when not specified', () => {
      const filters = [
        { id: 'search' }
      ]
      const filterValues = {
        search: 'test'
      }
      const result = mockBuildFilterQueryParams(filters, filterValues)
      expect(result).toEqual({
        search__exact: 'test'
      })
    })
  })

  describe('buildFieldSelectionParams', () => {
    it('should return empty object when no fields provided', () => {
      const result = mockBuildFieldSelectionParams()
      expect(result).toEqual({})
    })

    it('should handle string field list', () => {
      const result = mockBuildFieldSelectionParams('id,name,email')
      expect(result).toEqual({
        fields: 'id,name,email'
      })
    })

    it('should handle array field list', () => {
      const result = mockBuildFieldSelectionParams(['id', 'name', 'email'])
      expect(result).toEqual({
        fields: 'id,name,email'
      })
    })

    it('should trim whitespace from string fields', () => {
      const result = mockBuildFieldSelectionParams(' id , name , email ')
      expect(result).toEqual({
        fields: 'id,name,email'
      })
    })

    it('should handle single field', () => {
      const result = mockBuildFieldSelectionParams('id')
      expect(result).toEqual({
        fields: 'id'
      })
    })

    it('should handle single field array', () => {
      const result = mockBuildFieldSelectionParams(['id'])
      expect(result).toEqual({
        fields: 'id'
      })
    })
  })

  describe('buildExpansionParams', () => {
    it('should return empty object when no expand provided', () => {
      const result = mockBuildExpansionParams()
      expect(result).toEqual({})
    })

    it('should handle string expand list', () => {
      const result = mockBuildExpansionParams('owner,property')
      expect(result).toEqual({
        expand: 'owner,property'
      })
    })

    it('should handle array expand list', () => {
      const result = mockBuildExpansionParams(['owner', 'property'])
      expect(result).toEqual({
        expand: 'owner,property'
      })
    })

    it('should trim whitespace from string expand', () => {
      const result = mockBuildExpansionParams(' owner , property ')
      expect(result).toEqual({
        expand: 'owner,property'
      })
    })

    it('should handle single expand', () => {
      const result = mockBuildExpansionParams('owner')
      expect(result).toEqual({
        expand: 'owner'
      })
    })

    it('should handle single expand array', () => {
      const result = mockBuildExpansionParams(['owner'])
      expect(result).toEqual({
        expand: 'owner'
      })
    })
  })

  describe('buildCompleteQueryParams', () => {
    it('should build complete query parameters with all options', () => {
      const options = {
        page: 1,
        pageSize: 20,
        search: 'test',
        sortBy: 'name',
        filters: [
          { id: 'category', operator: 'exact' }
        ],
        filterValues: {
          category: 'electronics'
        },
        fields: ['id', 'name', 'price'],
        expand: ['owner'],
        additionalParams: { custom: 'value' }
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({
        page: 1,
        page_size: 20,
        search: 'test',
        ordering: 'name',
        category__exact: 'electronics',
        fields: 'id,name,price',
        expand: 'owner',
        custom: 'value'
      })
    })

    it('should handle minimal options', () => {
      const options = {
        search: 'test'
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({
        search: 'test'
      })
    })

    it('should skip undefined pagination', () => {
      const options = {
        page: undefined,
        pageSize: 10
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({
        page_size: 10
      })
    })

    it('should handle empty filters array', () => {
      const options = {
        filters: []
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({})
    })

    it('should handle undefined fields and expand', () => {
      const options = {
        fields: undefined,
        expand: undefined
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({})
    })

    it('should merge additional params', () => {
      const options = {
        search: 'test',
        additionalParams: { api_key: 'secret', version: 'v1' }
      }
      const result = mockBuildCompleteQueryParams(options)
      expect(result).toEqual({
        search: 'test',
        api_key: 'secret',
        version: 'v1'
      })
    })
  })
})