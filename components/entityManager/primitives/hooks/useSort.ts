/**
 * Sort Hook
 * 
 * Primitive hook for managing sort state.
 * Zero dependencies - can be used anywhere.
 * 
 * @module primitives/hooks/useSort
 */

'use client';

import { useState, useCallback } from 'react';
import type { SortConfig, SortDirection } from '../types/entity';

/**
 * Sort hook options
 */
export interface UseSortOptions {
  /** Initial sort field */
  initialField?: string;
  /** Initial sort direction */
  initialDirection?: SortDirection;
  /** Sort change callback */
  onSortChange?: (sort: SortConfig | null) => void;
  /** Whether to allow multiple sorts */
  multiple?: boolean;
}

/**
 * Sort hook return type
 */
export interface UseSortReturn {
  /** Current sort configuration */
  sort: SortConfig | null;
  /** Current sort field */
  field: string | null;
  /** Current sort direction */
  direction: SortDirection | null;
  /** Whether sorting is active */
  isSorted: boolean;
  /** Set sort field and direction */
  setSort: (field: string, direction: SortDirection) => void;
  /** Toggle sort for a field */
  toggleSort: (field: string) => void;
  /** Clear sort */
  clearSort: () => void;
  /** Check if field is sorted */
  isSortedBy: (field: string) => boolean;
  /** Get sort direction for a field */
  getSortDirection: (field: string) => SortDirection | null;
}

/**
 * Hook for managing sort state
 * 
 * @example
 * ```tsx
 * const {
 *   sort,
 *   setSort,
 *   toggleSort,
 *   clearSort
 * } = useSort({
 *   initialField: 'createdAt',
 *   initialDirection: 'desc'
 * });
 * ```
 */
export function useSort(
  options: UseSortOptions = {}
): UseSortReturn {
  const {
    initialField,
    initialDirection = 'asc',
    onSortChange,
  } = options;

  const [sort, setSortState] = useState<SortConfig | null>(() => {
    if (initialField) {
      return { field: initialField, direction: initialDirection };
    }
    return null;
  });

  // Get current field and direction
  const field = sort?.field ?? null;
  const direction = sort?.direction ?? null;

  // Check if sorting is active
  const isSorted = sort !== null;

  // Set sort field and direction
  const setSort = useCallback((newField: string, newDirection: SortDirection) => {
    const newSort: SortConfig = { field: newField, direction: newDirection };
    setSortState(newSort);
    
    if (onSortChange) {
      onSortChange(newSort);
    }
  }, [onSortChange]);

  // Toggle sort for a field
  const toggleSort = useCallback((toggleField: string) => {
    setSortState(prev => {
      let newSort: SortConfig | null;
      
      if (!prev || prev.field !== toggleField) {
        // New field - sort ascending
        newSort = { field: toggleField, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Same field, was ascending - switch to descending
        newSort = { field: toggleField, direction: 'desc' };
      } else {
        // Same field, was descending - clear sort
        newSort = null;
      }
      
      if (onSortChange) {
        onSortChange(newSort);
      }
      
      return newSort;
    });
  }, [onSortChange]);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortState(null);
    
    if (onSortChange) {
      onSortChange(null);
    }
  }, [onSortChange]);

  // Check if field is sorted
  const isSortedBy = useCallback((checkField: string) => {
    return sort?.field === checkField;
  }, [sort]);

  // Get sort direction for a field
  const getSortDirection = useCallback((checkField: string) => {
    if (sort?.field === checkField) {
      return sort.direction;
    }
    return null;
  }, [sort]);

  return {
    sort,
    field,
    direction,
    isSorted,
    setSort,
    toggleSort,
    clearSort,
    isSortedBy,
    getSortDirection,
  };
}
