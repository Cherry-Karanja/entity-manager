/**
 * Field Definition Types
 * 
 * Core field types for entity properties and form fields.
 * These types are used across all components to ensure consistency.
 * 
 * @module primitives/types/field
 */

/**
 * Supported field types
 */
export type FieldType =
  // Text types
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'search'
  // Number types
  | 'number'
  | 'currency'
  | 'percentage'
  // Date/Time types
  | 'date'
  | 'datetime'
  | 'time'
  // Selection types
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  // Rich content
  | 'textarea'
  | 'richtext'
  | 'markdown'
  | 'code'
  // File types
  | 'file'
  | 'image'
  | 'avatar'
  // Boolean
  | 'boolean'
  | 'switch'
  // Relationship
  | 'relation'
  | 'multirelation'
  // Special
  | 'color'
  | 'rating'
  | 'slider'
  | 'json'
  | 'custom';

/**
 * Field alignment options
 */
export type FieldAlignment = 'left' | 'center' | 'right';

/**
 * Field display width
 */
export type FieldWidth = 'auto' | 'full' | 'half' | 'third' | 'quarter' | number;

/**
 * Base field definition
 */
export interface FieldDefinition {
  /** Unique field key (maps to entity property) */
  key: string;
  /** Human-readable label */
  label: string;
  /** Field type */
  type: FieldType;
  /** Field description/help text */
  description?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: unknown;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether field is readonly */
  readonly?: boolean;
  /** Whether field is visible */
  visible?: boolean;
  /** Field width */
  width?: FieldWidth;
  /** Custom CSS class */
  className?: string;
  /** Field alignment */
  align?: FieldAlignment;
}

/**
 * Select/Choice option
 */
export interface FieldOption {
  /** Option value */
  value: string | number;
  /** Option label */
  label: string;
  /** Option description */
  description?: string;
  /** Option icon */
  icon?: string;
  /** Option color */
  color?: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Option group */
  group?: string;
}

/**
 * Text field configuration
 */
export interface TextFieldConfig extends FieldDefinition {
  type: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
  /** Minimum length */
  minLength?: number;
  /** Maximum length */
  maxLength?: number;
  /** Regex pattern */
  pattern?: string;
  /** Autocomplete attribute */
  autocomplete?: string;
}

/**
 * Number field configuration
 */
export interface NumberFieldConfig extends FieldDefinition {
  type: 'number' | 'currency' | 'percentage';
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Decimal places */
  decimals?: number;
  /** Currency code (for currency type) */
  currency?: string;
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig extends FieldDefinition {
  type: 'select' | 'multiselect' | 'radio' | 'checkbox';
  /** Available options */
  options: FieldOption[];
  /** Whether to allow search/filter */
  searchable?: boolean;
  /** Whether to allow creating new options */
  creatable?: boolean;
  /** Maximum selections (for multiselect) */
  maxSelections?: number;
}

/**
 * Date field configuration
 */
export interface DateFieldConfig extends FieldDefinition {
  type: 'date' | 'datetime' | 'time';
  /** Minimum date */
  minDate?: Date | string;
  /** Maximum date */
  maxDate?: Date | string;
  /** Date format */
  format?: string;
  /** Show time picker */
  showTime?: boolean;
}

/**
 * Textarea field configuration
 */
export interface TextareaFieldConfig extends FieldDefinition {
  type: 'textarea' | 'richtext' | 'markdown' | 'code';
  /** Number of rows */
  rows?: number;
  /** Minimum length */
  minLength?: number;
  /** Maximum length */
  maxLength?: number;
  /** Show character count */
  showCount?: boolean;
  /** Code language (for code type) */
  language?: string;
}

/**
 * File field configuration
 */
export interface FileFieldConfig extends FieldDefinition {
  type: 'file' | 'image' | 'avatar';
  /** Accepted file types */
  accept?: string[];
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Image dimensions (for image/avatar) */
  dimensions?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
}

/**
 * Relation field configuration
 */
export interface RelationFieldConfig extends FieldDefinition {
  type: 'relation' | 'multirelation';
  /** Related entity name */
  relatedEntity: string;
  /** Field to display from related entity */
  displayField: string;
  /** API endpoint to fetch related entities */
  endpoint?: string;
  /** Whether to allow search */
  searchable?: boolean;
  /** Whether to allow creating new related entities */
  creatable?: boolean;
  /** Maximum selections (for multirelation) */
  maxSelections?: number;
}

/**
 * Boolean field configuration
 */
export interface BooleanFieldConfig extends FieldDefinition {
  type: 'boolean' | 'switch';
  /** Label for true state */
  trueLabel?: string;
  /** Label for false state */
  falseLabel?: string;
}

/**
 * Union of all field configurations
 */
export type AnyFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | TextareaFieldConfig
  | FileFieldConfig
  | RelationFieldConfig
  | BooleanFieldConfig
  | FieldDefinition;

/**
 * Field group for organizing fields
 */
export interface FieldGroup {
  /** Group identifier */
  id: string;
  /** Group label */
  label: string;
  /** Group description */
  description?: string;
  /** Fields in this group */
  fields: AnyFieldConfig[];
  /** Whether group is collapsible */
  collapsible?: boolean;
  /** Whether group is initially collapsed */
  defaultCollapsed?: boolean;
  /** Group icon */
  icon?: string;
}
