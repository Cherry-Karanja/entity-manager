// ===== ENTITY LIST V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityListConfig<TEntity>

'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Entity, EntityListConfig } from '../types'
import type { EntityListColumn } from '../EntityList/types'

export interface EntityListProps<TEntity extends Entity = Entity> {
  config: EntityListConfig<TEntity>
  data: TEntity[]
  loading?: boolean
  onRowClick?: (row: TEntity) => void
  onRefresh?: () => void
  onSelectionChange?: (selected: TEntity[]) => void
}

export const EntityList = <TEntity extends Entity = Entity>({
  config,
  data,
  loading = false,
  onRowClick,
  onRefresh,
  onSelectionChange,
}: EntityListProps<TEntity>) => {
  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
  const [sortField, setSortField] = useState<string | undefined>(
    config.defaultSort && config.defaultSort.length > 0 ? config.defaultSort[0].field : undefined
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    config.defaultSort && config.defaultSort.length > 0 ? config.defaultSort[0].direction : 'asc'
  )
  const [currentPage, setCurrentPage] = useState(1)

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm || !config.searchable) return data

    const searchLower = searchTerm.toLowerCase()
    const searchFields = config.searchFields || config.columns.map(c => c.accessorKey || c.id)

    return data.filter(item =>
      searchFields.some(field => {
        const value = (item as Record<string, unknown>)[field]
        return value?.toString().toLowerCase().includes(searchLower)
      })
    )
  }, [data, searchTerm, config.searchable, config.searchFields, config.columns])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField]
      const bVal = (b as Record<string, unknown>)[sortField]

      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection])

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
      onSelectionChange?.(paginatedData)
    } else {
      setSelectedIds(new Set())
      onSelectionChange?.([])
    }
  }, [paginatedData, onSelectionChange])

  const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
    onSelectionChange?.(data.filter(item => newSelected.has(item.id)))
  }, [selectedIds, data, onSelectionChange])

  // Sorting handler
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }, [sortField])

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  // Selection state
  const allSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.has(item.id))

  // Render cell value
  const renderCellValue = (column: EntityListColumn, row: TEntity) => {
    if (column.cell) {
      const value = column.accessorKey ? (row as Record<string, unknown>)[column.accessorKey] : undefined
      const accessorFn = column.accessorFn
      const cellValue = accessorFn ? accessorFn(row) : value
      return column.cell(cellValue, row, 0)
    }

    if (column.accessorFn) {
      return String(column.accessorFn(row) ?? '')
    }

    if (column.accessorKey) {
      return String((row as Record<string, unknown>)[column.accessorKey] ?? '')
    }

    return ''
  }

  if (loading) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{config.title}</CardTitle>
          <div className="flex items-center gap-2">
            {config.searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={config.searchPlaceholder || 'Search...'}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-8 w-64"
                />
              </div>
            )}
            {onRefresh && (
              <Button variant="outline" size="icon" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
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
                        className={column.sortable ? 'cursor-pointer select-none' : ''}
                        onClick={column.sortable ? () => handleSort(column.accessorKey || column.id) : undefined}
                      >
                        <div className="flex items-center gap-2">
                          {column.header}
                          {column.sortable && sortField === (column.accessorKey || column.id) && (
                            <span className="text-xs">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'cursor-pointer' : ''}
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
                          {renderCellValue(column, row)}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {config.pagination && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
