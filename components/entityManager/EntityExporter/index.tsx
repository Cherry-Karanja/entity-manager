// ===== ENTITY EXPORTER V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityExporterConfig<TEntity>

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Entity } from '../types'
import { EntityExporterConfig, ExportFormat, ExportResult } from './types'

export interface EntityExporterProps<TEntity extends Entity = Entity> {
  config: EntityExporterConfig<TEntity>
  data?: TEntity[]
  onExport?: (result: ExportResult) => void
}

export const EntityExporter = <TEntity extends Entity = Entity>({
  config,
  data,
  onExport,
}: EntityExporterProps<TEntity>) => {
  const [isExporting, setIsExporting] = useState(false)

  // Handle export
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)

    try {
      let exportData = data || config.data || []

      // Call onExportStart hook
      config.hooks?.onExportStart?.(format.type, exportData)

      // Transform data if transformer provided
      if (config.dataTransformer) {
        exportData = config.dataTransformer(exportData) as TEntity[]
      }

      // Generate file based on format
      let blob: Blob
      const filename = config.filename || 'export'

      switch (format.type) {
        case 'csv':
          blob = generateCSV(exportData, config)
          downloadFile(blob, `${filename}.csv`, 'text/csv')
          break

        case 'json':
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          downloadFile(blob, `${filename}.json`, 'application/json')
          break

        case 'xlsx':
          // For Excel, we'd need a library like xlsx
          // For now, fallback to CSV
          blob = generateCSV(exportData, config)
          downloadFile(blob, `${filename}.csv`, 'text/csv')
          break

        default:
          throw new Error(`Unsupported export format: ${format.type}`)
      }

      const result: ExportResult = {
        success: true,
        data: blob,
        filename: typeof config.filename === 'function' ? config.filename(format.type) : config.filename || 'export',
        format: format.type,
        recordCount: exportData.length,
      }

      config.hooks?.onExportComplete?.(format.type, result)
      onExport?.(result)
    } catch (error) {
      console.error('Export error:', error)
      const errorResult: ExportResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        filename: typeof config.filename === 'function' ? config.filename(format.type) : config.filename || 'export',
        format: format.type,
        recordCount: 0,
      }
      config.hooks?.onExportError?.(format.type, error)
      onExport?.(errorResult)
    } finally {
      setIsExporting(false)
    }
  }

  // Generate CSV
  const generateCSV = (data: TEntity[], config: EntityExporterConfig<TEntity>): Blob => {
    const fields = config.fields || []
    const includeHeaders = config.includeHeaders ?? true

    const lines: string[] = []

    // Headers
    if (includeHeaders) {
      const headers = fields.map(f => `"${f.label}"`)
      lines.push(headers.join(','))
    }

    // Data rows
    data.forEach(row => {
      const values = fields.map(field => {
        const value = (row as Record<string, unknown>)[field.key]
        
        // Format if formatter provided
        const formatted = field.format ? field.format(value, row) : String(value ?? '')
        
        // Escape quotes and wrap in quotes
        return `"${String(formatted).replace(/"/g, '""')}"`
      })
      lines.push(values.join(','))
    })

    return new Blob([lines.join('\n')], { type: 'text/csv' })
  }

  // Download file
  const downloadFile = (blob: Blob, filename: string, type: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting || !data || data.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {config.formats.map(format => (
          <DropdownMenuItem
            key={format.type}
            onClick={() => handleExport(format)}
          >
            Export as {format.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

EntityExporter.displayName = 'EntityExporter'