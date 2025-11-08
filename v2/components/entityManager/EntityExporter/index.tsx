'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Download, FileText, Table, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EntityExporterProps,
  ExportFormatType,
  ExportResult,
  DEFAULT_EXPORTER_CONFIG,
  DEFAULT_EXPORT_FORMATS
} from './types'
import { validateExportOperation } from './validation'
import { EntityListColumn } from '../EntityList/types'

// Import export libraries
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ===== UTILITY FUNCTIONS =====

const formatFilename = (filename: string | ((format: ExportFormatType) => string), format: ExportFormatType): string => {
  if (typeof filename === 'function') {
    return filename(format)
  }
  return filename.replace('{format}', format).replace('{timestamp}', new Date().toISOString())
}

const transformData = (data: unknown[], transformer?: (data: unknown[]) => unknown[]): unknown[] => {
  return transformer ? transformer(data) : data
}

const mapFields = (item: unknown, fields?: Array<{ key: string; format?: (value: unknown, item: unknown) => string }>): Record<string, unknown> => {
  if (!fields) return item as Record<string, unknown>

  const result: Record<string, unknown> = {}
  fields.forEach(field => {
    const value = (item as Record<string, unknown>)[field.key]
    result[field.key] = field.format ? field.format(value, item) : value
  })
  return result
}

// ===== EXPORT FUNCTIONS =====

const exportToCSV = async (
  data: unknown[],
  config: any,
  fields?: Array<{ key: string; label: string; format?: (value: unknown, item: unknown) => string }>
): Promise<string> => {
  const headers = fields ? fields.map(f => f.label) : Object.keys(data[0] || {})
  const rows = data.map(item => {
    const mapped = mapFields(item, fields)
    return fields
      ? fields.map(f => String(mapped[f.key] || ''))
      : Object.values(mapped).map(v => String(v || ''))
  })

  const csvContent = [
    headers.join(config.delimiter || ','),
    ...rows.map(row => row.join(config.delimiter || ','))
  ].join('\n')

  return csvContent
}

const exportToJSON = async (data: unknown[]): Promise<string> => {
  return JSON.stringify(data, null, 2)
}

