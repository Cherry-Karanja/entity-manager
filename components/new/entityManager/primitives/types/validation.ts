/**
 * Validation Types
 * 
 * Core validation types and interfaces for field and form validation.
 * 
 * @module primitives/types/validation
 */

/**
 * Validation rule type
 */
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

/**
 * Validation severity
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field key that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Rule type that failed */
  rule: ValidationRuleType;
  /** Severity level */
  severity: ValidationSeverity;
  /** Error code */
  code?: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Field key */
  field: string;
  /** Warning message */
  message: string;
  /** Warning code */
  code?: string;
}

/**
 * Base validation rule
 */
export interface ValidationRule {
  /** Rule type */
  type: ValidationRuleType;
  /** Error message */
  message: string;
  /** Severity level */
  severity?: ValidationSeverity;
}

/**
 * Required validation rule
 */
export interface RequiredRule extends ValidationRule {
  type: 'required';
}

/**
 * Length validation rule
 */
export interface LengthRule extends ValidationRule {
  type: 'minLength' | 'maxLength';
  /** Length value */
  value: number;
}

/**
 * Number validation rule
 */
export interface NumberRule extends ValidationRule {
  type: 'min' | 'max';
  /** Number value */
  value: number;
}

/**
 * Pattern validation rule
 */
export interface PatternRule extends ValidationRule {
  type: 'pattern';
  /** Regex pattern */
  pattern: RegExp | string;
}

/**
 * Email validation rule
 */
export interface EmailRule extends ValidationRule {
  type: 'email';
}

/**
 * URL validation rule
 */
export interface UrlRule extends ValidationRule {
  type: 'url';
}

/**
 * Custom validation rule
 */
export interface CustomRule extends ValidationRule {
  type: 'custom';
  /** Custom validator function */
  validator: (value: unknown, allValues?: Record<string, unknown>) => boolean | string | Promise<boolean | string>;
}

/**
 * Union of all validation rules
 */
export type AnyValidationRule =
  | RequiredRule
  | LengthRule
  | NumberRule
  | PatternRule
  | EmailRule
  | UrlRule
  | CustomRule;

/**
 * Field validation configuration
 */
export interface FieldValidation {
  /** Field key */
  field: string;
  /** Validation rules */
  rules: AnyValidationRule[];
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Debounce delay for validation (ms) */
  debounce?: number;
}

/**
 * Form validation schema
 */
export interface ValidationSchema {
  /** Field validations */
  fields: Record<string, AnyValidationRule[]>;
  /** Cross-field validation rules */
  crossField?: CrossFieldValidation[];
}

/**
 * Cross-field validation
 */
export interface CrossFieldValidation {
  /** Validation name */
  name: string;
  /** Fields involved */
  fields: string[];
  /** Validator function */
  validator: (values: Record<string, unknown>) => boolean | string | Promise<boolean | string>;
  /** Error message */
  message: string;
}

/**
 * Validation state
 */
export interface ValidationState {
  /** Whether form is validating */
  isValidating: boolean;
  /** Whether form is valid */
  isValid: boolean;
  /** Field errors */
  errors: Record<string, string[]>;
  /** Field warnings */
  warnings: Record<string, string[]>;
  /** Touched fields */
  touched: Record<string, boolean>;
}
