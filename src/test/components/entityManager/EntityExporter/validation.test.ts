import { describe, it, expect } from 'vitest'
import {
  validateExportData,
  validateCSVExport,
  validateJSONExport,
  validateFieldMappings,
  validateExportSize,
  validateExportOperation,
} from '../../../../../components/entityManager/EntityExporter/validation'

describe('EntityExporter Validation', () => {
  describe('validateExportData', () => {
    it('should pass validation for valid data', () => {
      const validData = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ]

      const result = validateExportData(validData)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it('should fail validation for empty data', () => {
      const result = validateExportData([])
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors?.[0].message).toContain('cannot be empty')
    })

    it('should fail validation for non-array data', () => {
      const result = validateExportData('not an array' as any)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors?.[0].message).toContain('must be an array')
    })

    it('should fail validation for inconsistent object structure', () => {
      const invalidData = [
        { id: 1, name: 'John' },
        { id: 2, email: 'jane@example.com' }, // missing name, has email
      ]

      const result = validateExportData(invalidData)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('validateCSVExport', () => {
    it('should pass validation for valid CSV data', () => {
      const validData = [
        { name: 'John', age: '25' },
        { name: 'Jane', age: '30' },
      ]

      const result = validateCSVExport(validData)
      expect(result.success).toBe(true)
    })

    it('should fail validation for data with delimiter conflicts', () => {
      const invalidData = [
        { name: 'John, Doe', age: '25' },
      ]

      const result = validateCSVExport(invalidData, ',')
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors?.[0].message).toContain('delimiter')
    })

    it('should fail validation for data with quotes', () => {
      const invalidData = [
        { name: 'John "The Great"', age: '25' },
      ]

      const result = validateCSVExport(invalidData)
      expect(result.success).toBe(false)
      expect(result.errors?.[0].message).toContain('quotes')
    })
  })

  describe('validateJSONExport', () => {
    it('should pass validation for valid JSON data', () => {
      const validData = [
        { id: 1, name: 'John', nested: { value: 'test' } },
        { id: 2, name: 'Jane', nested: { value: 'test2' } },
      ]

      const result = validateJSONExport(validData)
      expect(result.success).toBe(true)
    })

    it('should fail validation for circular references', () => {
      const circularObj: any = { id: 1 }
      circularObj.self = circularObj

      const invalidData = [circularObj]

      const result = validateJSONExport(invalidData)
      expect(result.success).toBe(false)
      expect(result.errors?.[0].message).toContain('JSON serialization failed')
    })
  })

  describe('validateFieldMappings', () => {
    const testData = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' },
    ]

    it('should pass validation when no fields are specified', () => {
      const result = validateFieldMappings(testData)
      expect(result.success).toBe(true)
    })

    it('should pass validation for valid field mappings', () => {
      const fields = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]

      const result = validateFieldMappings(testData, fields)
      expect(result.success).toBe(true)
    })

    it('should fail validation for invalid field mappings', () => {
      const fields = [
        { key: 'id', label: 'ID' },
        { key: 'invalidField', label: 'Invalid' },
      ]

      const result = validateFieldMappings(testData, fields)
      expect(result.success).toBe(false)
      expect(result.errors?.[0].message).toContain('not found in data')
    })
  })

  describe('validateExportSize', () => {
    it('should pass validation for small datasets', () => {
      const smallData = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `User ${i}` }))

      const result = validateExportSize(smallData, 'csv')
      expect(result.success).toBe(true)
    })

    it('should fail validation for datasets exceeding record limit', () => {
      const largeData = Array.from({ length: 200000 }, (_, i) => ({ id: i, name: `User ${i}` }))

      const result = validateExportSize(largeData, 'csv')
      expect(result.success).toBe(false)
      expect(result.errors?.[0].message).toContain('record limit')
    })
  })

  describe('validateExportOperation', () => {
    const validConfig = {
      formats: [
        { type: 'csv', label: 'CSV', extension: 'csv', mimeType: 'text/csv' },
      ],
      defaultFormat: 'csv' as const,
    }

    const validData = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]

    it('should pass validation for valid export operation', () => {
      const result = validateExportOperation(validConfig, validData, 'csv')
      expect(result.success).toBe(true)
    })

    it('should fail validation for invalid config', () => {
      const invalidConfig = { invalidProperty: 'test' }
      const result = validateExportOperation(invalidConfig, validData, 'csv')
      expect(result.success).toBe(false)
    })

    it('should fail validation for invalid data', () => {
      const result = validateExportOperation(validConfig, [], 'csv')
      expect(result.success).toBe(false)
    })

    it('should fail validation for CSV-specific issues', () => {
      const csvProblemData = [
        { name: 'John, Doe', age: '25' },
      ]
      const result = validateExportOperation(validConfig, csvProblemData, 'csv')
      expect(result.success).toBe(false)
    })
  })
})