/**
 * Tests for useSelection hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from '../../primitives/hooks';
import { createMockUsers } from '../testUtils';
import type { BaseEntity } from '../../primitives/types/entity';

interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

describe('useSelection', () => {
  const mockUsers = createMockUsers(10) as User[];

  describe('initialization', () => {
    it('should initialize with no selection', () => {
      const { result } = renderHook(() => useSelection<User>());

      expect(result.current.selectedIds).toEqual(new Set());
      expect(result.current.selectionCount).toBe(0);
      expect(result.current.hasSelection).toBe(false);
    });

    it('should initialize with provided IDs', () => {
      const { result } = renderHook(() => useSelection<User>({
        initialSelectedIds: [mockUsers[0].id, mockUsers[1].id],
        entities: mockUsers
      }));

      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.selectionCount).toBe(2);
      expect(result.current.selectedEntities).toHaveLength(2);
    });
  });

  describe('select', () => {
    it('should select an entity', () => {
      const { result } = renderHook(() => useSelection<User>({ entities: mockUsers }));

      act(() => {
        result.current.select(mockUsers[0].id);
      });

      expect(result.current.selectedIds.has(mockUsers[0].id)).toBe(true);
      expect(result.current.selectionCount).toBe(1);
    });

    it('should select multiple entities', () => {
      const { result } = renderHook(() => useSelection<User>({ 
        entities: mockUsers,
        multiple: true
      }));

      act(() => {
        result.current.select(mockUsers[0].id);
        result.current.select(mockUsers[1].id);
      });

      expect(result.current.selectionCount).toBe(2);
      expect(result.current.selectedEntities).toHaveLength(2);
    });
  });

  describe('deselect', () => {
    it('should deselect an entity', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id]
      }));

      act(() => {
        result.current.deselect(mockUsers[0].id);
      });

      expect(result.current.selectedIds.has(mockUsers[0].id)).toBe(false);
      expect(result.current.selectionCount).toBe(0);
    });
  });

  describe('toggle', () => {
    it('should toggle selection on', () => {
      const { result } = renderHook(() => useSelection<User>({ entities: mockUsers }));

      act(() => {
        result.current.toggle(mockUsers[0].id);
      });

      expect(result.current.selectedIds.has(mockUsers[0].id)).toBe(true);
    });

    it('should toggle selection off', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id]
      }));

      act(() => {
        result.current.toggle(mockUsers[0].id);
      });

      expect(result.current.selectedIds.has(mockUsers[0].id)).toBe(false);
    });
  });

  describe('selectAll', () => {
    it('should select all entities', () => {
      const { result } = renderHook(() => useSelection<User>({ entities: mockUsers }));

      act(() => {
        result.current.selectAll();
      });

      expect(result.current.selectionCount).toBe(mockUsers.length);
      expect(result.current.isAllSelected).toBe(true);
    });
  });

  describe('deselectAll / clear', () => {
    it('should deselect all entities', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id, mockUsers[1].id]
      }));

      act(() => {
        result.current.deselectAll();
      });

      expect(result.current.selectionCount).toBe(0);
      expect(result.current.isAllSelected).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should compute selectedEntities', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id, mockUsers[1].id]
      }));

      expect(result.current.selectedEntities).toHaveLength(2);
      expect(result.current.selectedEntities).toEqual([mockUsers[0], mockUsers[1]]);
    });

    it('should compute isAllSelected', () => {
      const allIds = mockUsers.map(u => u.id);
      const { result } = renderHook(() => useSelection<User>({ 
        entities: mockUsers,
        initialSelectedIds: allIds
      }));

      expect(result.current.isAllSelected).toBe(true);
    });

    it('should compute hasSelection', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id]
      }));

      expect(result.current.hasSelection).toBe(true);
    });
  });

  describe('isSelected', () => {
    it('should check if entity is selected', () => {
      const { result } = renderHook(() => useSelection<User>({
        entities: mockUsers,
        initialSelectedIds: [mockUsers[0].id]
      }));

      expect(result.current.isSelected(mockUsers[0].id)).toBe(true);
      expect(result.current.isSelected(mockUsers[1].id)).toBe(false);
    });
  });
});
