import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { FormField, BulkImportFormat, BulkImportState } from '../types'
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react'
import { parseImportFile } from '../utils/fileParser'

interface BulkImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formats: BulkImportFormat[]
  fields: FormField[]
  onImport: (data: Record<string, unknown>[]) => Promise<void>
  importState: BulkImportState
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  formats,
  fields,
  onImport,
  importState,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BulkImportFormat | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [parseError, setParseError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setParseError(null)
    setPreviewData([])

    if (!selectedFormat) return

    try {
      const data = await parseImportFile(file, selectedFormat, fields)
      setPreviewData(data.slice(0, 5)) // Show first 5 rows as preview

      // Auto-generate field mapping based on headers/field names
      const autoMapping: Record<string, string> = {}
      if (data.length > 0) {
        const firstRow = data[0]
        Object.keys(firstRow).forEach(importField => {
          // Try to match by exact name first
          const matchingField = fields.find(f => f.name.toLowerCase() === importField.toLowerCase())
          if (matchingField) {
            autoMapping[importField] = matchingField.name
          }
        })
      }
      setFieldMapping(autoMapping)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Failed to parse file')
    }
  }

  const handleImport = async () => {
    if (!selectedFile || !selectedFormat) return

    try {
      const data = await parseImportFile(selectedFile, selectedFormat, fields)

      // Apply field mapping
      const mappedData = data.map((row: Record<string, unknown>) => {
        const mappedRow: Record<string, unknown> = {}
        Object.entries(fieldMapping).forEach(([importField, formField]) => {
          if (row[importField] !== undefined) {
            mappedRow[formField] = row[importField]
          }
        })
        return mappedRow
      })

      await onImport(mappedData)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  const downloadTemplate = (format: BulkImportFormat) => {
    const headers = fields.map(f => f.label || f.name).join(format.delimiter || ',')
    const blob = new Blob([headers], { type: format.mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template.${format.extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetDialog = () => {
    setSelectedFormat(null)
    setSelectedFile(null)
    setPreviewData([])
    setFieldMapping({})
    setParseError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Import Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formats.map((format) => (
                <button
                  key={format.type}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    selectedFormat?.type === format.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  disabled={importState.isImporting}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">{format.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">.{format.extension}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedFormat && (
            <>
              <Separator />

              {/* File Upload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Upload File</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTemplate(selectedFormat)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={`.${selectedFormat.extension}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                    className="hidden"
                    disabled={importState.isImporting}
                    aria-label={`Upload ${selectedFormat.label} file`}
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        {selectedFormat.label} files only
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importState.isImporting}
                  >
                    Choose File
                  </Button>
                </div>

                {parseError && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{parseError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Field Mapping */}
              {previewData.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-3">Field Mapping</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(previewData[0]).map((importField) => (
                        <div key={importField} className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">
                            {importField}
                          </Label>
                          <select
                            value={fieldMapping[importField] || ''}
                            onChange={(e) => setFieldMapping(prev => ({
                              ...prev,
                              [importField]: e.target.value
                            }))}
                            className="w-full p-2 border rounded text-sm"
                            disabled={importState.isImporting}
                            aria-label={`Map ${importField} to form field`}
                          >
                            <option value="">-- Skip --</option>
                            {fields.map((field) => (
                              <option key={field.name} value={field.name}>
                                {field.label || field.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Data Preview */}
              {previewData.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-3">Data Preview (First 5 rows)</h3>
                    <ScrollArea className="h-48 border rounded">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(previewData[0]).map((key) => (
                              <th key={key} className="p-2 text-left font-medium border-b">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index} className="border-b">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="p-2">
                                  {String(value || '').slice(0, 50)}
                                  {String(value || '').length > 50 && '...'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>
                </>
              )}

              {/* Import Progress */}
              {importState.isImporting && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Importing...</h3>
                      <Badge variant="secondary">
                        {importState.processedRecords}/{importState.totalRecords}
                      </Badge>
                    </div>
                    <Progress value={importState.progress} className="w-full" />
                  </div>
                </>
              )}

              {/* Import Errors */}
              {importState.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {importState.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-xs">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                      {importState.errors.length > 5 && (
                        <div className="text-xs">
                          ... and {importState.errors.length - 5} more errors
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={importState.isImporting}
            >
              Cancel
            </Button>

            <Button
              onClick={handleImport}
              disabled={!selectedFile || !selectedFormat || importState.isImporting || parseError !== null}
            >
              {importState.isImporting ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}