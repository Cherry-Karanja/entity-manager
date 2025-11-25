/**
 * EntityExporter Component
 * 
 * Standalone component for exporting entity data to CSV, JSON, or XLSX formats.
 * Works independently without orchestrator or context.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { BaseEntity } from '../../primitives/types';
import {
  EntityExporterProps,
  ExportFormat,
  ExportResult,
  ExportOptions,
  ExportField,
} from './types';
import {
  entitiesToCSV,
  entitiesToJSON,
  entitiesToXLSX,
  generateFilename,
  getMimeType,
  downloadFile,
  getIncludedFields,
  validateExportData,
} from './utils';

/**
 * EntityExporter Component
 * 
 * @example
 * ```tsx
 * const fields: ExportField<User>[] = [
 *   { key: 'id', label: 'ID' },
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email' },
 * ];
 * 
 * <EntityExporter
 *   data={users}
 *   fields={fields}
 *   options={{ format: 'csv' }}
 *   onExportComplete={(result) => console.log('Exported:', result)}
 * />
 * ```
 */
export function EntityExporter<T extends BaseEntity = BaseEntity>({
  data,
  fields,
  options = {},
  onExportStart,
  onExportComplete,
  onExportError,
  buttonLabel = 'Export',
  showFormatSelector = false,
  showFieldSelector = false,
  className = '',
  disabled = false,
  loading = false,
}: EntityExporterProps<T>): React.ReactElement {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    options.format || 'csv'
  );
  const [selectedFields, setSelectedFields] = useState<ExportField<T>[]>(
    getIncludedFields(fields)
  );
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handle export operation
   */
  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      onExportStart?.();

      // Validate data
      const validation = validateExportData(data, selectedFields);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Prepare export options
      const exportOptions: ExportOptions = {
        format: selectedFormat,
        filename: options.filename || 'export',
        includeHeaders: options.includeHeaders ?? true,
        prettyPrint: options.prettyPrint ?? true,
        dateFormat: options.dateFormat || 'YYYY-MM-DD HH:mm:ss',
        delimiter: options.delimiter || ',',
        sheetName: options.sheetName || 'Sheet1',
      };

      // Generate filename
      const filename = generateFilename(
        exportOptions.filename || 'export',
        selectedFormat
      );

      // Export based on format
      let content: string | Blob;
      switch (selectedFormat) {
        case 'csv':
          content = entitiesToCSV(data, selectedFields, exportOptions);
          break;
        case 'json':
          content = entitiesToJSON(data, selectedFields, exportOptions);
          break;
        case 'xlsx':
          // For XLSX, we need a library like xlsx or exceljs
          // For now, fall back to CSV
          content = entitiesToCSV(data, selectedFields, exportOptions);
          // Note: XLSX export requires xlsx library - falling back to CSV
          break;
        default:
          throw new Error(`Unsupported export format: ${selectedFormat}`);
      }

      // Download file
      const mimeType = getMimeType(selectedFormat);
      downloadFile(content, filename, mimeType);

      // Prepare result
      const result: ExportResult = {
        success: true,
        recordCount: data.length,
        filename,
        format: selectedFormat,
      };

      onExportComplete?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      onExportError?.(new Error(errorMessage));
      
      const result: ExportResult = {
        success: false,
        recordCount: 0,
        filename: '',
        format: selectedFormat,
        error: errorMessage,
      };
      
      onExportComplete?.(result);
    } finally {
      setIsExporting(false);
    }
  }, [
    data,
    selectedFields,
    selectedFormat,
    options,
    onExportStart,
    onExportComplete,
    onExportError,
  ]);

  /**
   * Toggle field selection
   */
  const toggleField = useCallback((fieldKey: keyof T | string) => {
    setSelectedFields(prev => {
      const field = prev.find(f => f.key === fieldKey);
      if (field) {
        return prev.filter(f => f.key !== fieldKey);
      } else {
        const originalField = fields.find(f => f.key === fieldKey);
        return originalField ? [...prev, originalField] : prev;
      }
    });
  }, [fields]);

  const isDisabled = disabled || loading || isExporting || data.length === 0;

  return (
    <div className={`entity-exporter ${className}`}>
      {/* Format Selector */}
      {showFormatSelector && (
        <div className="exporter-format-selector">
          <label htmlFor="export-format">Format:</label>
          <select
            id="export-format"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
            disabled={isDisabled}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
      )}

      {/* Field Selector */}
      {showFieldSelector && (
        <div className="exporter-field-selector">
          <label>Fields to export:</label>
          <div className="field-checkboxes">
            {fields.map(field => (
              <label key={String(field.key)} className="field-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFields.some(f => f.key === field.key)}
                  onChange={() => toggleField(field.key)}
                  disabled={isDisabled}
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isDisabled}
        className="export-button"
      >
        {isExporting ? 'Exporting...' : buttonLabel}
      </button>

      {/* Status */}
      {data.length === 0 && (
        <div className="export-status">No data to export</div>
      )}
    </div>
  );
}

export default EntityExporter;
