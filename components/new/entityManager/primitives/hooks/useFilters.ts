/**
 * Filters Hook
 * 
 * Primitive hook for managing filter state.
 * Zero dependencies - can be used anywhere.
 * 
 * @module primitives/hooks/useFilters
 */

'use client';

import { useState, useCallback } from 'react';
import type { FilterConfig, FilterOperator } from '../types/entity';

/**
 * Filters hook options
 */
export interface UseFiltersOptions {
  /** Initial filters */
  initialFilters?: FilterConfig[];
  /** Filter change callback */
  onFiltersChange?: (filters: FilterConfig[]) => void;
}

/**
 * Filters hook return type
 */
export interface UseFiltersReturn {
  /** Current filters */
  filters: FilterConfig[];
  /** Whether any filters are active */
  hasFilters: boolean;
  /** Number of active filters */
  filterCount: number;
  /** Add a filter */
  addFilter: (field: string, operator: FilterOperator, value: unknown) => void;
  /** Remove a filter */
  removeFilter: (field: string) => void;
  /** Update a filter */
  updateFilter: (field: string, operator: FilterOperator, value: unknown) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Get filter for a field */
  getFilter: (field: string) => FilterConfig | undefined;
  /** Check if field has filter */
  hasFilter: (field: string) => boolean;
  /** Set multiple filters at once */
  setFilters: (filters: FilterConfig[]) => void;
}

/**
 * Hook for managing filter state
 * 
 * @example
 * ```tsx
 * const {
 *   filters,
 *   addFilter,
 *   removeFilter,
 *   clearFilters
 * } = useFilters({
 *   initialFilters: [{ field: 'status', operator: 'equals', value: 'active' }]
 * });
 * ```
 */
export function useFilters(
  options: UseFiltersOptions = {}
): UseFiltersReturn {
  const {
    initialFilters = [],
    onFiltersChange,
  } = options;

  const [filters, setFiltersState] = useState<FilterConfig[]>(initialFilters);

  // Check if any filters are active
  const hasFilters = filters.length > 0;

  // Get filter count
  const filterCount = filters.length;

  // Add a filter
  const addFilter = useCallback((
    field: string,
    operator: FilterOperator,
    value: unknown
  ) => {
    setFiltersState(prev => {
      // Check if filter already exists for this field
      const existingIndex = prev.findIndex(f => f.field === field);
      
      const newFilter: FilterConfig = { field, operator, value };
      
      let newFilters: FilterConfig[];
      if (existingIndex >= 0) {
        // Update existing filter
        newFilters = [...prev];
        newFilters[existingIndex] = newFilter;
      } else {
        // Add new filter
        newFilters = [...prev, newFilter];
      }
      
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFiltersChange]);

  // Remove a filter
  const removeFilter = useCallback((field: string) => {
    setFiltersState(prev => {
      const newFilters = prev.filter(f => f.field !== field);
      
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFiltersChange]);

  // Update a filter
  const updateFilter = useCallback((
    field: string,
    operator: FilterOperator,
    value: unknown
  ) => {
    setFiltersState(prev => {
      const existingIndex = prev.findIndex(f => f.field === field);
      
      if (existingIndex < 0) {
        return prev; // Filter doesn't exist, don't update
      }
      
      const newFilters = [...prev];
      newFilters[existingIndex] = { field, operator, value };
      
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFiltersChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState([]);
    
    if (onFiltersChange) {
      onFiltersChange([]);
    }
  }, [onFiltersChange]);

  // Get filter for a field
  const getFilter = useCallback((field: string) => {
    return filters.find(f => f.field === field);
  }, [filters]);

  // Check if field has filter
  const hasFilter = useCallback((field: string) => {
    return filters.some(f => f.field === field);
  }, [filters]);

  // Set multiple filters at once
  const setFilters = useCallback((newFilters: FilterConfig[]) => {
    setFiltersState(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  }, [onFiltersChange]);

  return {
    filters,
    hasFilters,
    filterCount,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    getFilter,
    hasFilter,
    setFilters,
  };
}
