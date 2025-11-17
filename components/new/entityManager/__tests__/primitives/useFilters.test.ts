/**
 * Tests for useFilters hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../../primitives/hooks';

describe('useFilters', () => {
  describe('initialization', () => {
    it('should initialize with empty filters', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual([]);
      expect(result.current.hasFilters).toBe(false);
      expect(result.current.filterCount).toBe(0);
    });

    it('should initialize with provided filters', () => {
      const initialFilters = [{ field: 'role', operator: 'equals' as const, value: 'admin' }];
      const { result } = renderHook(() => useFilters({ initialFilters }));

      expect(result.current.filters).toEqual(initialFilters);
      expect(result.current.hasFilters).toBe(true);
      expect(result.current.filterCount).toBe(1);
    });
  });

  describe('addFilter', () => {
    it('should add a filter', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.addFilter('role', 'equals', 'admin');
      });

      expect(result.current.filters).toHaveLength(1);
      expect(result.current.filters[0]).toEqual({
        field: 'role',
        operator: 'equals',
        value: 'admin'
      });
    });

    it('should update existing filter for same field', () => {
      const { result } = renderHook(() => useFilters({
        initialFilters: [{ field: 'role', operator: 'equals' as const, value: 'admin' }]
      }));

      act(() => {
        result.current.addFilter('role', 'equals', 'user');
      });

      expect(result.current.filters).toHaveLength(1);
      expect(result.current.filters[0].value).toBe('user');
    });
  });

  describe('removeFilter', () => {
    it('should remove a filter', () => {
      const { result } = renderHook(() => useFilters({
        initialFilters: [
          { field: 'role', operator: 'equals' as const, value: 'admin' },
          { field: 'status', operator: 'equals' as const, value: 'active' }
        ]
      }));

      act(() => {
        result.current.removeFilter('role');
      });

      expect(result.current.filters).toHaveLength(1);
      expect(result.current.filters[0].field).toBe('status');
    });
  });

  describe('updateFilter', () => {
    it('should update a filter', () => {
      const { result } = renderHook(() => useFilters({
        initialFilters: [{ field: 'role', operator: 'equals' as const, value: 'admin' }]
      }));

      act(() => {
        result.current.updateFilter('role', 'contains', 'user');
      });

      expect(result.current.filters[0]).toEqual({
        field: 'role',
        operator: 'contains',
        value: 'user'
      });
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() => useFilters({
        initialFilters: [
          { field: 'role', operator: 'equals' as const, value: 'admin' },
          { field: 'status', operator: 'equals' as const, value: 'active' }
        ]
      }));

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual([]);
      expect(result.current.hasFilters).toBe(false);
    });
  });

  describe('getFilter', () => {
    it('should get filter for a field', () => {
      const filter = { field: 'role', operator: 'equals' as const, value: 'admin' };
      const { result } = renderHook(() => useFilters({
        initialFilters: [filter]
      }));

      const found = result.current.getFilter('role');
      expect(found).toEqual(filter);
    });

    it('should return undefined for non-existent field', () => {
      const { result } = renderHook(() => useFilters());

      const found = result.current.getFilter('role');
      expect(found).toBeUndefined();
    });
  });

  describe('hasFilter', () => {
    it('should check if field has filter', () => {
      const { result } = renderHook(() => useFilters({
        initialFilters: [{ field: 'role', operator: 'equals' as const, value: 'admin' }]
      }));

      expect(result.current.hasFilter('role')).toBe(true);
      expect(result.current.hasFilter('status')).toBe(false);
    });
  });
});
