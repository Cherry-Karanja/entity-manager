/**
 * Tests for useSort hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSort } from '../../primitives/hooks';

describe('useSort', () => {
  describe('initialization', () => {
    it('should initialize with no sort', () => {
      const { result } = renderHook(() => useSort());

      expect(result.current.sort).toBeNull();
      expect(result.current.field).toBeNull();
      expect(result.current.direction).toBeNull();
      expect(result.current.isSorted).toBe(false);
    });

    it('should initialize with provided sort', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      expect(result.current.field).toBe('name');
      expect(result.current.direction).toBe('asc');
      expect(result.current.isSorted).toBe(true);
    });
  });

  describe('setSort', () => {
    it('should set sort field and direction', () => {
      const { result } = renderHook(() => useSort());

      act(() => {
        result.current.setSort('name', 'asc');
      });

      expect(result.current.field).toBe('name');
      expect(result.current.direction).toBe('asc');
      expect(result.current.isSorted).toBe(true);
    });

    it('should update sort direction', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      act(() => {
        result.current.setSort('name', 'desc');
      });

      expect(result.current.direction).toBe('desc');
    });
  });

  describe('toggleSort', () => {
    it('should toggle from null to asc', () => {
      const { result } = renderHook(() => useSort());

      act(() => {
        result.current.toggleSort('name');
      });

      expect(result.current.field).toBe('name');
      expect(result.current.direction).toBe('asc');
    });

    it('should toggle from asc to desc', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      act(() => {
        result.current.toggleSort('name');
      });

      expect(result.current.direction).toBe('desc');
    });

    it('should toggle from desc to null', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'desc'
      }));

      act(() => {
        result.current.toggleSort('name');
      });

      expect(result.current.sort).toBeNull();
      expect(result.current.field).toBeNull();
      expect(result.current.direction).toBeNull();
    });

    it('should switch to new field when toggling different field', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      act(() => {
        result.current.toggleSort('email');
      });

      expect(result.current.field).toBe('email');
      expect(result.current.direction).toBe('asc');
    });
  });

  describe('clearSort', () => {
    it('should clear sort', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      act(() => {
        result.current.clearSort();
      });

      expect(result.current.sort).toBeNull();
      expect(result.current.field).toBeNull();
      expect(result.current.direction).toBeNull();
      expect(result.current.isSorted).toBe(false);
    });
  });

  describe('isSortedBy', () => {
    it('should check if field is sorted', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'asc'
      }));

      expect(result.current.isSortedBy('name')).toBe(true);
      expect(result.current.isSortedBy('email')).toBe(false);
    });
  });

  describe('getSortDirection', () => {
    it('should get sort direction for field', () => {
      const { result } = renderHook(() => useSort({
        initialField: 'name',
        initialDirection: 'desc'
      }));

      expect(result.current.getSortDirection('name')).toBe('desc');
      expect(result.current.getSortDirection('email')).toBeNull();
    });
  });
});
