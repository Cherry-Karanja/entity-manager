/**
 * Primitives Utils Index
 * 
 * Exports all primitive utility functions for easy importing.
 * All utilities are pure functions with zero dependencies.
 * 
 * @module primitives/utils
 */

// Validation utilities
export {
  validateRule,
  validateField,
  validateSchema,
  isEmpty,
  isValidEmail,
  isValidUrl,
  isValidPhone,
  hasMinLength,
  hasMaxLength,
  isInRange,
  matchesPattern,
} from './validation';

// Formatting utilities
export {
  formatDate,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatFileSize,
  formatPhoneNumber,
  truncate,
  capitalize,
  titleCase,
  camelToTitle,
  snakeToTitle,
  formatRelativeTime,
  formatBoolean,
  formatArray,
} from './formatting';

// Transformation utilities
export {
  deepClone,
  deepMerge,
  pick,
  omit,
  groupBy,
  sortBy,
  filterBy,
  searchBy,
  paginate,
  uniqueBy,
  flatten,
  toQueryString,
  fromQueryString,
  toApiFormat,
  fromApiFormat,
} from './transformation';
