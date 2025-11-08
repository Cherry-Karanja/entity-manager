import { describe, it, expect } from 'vitest'
import { exportToXLSX, exportToPDF } from '../../../../../components/entityManager/EntityExporter/index'

describe('EntityExporter Export Functions', () => {
  const testData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ]

  const testConfig = {
    delimiter: ',',
    filename: 'test-export',
  }

  const testFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'age', label: 'Age' },
  ]

  describe('exportToXLSX', () => {
    it('should export data to XLSX format', async () => {
      const blob = await exportToXLSX(testData, testConfig, testFields)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should handle empty fields array', async () => {
      const blob = await exportToXLSX(testData, testConfig)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should handle empty data array', async () => {
      const blob = await exportToXLSX([], testConfig, testFields)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(0)
    })
  })

  describe('exportToPDF', () => {
    it('should export data to PDF format', async () => {
      const blob = await exportToPDF(testData, testConfig, testFields)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/pdf')
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should handle empty fields array', async () => {
      const blob = await exportToPDF(testData, testConfig)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should handle empty data array', async () => {
      const blob = await exportToPDF([], testConfig, testFields)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(0)
    })
  })
})