'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useDebounceSearch } from '../../../../hooks/useDebounce'
import { EntityConfig, BaseEntity } from '../types'
import { EntityListSort } from '../../EntityList/types'
import { validateEntityConfig } from '../validation'

export interface UseEntityStateOptions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  initialMode?: 'list' | 'create' | 'edit' | 'view'
  enablePersistence?: boolean
  persistenceKey?: string
  cacheTimeout?: number // in milliseconds
  validateConfig?: boolean
}

export interface EntityState<TEntity extends BaseEntity> {
  // Navigation state
  readonly currentPage: number
  readonly pageSize: number
  readonly mode: 'list' | 'create' | 'edit' | 'view'
  readonly selectedItem: TEntity | null
  readonly selectedIds: readonly (string | number)[]

  // List state
  readonly sortConfig: readonly EntityListSort[] | undefined
  readonly filterValues: Readonly<Record<string, unknown>>
  readonly searchTerm: string
  readonly debouncedSearchTerm: string
  readonly fields?: string | string[]
  readonly expand?: string | string[]

  // UI state
  readonly deleteDialog: { readonly open: boolean; readonly id?: string | number }
  readonly batchDeleteDialog: { readonly open: boolean }
  readonly isLoading: boolean
  readonly error: string | null

  // Cache state
  readonly paginationCache: Readonly<Record<string, { readonly data: { readonly results: readonly TEntity[]; readonly count: number; readonly next: string | null; readonly previous: string | null }; readonly timestamp: number }>>
  readonly hasLoadedOnce: boolean
  readonly lastUpdated: number
}

export interface EntityStateActions<TEntity extends BaseEntity> {
  // Navigation actions
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  setMode: (mode: 'list' | 'create' | 'edit' | 'view') => void
  setSelectedItem: (item: TEntity | null) => void
  setSelectedIds: (ids: readonly (string | number)[]) => void

  // List actions
  setSortConfig: (config: readonly EntityListSort[] | undefined) => void
  setFilterValues: (values: Record<string, unknown>) => void
  setSearchTerm: (term: string) => void
  setFields: (fields: string | string[] | undefined) => void
  setExpand: (expand: string | string[] | undefined) => void

  // UI actions
  setDeleteDialog: (dialog: { open: boolean; id?: string | number }) => void
  setBatchDeleteDialog: (dialog: { open: boolean }) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Cache actions
  updatePaginationCache: (key: string, data: { results: TEntity[]; count: number; next: string | null; previous: string | null }) => void
  clearPaginationCache: () => void
  setHasLoadedOnce: (loaded: boolean) => void

  // Utility actions
  resetState: () => void
  resetFilters: () => void
  resetSelection: () => void
}

// Cache entry with TTL
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// Persistence state
interface PersistedState {
  currentPage: number
  pageSize: number
  sortConfig?: readonly EntityListSort[]
  filterValues: Record<string, unknown>
  searchTerm: string
}

// Constants
const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const DEFAULT_PAGE_SIZE = 10
const STORAGE_KEY_PREFIX = 'entityManager_state_'

function createCacheKey(page: number, pageSize: number, sortConfig?: readonly EntityListSort[], filterValues?: Record<string, unknown>, searchTerm?: string): string {
  const params = {
    page,
    page_size: pageSize,
    search: searchTerm,
    ordering: sortConfig && sortConfig.length > 0
      ? sortConfig.map(s => `${s.direction === 'desc' ? '-' : ''}${s.field}`).join(',')
      : undefined,
    ...filterValues
  }
  return JSON.stringify(params)
}

function isCacheValid<T>(entry: CacheEntry<T>, timeout: number): boolean {
  return Date.now() - entry.timestamp < timeout
}

function loadPersistedState(key: string): Partial<PersistedState> | null {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Failed to load persisted state:', error)
    return null
  }
}

function savePersistedState(key: string, state: PersistedState): void {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save persisted state:', error)
  }
}

