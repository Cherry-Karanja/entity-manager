import React, { useState } from 'react';
import { Search, Filter, Download, RefreshCw, Plus, Grid, List, Table, LayoutGrid, Clock, FileText, Users, X, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EntityListConfig, EntityListSort, EntityListFilter, EntityListBulkAction } from '../types'

interface EntityListToolbarProps {
  config: EntityListConfig;
  currentView: string;
  onViewChange: (view: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  activeFilters: Record<string, unknown>;
  onFilter: (filters: Record<string, unknown>) => void;
  sortConfig: EntityListSort[];
  onSort: (sort: EntityListSort[]) => void;
  selectedKeys: (string | number)[];
  onBulkAction: (action: EntityListBulkAction) => void;
  onExport?: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void;
  onRefresh?: () => void;
  views?: EntityListConfig['views'];
  filters?: EntityListFilter[];
  bulkActions?: EntityListBulkAction[];
  exportConfig?: EntityListConfig['export'];
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
};

export const EntityListToolbar: React.FC<EntityListToolbarProps> = ({
  config,
  currentView,
  onViewChange,
  searchTerm,
  onSearch,
  activeFilters,
  sortConfig,
  onSort,
  selectedKeys,
  onBulkAction,
  onExport,
  onRefresh,
  views = [],
  bulkActions = [],
  exportConfig
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const hasSelection = selectedKeys.length > 0;
  const hasSorting = sortConfig.length > 0;

  const handleClearSearch = () => {
    onSearch('');
  };

  const handleSortToggle = (field: string) => {
    const existing = sortConfig.find(s => s.field === field);
    if (existing) {
      const newDirection = existing.direction === 'asc' ? 'desc' : 'asc';
      onSort([{ field, direction: newDirection }]);
    } else {
      onSort([{ field, direction: 'asc' }]);
    }
  };

  return (
    <div className="space-y-3 w-full ">
      {/* Main Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Left Section: Search */}
        <div className="flex-1 min-w-0">
          {config.searchable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <Search 
                      className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                        searchFocused ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                    <Input
                      placeholder={config.searchPlaceholder || "Search..."}
                      value={searchTerm}
                      onChange={(e) => onSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className={cn(
                        "pl-10 pr-10 transition-all duration-200",
                        searchFocused && "ring-2 ring-primary/20",
                        searchTerm && "bg-primary/5 border-primary/30"
                      )}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Search across all fields</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Sort Dropdown */}
          {config.columns && config.columns.some(col => col.sortable !== false) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={cn(
                          "gap-2 transition-all duration-200",
                          hasSorting && "border-primary/50 bg-primary/5"
                        )}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort</span>
                        {hasSorting && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                            {sortConfig.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {config.columns
                        .filter(col => col.sortable !== false)
                        .map((column) => {
                          const sort = sortConfig.find(s => s.field === (column.accessorKey || column.id));
                          return (
                            <DropdownMenuItem
                              key={column.id}
                              onClick={() => handleSortToggle(column.accessorKey || column.id)}
                              className="flex items-center justify-between"
                            >
                              <span>{column.header}</span>
                              {sort && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {sort.direction === 'asc' ? '↑' : '↓'}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      {hasSorting && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onSort([])}
                            className="text-destructive"
                          >
                            Clear sorting
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort columns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* View Switcher */}
          {views && views.length > 1 && (
            <TooltipProvider>
              <div className="flex items-center border rounded-lg overflow-hidden bg-background shadow-sm">
                {views.map((view) => {
                  const Icon = (view.icon || viewIcons[view.id as keyof typeof viewIcons]) || Table;
                  const isActive = currentView === view.id;
                  return (
                    <Tooltip key={view.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewChange(view.id)}
                          className={cn(
                            "rounded-none px-3 transition-all duration-200",
                            isActive 
                              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                              : "hover:bg-accent"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{view.name} view</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          )}

          {/* Export */}
          {exportConfig?.enabled && onExport && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {exportConfig.formats?.map((format) => (
                        <DropdownMenuItem 
                          key={format} 
                          onClick={() => onExport(format)}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {format.toUpperCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Refresh */}
          {(onRefresh || config.onRefresh) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRefresh || config.onRefresh}
                    className="px-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Create */}
          {config.onCreate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={config.onCreate}
                    className="gap-2 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="gap-1.5 py-1.5 px-3 bg-primary/10 text-primary border-primary/20"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-medium">
              {Object.keys(activeFilters).length} filter{Object.keys(activeFilters).length !== 1 ? 's' : ''} active
            </span>
          </Badge>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {hasSelection && bulkActions.length > 0 && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedKeys.length} item{selectedKeys.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose an action to apply
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {bulkActions.map((action) => {
                const Icon = action.icon;
                return (
                  <TooltipProvider key={action.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={action.variant || (action.danger ? 'destructive' : 'default')}
                          size="sm"
                          onClick={() => onBulkAction(action)}
                          disabled={action.disabled}
                          className="gap-2 shadow-sm"
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {action.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Apply to {selectedKeys.length} item{selectedKeys.length !== 1 ? 's' : ''}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
