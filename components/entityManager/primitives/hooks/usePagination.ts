/**
 * Pagination Hook
 * 
 * Primitive hook for managing pagination state.
 * Zero dependencies - can be used anywhere.
 * 
 * @module primitives/hooks/usePagination
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * Pagination hook options
 */
export interface UsePaginationOptions {
  /** Initial page number (1-indexed) */
  initialPage?: number;
  /** Initial page size */
  initialPageSize?: number;
  /** Total count of items */
  totalCount?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Page change callback */
  onPageChange?: (page: number, pageSize: number) => void;
}

/**
 * Pagination hook return type
 */
export interface UsePaginationReturn {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total count of items */
  totalCount: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
  /** Whether on first page */
  isFirstPage: boolean;
  /** Whether on last page */
  isLastPage: boolean;
  /** Start index of current page items (0-indexed) */
  startIndex: number;
  /** End index of current page items (0-indexed, exclusive) */
  endIndex: number;
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Change page size */
  setPageSize: (pageSize: number) => void;
  /** Set total count */
  setTotalCount: (count: number) => void;
  /** Reset pagination */
  reset: () => void;
}

/**
 * Hook for managing pagination state
 * 
 * @example
 * ```tsx
 * const {
 *   page,
 *   pageSize,
 *   totalPages,
 *   goToPage,
 *   nextPage,
 *   previousPage
 * } = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 10,
 *   totalCount: 100
 * });
 * ```
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalCount: initialTotalCount = 0,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  // Check if there are more pages
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || totalPages === 0;

  // Calculate start and end indices
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  // Go to specific page
  const goToPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
    setPage(validPage);
    
    if (onPageChange) {
      onPageChange(validPage, pageSize);
    }
  }, [totalPages, pageSize, onPageChange]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  }, [hasNextPage, page, goToPage]);

  // Go to previous page
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(page - 1);
    }
  }, [hasPreviousPage, page, goToPage]);

  // Go to first page
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  // Go to last page
  const lastPage = useCallback(() => {
    if (totalPages > 0) {
      goToPage(totalPages);
    }
  }, [totalPages, goToPage]);

  // Change page size
  const setPageSize = useCallback((newPageSize: number) => {
    // Validate page size
    const validPageSize = pageSizeOptions.includes(newPageSize)
      ? newPageSize
      : pageSizeOptions[0];
    
    setPageSizeState(validPageSize);
    
    // Reset to first page when changing page size
    setPage(1);
    
    if (onPageChange) {
      onPageChange(1, validPageSize);
    }
  }, [pageSizeOptions, onPageChange]);

  // Reset pagination
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSizeState(initialPageSize);
    setTotalCount(initialTotalCount);
  }, [initialPage, initialPageSize, initialTotalCount]);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    setTotalCount,
    reset,
  };
}
