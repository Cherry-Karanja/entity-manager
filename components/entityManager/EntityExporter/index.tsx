'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Download, FileText, Table } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EntityExporterProps,
  ExportFormatType,
  ExportResult,
  DEFAULT_EXPORTER_CONFIG,
  DEFAULT_EXPORT_FORMATS
} from './types'
import { EntityListColumn } from '../EntityList/types'

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

  // Export data
  const performExport = useCallback(async (format: ExportFormatType) => {
    try {
      setIsExporting(true)
      setExportProgress(0)
      setError(null)

      const data = await getExportData()
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

      mimeType = formatConfig.mimeType
      extension = formatConfig.extension

      switch (format) {
        case 'csv':
          content = await exportToCSV(data, mergedConfig, mergedConfig.fields)
          break
        case 'json':
          content = await exportToJSON(data)
          break
        case 'xml':
          content = await exportToXML(data, mergedConfig.fields)
          break
        case 'xlsx':
          // For XLSX, we'd need a library like xlsx or exceljs
          // For now, fall back to CSV
          content = await exportToCSV(data, mergedConfig, mergedConfig.fields)
          mimeType = 'text/csv'
          extension = 'csv'
          break
        case 'pdf':
          // For PDF, we'd need a library like jsPDF or puppeteer
          // For now, fall back to JSON
          content = await exportToJSON(data)
          mimeType = 'application/json'
          extension = 'json'
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      setExportProgress(75)

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

      setExportProgress(100)

      const result: ExportResult = {
        success: true,
        data: blob,
        filename,
        format,
        recordCount: data.length,
      }

      mergedConfig.hooks?.onExportComplete?.(format, result)
      onExport?.(result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed'
      setError(errorMessage)

      const result: ExportResult = {
        success: false,
        filename: '',
        format,
        recordCount: 0,
        error: errorMessage,
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