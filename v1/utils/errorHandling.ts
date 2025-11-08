"use client";

import { AxiosError } from 'axios';

/**
 * Standardized error codes matching backend ErrorCode class
 */
export enum ErrorCode {
  // Authentication & Authorization
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  REQUIRED_FIELD = "REQUIRED_FIELD",
  INVALID_FORMAT = "INVALID_FORMAT",
  DUPLICATE_VALUE = "DUPLICATE_VALUE",
  INVALID_CHOICE = "INVALID_CHOICE",

  // Resource
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",
  RESOURCE_LOCKED = "RESOURCE_LOCKED",

  // Business Logic
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
  INVALID_STATE = "INVALID_STATE",

  // System
  INTERNAL_ERROR = "INTERNAL_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Network
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CONNECTION_ERROR = "CONNECTION_ERROR",
}

/**
 * Standardized error response format from backend
 */
export interface StandardizedError {
  error: {
    code: ErrorCode;
    message: string;
    status_code: number;
    details?: Record<string, any>;
    field_errors?: Record<string, string[]>;
  };
}

/**
 * Validation errors format for forms
 */
export interface ValidationErrors {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

/**
 * Extended error information for better error handling
 */
export interface ErrorInfo {
  code: ErrorCode;
  message: string;
  statusCode: number;
  fieldErrors?: Record<string, string[]>;
  details?: Record<string, any>;
  isValidationError: boolean;
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
}

/**
 * Parse backend error response into standardized format
 */
export function parseApiError(error: AxiosError): ErrorInfo {
  // Network errors (no response)
  if (!error.response) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: error.message || 'Network connection failed',
      statusCode: 0,
      isValidationError: false,
      isNetworkError: true,
      isAuthError: false,
      isServerError: false,
    };
  }

  const { response } = error;
  const statusCode = response.status;

  // Handle standardized backend errors
  if (response.data && typeof response.data === 'object' && 'error' in response.data) {
    const backendError = (response.data as StandardizedError).error;

    return {
      code: backendError.code,
      message: backendError.message,
      statusCode: backendError.status_code,
      fieldErrors: backendError.field_errors,
      details: backendError.details,
      isValidationError: backendError.code === ErrorCode.VALIDATION_ERROR,
      isNetworkError: false,
      isAuthError: statusCode === 401 || statusCode === 403,
      isServerError: statusCode >= 500,
    };
  }

  // Handle legacy DRF errors
  if (typeof response.data === 'object' && response.data !== null) {
    const data = response.data as Record<string, any>;

    // Check if it's a DRF validation error format
    if (data.detail) {
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: data.detail,
        statusCode,
        isValidationError: false,
        isNetworkError: false,
        isAuthError: statusCode === 401 || statusCode === 403,
        isServerError: statusCode >= 500,
      };
    }

    // Check for field-specific errors
    const fieldErrors: Record<string, string[]> = {};
    let hasFieldErrors = false;

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map(String);
        hasFieldErrors = true;
      } else if (typeof value === 'string') {
        fieldErrors[key] = [value];
        hasFieldErrors = true;
      }
    });

    if (hasFieldErrors) {
      return {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        statusCode,
        fieldErrors,
        isValidationError: true,
        isNetworkError: false,
        isAuthError: false,
        isServerError: false,
      };
    }
  }

  // Default error handling
  let message = 'An unexpected error occurred';
  let code = ErrorCode.INTERNAL_ERROR;

  if (statusCode === 400) {
    code = ErrorCode.VALIDATION_ERROR;
    message = 'Invalid request data';
  } else if (statusCode === 401) {
    code = ErrorCode.AUTHENTICATION_FAILED;
    message = 'Authentication required';
  } else if (statusCode === 403) {
    code = ErrorCode.AUTHORIZATION_FAILED;
    message = 'Permission denied';
  } else if (statusCode === 404) {
    code = ErrorCode.NOT_FOUND;
    message = 'Resource not found';
  } else if (statusCode === 409) {
    code = ErrorCode.CONFLICT;
    message = 'Resource conflict';
  } else if (statusCode >= 500) {
    code = ErrorCode.INTERNAL_ERROR;
    message = 'Server error';
  }

  return {
    code,
    message,
    statusCode,
    isValidationError: statusCode === 400,
    isNetworkError: false,
    isAuthError: statusCode === 401 || statusCode === 403,
    isServerError: statusCode >= 500,
  };
}

/**
 * Extract validation errors from API error for form handling
 */
export function extractValidationErrors(error: AxiosError): ValidationErrors | null {
  const errorInfo = parseApiError(error);

  if (!errorInfo.isValidationError || !errorInfo.fieldErrors) {
    return null;
  }

  return {
    fieldErrors: errorInfo.fieldErrors,
    nonFieldErrors: errorInfo.details?.non_field_errors || [],
  };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: AxiosError): string {
  const errorInfo = parseApiError(error);

  // Return backend message if available
  if (errorInfo.message) {
    return errorInfo.message;
  }

  // Fallback messages
  if (errorInfo.isNetworkError) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (errorInfo.isAuthError) {
    return 'Authentication failed. Please log in again.';
  }

  if (errorInfo.isServerError) {
    return 'Server error occurred. Please try again later.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AxiosError): boolean {
  const errorInfo = parseApiError(error);

  // Don't retry auth errors
  if (errorInfo.isAuthError) {
    return false;
  }

  // Retry network errors and server errors
  return errorInfo.isNetworkError || errorInfo.isServerError;
}

/**
 * Get appropriate toast variant for error
 */
export function getErrorToastVariant(error: AxiosError): 'error' | 'warning' | 'info' {
  const errorInfo = parseApiError(error);

  if (errorInfo.isValidationError) {
    return 'warning';
  }

  if (errorInfo.isAuthError) {
    return 'error';
  }

  if (errorInfo.isServerError) {
    return 'error';
  }

  return 'error';
}