/**
 * Selection Hook
 * 
 * Primitive hook for managing entity selection state.
 * Zero dependencies - can be used anywhere.
 * 
 * @module primitives/hooks/useSelection
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { BaseEntity } from '../types/entity';

/**
 * Selection hook options
 */
export interface UseSelectionOptions<T extends BaseEntity> {
  /** Initial selected IDs */
  initialSelectedIds?: (string | number)[];
  /** All available entities */
  entities?: T[];
  /** Whether to allow multiple selection */
  multiple?: boolean;
  /** Maximum selections allowed */
  maxSelections?: number;
  /** Selection change callback */
  onSelectionChange?: (selectedIds: Set<string | number>, selectedEntities: T[]) => void;
}

/**
 * Selection hook return type
 */
export interface UseSelectionReturn<T extends BaseEntity> {
  /** Selected entity IDs */
  selectedIds: Set<string | number>;
  /** Selected entities */
  selectedEntities: T[];
  /** Whether all entities are selected */
  isAllSelected: boolean;
  /** Whether any entities are selected */
  hasSelection: boolean;
  /** Number of selected entities */
  selectionCount: number;
  /** Select an entity */
  select: (id: string | number) => void;
  /** Deselect an entity */
  deselect: (id: string | number) => void;
  /** Toggle entity selection */
  toggle: (id: string | number) => void;
  /** Select all entities */
  selectAll: () => void;
  /** Deselect all entities */
  deselectAll: () => void;
  /** Clear selection */
  clear: () => void;
  /** Check if entity is selected */
  isSelected: (id: string | number) => boolean;
}

/**
 * Hook for managing entity selection state
 * 
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   selectedEntities,
 *   select,
 *   deselect,
 *   toggle,
 *   selectAll,
 *   clear
 * } = useSelection({ entities: users, multiple: true });
 * ```
 */
export function useSelection<T extends BaseEntity>(
  options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> {
  const {
    initialSelectedIds = [],
    entities = [],
    multiple = true,
    maxSelections,
    onSelectionChange,
  } = options;

  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    () => new Set(initialSelectedIds)
  );

  // Get selected entities
  const selectedEntities = useMemo(() => {
    return entities.filter(entity => selectedIds.has(entity.id));
  }, [entities, selectedIds]);

  // Check if all entities are selected
  const isAllSelected = useMemo(() => {
    if (entities.length === 0) return false;
    return entities.every(entity => selectedIds.has(entity.id));
  }, [entities, selectedIds]);

  // Check if any entities are selected
  const hasSelection = selectedIds.size > 0;

  // Get selection count
  const selectionCount = selectedIds.size;

  // Select an entity
  const select = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      
      // Check if already selected
      if (newSet.has(id)) return prev;
      
      // Check multiple selection
      if (!multiple) {
        newSet.clear();
      }
      
      // Check max selections
      if (maxSelections && newSet.size >= maxSelections) {
        return prev;
      }
      
      newSet.add(id);
      
      // Trigger callback
      if (onSelectionChange) {
        const selected = entities.filter(e => newSet.has(e.id));
        onSelectionChange(newSet, selected);
      }
      
      return newSet;
    });
  }, [multiple, maxSelections, entities, onSelectionChange]);

  // Deselect an entity
  const deselect = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      if (!prev.has(id)) return prev;
      
      const newSet = new Set(prev);
      newSet.delete(id);
      
      // Trigger callback
      if (onSelectionChange) {
        const selected = entities.filter(e => newSet.has(e.id));
        onSelectionChange(newSet, selected);
      }
      
      return newSet;
    });
  }, [entities, onSelectionChange]);

  // Toggle entity selection
  const toggle = useCallback((id: string | number) => {
    if (selectedIds.has(id)) {
      deselect(id);
    } else {
      select(id);
    }
  }, [selectedIds, select, deselect]);

  // Select all entities
  const selectAll = useCallback(() => {
    if (!multiple) return;
    
    setSelectedIds(() => {
      const newSet = new Set(entities.map(e => e.id));
      
      // Check max selections
      if (maxSelections && newSet.size > maxSelections) {
        return selectedIds; // Keep current selection
      }
      
      // Trigger callback
      if (onSelectionChange) {
        onSelectionChange(newSet, entities);
      }
      
      return newSet;
    });
  }, [multiple, maxSelections, entities, selectedIds, onSelectionChange]);

  // Deselect all entities
  const deselectAll = useCallback(() => {
    setSelectedIds(() => {
      const newSet = new Set<string | number>();
      
      // Trigger callback
      if (onSelectionChange) {
        onSelectionChange(newSet, []);
      }
      
      return newSet;
    });
  }, [onSelectionChange]);

  // Clear selection (alias for deselectAll)
  const clear = deselectAll;

  // Check if entity is selected
  const isSelected = useCallback((id: string | number) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  return {
    selectedIds,
    selectedEntities,
    isAllSelected,
    hasSelection,
    selectionCount,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    clear,
    isSelected,
  };
}
