'use client'

import React, { memo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityListViewProps, EntityListColumn, EntityListItem, EntityListSelection, EntityListAction } from '../types'
import { EntityListActions } from '../components/EntityListActions'
import { EntityActions } from '../../EntityActions'

interface EntityTableViewProps extends EntityListViewProps {
  selection?: EntityListSelection & { selectedKeys: (string | number)[]; onChange: (keys: (string | number)[], items: EntityListItem[]) => void }
  actions?: EntityListAction[]
  entityActions?: import('../../EntityActions/types').EntityActionsConfig
  onAction?: (action: EntityListAction, item: EntityListItem) => void
  entityType?: string
  rowKey?: string | ((item: EntityListItem) => string | number)
  onRow?: (record: EntityListItem, index?: number) => {
    onClick?: (event: React.MouseEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
    onContextMenu?: (event: React.MouseEvent) => void
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
  }
  scroll?: { x?: string | number; y?: string | number }
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
}

const EntityTableViewComponent: React.FC<EntityTableViewProps> = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyText = 'No data available',
  selection,
  actions = [],
  entityActions,
  onAction,
  entityType = 'entity',
  rowKey = 'id',
  onRow,
  scroll,
  size = 'middle',
  bordered = true,
  className
}) => {
  // Get row key
  const getRowKey = (item: EntityListItem, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(item)
    }
    const key = item[rowKey as string]
    return (key as string | number) || index
  }

  // Get cell value
  const getCellValue = (column: EntityListColumn, item: EntityListItem, index: number): unknown => {
    if (column.accessorFn) {
      return column.accessorFn(item)
    }
    if (column.accessorKey) {
      return item[column.accessorKey]
    }
    return item[column.id]
  }

  // Render cell content
  const renderCell = (column: EntityListColumn, item: EntityListItem, index: number): React.ReactNode => {
    const value = getCellValue(column, item, index)

    if (column.cell) {
      return column.cell(value, item, index)
    }

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }

    return String(value)
  }

  // Handle row events
  const handleRowClick = (item: EntityListItem, index: number) => (event: React.MouseEvent) => {
    onRow?.(item, index)?.onClick?.(event)
  }

  const handleRowDoubleClick = (item: EntityListItem, index: number) => (event: React.MouseEvent) => {
    onRow?.(item, index)?.onDoubleClick?.(event)
  }

  const handleRowContextMenu = (item: EntityListItem, index: number) => (event: React.MouseEvent) => {
    onRow?.(item, index)?.onContextMenu?.(event)
  }

  const handleRowMouseEnter = (item: EntityListItem, index: number) => (event: React.MouseEvent) => {
    onRow?.(item, index)?.onMouseEnter?.(event)
  }

  const handleRowMouseLeave = (item: EntityListItem, index: number) => (event: React.MouseEvent) => {
    onRow?.(item, index)?.onMouseLeave?.(event)
  }

  // Handle selection
  const handleSelectionChange = (item: EntityListItem) => (checked: boolean) => {
    if (!selection?.onChange) return

    const itemKey = getRowKey(item, 0)
    let newSelectedKeys: (string | number)[]

    if (selection.mode === 'single') {
      newSelectedKeys = checked ? [itemKey] : []
    } else {
      newSelectedKeys = checked
        ? [...selection.selectedKeys, itemKey]
        : selection.selectedKeys.filter(key => key !== itemKey)
    }

    const selectedItems = data.filter(item => newSelectedKeys.includes(getRowKey(item, 0)))
    selection.onChange(newSelectedKeys, selectedItems)
  }

  // Filter visible columns
  const visibleColumns = columns.filter(col => !col.hidden)

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-destructive">
        <span>{error}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        {emptyText}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)} role="region" aria-label="Data table">
      <div
        className={cn("overflow-auto", scroll?.y && "max-h-96")}
        role="presentation"
      >
        <Table>
          <TableHeader>
            <TableRow>
              {/* Selection column */}
              {selection && selection.mode !== 'none' && (
                <TableHead className="w-12">
                  {selection.mode === 'multiple' && (
                    <Checkbox
                      checked={selection.selectedKeys.length === data.length && data.length > 0}
                      onCheckedChange={(checked) => {
                        if (!selection?.onChange) return
                        const allKeys = data.map((item, index) => getRowKey(item, index))
                        const newSelectedKeys = checked ? allKeys : []
                        const selectedItems = checked ? data : []
                        selection.onChange(newSelectedKeys, selectedItems)
                      }}
                      aria-label={`Select all ${data.length} items`}
                    />
                  )}
                </TableHead>
              )}

              {/* Data columns */}
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">{column.tooltip}</p>
                            {column.helpText && (
                              <p className="text-xs text-muted-foreground mt-1">{column.helpText}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableHead>
              ))}

              {/* Actions column */}
              {(actions.length > 0 || entityActions) && (
                <TableHead className="w-12">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const rowKey = getRowKey(item, index)
              const isSelected = selection?.selectedKeys.includes(rowKey)
              const rowProps = onRow?.(item, index)

              return (
                <TableRow
                  key={rowKey}
                  className={cn(
                    isSelected && 'bg-muted/50',
                    rowProps && 'cursor-pointer'
                  )}
                  onClick={rowProps?.onClick ? handleRowClick(item, index) : undefined}
                  onDoubleClick={rowProps?.onDoubleClick ? handleRowDoubleClick(item, index) : undefined}
                  onContextMenu={rowProps?.onContextMenu ? handleRowContextMenu(item, index) : undefined}
                  onMouseEnter={rowProps?.onMouseEnter ? handleRowMouseEnter(item, index) : undefined}
                  onMouseLeave={rowProps?.onMouseLeave ? handleRowMouseLeave(item, index) : undefined}
                  aria-selected={isSelected}
                  tabIndex={0}
                  role="row"
                >
                  {/* Selection cell */}
                  {selection && selection.mode !== 'none' && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleSelectionChange(item)}
                        disabled={selection.getCheckboxProps?.(item)?.disabled}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </TableCell>
                  )}

                  {/* Data cells */}
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.className
                      )}
                    >
                      {renderCell(column, item, index)}
                    </TableCell>
                  ))}

                  {/* Actions cell */}
                  {(actions.length > 0 || entityActions) && (
                    <TableCell>
                      {entityActions ? (
                        <EntityActions
                          config={entityActions}
                          item={item}
                          selectedItems={selection?.selectedKeys.map(key => data.find(d => getRowKey(d, 0) === key)).filter(Boolean) || []}
                        />
                      ) : (
                        <EntityListActions
                          actions={actions}
                          item={item}
                          onAction={onAction}
                          entityType={entityType}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
const EntityTableView = memo(EntityTableViewComponent)

export default EntityTableView