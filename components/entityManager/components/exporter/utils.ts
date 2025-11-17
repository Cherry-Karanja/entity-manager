/**
 * EntityExporter Utility Functions
 * 
 * Pure functions for data export operations.
 */

import { BaseEntity } from '../../primitives/types';
import { formatDate } from '../../primitives/utils';
import { ExportField, ExportFormat, ExportOptions } from './types';

/**
 * Convert entities to CSV format
 */
export function entitiesToCSV<T extends BaseEntity>(
  entities: T[],
  fields: ExportField<T>[],
  options: ExportOptions
): string {
  const { includeHeaders = true, delimiter = ',' } = options;
  const lines: string[] = [];

  // Add headers
  if (includeHeaders) {
    const headers = fields.map(f => escapeCSVValue(f.label));
    lines.push(headers.join(delimiter));
  }

  // Add data rows
  entities.forEach(entity => {
    const values = fields.map(field => {
      const value = getFieldValue(entity, field);
      return escapeCSVValue(formatExportValue(value, options));
    });
    lines.push(values.join(delimiter));
  });

  return lines.join('\n');
}

/**
 * Convert entities to JSON format
 */
export function entitiesToJSON<T extends BaseEntity>(
  entities: T[],
  fields: ExportField<T>[],
  options: ExportOptions
): string {
  const { prettyPrint = true } = options;

  const data = entities.map(entity => {
    const obj: Record<string, unknown> = {};
    fields.forEach(field => {
      const key = String(field.key);
      obj[key] = getFieldValue(entity, field);
    });
    return obj;
  });

  return prettyPrint 
    ? JSON.stringify(data, null, 2) 
    : JSON.stringify(data);
}

/**
 * Convert entities to XLSX format (simple array of arrays)
 */
export function entitiesToXLSX<T extends BaseEntity>(
  entities: T[],
  fields: ExportField<T>[],
  options: ExportOptions
): unknown[][] {
  const { includeHeaders = true } = options;
  const rows: unknown[][] = [];

  // Add headers
  if (includeHeaders) {
    rows.push(fields.map(f => f.label));
  }

  // Add data rows
  entities.forEach(entity => {
    const values = fields.map(field => {
      return getFieldValue(entity, field);
    });
    rows.push(values);
  });

  return rows;
}

/**
 * Get field value from entity
 */
function getFieldValue<T extends BaseEntity>(
  entity: T,
  field: ExportField<T>
): unknown {
  // Use custom formatter if provided
  if (field.formatter) {
    return field.formatter(entity[field.key as keyof T], entity);
  }

  // Get raw value
  return entity[field.key as keyof T];
}

/**
 * Format value for export
 */
function formatExportValue(
  value: unknown,
  options: ExportOptions
): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return formatDate(value, options.dateFormat || 'YYYY-MM-DD HH:mm:ss');
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: string | unknown): string {
  const str = String(value);

  // If value contains comma, quote, or newline, wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    // Escape existing quotes by doubling them
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return str;
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(
  baseName: string,
  format: ExportFormat
): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const extension = getFileExtension(format);
  return `${baseName}_${timestamp}.${extension}`;
}

/**
 * Get file extension for format
 */
function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'xlsx':
      return 'xlsx';
    default:
      return 'txt';
  }
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return 'text/csv;charset=utf-8;';
    case 'json':
      return 'application/json;charset=utf-8;';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'text/plain;charset=utf-8;';
  }
}

/**
 * Download file in browser
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string
): void {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Filter fields by include flag
 */
export function getIncludedFields<T extends BaseEntity>(
  fields: ExportField<T>[]
): ExportField<T>[] {
  return fields.filter(field => field.include !== false);
}

/**
 * Validate export data
 */
export function validateExportData<T extends BaseEntity>(
  entities: T[],
  fields: ExportField<T>[]
): { valid: boolean; error?: string } {
  if (!entities || entities.length === 0) {
    return { valid: false, error: 'No data to export' };
  }

  if (!fields || fields.length === 0) {
    return { valid: false, error: 'No fields selected for export' };
  }

  return { valid: true };
}
