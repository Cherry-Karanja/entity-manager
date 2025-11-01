'use client'

import React, { useState, useMemo, useCallback, useEffect, memo } from 'react'
import { Search, Filter, SortAsc, SortDesc, MoreHorizontal, Download, RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePermissions } from '@/hooks/use-permissions'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  EntityListProps,
  EntityListItem,
  EntityListColumn,
  EntityListSort,
  EntityListPagination,
  EntityListAction,
  EntityListBulkAction
} from './types'
import EntityTableView from './views/EntityTableView'
import EntityCardView from './views/EntityCardView'
import EntityListView from './views/EntityListView'
import EntityGridView from './views/EntityGridView'
import EntityCompactView from './views/EntityCompactView'
import { EntityListToolbar } from './components/EntityListToolbar'
import { EntityListFilters } from './components/EntityListFilters'
import { EntityListPagination as EntityListPaginationComponent } from './components/EntityListPagination'
import { EntityListActions } from './components/EntityListActions'
import { EntityListBulkActions } from './components/EntityListBulkActions'
import { EntityExporter, exportData } from '../EntityExporter'

// ===== MAIN COMPONENT =====

const EntityListComponent: React.FC<EntityListProps> = ({
  config,
  data: overrideData,
  loading: overrideLoading,
  error: overrideError,
  selectedKeys: overrideSelectedKeys,
  searchTerm: overrideSearchTerm,
  activeFilters: overrideActiveFilters,
  sortConfig: overrideSortConfig,
  pagination: overridePagination,
  onDataChange,
  onSelectionChange,
  onSearch,
  onFilter,
  onSort,
  onPageChange,
  onAction,
  onBulkAction,
  onExport
}) => {
  // Permissions
  const { hasPermission } = usePermissions()
  const isMobile = useIsMobile()

  // Merged configuration
  const mergedConfig = useMemo(() => ({
    ...config,
    data: overrideData || config.data,
    loading: overrideLoading ?? config.loading,
    error: overrideError ?? config.error
  }), [config, overrideData, overrideLoading, overrideError])

  // State management
  const [currentView, setCurrentView] = useState(() => {
    // Auto-select mobile-friendly view on small screens
    if (isMobile && mergedConfig.views) {
      const mobileFriendlyViews = ['card', 'list', 'compact']
      const availableMobileView = mergedConfig.views.find(view => mobileFriendlyViews.includes(view.id))
      if (availableMobileView) {
        return availableMobileView.id
      }
    }
    return mergedConfig.defaultView || mergedConfig.views?.[0]?.id || 'table'
  })
  const [localSearchTerm, setLocalSearchTerm] = useState(overrideSearchTerm || '')
  const [searchInput, setSearchInput] = useState(overrideSearchTerm || '')
  
  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalSearchTerm(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])
  const [localFilters, setLocalFilters] = useState<Record<string, unknown>>(overrideActiveFilters || {})
  const [localSort, setLocalSort] = useState<EntityListSort[]>(overrideSortConfig || mergedConfig.defaultSort || [])
  const [localSelectedKeys, setLocalSelectedKeys] = useState<(string | number)[]>(overrideSelectedKeys || [])
  const [localPagination, setLocalPagination] = useState<EntityListPagination>({
    page: 1,
    pageSize: 10,
    total: mergedConfig.data.length,
    totalPages: Math.ceil(mergedConfig.data.length / 10),
    pageSizeOptions: [10, 20, 50, 100],
    ...mergedConfig.pagination
  })

  // Update local state when props change
  useEffect(() => {
    if (overrideSearchTerm !== undefined) setLocalSearchTerm(overrideSearchTerm)
  }, [overrideSearchTerm])

  useEffect(() => {
    if (overrideActiveFilters !== undefined) setLocalFilters(overrideActiveFilters)
  }, [overrideActiveFilters])

  useEffect(() => {
    if (overrideSortConfig !== undefined) setLocalSort(overrideSortConfig)
  }, [overrideSortConfig])

  useEffect(() => {
    if (overrideSelectedKeys !== undefined) setLocalSelectedKeys(overrideSelectedKeys)
  }, [overrideSelectedKeys])

  useEffect(() => {
    if (overridePagination !== undefined) {
      setLocalPagination(prev => ({ ...prev, ...overridePagination }))
    }
  }, [overridePagination])

  // Processed data
  const processedData = useMemo(() => {
    let result = [...mergedConfig.data]

    // Apply search
    if (localSearchTerm && mergedConfig.searchable) {
      const searchFields = mergedConfig.searchFields ||
        mergedConfig.columns.filter(col => col.searchable !== false).map(col => col.accessorKey || col.id)

      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field]
          return value != null && String(value).toLowerCase().includes(localSearchTerm.toLowerCase())
        })
      })
    }

    // Apply filters
    if (Object.keys(localFilters).length > 0 && mergedConfig.filters) {
      result = result.filter(item => {
        return Object.entries(localFilters).every(([key, filterValue]) => {
          if (!filterValue) return true

          const filterConfig = mergedConfig.filters?.find(f => (f.field || f.id) === key)
          if (!filterConfig) return true

          const itemValue = item[key]

          // Apply filter based on type
          switch (filterConfig.type) {
            case 'text':
              return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())

            case 'select':
            case 'boolean':
              return itemValue === filterValue

            case 'multiselect':
              const selectedValues = filterValue as string[]
              return selectedValues.includes(String(itemValue))

            case 'number':
              const numValue = Number(itemValue)
              const filterNum = Number(filterValue)
              return !isNaN(numValue) && !isNaN(filterNum) && numValue === filterNum

            case 'range':
              const rangeValue = filterValue as { min?: number; max?: number }
              const numItemValue = Number(itemValue)
              if (isNaN(numItemValue)) return false

              if (rangeValue.min !== undefined && numItemValue < rangeValue.min) return false
              if (rangeValue.max !== undefined && numItemValue > rangeValue.max) return false
              return true

            case 'date':
              const dateValue = new Date(itemValue as string | Date)
              const filterDate = new Date(filterValue as string | Date)
              return dateValue.toDateString() === filterDate.toDateString()

            case 'daterange':
              const dateRangeValue = filterValue as { start?: Date; end?: Date }
              const itemDate = new Date(itemValue as string | Date)

              if (dateRangeValue.start && itemDate < dateRangeValue.start) return false
              if (dateRangeValue.end && itemDate > dateRangeValue.end) return false
              return true

            default:
              return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())
          }
        })
      })
    }

    // Apply sorting
    if (localSort.length > 0) {
      result.sort((a, b) => {
        for (const sort of localSort) {
          const aValue = a[sort.field]
          const bValue = b[sort.field]
          let comparison = 0

          if (aValue != null && bValue != null) {
            if (aValue < bValue) comparison = -1
            else if (aValue > bValue) comparison = 1
          }

          if (comparison !== 0) {
            return sort.direction === 'desc' ? -comparison : comparison
          }
        }
        return 0
      })
    }

    return result
  }, [mergedConfig.data, localSearchTerm, localFilters, localSort, mergedConfig.searchable, mergedConfig.searchFields, mergedConfig.columns, mergedConfig.filters])

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!mergedConfig.paginated) return processedData

    const startIndex = (localPagination.page - 1) * localPagination.pageSize
    const endIndex = startIndex + localPagination.pageSize
    return processedData.slice(startIndex, endIndex)
  }, [processedData, mergedConfig.paginated, localPagination.page, localPagination.pageSize])

  // Update pagination when data changes
  useEffect(() => {
    if (mergedConfig.paginated) {
      const totalPages = Math.ceil(processedData.length / localPagination.pageSize)
      setLocalPagination(prev => ({
        ...prev,
        total: processedData.length,
        totalPages,
        page: Math.min(prev.page, totalPages) || 1
      }))
    }
  }, [processedData.length, localPagination.pageSize, mergedConfig.paginated])

  // Event handlers
  const handleSearch = useCallback((term: string) => {
    // Only allow search if searchable is enabled
    if (!mergedConfig.searchable) return

    setSearchInput(term)
    onSearch?.(term)
  }, [onSearch, mergedConfig.searchable])

  const handleFilter = useCallback((filters: Record<string, unknown>) => {
    // Only allow filters for fields that are configured as filterable
    const validFilters: Record<string, unknown> = {}
    const filterableFields = mergedConfig.filters?.map(f => f.field || f.id) || []

    Object.entries(filters).forEach(([key, value]) => {
      if (filterableFields.includes(key)) {
        validFilters[key] = value
      }
    })

    setLocalFilters(validFilters)
    onFilter?.(validFilters)
  }, [onFilter, mergedConfig.filters])

  const handleSort = useCallback((sort: EntityListSort[]) => {
    // Only allow sorting for fields that are configured as sortable
    const sortableFields = mergedConfig.columns?.filter(col => col.sortable !== false).map(col => col.id) || []

    const validSort = sort.filter(sortItem => sortableFields.includes(sortItem.field))

    setLocalSort(validSort)
    onSort?.(validSort)
  }, [onSort, mergedConfig.columns])

  const handleSelectionChange = useCallback((selectedKeys: (string | number)[], selectedItems: EntityListItem[]) => {
    setLocalSelectedKeys(selectedKeys)
    onSelectionChange?.(selectedKeys, selectedItems)
  }, [onSelectionChange])

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setLocalPagination(prev => ({ ...prev, page, pageSize }))
    onPageChange?.(page, pageSize)
  }, [onPageChange])

  const handleAction = useCallback(async (action: EntityListAction, item: EntityListItem) => {
    try {
      await action.onClick?.(item)
      onAction?.(action, item)
    } catch (error) {
      console.error('Action execution failed:', error)
    }
  }, [onAction])

  const handleBulkAction = useCallback(async (action: EntityListBulkAction, items: EntityListItem[]) => {
    try {
      await action.onClick?.(items)
      onBulkAction?.(action, items)
    } catch (error) {
      console.error('Bulk action execution failed:', error)
    }
  }, [onBulkAction])

  const handleExport = useCallback(async (format: 'csv' | 'xlsx' | 'pdf' | 'json') => {
    if (onExport) {
      onExport(format)
    } else if (mergedConfig.export?.enabled) {
      // Use EntityExporter
      await exportData(
        processedData,
        mergedConfig.columns,
        format,
        mergedConfig.export.filename || `${mergedConfig.id || 'export'}`
      )
    }
  }, [onExport, mergedConfig.export, processedData, mergedConfig.columns, mergedConfig.id])

  // Get current view component
  const currentViewComponent = useMemo(() => {
    const view = mergedConfig.views?.find(v => v.id === currentView)
    if (!view) return EntityTableView

    return view.component
  }, [mergedConfig.views, currentView])

  // Check permissions
  const canView = mergedConfig.permissions?.view === false ? false :
    (typeof mergedConfig.permissions?.view === 'string' ? hasPermission(mergedConfig.permissions.view) : true)
  const canExport = mergedConfig.permissions?.export === false ? false :
    (typeof mergedConfig.permissions?.export === 'string' ? hasPermission(mergedConfig.permissions.export) : true)

  if (!canView) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">You don&apos;t have permission to view this data.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div 
      className={cn("space-y-4", mergedConfig.className)}
      role="region"
      aria-label={typeof mergedConfig.title === 'string' ? mergedConfig.title : 'Entity list'}
      {...(mergedConfig.loading ? { 'aria-busy': true as any } : {})}
      aria-describedby={mergedConfig.description ? 'entity-list-description' : undefined}
    >
      {/* Header */}
      {(mergedConfig.title || mergedConfig.description) && (
        <Card>
          <CardHeader>
            {mergedConfig.title && (
              <CardTitle className="flex items-center justify-between">
                <span id="entity-list-title">{mergedConfig.title}</span>
                {mergedConfig.components?.header && (
                  <mergedConfig.components.header config={mergedConfig} />
                )}
              </CardTitle>
            )}
            {mergedConfig.description && (
              <p className="text-muted-foreground" id="entity-list-description">
                {mergedConfig.description}
              </p>
            )}
          </CardHeader>
        </Card>
      )}

      {/* Toolbar */}
      <EntityListToolbar
        config={mergedConfig}
        currentView={currentView}
        onViewChange={setCurrentView}
        searchTerm={localSearchTerm}
        onSearch={handleSearch}
        activeFilters={localFilters}
        onFilter={handleFilter}
        sortConfig={localSort}
        onSort={handleSort}
        selectedKeys={localSelectedKeys}
        onBulkAction={handleBulkAction}
        onExport={canExport ? handleExport : undefined}
        views={mergedConfig.views}
        filters={mergedConfig.filters}
        bulkActions={mergedConfig.bulkActions}
        exportConfig={mergedConfig.export}
      />

      {/* Filters */}
      {mergedConfig.filters && mergedConfig.filters.length > 0 && (
        <EntityListFilters
          filters={mergedConfig.filters}
          activeFilters={localFilters}
          onChange={handleFilter}
          layout={isMobile ? 'vertical' : (mergedConfig.filterLayout || 'inline')}
          showReset={mergedConfig.showFilterReset}
          collapsible={mergedConfig.collapsibleFilters}
          defaultCollapsed={mergedConfig.defaultFiltersCollapsed}
        />
      )}

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {mergedConfig.error ? (
            <div className="flex items-center justify-center h-32 text-destructive">
              <span>{mergedConfig.error}</span>
            </div>
          ) : mergedConfig.loading ? (
            mergedConfig.components?.loading ? (
              <mergedConfig.components.loading config={mergedConfig} />
            ) : (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )
          ) : processedData.length === 0 ? (
            mergedConfig.components?.empty ? (
              <mergedConfig.components.empty config={mergedConfig} />
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {mergedConfig.emptyText || 'No data available'}
              </div>
            )
          ) : (
            <div className="relative">
              {React.createElement(currentViewComponent, {
                data: paginatedData,
                columns: mergedConfig.columns,
                loading: mergedConfig.loading,
                error: mergedConfig.error,
                emptyText: mergedConfig.emptyText,
                selection: mergedConfig.selection ? {
                  ...mergedConfig.selection,
                  selectedKeys: localSelectedKeys,
                  onChange: handleSelectionChange
                } : undefined,
                actions: mergedConfig.actions,
                entityActions: mergedConfig.entityActions,
                onAction: handleAction,
                rowKey: mergedConfig.rowKey,
                onRow: mergedConfig.onRow,
                scroll: mergedConfig.scroll,
                size: mergedConfig.size,
                bordered: mergedConfig.bordered,
                className: mergedConfig.className
              } as any)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {mergedConfig.paginated && processedData.length > 0 && (
        <EntityListPaginationComponent
          pagination={localPagination}
          onChange={handlePageChange}
          showSizeChanger={localPagination.showSizeChanger}
          showQuickJumper={localPagination.showQuickJumper}
          showTotal={localPagination.showTotal}
        />
      )}

      {/* Footer */}
      {mergedConfig.showFooter && mergedConfig.components?.footer && (
        <Card>
          <CardContent>
            <mergedConfig.components.footer config={mergedConfig} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const EntityList = memo(EntityListComponent)

export default EntityList