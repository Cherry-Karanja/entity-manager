// ===== ENTITY LIST V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityListConfig<TEntity>

'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { BaseEntity } from '../manager'
import { EntityListColumn, EntityListBulkAction, EntityListConfig, EntityListItem } from '../EntityList/types'
import { EntityActionsConfig, EntityAction } from '../EntityActions/types'
import { EntityListProps } from '../EntityList/types'
import { EntityActions } from '../EntityActions'
import { EntityListToolbar } from './components/EntityListToolbar'
import { EntityListFilters } from './components/EntityListFilters'
import { EntityListPagination } from './components/EntityListPagination'

export const EntityList = <TEntity extends BaseEntity = BaseEntity>(props: EntityListProps<TEntity> & {
  onRowClick?: (item: TEntity) => void
}) => {
  const {
    config,
    searchTerm = '',
    sort,
 
    onDataChange,
    onSelectionChange,
    onSearch,
    onFilter,
    onSort,
    onPageChange,
    onAction,
    onBulkAction,
    onExport,
    onRowClick
  } = props
  // ESLint disable for props that are part of the interface but not fully implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _onDataChange = onDataChange

  // State
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set(config.selection?.selectedKeys || []))
  const [sortField, setSortField] = useState<string | undefined>(
    sort && sort.length > 0 ? sort[0].field :
    config.defaultSort && config.defaultSort.length > 0 ? config.defaultSort[0].field : undefined
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    sort && sort.length > 0 ? sort[0].direction :
    config.defaultSort && config.defaultSort.length > 0 ? config.defaultSort[0].direction : 'asc'
  )
  const [currentPage, setCurrentPage] = useState(config.pagination?.page || 1)
  const [activeFiltersState, setActiveFiltersState] = useState<Record<string, unknown>>(config.savedFiltersKey ? {} : {})
  const [confirmAction, setConfirmAction] = useState<{
    action: EntityAction | EntityListBulkAction
    item?: TEntity
    items?: TEntity[]
  } | null>(null)
  const [currentView, setCurrentView] = useState(config.defaultView || 'table')

  // Sync local sort state with external sort prop
  React.useEffect(() => {
    if (sort && sort.length > 0) {
      setSortField(sort[0].field)
      setSortDirection(sort[0].direction)
    }
  }, [sort])

  // Render cell value
  const renderCellValue = useCallback((column: EntityListColumn, item: TEntity) => {
    let value: unknown

    if (column.accessorFn) {
      value = column.accessorFn(item as EntityListItem)
    } else if (column.accessorKey) {
      value = (item as Record<string, unknown>)[column.accessorKey]
    } else {
      value = item
    }

    if (column.cell) {
      return column.cell(value, item as EntityListItem, 0) // index not used in simple rendering
    }

    return value?.toString() || ''
  }, [])

  // Filtering
  const filteredData = useMemo(() => {
    let filtered = config.data || []

    console.log('EntityList data:', {configData: config.data, filteredLength: filtered.length })

    // Apply search filter
    if (localSearchTerm && config.searchable) {
      const searchLower = localSearchTerm.toLowerCase()
      const searchFields = config.searchFields || config.columns.map(c => c.accessorKey || c.id)

      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = (item as Record<string, unknown>)[field]
          return value?.toString().toLowerCase().includes(searchLower)
        })
      )
    }
    console.log('afterfilter',filtered)

    // Apply active filters
    if (Object.keys(activeFiltersState).length > 0 && config.filters) {
      filtered = filtered.filter(item => {
        return config.filters!.every(filter => {
          const fieldValue = (item as Record<string, unknown>)[filter.field.name]
          const filterValue = activeFiltersState[filter.field.name]
          if (filterValue == null || filterValue === '') return true

          const operator = filter.operator || 'exact'
          let transformedValue: unknown = filterValue
          let transformedFieldValue: unknown = fieldValue

          // Apply transform if provided
          if (filter.transform) {
            transformedValue = filter.transform(filterValue, operator)
          }

          // Apply field transform if needed (for comparison)
          if (typeof fieldValue === 'string' && typeof transformedValue === 'string') {
            // For string comparisons, handle case sensitivity
            if (operator === 'iexact') {
              transformedFieldValue = fieldValue.toLowerCase()
              transformedValue = transformedValue.toLowerCase()
            } else if (operator === 'icontains') {
              transformedFieldValue = fieldValue.toLowerCase()
              transformedValue = transformedValue.toLowerCase()
            } else if (operator === 'istartswith') {
              transformedFieldValue = fieldValue.toLowerCase()
              transformedValue = transformedValue.toLowerCase()
            } else if (operator === 'iendswith') {
              transformedFieldValue = fieldValue.toLowerCase()
              transformedValue = transformedValue.toLowerCase()
            }
          }

          // Apply the operator
          switch (operator) {
            case 'exact':
            case 'iexact':
              // Special handling for multiselect: if filterValue is array, check if fieldValue is in array
              if (Array.isArray(transformedValue)) {
                return transformedValue.includes(transformedFieldValue)
              }
              return transformedFieldValue === transformedValue

            case 'contains':
            case 'icontains':
              return typeof transformedFieldValue === 'string' && typeof transformedValue === 'string'
                ? transformedFieldValue.includes(transformedValue)
                : false

            case 'startswith':
            case 'istartswith':
              return typeof transformedFieldValue === 'string' && typeof transformedValue === 'string'
                ? transformedFieldValue.startsWith(transformedValue)
                : false

            case 'endswith':
            case 'iendswith':
              return typeof transformedFieldValue === 'string' && typeof transformedValue === 'string'
                ? transformedFieldValue.endsWith(transformedValue)
                : false

            case 'gt':
              return (typeof transformedFieldValue === 'number' || typeof transformedFieldValue === 'string') &&
                     (typeof transformedValue === 'number' || typeof transformedValue === 'string')
                ? transformedFieldValue > transformedValue
                : false

            case 'gte':
              return (typeof transformedFieldValue === 'number' || typeof transformedFieldValue === 'string') &&
                     (typeof transformedValue === 'number' || typeof transformedValue === 'string')
                ? transformedFieldValue >= transformedValue
                : false

            case 'lt':
              return (typeof transformedFieldValue === 'number' || typeof transformedFieldValue === 'string') &&
                     (typeof transformedValue === 'number' || typeof transformedValue === 'string')
                ? transformedFieldValue < transformedValue
                : false

            case 'lte':
              return (typeof transformedFieldValue === 'number' || typeof transformedFieldValue === 'string') &&
                     (typeof transformedValue === 'number' || typeof transformedValue === 'string')
                ? transformedFieldValue <= transformedValue
                : false

            case 'in':
              return Array.isArray(transformedValue)
                ? transformedValue.includes(transformedFieldValue)
                : false

            case 'range':
              return Array.isArray(transformedValue) && transformedValue.length === 2
                ? (typeof transformedFieldValue === 'number' || typeof transformedFieldValue === 'string') &&
                  (typeof transformedValue[0] === 'number' || typeof transformedValue[0] === 'string') &&
                  (typeof transformedValue[1] === 'number' || typeof transformedValue[1] === 'string') &&
                  transformedFieldValue >= transformedValue[0] && transformedFieldValue <= transformedValue[1]
                : false

            case 'isnull':
              return transformedValue === true
                ? fieldValue == null
                : fieldValue != null

            default:
              // Fallback to exact match
              if (Array.isArray(transformedValue)) {
                return transformedValue.includes(transformedFieldValue)
              }
              return transformedFieldValue === transformedValue
          }
        })
      })
    }

    return filtered
  }, [localSearchTerm, config.searchable, config.searchFields, config.columns, activeFiltersState, config.filters, config.data])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField]
      const bVal = (b as Record<string, unknown>)[sortField]

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return sortDirection === 'asc' ? -1 : 1
      if (bVal == null) return sortDirection === 'asc' ? 1 : -1

      // Find the column config to check for custom sort function
      const column = config.columns.find(col => (col.accessorKey || col.id) === sortField)
      if (column?.sortingFn) {
        const result = column.sortingFn(aVal, bVal, { desc: sortDirection === 'desc' })
        return sortDirection === 'asc' ? result : -result
      }

      // Default sorting logic based on data type
      let comparison = 0

      // Handle different data types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        comparison = aVal === bVal ? 0 : aVal ? 1 : -1
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime()
      } else {
        // Fallback: convert to strings and compare
        const aStr = String(aVal)
        const bStr = String(bVal)
        comparison = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' })
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection, config.columns])

  // Computed values
  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedIds.has(item.id))

  // Pagination
  const pageSize = config.pagination?.pageSize || 10
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = useMemo(() => {
    if (!config.pagination) return sortedData

    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, config.pagination])

  // Selection
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map(item => item.id))
      setSelectedIds(newSelected)
      onSelectionChange?.(Array.from(newSelected), paginatedData)
    } else {
      setSelectedIds(new Set())
      onSelectionChange?.([], [])
    }
  }, [paginatedData, onSelectionChange, setSelectedIds])

  const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
    const selectedItems = config.data?.filter(item => newSelected.has(item.id)) || []
    onSelectionChange?.(Array.from(newSelected), selectedItems)
  }, [selectedIds, config.data, onSelectionChange, setSelectedIds])

  // Sorting handler
  const handleSort = useCallback((field: string) => {
    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortField === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
      setSortDirection(newDirection)
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
    onSort?.([{ field, direction: newDirection }])
  }, [sortField, sortDirection, onSort, setSortDirection, setSortField, setCurrentPage])

  // Action handlers
  const handleBulkActionClick = useCallback((action: EntityListBulkAction) => {
    const selectedItems = config.data?.filter(item => selectedIds.has(item.id)) || []
    if (action.confirm) {
      setConfirmAction({ action, items: selectedItems as TEntity[] })
    } else {
      onBulkAction?.(action, selectedItems)
    }
  }, [config.data, selectedIds, onBulkAction])

  const handleConfirmAction = useCallback(() => {
    if (!confirmAction) return

    if (confirmAction.item) {
      onAction?.(confirmAction.action as EntityAction, confirmAction.item)
    } else if (confirmAction.items) {
      onBulkAction?.(confirmAction.action as EntityListBulkAction, confirmAction.items)
    }
    setConfirmAction(null)
  }, [confirmAction, onAction, onBulkAction])

  const handleExportClick = useCallback((format: 'csv' | 'xlsx' | 'pdf' | 'json') => {
    onExport?.(format)
  }, [onExport])

  // Render current view
  const renderCurrentView = () => {
    const currentViewConfig = config.views?.find(view => view.id === currentView)
    if (!currentViewConfig) {
      // Default to table view
      return renderTableView()
    }

    const ViewComponent = currentViewConfig.component
    const baseProps = {
      data: paginatedData as EntityListItem[],
      columns: config.columns,
      loading: config.loading,
      error: config.error,
      emptyText: config.emptyText,
      selection: config.selection ? {
        ...config.selection,
        selectedKeys: Array.from(selectedIds),
        onChange: (keys: (string | number)[], items: EntityListItem[]) => {
          const newSelected = new Set(keys)
          setSelectedIds(newSelected)
          onSelectionChange?.(keys, items)
        }
      } : undefined,
      entityActions: config.entityActions as EntityActionsConfig<unknown>,
      onAction: onAction,
      rowKey: "id" as const,
      onRow: config.onRow ? (record: EntityListItem, index?: number) => config.onRow!(record as TEntity, index) : undefined,
      scroll: config.scroll,
      size: config.size,
      bordered: config.bordered
    }

    // Conditionally add sorting props if the view supports them
    const viewProps = currentViewConfig.id === 'table' || currentViewConfig.component.name === 'EntityTableView'
      ? { ...baseProps, sortField, sortDirection, onSort: handleSort }
      : baseProps

    return <ViewComponent {...viewProps} />
  }

  // Render table view (default)
  const renderTableView = () => (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {config.selection && config.selection.mode !== 'none' && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {config.columns
              .filter(col => !col.hidden)
              .map((column) => (
                <TableHead
                  key={column.id}
                  style={{ textAlign: column.align || 'left' }}
                  className={column.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''}
                  onClick={column.sortable ? () => handleSort(column.accessorKey || column.id) : undefined}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex items-center">
                        {sortField === (column.accessorKey || column.id) ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            {config.showActions && config.entityActions?.actions && config.entityActions.actions.length > 0 && (
              <TableHead className="w-12">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => {
                onRowClick?.(row as TEntity)
                config.onRow?.(row as TEntity)?.onClick?.({} as React.MouseEvent)
              }}
              className={(onRowClick || config.onRow) ? 'cursor-pointer' : ''}
            >
              {config.selection && config.selection.mode !== 'none' && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              )}
              {config.columns
                .filter(col => !col.hidden)
                .map((column) => (
                  <TableCell key={column.id} style={{ textAlign: column.align || 'left' }}>
                    {renderCellValue(column, row as TEntity)}
                  </TableCell>
                ))}
              {config.showActions && config.entityActions?.actions && config.entityActions.actions.length > 0 && (
                <TableCell>
                  <EntityActions
                    config={{ actions: config.entityActions.actions }}
                    context={{ entity: row }}
                    maxVisibleActions={2}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {config.pagination && totalPages > 1 && (
        <EntityListPagination
          pagination={{
            page: currentPage,
            pageSize,
            total: sortedData.length,
            totalPages
          }}
          onChange={(page) => {
            setCurrentPage(page)
            onPageChange?.(page, pageSize)
          }}
          showSizeChanger={false} // Keep simple for now
          showQuickJumper={false}
          showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`}
        />
      )}
    </>
  )

  if (config.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.title || 'Loading...'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (config.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.title || 'Error'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-2">Failed to load data</p>
              <p className="text-sm text-muted-foreground">
                {typeof config.error === 'string' ? config.error : 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col w-full gap-2">
          <CardTitle>{config.title}</CardTitle>
          <EntityListToolbar
            config={config as unknown as EntityListConfig<BaseEntity>}
            currentView={currentView}
            onViewChange={setCurrentView}
            searchTerm={localSearchTerm}
            onSearch={(term) => {
              setLocalSearchTerm(term)
              setCurrentPage(1)
              onSearch?.(term)
            }}
            activeFilters={activeFiltersState}
            onFilter={(filters) => {
              setActiveFiltersState(filters)
              onFilter?.(filters)
              setCurrentPage(1)
            }}
            sortConfig={sortField ? [{ field: sortField, direction: sortDirection }] : []}
            onSort={(sort) => {
              if (sort.length > 0) {
                setSortField(sort[0].field)
                setSortDirection(sort[0].direction)
                setCurrentPage(1)
                onSort?.(sort)
              }
            }}
            selectedKeys={Array.from(selectedIds)}
            onBulkAction={handleBulkActionClick}
            onExport={handleExportClick}
            filters={config.filters}
            bulkActions={config.bulkActions}
            exportConfig={config.export}
            views={config.views}
          />
        </div>

        {/* Filters Panel */}
        {config.filters && config.filters.length > 0 && (
          <EntityListFilters
            filters={config.filters}
            activeFilters={activeFiltersState}
            onChange={(filters) => {
              setActiveFiltersState(filters)
              onFilter?.(filters)
              setCurrentPage(1)
            }}
            layout="horizontal"
            showReset={config.showFilterReset}
            showCount={true}
            collapsible={true}
            defaultCollapsed={config.defaultFiltersCollapsed}
          />
        )}
      </CardHeader>
      <CardContent>
        {paginatedData.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {config.emptyText || 'No data available'}
            </p>
          </div>
        ) : (
          <>
            {renderCurrentView()}
          </>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {typeof confirmAction?.action.confirm?.title === 'function'
                ? confirmAction.action.confirm.title(confirmAction?.items?.length || 1)
                : confirmAction?.action.confirm?.title ||
                  (confirmAction?.items ? 'Confirm Bulk Action' : 'Confirm Action')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {typeof confirmAction?.action.confirm?.content === 'function'
                ? confirmAction.action.confirm.content(confirmAction?.items || [])
                : confirmAction?.action.confirm?.content ||
                  `Are you sure you want to ${confirmAction?.action.label.toLowerCase()}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction?.action.confirm?.okText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}