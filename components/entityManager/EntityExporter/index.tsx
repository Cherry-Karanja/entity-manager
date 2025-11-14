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
import { Entity, EntityExporterConfig, ExportFormat } from '../types'

export interface EntityExporterProps<TEntity extends Entity = Entity> {
  config: EntityExporterConfig<TEntity>
  data: TEntity[]
  onExportComplete?: (file: Blob) => void
}

export const EntityExporter = <TEntity extends Entity = Entity>({
  config,
  data,
  onExportComplete,
}: EntityExporterProps<TEntity>) => {
  const [isExporting, setIsExporting] = useState(false)

  // Handle export
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    config.onExportStart?.()

    try {
      let exportData = data

      // Transform data if transformer provided
      if (config.dataTransformer) {
        exportData = config.dataTransformer(data) as TEntity[]
      }

      // Generate file based on format
      let blob: Blob
      const filename = config.filename || 'export'

      switch (format) {
        case 'csv':
          blob = generateCSV(exportData, config)
          downloadFile(blob, `${filename}.csv`, 'text/csv')
          break

        case 'json':
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          downloadFile(blob, `${filename}.json`, 'application/json')
          break

        case 'excel':
          // For Excel, we'd need a library like xlsx
          // For now, fallback to CSV
          blob = generateCSV(exportData, config)
          downloadFile(blob, `${filename}.csv`, 'text/csv')
          break

        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      config.onExportComplete?.(blob)
      onExportComplete?.(blob)
    } catch (error) {
      console.error('Export error:', error)
      config.onExportError?.(error as Error)
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
        const formatted = field.format ? field.format(value) : String(value ?? '')
        
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
        <Button variant="outline" disabled={isExporting || data.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {config.formats.map(format => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
          >
            Export as {format.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

EntityExporter.displayName = 'EntityExporter'