/**
 * Tests for usePagination hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../primitives/hooks';

describe('usePagination', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.page).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should initialize with custom values', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 2,
        initialPageSize: 25,
        totalCount: 100
      }));

      expect(result.current.page).toBe(2);
      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalCount).toBe(100);
      expect(result.current.totalPages).toBe(4); // 100 / 25 = 4
    });
  });

  describe('navigation', () => {
    it('should go to next page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 1,
        totalCount: 100,
        initialPageSize: 10
      }));

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.page).toBe(2);
    });

    it('should go to previous page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 2,
        totalCount: 100,
        initialPageSize: 10
      }));

      act(() => {
        result.current.previousPage();
      });

      expect(result.current.page).toBe(1);
    });

    it('should go to specific page', () => {
      const { result } = renderHook(() => usePagination({
        totalCount: 100,
        initialPageSize: 10
      }));

      act(() => {
        result.current.goToPage(5);
      });

      expect(result.current.page).toBe(5);
    });

    it('should go to first page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 5,
        totalCount: 100,
        initialPageSize: 10
      }));

      act(() => {
        result.current.firstPage();
      });

      expect(result.current.page).toBe(1);
    });

    it('should go to last page', () => {
      const { result } = renderHook(() => usePagination({
        totalCount: 100,
        initialPageSize: 10
      }));

      act(() => {
        result.current.lastPage();
      });

      expect(result.current.page).toBe(10);
    });
  });

  describe('page flags', () => {
    it('should indicate has next page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 1,
        totalCount: 100,
        initialPageSize: 10
      }));

      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);
    });

    it('should indicate has previous page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 5,
        totalCount: 100,
        initialPageSize: 10
      }));

      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(true);
      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(false);
    });

    it('should indicate is last page', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 10,
        totalCount: 100,
        initialPageSize: 10
      }));

      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPreviousPage).toBe(true);
      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe('setPageSize', () => {
    it('should change page size', () => {
      const { result } = renderHook(() => usePagination({
        totalCount: 100,
        initialPageSize: 10,
        pageSizeOptions: [10, 25, 50]
      }));

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalPages).toBe(4); // 100 / 25 = 4
    });

    it('should reset to first page when changing size', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 5,
        totalCount: 100,
        initialPageSize: 10,
        pageSizeOptions: [10, 25, 50]
      }));

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.page).toBe(1);
    });
  });

  describe('indices', () => {
    it('should calculate start and end indices', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 2,
        totalCount: 100,
        initialPageSize: 10
      }));

      expect(result.current.startIndex).toBe(10); // (2-1) * 10
      expect(result.current.endIndex).toBe(20); // min(10 + 10, 100)
    });
  });

  describe('reset', () => {
    it('should reset pagination to initial values', () => {
      const { result } = renderHook(() => usePagination({
        initialPage: 1,
        initialPageSize: 10,
        totalCount: 100
      }));

      act(() => {
        result.current.goToPage(5);
        result.current.setPageSize(25);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.page).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalCount).toBe(100);
    });
  });
});
