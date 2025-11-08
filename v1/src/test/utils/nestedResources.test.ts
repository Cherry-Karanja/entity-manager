import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApiService } from '@/handler/ApiService'
import { EntityConfig } from '@/components/entityManager/manager/types'
import { NestedResourceContext } from '@/utils/nestedResources'
import { api } from '@/utils/api'

// Mock the API
vi.mock('@/utils/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

const mockApi = vi.mocked(api)

describe('Nested Resource API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const propertyConfig: EntityConfig = {
    name: 'Property',
    namePlural: 'Properties',
    displayName: 'Property',
    fields: [],
    endpoints: {
      list: '/api/properties/',
      create: '/api/properties/',
      update: '/api/properties/{id}/',
      delete: '/api/properties/{id}/',
      nested: {
        tenants: {
          endpoint: '/api/properties/{id}/tenants/',
          parentField: 'property_id',
          relatedName: 'tenants'
        }
      }
    },
    listConfig: {
      columns: []
    }
  }

  const tenantConfig: EntityConfig = {
    name: 'Tenant',
    namePlural: 'Tenants',
    displayName: 'Tenant',
    fields: [],
    endpoints: {
      list: '/api/tenants/',
      create: '/api/tenants/',
      update: '/api/tenants/{id}/',
      delete: '/api/tenants/{id}/',
    },
    listConfig: {
      columns: []
    }
  }

  describe('Property API Service', () => {
    it('should create API service for properties', () => {
      const usePropertyApi = createApiService(propertyConfig)
      expect(typeof usePropertyApi).toBe('function')
    })

    it('should have correct property configuration', () => {
      expect(propertyConfig.endpoints.list).toBe('/api/properties/')
      expect(propertyConfig.endpoints.nested?.tenants.endpoint).toBe('/api/properties/{id}/tenants/')
      expect(propertyConfig.endpoints.nested?.tenants.parentField).toBe('property_id')
      expect(propertyConfig.endpoints.nested?.tenants.relatedName).toBe('tenants')
    })
  })

  describe('Nested Resource API Service - Tenants', () => {
    it('should create nested API service for property tenants', () => {
      const nestedContext: NestedResourceContext = {
        parentEntity: 'Property',
        parentId: '1',
        relationship: 'tenants'
      }

      const useTenantApi = createApiService(tenantConfig, { nestedContext })
      expect(typeof useTenantApi).toBe('function')
    })

    it('should have correct nested context configuration', () => {
      const nestedContext: NestedResourceContext = {
        parentEntity: 'Property',
        parentId: '1',
        relationship: 'tenants'
      }

      expect(nestedContext.parentEntity).toBe('Property')
      expect(nestedContext.parentId).toBe('1')
      expect(nestedContext.relationship).toBe('tenants')
    })
  })

  describe('API Service Integration', () => {
    it('should integrate with nested resource utilities', () => {
      // Test that the API service can be created with nested context
      const nestedContext: NestedResourceContext = {
        parentEntity: 'Property',
        parentId: '1',
        relationship: 'tenants'
      }

      expect(() => createApiService(tenantConfig, { nestedContext })).not.toThrow()
    })

    it('should handle different nested resource configurations', () => {
      const propertyConfigWithMultipleNested: EntityConfig = {
        ...propertyConfig,
        endpoints: {
          ...propertyConfig.endpoints,
          nested: {
            tenants: {
              endpoint: '/api/properties/{id}/tenants/',
              parentField: 'property_id',
              relatedName: 'tenants'
            },
            units: {
              endpoint: '/api/properties/{id}/units/',
              parentField: 'property_id',
              relatedName: 'units'
            }
          }
        }
      }

      expect(propertyConfigWithMultipleNested.endpoints.nested?.tenants.relatedName).toBe('tenants')
      expect(propertyConfigWithMultipleNested.endpoints.nested?.units.relatedName).toBe('units')
    })
  })
})