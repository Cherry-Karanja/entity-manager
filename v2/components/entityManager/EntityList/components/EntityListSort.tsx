'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ArrowUpDown, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import type { EntityListSort, EntityListColumn } from '../types'

interface EntityListSortProps {
  sortConfig: EntityListSort[]
  onChange: (sort: EntityListSort[]) => void
  columns: EntityListColumn[]
  showReset?: boolean
  compact?: boolean
}

export const EntityListSortComponent: React.FC<EntityListSortProps> = ({
  sortConfig,
  onChange,
  columns,
  showReset = true,
  compact = false
}) => {
  const sortableColumns = columns.filter(col => col.sortable !== false)

  const handleAddSort = () => {
    if (sortableColumns.length === 0) return

    const availableColumns = sortableColumns.filter(col =>
      !sortConfig.some(sort => sort.field === col.id)
    )

    if (availableColumns.length === 0) return

    const newSort: EntityListSort = {
      field: availableColumns[0].id,
      direction: 'asc'
    }

    onChange([...sortConfig, newSort])
  }

  const handleUpdateSort = (index: number, updates: Partial<EntityListSort>) => {
    const newSort = [...sortConfig]
    newSort[index] = { ...newSort[index], ...updates }
    onChange(newSort)
  }

  const handleRemoveSort = (index: number) => {
    const newSort = sortConfig.filter((_, i) => i !== index)
    onChange(newSort)
  }

  const handleReset = () => {
    onChange([])
  }

  const getColumnLabel = (field: string) => {
    const column = columns.find(col => col.id === field)
    return column?.header || field
  }

  if (sortableColumns.length === 0) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Sort:</span>
        <div className="flex flex-wrap gap-1">
          {sortConfig.map((sort, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
              <span className="font-medium">{getColumnLabel(sort.field)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdateSort(index, { direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
                className="h-4 w-4 p-0 hover:bg-muted"
              >
                {sort.direction === 'asc' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSort(index)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {sortConfig.length < sortableColumns.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddSort}
              className="h-5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        {sortConfig.length > 0 && showReset && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sortConfig.map((sort, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1">
            <span className="text-xs font-medium">{getColumnLabel(sort.field)}</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateSort(index, { direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
              className="h-6 px-1 hover:bg-muted"
              title={`Sort ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sort.direction === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveSort(index)}
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {sortConfig.length < sortableColumns.length && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSort}
            className="h-7 px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Sort
          </Button>
        )}
      </div>
    </div>
  )
}