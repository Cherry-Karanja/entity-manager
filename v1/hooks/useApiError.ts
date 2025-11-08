"use client";

import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  parseApiError,
  getErrorMessage,
  getErrorToastVariant,
  isRetryableError,
  ErrorInfo
} from '@/utils/errorHandling';

interface UseApiErrorOptions {
  showToast?: boolean;
  toastMessage?: string;
  onError?: (error: ErrorInfo) => void;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface UseApiErrorReturn {
  error: ErrorInfo | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: AxiosError) => ErrorInfo;
  retry: () => void;
}

/**
 * Hook for standardized API error handling
 */
export function useApiError(options: UseApiErrorOptions = {}): UseApiErrorReturn {
  const {
    showToast = true,
    toastMessage,
    onError,
    retryOnError = false,
    maxRetries = 3
  } = options;

  const [error, setError] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const handleError = useCallback((axiosError: AxiosError): ErrorInfo => {
    const errorInfo = parseApiError(axiosError);
    setError(errorInfo);

    // Show toast notification
    if (showToast) {
      const message = toastMessage || getErrorMessage(axiosError);
      const variant = getErrorToastVariant(axiosError);

      if (variant === 'error') {
        toast.error(message);
      } else if (variant === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    }

    // Call custom error handler
    if (onError) {
      onError(errorInfo);
    }

    return errorInfo;
  }, [showToast, toastMessage, onError]);

  const retry = useCallback(() => {
    if (error && isRetryableError({ response: { status: error.statusCode } } as AxiosError) && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // The actual retry logic should be implemented by the caller
      // This just tracks the retry state
    }
  }, [error, retryCount, maxRetries]);

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
    retry
  };
}

/**
 * Enhanced mutation hook with standardized error handling
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiErrorOptions & {
    onSuccess?: (data: TData) => void;
    onError?: (error: ErrorInfo) => void;
    successMessage?: string;
  } = {}
) {
  const {
    onSuccess,
    onError,
    successMessage,
    ...errorOptions
  } = options;

  const { handleError } = useApiError(errorOptions);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: AxiosError) => {
      const errorInfo = handleError(error);
      if (onError) {
        onError(errorInfo);
      }
    }
  });
}

/**
 * Utility function to create error boundary compatible error
 */
export function createErrorBoundaryError(error: AxiosError): Error {
  const errorInfo = parseApiError(error);
  const boundaryError = new Error(errorInfo.message);
  boundaryError.name = errorInfo.code;
  boundaryError.cause = error;
  return boundaryError;
}