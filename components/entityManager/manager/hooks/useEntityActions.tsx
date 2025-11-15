'use client'

import { useCallback, useMemo, useRef } from 'react'
import { EntityConfig, BaseEntity } from '../types'
import { EntityState, EntityStateActions } from './useEntityState'
import { EntityApiActions, EntityOperationResult } from './useEntityApi'

export interface UseEntityActionsOptions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  state: EntityState<TEntity>
  actions: EntityStateActions<TEntity>
  apiActions: EntityApiActions<TEntity, TFormData>
  cachedData?: { results: TEntity[] } | null
}

export interface ActionState {
  isLoading: boolean
  error: string | null
  lastAction: string | null
  actionHistory: Array<{
    action: string
    timestamp: Date
    data?: unknown
    retryData?: {
      actionFn: () => Promise<unknown>
      retryCount: number
      maxRetries: number
      lastError?: unknown
    }
    undoData?: {
      undoFn: () => Promise<unknown>
      canUndo: boolean
    }
  }>
}

export interface EntityActions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  // Navigation actions
  handleCreate: () => void
  handleEdit: (item: TEntity) => void
  handleView: (item: TEntity) => void
  handleBackToList: () => void

  // Selection actions
  handleSelectItem: (item: TEntity) => void
  handleSelectAll: (items: TEntity[]) => void
  handleDeselectAll: () => void
  handleToggleSelection: (id: string | number) => void
  handleSetSelectedIds: (ids: (string | number)[]) => void

  // CRUD actions
  handleSave: (data: TFormData) => Promise<boolean>
  handleUpdate: (data: Partial<TFormData>) => Promise<boolean>
  handleDelete: (id: string | number) => Promise<boolean>
  handleConfirmDelete: () => Promise<boolean>

  // Data refresh action
  handleRefreshData: () => Promise<boolean>

  // Batch actions
  handleBatchDelete: () => Promise<boolean>
  handleBatchUpdate: (updates: Array<{ id: string | number; data: Partial<TFormData> }>) => Promise<boolean>

  // List actions
  handleSort: (key: string) => void
  handleFilter: (filters: Record<string, unknown>) => void
  handleSearch: (term: string) => void
  handlePageChange: (page: number) => void
  handlePageSizeChange: (size: number) => void

  // Export actions
  handleExport: (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, unknown>) => Promise<boolean>

  // UI actions
  handleOpenDeleteDialog: (id: string | number) => void
  handleCloseDeleteDialog: () => void
  handleOpenBatchDeleteDialog: () => void
  handleCloseBatchDeleteDialog: () => void

  // Utility actions
  handleRetryLastAction: () => Promise<boolean>
  handleClearError: () => void
  handleUndoLastAction: () => Promise<boolean>

  // Action state
  actionState: ActionState
}

