/**
 * EntityExporter Component Types
 * 
 * Type definitions for the entity exporter component.
 * Handles CSV, JSON, and XLSX export formats.
 */

import { BaseEntity } from '../../primitives/types';

/**
 * Supported export formats
 */
export type ExportFormat = 'csv' | 'json' | 'xlsx';

/**
 * Export field configuration
 */
export interface ExportField<T extends BaseEntity = BaseEntity> {
  /** Field key from entity */
  key: keyof T | string;
  
  /** Display label in export */
  label: string;
  
  /** Custom formatter function */
  formatter?: (value: unknown, entity: T) => string | number | boolean | null;
  
  /** Include this field in export */
  include?: boolean;
}

/**
 * Export options configuration
 */
export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  
  /** Filename (without extension) */
  filename?: string;
  
  /** Include headers in CSV/XLSX */
  includeHeaders?: boolean;
  
  /** Pretty print JSON */
  prettyPrint?: boolean;
  
  /** Date format for date fields */
  dateFormat?: string;
  
  /** Custom delimiter for CSV */
  delimiter?: string;
  
  /** Sheet name for XLSX */
  sheetName?: string;
}

/**
 * Export result
 */
export interface ExportResult {
  /** Export successful */
  success: boolean;
  
  /** Number of records exported */
  recordCount: number;
  
  /** Generated filename */
  filename: string;
  
  /** Export format used */
  format: ExportFormat;
  
  /** Error message if failed */
  error?: string;
}

/**
 * EntityExporter component props
 */
export interface EntityExporterProps<T extends BaseEntity = BaseEntity> {
  /** Entities to export */
  data: T[];
  
  /** Fields to include in export */
  fields: ExportField<T>[];
  
  /** Export options */
  options?: Partial<ExportOptions>;
  
  /** Callback when export starts */
  onExportStart?: () => void;
  
  /** Callback when export completes */
  onExportComplete?: (result: ExportResult) => void;
  
  /** Callback when export fails */
  onExportError?: (error: Error) => void;
  
  /** Button label */
  buttonLabel?: string;
  
  /** Show format selector */
  showFormatSelector?: boolean;
  
  /** Show field selector */
  showFieldSelector?: boolean;
  
  /** Custom button className */
  className?: string;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Export configuration state
 */
export interface ExportConfig<T extends BaseEntity = BaseEntity> {
  /** Selected format */
  format: ExportFormat;
  
  /** Selected fields */
  selectedFields: ExportField<T>[];
  
  /** Export options */
  options: ExportOptions;
  
  /** Custom filename */
  customFilename?: string;
}
