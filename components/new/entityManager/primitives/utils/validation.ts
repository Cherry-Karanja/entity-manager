/**
 * Validation Utilities
 * 
 * Pure validation functions with zero dependencies.
 * 
 * @module primitives/utils/validation
 */

import type {
  ValidationResult,
  ValidationError,
  AnyValidationRule,
  ValidationSchema,
} from '../types/validation';

/**
 * Email regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL regex pattern
 */
const URL_REGEX = /^https?:\/\/.+\..+/;

/**
 * Validate a single value against a rule
 */
export function validateRule(
  value: unknown,
  rule: AnyValidationRule,
  allValues?: Record<string, unknown>
): string | null {
  switch (rule.type) {
    case 'required':
      if (value === null || value === undefined || value === '') {
        return rule.message;
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && value.length < rule.value) {
        return rule.message;
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && value.length > rule.value) {
        return rule.message;
      }
      break;

    case 'min':
      if (typeof value === 'number' && value < rule.value) {
        return rule.message;
      }
      break;

    case 'max':
      if (typeof value === 'number' && value > rule.value) {
        return rule.message;
      }
      break;

    case 'pattern':
      if (typeof value === 'string') {
        const pattern = typeof rule.pattern === 'string'
          ? new RegExp(rule.pattern)
          : rule.pattern;
        if (!pattern.test(value)) {
          return rule.message;
        }
      }
      break;

    case 'email':
      if (typeof value === 'string' && !EMAIL_REGEX.test(value)) {
        return rule.message;
      }
      break;

    case 'url':
      if (typeof value === 'string' && !URL_REGEX.test(value)) {
        return rule.message;
      }
      break;

    case 'custom':
      if (rule.validator) {
        const result = rule.validator(value, allValues);
        if (typeof result === 'string') {
          return result;
        }
        if (result === false) {
          return rule.message;
        }
      }
      break;
  }

  return null;
}

/**
 * Validate a field value against multiple rules
 */
export function validateField(
  value: unknown,
  rules: AnyValidationRule[],
  allValues?: Record<string, unknown>
): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    const error = validateRule(value, rule, allValues);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * Validate all fields in an object against a schema
 */
export function validateSchema(
  values: Record<string, unknown>,
  schema: ValidationSchema
): ValidationResult {
  const errors: ValidationError[] = [];
  // const warnings: ValidationError[] = []; // Reserved for future use

  // Validate individual fields
  for (const [field, rules] of Object.entries(schema.fields)) {
    const value = values[field];
    const fieldErrors = validateField(value, rules, values);

    for (const message of fieldErrors) {
      const rule = rules.find(r => validateRule(value, r, values) === message);
      errors.push({
        field,
        message,
        rule: rule?.type || 'custom',
        severity: rule?.severity || 'error',
      });
    }
  }

  // Validate cross-field rules
  if (schema.crossField) {
    for (const crossRule of schema.crossField) {
      const result = crossRule.validator(values);
      if (typeof result === 'string' || result === false) {
        const message = typeof result === 'string' ? result : crossRule.message;
        // Add error for all involved fields
        for (const field of crossRule.fields) {
          errors.push({
            field,
            message,
            rule: 'custom',
            severity: 'error',
          });
        }
      }
    }
  }

  // Separate errors and warnings
  const actualErrors = errors.filter(e => e.severity === 'error');
  const actualWarnings = errors.filter(e => e.severity === 'warning');

  return {
    valid: actualErrors.length === 0,
    errors: actualErrors,
    warnings: actualWarnings,
  };
}

/**
 * Check if a value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate that value matches pattern
 */
export function matchesPattern(value: string, pattern: RegExp | string): boolean {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  return regex.test(value);
}