export function useEntityActions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>({
  config,
  state,
  actions,
  apiActions,
  cachedData
}: UseEntityActionsOptions<TEntity, TFormData>) {
  // Action state management
  const actionStateRef = useRef<ActionState>({
    isLoading: false,
    error: null,
    lastAction: null,
    actionHistory: []
  })

  // Update action state
  const updateActionState = useCallback((updates: Partial<ActionState>) => {
    actionStateRef.current = { ...actionStateRef.current, ...updates }
  }, [])

  // Add action to history
  const addToActionHistory = useCallback((action: string, data?: unknown, retryData?: ActionState['actionHistory'][0]['retryData'], undoData?: ActionState['actionHistory'][0]['undoData']) => {
    actionStateRef.current.actionHistory.unshift({
      action,
      timestamp: new Date(),
      data,
      retryData,
      undoData
    })
    // Keep only last 10 actions
    if (actionStateRef.current.actionHistory.length > 10) {
      actionStateRef.current.actionHistory = actionStateRef.current.actionHistory.slice(0, 10)
    }
  }, [])

  // Execute action with error handling and state management
  const executeAction = useCallback(async <T,>(
    actionName: string,
    actionFn: () => Promise<T>,
    options: {
      showLoading?: boolean
      onSuccess?: (result: T) => void
      onError?: (error: unknown) => void
      maxRetries?: number
      retryable?: boolean
    } = {}
  ): Promise<T | null> => {
    const { showLoading = true, onSuccess, onError, maxRetries = 3, retryable = true } = options

    const attemptAction = async (attempt: number): Promise<T> => {
      try {
        const result = await actionFn()
        return result
      } catch (error) {
        if (attempt < maxRetries && retryable) {
          // Exponential backoff: wait 2^attempt seconds
          const delay = Math.pow(2, attempt) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
          return attemptAction(attempt + 1)
        }
        throw error
      }
    }

    try {
      if (showLoading) {
        updateActionState({ isLoading: true, error: null })
      }

      updateActionState({ lastAction: actionName })
      addToActionHistory(actionName, undefined, {
        actionFn,
        retryCount: 0,
        maxRetries
      })

      const result = await attemptAction(0)

      if (onSuccess) {
        onSuccess(result)
      }

      updateActionState({ error: null })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      updateActionState({ error: errorMessage })

      // Store retry data for failed actions
      if (retryable) {
        const lastHistoryItem = actionStateRef.current.actionHistory[0]
        if (lastHistoryItem && lastHistoryItem.retryData) {
          lastHistoryItem.retryData.lastError = error
        }
      }

      if (onError) {
        onError(error)
      }

      return null
    } finally {
      updateActionState({ isLoading: false })
    }
  }, [updateActionState, addToActionHistory])

  // Navigation actions
  const handleCreate = useCallback(() => {
    actions.setMode('create')
    actions.setSelectedItem(null)
    addToActionHistory('create_mode')
  }, [actions, addToActionHistory])

  const handleEdit = useCallback((item: TEntity) => {
    actions.setMode('edit')
    actions.setSelectedItem(item)
    addToActionHistory('edit_mode', { itemId: item.id })
  }, [actions, addToActionHistory])

  const handleView = useCallback((item: TEntity) => {
    actions.setMode('view')
    actions.setSelectedItem(item)
    addToActionHistory('view_mode', { itemId: item.id })
  }, [actions, addToActionHistory])

  const handleBackToList = useCallback(() => {
    actions.setMode('list')
    actions.setSelectedItem(null)
    actions.setSelectedIds([])
    addToActionHistory('back_to_list')
  }, [actions, addToActionHistory])

  // Selection actions
  const handleSelectItem = useCallback((item: TEntity) => {
    actions.setSelectedItem(item)
    addToActionHistory('select_item', { itemId: item.id })
  }, [actions, addToActionHistory])

  const handleSelectAll = useCallback((items: TEntity[]) => {
    const ids = items.map(item => item.id)
    actions.setSelectedIds(ids)
    addToActionHistory('select_all', { count: ids.length })
  }, [actions, addToActionHistory])

  const handleDeselectAll = useCallback(() => {
    actions.setSelectedIds([])
    addToActionHistory('deselect_all')
  }, [actions, addToActionHistory])

  const handleToggleSelection = useCallback((id: string | number) => {
    const isSelected = state.selectedIds.includes(id)
    if (isSelected) {
      actions.setSelectedIds(state.selectedIds.filter(selectedId => selectedId !== id))
      addToActionHistory('deselect_item', { itemId: id })
    } else {
      actions.setSelectedIds([...state.selectedIds, id])
      addToActionHistory('select_item', { itemId: id })
    }
  }, [state.selectedIds, actions, addToActionHistory])

  const handleSetSelectedIds = useCallback((ids: (string | number)[]) => {
    actions.setSelectedIds(ids)
    addToActionHistory('set_selected_ids', { count: ids.length })
  }, [actions, addToActionHistory])

  // Data refresh action
  const handleRefreshData = useCallback(async (): Promise<boolean> => {
    return await executeAction('refresh_data', () => apiActions.fetchEntities(true), {
      onSuccess: () => {
        // Data refreshed successfully
      }
    }) !== null
  }, [executeAction, apiActions])

  // CRUD actions
  const handleSave = useCallback(async (data: TFormData): Promise<boolean> => {
    const result = await executeAction('create_entity', () => apiActions.createEntity(data), {
      onSuccess: (operationResult: EntityOperationResult<TEntity>) => {
        if (operationResult.success) {
          actions.setMode('list')
          actions.setSelectedItem(null)
          // Add undo data for create (undo = delete)
          const lastHistoryItem = actionStateRef.current.actionHistory[0]
          if (lastHistoryItem) {
            lastHistoryItem.undoData = {
              canUndo: true,
              undoFn: async () => {
                await apiActions.deleteEntity(operationResult.data.id)
                actions.setMode('list')
                actions.setSelectedItem(null)
              }
            }
          }
        } else {
          // Handle validation errors
          console.error('Validation errors during save:', operationResult.validationErrors)
        }
      }
    })
    return result !== null && 'success' in result && result.success
  }, [executeAction, apiActions, actions])

  const handleUpdate = useCallback(async (data: Partial<TFormData>): Promise<boolean> => {
    if (!state.selectedItem) {
      updateActionState({ error: 'No item selected for update' })
      return false
    }

    const selectedItem = state.selectedItem
    const previousData = { ...selectedItem } // Store previous state for undo

    const result = await executeAction('update_entity', () => apiActions.updateEntity(selectedItem.id, data), {
      onSuccess: (operationResult: EntityOperationResult<TEntity>) => {
        if (operationResult.success) {
          actions.setMode('list')
          actions.setSelectedItem(null)
          // Add undo data for update (undo = revert to previous state)
          const lastHistoryItem = actionStateRef.current.actionHistory[0]
          if (lastHistoryItem) {
            lastHistoryItem.undoData = {
              canUndo: true,
              undoFn: async () => {
                await apiActions.updateEntity(operationResult.data.id, previousData as unknown as Partial<TFormData>)
                actions.setMode('list')
                actions.setSelectedItem(null)
              }
            }
          }
        } else {
          // Handle validation errors
          console.error('Validation errors during update:', operationResult.validationErrors)
        }
      }
    })
    return result !== null && 'success' in result && result.success
  }, [executeAction, apiActions, state.selectedItem, actions, updateActionState])

  const handleDelete = useCallback(async (id: string | number): Promise<boolean> => {
    // Store the entity data before deletion for potential undo
    const entityToDelete = cachedData?.results?.find((item: TEntity) => item.id === id)

    const result = await executeAction('delete_entity', () => apiActions.deleteEntity(id), {
      onSuccess: (success: boolean) => {
        if (success) {
          actions.setDeleteDialog({ open: false })
          if (state.selectedItem?.id === id) {
            actions.setSelectedItem(null)
          }
          // Note: Delete undo is complex and may not be fully reversible
          // depending on backend implementation
          const lastHistoryItem = actionStateRef.current.actionHistory[0]
          if (lastHistoryItem && entityToDelete) {
            lastHistoryItem.undoData = {
              canUndo: false, // Mark as not undoable for now
              undoFn: async () => {
                throw new Error('Delete operations cannot be undone')
              }
            }
          }
        }
      }
    })
    return result === true
  }, [executeAction, apiActions, actions, state.selectedItem, cachedData])

  const handleConfirmDelete = useCallback(async (): Promise<boolean> => {
    if (!state.deleteDialog.id) {
      updateActionState({ error: 'No item selected for deletion' })
      return false
    }

    return await handleDelete(state.deleteDialog.id)
  }, [state.deleteDialog.id, handleDelete, updateActionState])

  // Batch actions
  const handleBatchDelete = useCallback(async (): Promise<boolean> => {
    if (state.selectedIds.length === 0) {
      updateActionState({ error: 'No items selected for batch delete' })
      return false
    }

    const result = await executeAction('batch_delete', () => apiActions.batchDeleteEntities([...state.selectedIds]), {
      onSuccess: (success) => {
        if (success.success) {
          actions.setSelectedIds([])
        }
      }
    })
    return result?.success ?? false
  }, [executeAction, apiActions, state.selectedIds, actions, updateActionState])

  const handleBatchUpdate = useCallback(async (updates: Array<{ id: string | number; data: Partial<TFormData> }>): Promise<boolean> => {
    if (updates.length === 0) {
      updateActionState({ error: 'No updates provided for batch operation' })
      return false
    }

    const result = await executeAction('batch_update', () => apiActions.batchUpdateEntities(updates), {
      onSuccess: (success) => {
        if (success.success) {
          // Batch update completed successfully
        }
      }
    })
    return result?.success ?? false
  }, [executeAction, apiActions, updateActionState])

  // List actions
  const handleSort = useCallback((key: string) => {
    const currentSort = state.sortConfig?.[0]
    const direction = currentSort?.field === key && currentSort.direction === 'asc' ? 'desc' : 'asc'
    actions.setSortConfig([{ field: key, direction }])
    addToActionHistory('sort', { key, direction })
  }, [state.sortConfig, actions, addToActionHistory])

  const handleFilter = useCallback((filters: Record<string, unknown>) => {
    actions.setFilterValues(filters)
    actions.setCurrentPage(1) // Reset to first page when filtering
    addToActionHistory('filter', { filters })
  }, [actions, addToActionHistory])

  const handleSearch = useCallback((term: string) => {
    actions.setSearchTerm(term)
    actions.setCurrentPage(1) // Reset to first page when searching
    addToActionHistory('search', { term })
  }, [actions, addToActionHistory])

  const handlePageChange = useCallback((page: number) => {
    actions.setCurrentPage(page)
    addToActionHistory('page_change', { page })
  }, [actions, addToActionHistory])

  const handlePageSizeChange = useCallback((size: number) => {
    actions.setPageSize(size)
    actions.setCurrentPage(1) // Reset to first page when changing page size
    addToActionHistory('page_size_change', { size })
  }, [actions, addToActionHistory])

  // Export actions
  const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, unknown>): Promise<boolean> => {
    const result = await executeAction('export', () => apiActions.exportEntities(format, filters), {
      onSuccess: (blob) => {
        if (blob) {
          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${config.entityName.toLowerCase()}_export.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      }
    })
    return result !== null
  }, [executeAction, apiActions, config.entityName])

  // UI actions
  const handleOpenDeleteDialog = useCallback((id: string | number) => {
    actions.setDeleteDialog({ open: true, id })
    addToActionHistory('open_delete_dialog', { itemId: id })
  }, [actions, addToActionHistory])

  const handleCloseDeleteDialog = useCallback(() => {
    actions.setDeleteDialog({ open: false })
    addToActionHistory('close_delete_dialog')
  }, [actions, addToActionHistory])

  const handleOpenBatchDeleteDialog = useCallback(() => {
    if (state.selectedIds.length === 0) {
      updateActionState({ error: 'No items selected for batch deletion' })
      return
    }
    actions.setBatchDeleteDialog({ open: true })
    addToActionHistory('open_batch_delete_dialog', { count: state.selectedIds.length })
  }, [state.selectedIds, actions, updateActionState, addToActionHistory])

  const handleCloseBatchDeleteDialog = useCallback(() => {
    actions.setBatchDeleteDialog({ open: false })
    addToActionHistory('close_batch_delete_dialog')
  }, [actions, addToActionHistory])

  // Utility actions
  const handleRetryLastAction = useCallback(async (): Promise<boolean> => {
    const lastHistoryItem = actionStateRef.current.actionHistory[0]
    if (!lastHistoryItem || !lastHistoryItem.retryData) {
      updateActionState({ error: 'No action to retry' })
      return false
    }

    const { actionFn, retryCount, maxRetries } = lastHistoryItem.retryData

    if (retryCount >= maxRetries) {
      updateActionState({ error: 'Maximum retry attempts exceeded' })
      return false
    }

    try {
      updateActionState({ isLoading: true, error: null })

      // Increment retry count
      lastHistoryItem.retryData.retryCount += 1

      const result = await actionFn()

      updateActionState({ error: null })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retry failed'
      updateActionState({ error: errorMessage })

      // Update last error
      lastHistoryItem.retryData.lastError = error

      return false
    } finally {
      updateActionState({ isLoading: false })
    }
  }, [updateActionState])

  const handleClearError = useCallback(() => {
    updateActionState({ error: null })
  }, [updateActionState])

  const handleUndoLastAction = useCallback(async (): Promise<boolean> => {
    const lastHistoryItem = actionStateRef.current.actionHistory[0]
    if (!lastHistoryItem || !lastHistoryItem.undoData?.canUndo || !lastHistoryItem.undoData.undoFn) {
      updateActionState({ error: 'No reversible action to undo' })
      return false
    }

    try {
      updateActionState({ isLoading: true, error: null })

      await lastHistoryItem.undoData.undoFn()

      // Remove the undone action from history
      actionStateRef.current.actionHistory.shift()

      updateActionState({ error: null })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Undo failed'
      updateActionState({ error: errorMessage })
      return false
    } finally {
      updateActionState({ isLoading: false })
    }
  }, [updateActionState])

  // Memoized action state for external access
  const actionState = useMemo(() => actionStateRef.current, [])

  const entityActions: EntityActions<TEntity, TFormData> = useMemo(() => ({
    handleCreate,
    handleEdit,
    handleView,
    handleBackToList,
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleToggleSelection,
    handleSetSelectedIds,
    handleSave,
    handleUpdate,
    handleDelete,
    handleConfirmDelete,
    handleRefreshData,
    handleBatchDelete,
    handleBatchUpdate,
    handleSort,
    handleFilter,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleExport,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenBatchDeleteDialog,
    handleCloseBatchDeleteDialog,
    handleRetryLastAction,
    handleClearError,
    handleUndoLastAction,
    actionState
  }), [
    handleCreate,
    handleEdit,
    handleView,
    handleBackToList,
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleToggleSelection,
    handleSetSelectedIds,
    handleSave,
    handleUpdate,
    handleDelete,
    handleConfirmDelete,
    handleRefreshData,
    handleBatchDelete,
    handleBatchUpdate,
    handleSort,
    handleFilter,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleExport,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenBatchDeleteDialog,
    handleCloseBatchDeleteDialog,
    handleRetryLastAction,
    handleClearError,
    handleUndoLastAction,
    actionState
  ])

  return entityActions
}