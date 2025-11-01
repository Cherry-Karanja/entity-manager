'use client'

import React from 'react'
import { Search, Filter, Download, RefreshCw, Plus, Grid, List, Table, LayoutGrid, Clock, FileText, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { EntityListConfig, EntityListSort, EntityListFilter, EntityListBulkAction } from '../types'
import { useIsMobile } from '@/hooks/use-mobile'
import { EntityListSortComponent } from './EntityListSort'

interface EntityListToolbarProps {
  config: EntityListConfig
  currentView: string
  onViewChange: (view: string) => void
  searchTerm: string
  onSearch: (term: string) => void
  activeFilters: Record<string, unknown>
  onFilter: (filters: Record<string, unknown>) => void
  sortConfig: EntityListSort[]
  onSort: (sort: EntityListSort[]) => void
  selectedKeys: (string | number)[]
  onBulkAction: (action: EntityListBulkAction, items: any[]) => void
  onExport?: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void
  views?: EntityListConfig['views']
  filters?: EntityListFilter[]
  bulkActions?: EntityListBulkAction[]
  exportConfig?: EntityListConfig['export']
}

const viewIcons = {
  table: Table,
  card: Grid,
  list: List,
  grid: LayoutGrid,
  compact: List,
  timeline: Clock,
  detailed: FileText,
  gallery: Users
}

export const EntityListToolbar: React.FC<EntityListToolbarProps> = ({
  config,
  currentView,
  onViewChange,
  searchTerm,
  onSearch,
  activeFilters,
  onFilter,
  sortConfig,
  onSort,
  selectedKeys,
  onBulkAction,
  onExport,
  views = [],
  filters = [],
  bulkActions = [],
  exportConfig
}) => {
  const hasActiveFilters = Object.keys(activeFilters).length > 0
  const hasSelection = selectedKeys.length > 0
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-muted/20">
      {/* Top row: Search, Sort, and primary actions */}
      <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between gap-4'}`}>
        <div className={`flex items-center gap-4 ${isMobile ? 'w-full flex-col' : 'flex-1'}`}>
          {/* Search and Sort container */}
          <div className={`flex items-center gap-4 ${isMobile ? 'w-full flex-col' : ''}`}>
            {/* Search */}
            {config.searchable && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`relative ${isMobile ? 'flex-1' : 'flex-1 max-w-sm'}`}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      placeholder={config.searchPlaceholder || "Search..."}
                      value={searchTerm}
                      onChange={(e) => onSearch(e.target.value)}
                      className="pl-9"
                      aria-label="Search entities"
                      aria-describedby="search-description"
                      role="searchbox"
                    />
                    <span id="search-description" className="sr-only">
                      Search across {config.columns?.filter(col => col.searchable !== false).length || 'all'} searchable columns
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search across {config.columns?.filter(col => col.searchable !== false).length || 'all'} searchable columns</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Sort - inline with search on larger screens */}
            {!isMobile && config.columns && config.columns.some(col => col.sortable !== false) && (
              <div className="flex-shrink-0">
                <EntityListSortComponent
                  sortConfig={sortConfig}
                  onChange={onSort}
                  columns={config.columns}
                  showReset={false}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Sort - separate row on mobile */}
          {isMobile && config.columns && config.columns.some(col => col.sortable !== false) && (
            <div className="w-full">
              <EntityListSortComponent
                sortConfig={sortConfig}
                onChange={onSort}
                columns={config.columns}
                showReset={true}
              />
            </div>
          )}

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
              <Filter className="h-3 w-3" />
              {Object.keys(activeFilters).length} filter{Object.keys(activeFilters).length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
          {/* View switcher */}
          {views.length > 1 && (
            <div className="flex items-center border rounded-md" role="group" aria-label="View options">
              {views.map((view) => {
                const Icon = viewIcons[view.id as keyof typeof viewIcons] || Table
                return (
                  <Tooltip key={view.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={currentView === view.id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onViewChange(view.id)}
                        className="rounded-none first:rounded-l-md last:rounded-r-md"
                        aria-label={`Switch to ${view.name} view`}
                        aria-pressed={currentView === view.id}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{view.name} view</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          )}

          {/* Export */}
          {exportConfig?.enabled && onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {exportConfig.formats?.map((format) => (
                      <DropdownMenuItem key={format} onClick={() => onExport(format)}>
                        {format.toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data in various formats</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Refresh */}
          {config.onRefresh && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={config.onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Create */}
          {config.onCreate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" onClick={config.onCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new item</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Bottom row: Bulk actions when items selected */}
      {hasSelection && bulkActions.length > 0 && (
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-2'} p-2 bg-primary/5 rounded-md border`}>
          <span className="text-sm font-medium">
            {selectedKeys.length} item{selectedKeys.length !== 1 ? 's' : ''} selected
          </span>
          <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : 'ml-auto'}`}>
            {bulkActions.map((action) => (
              <Button
                key={action.id}
                variant={action.danger ? 'destructive' : 'default'}
                size="sm"
                onClick={() => onBulkAction(action, [])}
                disabled={action.disabled}
              >
                {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}