const exportToXML = async (
  data: unknown[],
  fields?: Array<{ key: string; label: string }>
): Promise<string> => {
  const rootName = 'items'
  const itemName = 'item'

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`

  data.forEach(item => {
    xml += `  <${itemName}>\n`
    const mapped = mapFields(item, fields)
    Object.entries(mapped).forEach(([key, value]) => {
      xml += `    <${key}>${String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>\n`
    })
    xml += `  </${itemName}>\n`
  })

  xml += `</${rootName}>`
  return xml
}

export const exportToXLSX = async (
  data: unknown[],
  config: any,
  fields?: Array<{ key: string; label: string; format?: (value: unknown, item: unknown) => string }>
): Promise<Blob> => {
  // Prepare data for Excel
  const headers = fields
    ? fields.map(f => f.label || f.key)
    : data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []

  const rows = data.map(item => {
    const row: Record<string, unknown> = {}
    if (fields) {
      fields.forEach(field => {
        const value = (item as Record<string, unknown>)[field.key]
        row[field.label || field.key] = field.format ? field.format(value, item) : value
      })
    } else {
      Object.assign(row, item)
    }
    return row
  })

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers })

  // Auto-size columns
  const colWidths = headers.map(header => ({
    wch: Math.max(header.length, ...rows.map(row => String(row[header] || '').length).slice(0, 10))
  }))
  ws['!cols'] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  // Generate buffer and return as Blob
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export const exportToPDF = async (
  data: unknown[],
  config: any,
  fields?: Array<{ key: string; label: string; format?: (value: unknown, item: unknown) => string }>
): Promise<Blob> => {
  const doc = new jsPDF()

  // Prepare data for PDF
  const headers = fields
    ? fields.map(f => f.label || f.key)
    : data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []

  const rows = data.map(item => {
    if (fields) {
      return fields.map(field => {
        const value = (item as Record<string, unknown>)[field.key]
        return field.format ? field.format(value, item) : String(value || '')
      })
    } else {
      return Object.values(item as Record<string, unknown>).map(val => String(val || ''))
    }
  })

  // Add title
  doc.setFontSize(16)
  doc.text('Data Export', 14, 20)

  // Add export info
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)
  doc.text(`Total records: ${data.length}`, 14, 35)

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 45 },
  })

  // Return as Blob
  return new Blob([doc.output('blob')], { type: 'application/pdf' })
}

// ===== MAIN COMPONENT =====

export const EntityExporter: React.FC<EntityExporterProps> = ({
  config,
  data: propData,
  onExport,
  disabled = false,
  loading: externalLoading = false
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>(config.defaultFormat || 'csv')
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<unknown[] | null>(null)
  const [validationResults, setValidationResults] = useState<any>(null)

  // Merge config with defaults
  const mergedConfig = useMemo(() => ({
    ...DEFAULT_EXPORTER_CONFIG,
    ...config,
    formats: config.formats || DEFAULT_EXPORT_FORMATS,
  }), [config])

  // Get available formats
  const availableFormats = useMemo(() => {
    return mergedConfig.formats.filter(format => format.enabled !== false)
  }, [mergedConfig.formats])

  // Get data to export
  const getExportData = useCallback(async (): Promise<unknown[]> => {
    let data = propData || mergedConfig.data || []

    if (mergedConfig.dataFetcher) {
      data = await mergedConfig.dataFetcher()
    }

    return transformData(data, mergedConfig.dataTransformer)
  }, [propData, mergedConfig])

  // Preview data and validation
  const handlePreview = useCallback(async () => {
    try {
      setError(null)
      const data = await getExportData()
      const validation = validateExportOperation(mergedConfig, data, selectedFormat)

      setPreviewData(data.slice(0, mergedConfig.maxPreviewRows || 5))
      setValidationResults(validation)
      setShowPreview(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Preview failed'
      setError(errorMessage)
    }
  }, [getExportData, mergedConfig, selectedFormat])

  // Export data
  const performExport = useCallback(async (format: ExportFormatType) => {
    try {
      setIsExporting(true)
      setExportProgress(0)
      setError(null)

      const data = await getExportData()
      setExportProgress(10)

      // Comprehensive validation
      const validationResult = validateExportOperation(mergedConfig, data, format)
      if (!validationResult.success) {
        const validationErrors = validationResult.errors || []
        const errorMessages = validationErrors.map(err =>
          err.errors.map(e => e.message).join(', ')
        ).join('; ')
        throw new Error(`Validation failed: ${errorMessages}`)
      }

      setExportProgress(25)

      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      mergedConfig.hooks?.onExportStart?.(format, data)
      setExportProgress(50)

      let content: string
      let mimeType: string
      let extension: string

      const formatConfig = availableFormats.find(f => f.type === format)
      if (!formatConfig) {
        throw new Error(`Unsupported format: ${format}`)
      }

      switch (format) {
        case 'csv':
        case 'json':
        case 'xml': {
          const mimeType = formatConfig.mimeType
          const extension = formatConfig.extension
          let content: string

          if (format === 'csv') {
            content = await exportToCSV(data, mergedConfig, mergedConfig.fields)
          } else if (format === 'json') {
            content = await exportToJSON(data)
          } else {
            content = await exportToXML(data, mergedConfig.fields)
          }

          // Create blob and download
          const blob = new Blob([content], { type: mimeType })
          const url = URL.createObjectURL(blob)

          const filename = formatFilename(mergedConfig.filename || 'export', format).replace(`.${format}`, `.${extension}`)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          const result: ExportResult = {
            success: true,
            data: blob,
            filename,
            format,
            recordCount: data.length,
          }

          mergedConfig.hooks?.onExportComplete?.(format, result)
          onExport?.(result)
          break
        }
        case 'xlsx':
          const xlsxBlob = await exportToXLSX(data, mergedConfig, mergedConfig.fields)
          const xlsxUrl = URL.createObjectURL(xlsxBlob)
          const xlsxFilename = formatFilename(mergedConfig.filename || 'export', format).replace(`.${format}`, `.${formatConfig.extension}`)
          const xlsxLink = document.createElement('a')
          xlsxLink.href = xlsxUrl
          xlsxLink.download = xlsxFilename
          document.body.appendChild(xlsxLink)
          xlsxLink.click()
          document.body.removeChild(xlsxLink)
          URL.revokeObjectURL(xlsxUrl)

          const xlsxResult: ExportResult = {
            success: true,
            data: xlsxBlob,
            filename: xlsxFilename,
            format,
            recordCount: data.length,
          }

          mergedConfig.hooks?.onExportComplete?.(format, xlsxResult)
          onExport?.(xlsxResult)
          return // Early return since we handled the download directly
        case 'pdf':
          const pdfBlob = await exportToPDF(data, mergedConfig, mergedConfig.fields)
          const pdfUrl = URL.createObjectURL(pdfBlob)
          const pdfFilename = formatFilename(mergedConfig.filename || 'export', format).replace(`.${format}`, `.${formatConfig.extension}`)
          const pdfLink = document.createElement('a')
          pdfLink.href = pdfUrl
          pdfLink.download = pdfFilename
          document.body.appendChild(pdfLink)
          pdfLink.click()
          document.body.removeChild(pdfLink)
          URL.revokeObjectURL(pdfUrl)

          const pdfResult: ExportResult = {
            success: true,
            data: pdfBlob,
            filename: pdfFilename,
            format,
            recordCount: data.length,
          }

          mergedConfig.hooks?.onExportComplete?.(format, pdfResult)
          onExport?.(pdfResult)
          return // Early return since we handled the download directly
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      setExportProgress(100)

    } catch (err) {
      const error = err as Error
      const errorMessage = error.message
      let errorType: 'validation' | 'no-data' | 'format' | 'serialization' | 'size-limit' | 'general' = 'general'

      // Categorize errors for better user experience
      if (errorMessage.includes('Validation failed')) {
        errorType = 'validation'
      } else if (errorMessage.includes('No data to export')) {
        errorType = 'no-data'
      } else if (errorMessage.includes('Unsupported format')) {
        errorType = 'format'
      } else if (errorMessage.includes('JSON serialization failed')) {
        errorType = 'serialization'
      } else if (errorMessage.includes('exceeds maximum')) {
        errorType = 'size-limit'
      }

      setError(errorMessage)

      const result: ExportResult = {
        success: false,
        filename: '',
        format,
        recordCount: 0,
        error: errorMessage,
        errorType,
      }

      mergedConfig.hooks?.onExportError?.(format, err)
      onExport?.(result)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [getExportData, mergedConfig, availableFormats, onExport])

  // Handle format selection
  const handleFormatSelect = useCallback((format: ExportFormatType) => {
    setSelectedFormat(format)
    performExport(format)
  }, [performExport])

  // Render format selector
  const renderFormatSelector = () => {
    if (!mergedConfig.showFormatSelector || availableFormats.length <= 1) {
      return (
        <Button
          onClick={() => performExport(selectedFormat)}
          disabled={disabled || externalLoading || isExporting}
          variant={mergedConfig.buttonVariant as any}
          size={mergedConfig.buttonSize as any}
          className={cn(mergedConfig.className)}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={disabled || externalLoading || isExporting}
            variant={mergedConfig.buttonVariant as any}
            size={mergedConfig.buttonSize as any}
            className={cn(mergedConfig.className)}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
                <span className="ml-1 text-xs opacity-70">
                  ({selectedFormat.toUpperCase()})
                </span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {availableFormats.map((format) => (
            <DropdownMenuItem
              key={format.type}
              onClick={() => handleFormatSelect(format.type)}
              className="flex items-center gap-2"
            >
              {format.icon && <format.icon className="h-4 w-4" />}
              <span>{format.label}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                .{format.extension}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {renderFormatSelector()}

      {/* Preview Button */}
      {mergedConfig.showPreview && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
          disabled={disabled || externalLoading || isExporting}
          className={cn("ml-2", mergedConfig.className)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      )}

      {/* Progress Dialog */}
      {mergedConfig.showProgress && (isExporting || exportProgress > 0) && (
        <Dialog open={isExporting} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exporting Data
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                Preparing your {selectedFormat.toUpperCase()} export...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Dialog */}
      {mergedConfig.showPreview && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Export Preview - {selectedFormat.toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Validation Results */}
              {validationResults && (
                <div className="space-y-2">
                  <h4 className="font-medium">Validation Results</h4>
                  {validationResults.success ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span className="text-sm">All validations passed</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {validationResults.errors?.map((error: any, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{error.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Data Preview */}
              {previewData && previewData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Data Preview ({previewData.length} of {validationResults?.data?.length || 0} records)
                  </h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(previewData[0] as object).map((key) => (
                            <th key={key} className="px-3 py-2 text-left font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row as object).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {String(value || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    performExport(selectedFormat)
                  }}
                  disabled={!validationResults?.success}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// ===== EXPORT UTILITY FUNCTION =====

export const exportData = async (
  data: unknown[],
  columns: EntityListColumn[],
  format: ExportFormatType,
  filename: string,
  config: Partial<typeof DEFAULT_EXPORTER_CONFIG> = {}
): Promise<void> => {
  const mergedConfig = { ...DEFAULT_EXPORTER_CONFIG, ...config }

  const fields = columns.map(col => {
    const accessorFn = col.accessorFn
    return {
      key: col.accessorKey || col.id,
      label: typeof col.header === 'string' ? col.header : col.id,
      format: accessorFn ? (value: unknown, item: unknown) => String(accessorFn(item as any) || '') : undefined
    }
  })

  let content: string
  let mimeType: string
  let extension: string

  switch (format) {
    case 'csv':
      content = await exportToCSV(data, mergedConfig, fields)
      mimeType = 'text/csv'
      extension = 'csv'
      break
    case 'json':
      content = await exportToJSON(data)
      mimeType = 'application/json'
      extension = 'json'
      break
    case 'xlsx':
      // For now, fallback to CSV since we don't have XLSX implementation
      content = await exportToCSV(data, mergedConfig, fields)
      mimeType = 'text/csv'
      extension = 'csv'
      break
    case 'pdf':
      // For now, fallback to JSON since we don't have PDF implementation
      content = await exportToJSON(data)
      mimeType = 'application/json'
      extension = 'json'
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }

  // Create and download file
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}