export function useEntityState<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>({
  config,
  initialMode = 'list',
  enablePersistence = false,
  persistenceKey,
  cacheTimeout = DEFAULT_CACHE_TIMEOUT,
  validateConfig = true
}: UseEntityStateOptions<TEntity, TFormData>) {
  // Validate config if requested
  if (validateConfig && !validateEntityConfig(config)) {
    throw new Error('Invalid entity configuration provided to useEntityState')
  }

  // Persistence key
  const storageKey = useMemo(() => {
    return persistenceKey || `${STORAGE_KEY_PREFIX}${config.name}`
  }, [persistenceKey, config.name])

  // Load persisted state
  const persistedState = useMemo(() => {
    return enablePersistence ? loadPersistedState(storageKey) : null
  }, [enablePersistence, storageKey])

  // Navigation state
  const [currentPage, setCurrentPage] = useState(persistedState?.currentPage ?? 1)
  const [pageSize, setPageSize] = useState(persistedState?.pageSize ?? config.listConfig.pageSize ?? DEFAULT_PAGE_SIZE)
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>(initialMode)
  const [selectedItem, setSelectedItem] = useState<TEntity | null>(null)
  const [selectedIds, setSelectedIds] = useState<readonly (string | number)[]>([])

  // List state
  const [sortConfig, setSortConfig] = useState<readonly EntityListSort[] | undefined>(
    persistedState?.sortConfig ?? (
      config.listConfig.defaultSort
        ? [{ field: config.listConfig.defaultSort.field, direction: config.listConfig.defaultSort.direction }]
        : undefined
    )
  )
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(persistedState?.filterValues ?? {})
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebounceSearch(persistedState?.searchTerm ?? '', 300)
  const [fields, setFields] = useState<string | string[] | undefined>(config.listConfig.fields)
  const [expand, setExpand] = useState<string | string[] | undefined>(config.listConfig.expand)

  // UI state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string | number }>({ open: false })
  const [batchDeleteDialog, setBatchDeleteDialog] = useState<{ open: boolean }>({ open: false })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache state
  const [paginationCache, setPaginationCache] = useState<Record<string, CacheEntry<{ results: TEntity[]; count: number; next: string | null; previous: string | null }>>>({})
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(0)

  // Refs for tracking changes
  const lastPersistedState = useRef<PersistedState | null>(null)

  // Persist state when it changes
  useEffect(() => {
    if (!enablePersistence) return

    const currentState: PersistedState = {
      currentPage,
      pageSize,
      sortConfig,
      filterValues,
      searchTerm
    }

    // Only save if state has actually changed
    if (JSON.stringify(currentState) !== JSON.stringify(lastPersistedState.current)) {
      savePersistedState(storageKey, currentState)
      lastPersistedState.current = currentState
    }
  }, [currentPage, pageSize, sortConfig, filterValues, searchTerm, enablePersistence, storageKey])

  // Clean up expired cache entries
  useEffect(() => {
    const cleanup = () => {
      setPaginationCache(prev => {
        const now = Date.now()
        const cleaned: typeof prev = {}

        Object.entries(prev).forEach(([key, entry]) => {
          if (isCacheValid(entry, cacheTimeout)) {
            cleaned[key] = entry
          }
        })

        return cleaned
      })
    }

    // Clean up immediately and set interval
    cleanup()
    const interval = setInterval(cleanup, cacheTimeout / 4) // Clean every quarter of timeout

    return () => clearInterval(interval)
  }, [cacheTimeout])

  // Memoized cache key for current state
  const currentCacheKey = useMemo(() => {
    return createCacheKey(currentPage, pageSize, sortConfig, filterValues, debouncedSearchTerm)
  }, [currentPage, pageSize, sortConfig, filterValues, debouncedSearchTerm])

  // Check if current data is cached and valid
  const cachedData = useMemo(() => {
    const entry = paginationCache[currentCacheKey]
    return entry && isCacheValid(entry, cacheTimeout) ? entry.data : null
  }, [paginationCache, currentCacheKey, cacheTimeout])

  // Action creators with useCallback for performance
  const setCurrentPageAction = useCallback((page: number) => {
    if (page < 1) return
    setCurrentPage(page)
    setError(null) // Clear errors on navigation
  }, [])

  const setPageSizeAction = useCallback((size: number) => {
    if (size < 1) return
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
    setError(null)
  }, [])

  const setModeAction = useCallback((newMode: 'list' | 'create' | 'edit' | 'view') => {
    setMode(newMode)
    setError(null)
    // Clear selection when switching modes
    if (newMode === 'list' || newMode === 'create') {
      setSelectedItem(null)
      setSelectedIds([])
    }
  }, [])

  const setSelectedItemAction = useCallback((item: TEntity | null) => {
    setSelectedItem(item)
    setError(null)
  }, [])

  const setSelectedIdsAction = useCallback((ids: readonly (string | number)[]) => {
    setSelectedIds(ids)
    setError(null)
  }, [])

  const setSortConfigAction = useCallback((config: readonly EntityListSort[] | undefined) => {
    setSortConfig(config)
    setCurrentPage(1) // Reset to first page when sorting
    setError(null)
  }, [])

  const setFilterValuesAction = useCallback((values: Record<string, unknown>) => {
    setFilterValues(values)
    setCurrentPage(1) // Reset to first page when filtering
    setError(null)
  }, [])

  const setSearchTermAction = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
    setError(null)
  }, [])

  const setDeleteDialogAction = useCallback((dialog: { open: boolean; id?: string | number }) => {
    setDeleteDialog(dialog)
    setError(null)
  }, [])

  const setBatchDeleteDialogAction = useCallback((dialog: { open: boolean }) => {
    setBatchDeleteDialog(dialog)
    setError(null)
  }, [])

  const setLoadingAction = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const setErrorAction = useCallback((errorMsg: string | null) => {
    setError(errorMsg)
  }, [])

  const updatePaginationCacheAction = useCallback((key: string, data: { results: TEntity[]; count: number; next: string | null; previous: string | null }) => {
    setPaginationCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        ttl: cacheTimeout
      }
    }))
    setLastUpdated(Date.now())
  }, [cacheTimeout])

  const clearPaginationCacheAction = useCallback(() => {
    setPaginationCache({})
    setLastUpdated(Date.now())
  }, [])

  const setHasLoadedOnceAction = useCallback((loaded: boolean) => {
    setHasLoadedOnce(loaded)
  }, [])

  const resetStateAction = useCallback(() => {
    setCurrentPage(1)
    setMode('list')
    setSelectedItem(null)
    setSelectedIds([])
    setSortConfig(config.listConfig.defaultSort
      ? [{ field: config.listConfig.defaultSort.field, direction: config.listConfig.defaultSort.direction }]
      : undefined
    )
    setFilterValues({})
    setSearchTerm('')
    setFields(config.listConfig.fields)
    setExpand(config.listConfig.expand)
    setDeleteDialog({ open: false })
    setBatchDeleteDialog({ open: false })
    setError(null)
    setPaginationCache({})
    setHasLoadedOnce(false)
    setLastUpdated(Date.now())
  }, [config.listConfig.defaultSort])

  const resetFiltersAction = useCallback(() => {
    setFilterValues({})
    setSearchTerm('')
    setCurrentPage(1)
    setError(null)
  }, [])

  const resetSelectionAction = useCallback(() => {
    setSelectedItem(null)
    setSelectedIds([])
    setError(null)
  }, [])

  const actions: EntityStateActions<TEntity> = useMemo(() => ({
    setCurrentPage: setCurrentPageAction,
    setPageSize: setPageSizeAction,
    setMode: setModeAction,
    setSelectedItem: setSelectedItemAction,
    setSelectedIds: setSelectedIdsAction,
    setSortConfig: setSortConfigAction,
    setFilterValues: setFilterValuesAction,
    setSearchTerm: setSearchTermAction,
    setDeleteDialog: setDeleteDialogAction,
    setBatchDeleteDialog: setBatchDeleteDialogAction,
    setLoading: setLoadingAction,
    setError: setErrorAction,
    updatePaginationCache: updatePaginationCacheAction,
    clearPaginationCache: clearPaginationCacheAction,
    setHasLoadedOnce: setHasLoadedOnceAction,
    resetState: resetStateAction,
    resetFilters: resetFiltersAction,
    resetSelection: resetSelectionAction,
    setFields: (fields: string | string[] | undefined) => {
      setFields(fields)
      setError(null)
    },
    setExpand: (expand: string | string[] | undefined) => {
      setExpand(expand)
      setError(null)
    }
  }), [
    setCurrentPageAction,
    setPageSizeAction,
    setModeAction,
    setSelectedItemAction,
    setSelectedIdsAction,
    setSortConfigAction,
    setFilterValuesAction,
    setSearchTermAction,
    setDeleteDialogAction,
    setBatchDeleteDialogAction,
    setLoadingAction,
    setErrorAction,
    updatePaginationCacheAction,
    clearPaginationCacheAction,
    setHasLoadedOnceAction,
    resetStateAction,
    resetFiltersAction,
    resetSelectionAction
  ])

  // Construct the state object
  const state: EntityState<TEntity> = useMemo(() => ({
    currentPage,
    pageSize,
    mode,
    selectedItem,
    selectedIds,
    sortConfig,
    filterValues,
    searchTerm,
    debouncedSearchTerm,
    fields,
    expand,
    deleteDialog,
    batchDeleteDialog,
    isLoading,
    error,
    paginationCache: Object.fromEntries(
      Object.entries(paginationCache).map(([key, entry]) => [
        key,
        { data: entry.data, timestamp: entry.timestamp }
      ])
    ),
    hasLoadedOnce,
    lastUpdated
  }), [
    currentPage,
    pageSize,
    mode,
    selectedItem,
    selectedIds,
    sortConfig,
    filterValues,
    searchTerm,
    debouncedSearchTerm,
    fields,
    expand,
    deleteDialog,
    batchDeleteDialog,
    isLoading,
    error,
    paginationCache,
    hasLoadedOnce,
    lastUpdated
  ])

  return { state, actions, cachedData }
}