/**
 * EntityList Component
 * 
 * Comprehensive list component with 8 view modes, search, filter, sort, and pagination.
 * Standalone component - works independently.
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { BaseEntity } from '../../primitives/types';
import { EntityActions } from '../actions';
import { Action } from '../actions/types';
import { 
  EntityListProps, 
  ListView, 
  ListState, 
  Column,
  CellRenderProps,
  RowRenderProps 
} from './types';
import {
  getVisibleColumns,
  getColumnValue,
  formatCellValue,
  searchEntities,
  filterEntities,
  sortEntities,
  paginateEntities,
  getTotalPages,
  getEntityTitle,
  getEntitySubtitle,
  getEntityImageUrl,
  getEntityDate,
  isImageView,
  isGridView,
  getDefaultPageSizes
} from './utils';

/**
 * EntityList component
 */
export function EntityList<T extends BaseEntity = BaseEntity>(
  props: EntityListProps<T>
) {
  const {
    data,
    columns,
    view: viewProp = 'table',
    toolbar = {},
    selectable = false,
    multiSelect = false,
    selectedIds: selectedIdsProp,
    onSelectionChange,
    onRowClick,
    onRowDoubleClick,
    pagination = false,
    paginationConfig,
    onPaginationChange,
    sortable = false,
    sortConfig: sortConfigProp,
    onSortChange,
    filterable = false,
    filterConfigs: filterConfigsProp,
    onFilterChange,
    searchable = false,
    searchValue: searchValueProp,
    onSearchChange,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data available',
    loading = false,
    error,
    rowHeight = 'auto',
    rowActions: RowActions,
    actions,
    bulkActions,
    className = '',
    rowClassName,
    hover = true,
    striped = false,
    bordered = false,
    titleField,
    subtitleField,
    imageField,
    dateField
  } = props;

  // State
  const [state, setState] = useState<ListState>({
    view: viewProp,
    selectedIds: selectedIdsProp || new Set(),
    page: paginationConfig?.page || 1,
    pageSize: paginationConfig?.pageSize || 10,
    sort: sortConfigProp,
    filters: filterConfigsProp || [],
    search: searchValueProp || '',
    visibleColumns: new Set(columns.map(c => String(c.key))),
    columnWidths: new Map()
  });

  // Sync external state
  React.useEffect(() => {
    if (selectedIdsProp) {
      setState(prev => ({ ...prev, selectedIds: selectedIdsProp }));
    }
  }, [selectedIdsProp]);

  React.useEffect(() => {
    if (sortConfigProp) {
      setState(prev => ({ ...prev, sort: sortConfigProp }));
    }
  }, [sortConfigProp]);

  React.useEffect(() => {
    if (filterConfigsProp) {
      setState(prev => ({ ...prev, filters: filterConfigsProp }));
    }
  }, [filterConfigsProp]);

  React.useEffect(() => {
    if (searchValueProp !== undefined) {
      setState(prev => ({ ...prev, search: searchValueProp }));
    }
  }, [searchValueProp]);

  // Process data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Search
    if (state.search) {
      result = searchEntities(result, state.search, columns);
    }
    
    // Filter
    if (state.filters.length > 0) {
      result = filterEntities(result, state.filters);
    }
    
    // Sort
    if (state.sort) {
      result = sortEntities(result, state.sort);
    }
    
    return result;
  }, [data, state.search, state.filters, state.sort, columns]);

  // Pagination
  const totalPages = getTotalPages(processedData.length, state.pageSize);
  const paginatedData = pagination 
    ? paginateEntities(processedData, state.page, state.pageSize)
    : processedData;

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    const allIds = new Set(processedData.map(e => e.id));
    setState(prev => ({ ...prev, selectedIds: allIds }));
    onSelectionChange?.(allIds, processedData);
  }, [processedData, onSelectionChange]);

  const handleDeselectAll = useCallback(() => {
    const empty = new Set<string | number>();
    setState(prev => ({ ...prev, selectedIds: empty }));
    onSelectionChange?.(empty, []);
  }, [onSelectionChange]);

  const handleSelectRow = useCallback((id: string | number) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedIds);
      if (multiSelect) {
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
      } else {
        newSelected.clear();
        newSelected.add(id);
      }
      const selectedEntities = data.filter(e => newSelected.has(e.id));
      onSelectionChange?.(newSelected, selectedEntities);
      return { ...prev, selectedIds: newSelected };
    });
  }, [multiSelect, onSelectionChange, data]);

  // Search handler
  const handleSearchChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, search: value, page: 1 }));
    onSearchChange?.(value);
  }, [onSearchChange]);

  // Sort handler
  const handleSort = useCallback((field: string) => {
    setState(prev => {
      const newSort = prev.sort?.field === field && prev.sort.direction === 'asc'
        ? { field, direction: 'desc' as const }
        : { field, direction: 'asc' as const };
      onSortChange?.(newSort);
      return { ...prev, sort: newSort };
    });
  }, [onSortChange]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
    const pageSize = paginationConfig?.pageSize ?? state.pageSize;
    onPaginationChange?.({ ...(paginationConfig ?? {}), page, pageSize });
  }, [paginationConfig, onPaginationChange, state.pageSize]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
    onPaginationChange?.({ ...(paginationConfig ?? {}), pageSize, page: 1 });
  }, [paginationConfig, onPaginationChange]);

  // View switcher
  const handleViewChange = useCallback((view: ListView) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  // Get visible columns
  const visibleColumns = getVisibleColumns(columns);

  // Render toolbar
  const renderToolbar = () => {
    const hasToolbar = (toolbar && Object.keys(toolbar).length > 0) || searchable;
    if (!hasToolbar) {
      return null;
    }

    return (
      <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-card border-b">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            {(toolbar?.search || searchable) && (
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={state.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                  aria-label="Search"
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2 items-center flex-wrap">
            {toolbar.viewSwitcher && (
              <div className="inline-flex rounded-md shadow-sm overflow-x-auto" role="group" aria-label="View switcher">
                {(['table', 'card', 'list', 'grid'] as ListView[]).map(v => (
                  <button
                    key={v}
                    onClick={() => handleViewChange(v)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border transition-colors first:rounded-l-md last:rounded-r-md ${
                      state.view === v
                        ? 'bg-primary text-primary-foreground border-primary z-10'
                        : 'bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground'
                    }`}
                    aria-pressed={state.view === v}
                    title={`Switch to ${v} view`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            )}
            
            {toolbar.actions && (
              <div className="flex gap-2">
                {toolbar.actions}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const startItem = ((state.page - 1) * state.pageSize) + 1;
    const endItem = Math.min(state.page * state.pageSize, processedData.length);

    return (
      <nav 
        className="flex flex-col gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-card border-t" 
        role="navigation" 
        aria-label="Pagination"
      >
        {/* Results info - always visible */}
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
          <span className="font-medium text-foreground">{endItem}</span> of{' '}
          <span className="font-medium text-foreground">{processedData.length}</span> results
        </div>
        
        {/* Pagination controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Page navigation buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={state.page === 1}
              className="hidden sm:inline-flex px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-input rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to first page"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(state.page - 1)}
              disabled={state.page === 1}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-input rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to previous page"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            
            <span className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-3 whitespace-nowrap">
              Page <span className="font-medium text-foreground">{state.page}</span> of{' '}
              <span className="font-medium text-foreground">{totalPages}</span>
            </span>
            
            <button
              onClick={() => handlePageChange(state.page + 1)}
              disabled={state.page >= totalPages}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-input rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to next page"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={state.page >= totalPages}
              className="hidden sm:inline-flex px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-input rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to last page"
            >
              Last
            </button>
          </div>
          
          {/* Page size selector */}
          <select
            title='Items per page'
            aria-label='Items per page'
            value={state.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="w-full sm:w-auto px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          >
            {getDefaultPageSizes().map(size => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
        </div>
      </nav>
    );
  };

  // Render cell
  const renderCell = ({ column, entity, value, index }: CellRenderProps<T>) => {
    if (column.render) {
      return column.render(value, entity, index);
    }
    
    return formatCellValue(value, column, entity);
  };

  // Render table view
  const renderTableView = () => {
    return (
      <div className="relative overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th scope="col" className="px-3 sm:px-4 py-3 w-12">
                    {multiSelect && (
                      <input
                        title="Select all"
                        aria-label="Select all"
                        type="checkbox"
                        checked={state.selectedIds.size === processedData.length && processedData.length > 0}
                        onChange={() => state.selectedIds.size === processedData.length ? handleDeselectAll() : handleSelectAll()}
                        className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                      />
                    )}
                  </th>
                )}
                {visibleColumns.map(column => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    style={{ width: column.width, textAlign: column.align }}
                    className={`px-3 sm:px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                      column.sortable && sortable ? 'cursor-pointer select-none hover:text-foreground' : ''
                    }`}
                    onClick={() => column.sortable && sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">{column.label}</span>
                      {state.sort?.field === column.key && (
                        <span className="text-primary flex-shrink-0">
                          {state.sort.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(RowActions || actions) && (
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right w-24">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedData.map((entity, index) => {
                const isSelected = state.selectedIds.has(entity.id);
                const rowClass = rowClassName ? rowClassName(entity, index) : '';
                
                return (
                  <tr
                    key={entity.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-muted' : ''
                    } ${hover ? 'hover:bg-muted/50 cursor-pointer' : ''} ${
                      striped && index % 2 === 0 ? 'bg-muted/20' : ''
                    } ${rowClass}`}
                    onClick={() => onRowClick?.(entity, index)}
                    onDoubleClick={() => onRowDoubleClick?.(entity, index)}
                  >
                    {selectable && (
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <input
                          title="Select row"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(entity.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                        />
                      </td>
                    )}
                    {visibleColumns.map(column => {
                      const value = getColumnValue(entity, column.key);
                      return (
                        <td
                          key={String(column.key)}
                          className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm"
                          style={{ textAlign: column.align }}
                        >
                          <div className="truncate max-w-xs">
                            {renderCell({ column, entity, value, index })}
                          </div>
                        </td>
                      );
                    })}
                    {(RowActions || actions) && (
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1 sm:gap-2">
                          {actions ? (
                            <EntityActions actions={actions} entity={entity} mode="buttons" />
                          ) : RowActions ? (
                            <RowActions entity={entity} index={index} />
                          ) : null}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };  // Render card view
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          const imageUrl = getEntityImageUrl(entity, imageField);
          
          return (
            <div
              key={entity.id}
              className={`bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } cursor-pointer relative`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <div className="absolute top-2 right-2 z-10">
                  <input
                    title="Select card"
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectRow(entity.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                  />
                </div>
              )}
              
              {imageUrl && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1">{title}</h3>
                  {subtitle && <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">{subtitle}</p>}
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  {visibleColumns.slice(0, 3).map(column => {
                    const value = getColumnValue(entity, column.key);
                    return (
                      <div key={String(column.key)} className="flex items-start text-xs sm:text-sm">
                        <span className="font-medium text-muted-foreground w-1/3 flex-shrink-0">{column.label}:</span>
                        <span className="text-foreground w-2/3 line-clamp-1">
                          {renderCell({ column, entity, value, index })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {(RowActions || actions) && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 flex items-center gap-2 border-t pt-3">
                  {actions ? (
                    <EntityActions actions={actions} entity={entity} mode="buttons" />
                  ) : RowActions ? (
                    <RowActions entity={entity} index={index} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="divide-y">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          
          return (
            <div
              key={entity.id}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 transition-colors ${
                isSelected ? 'bg-muted' : ''
              } hover:bg-muted/50 cursor-pointer`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <input
                  title="Select item"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2 flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{title}</div>
                {subtitle && <div className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</div>}
              </div>
              
              {(RowActions || actions) && (
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {actions ? (
                    <EntityActions actions={actions} entity={entity} mode="buttons" />
                  ) : RowActions ? (
                    <RowActions entity={entity} index={index} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render timeline view
  const renderTimelineView = () => {
    return (
      <div className="relative space-y-4 sm:space-y-6 p-3 sm:p-4">
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        {paginatedData.map((entity, index) => {
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          const date = getEntityDate(entity, dateField);
          
          return (
            <div key={entity.id} className="relative pl-10 sm:pl-12">
              <div className="absolute left-3 sm:left-4.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm"></div>
              <div className="bg-card rounded-lg border shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => onRowClick?.(entity, index)}>
                {date && (
                  <div className="text-xs font-medium text-primary mb-1.5 sm:mb-2">
                    {date.toLocaleDateString()}
                  </div>
                )}
                <div className="text-sm font-semibold text-foreground">{title}</div>
                {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 p-3 sm:p-4">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          
          return (
            <div
              key={entity.id}
              className={`bg-card rounded-lg border shadow-sm p-3 sm:p-4 transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } cursor-pointer relative aspect-square flex items-center justify-center`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1.5 right-1.5 w-3 h-3 text-primary bg-background border-input rounded focus:ring-ring focus:ring-1"
                  title="Select item"
                />
              )}
              <div className="text-xs sm:text-sm font-medium text-foreground text-center line-clamp-3 px-1">
                {title}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render compact view
  const renderCompactView = () => {
    return renderTableView(); // Similar to table but with smaller styling
  };

  // Render detailed view
  const renderDetailedView = () => {
    return (
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          
          return (
            <div
              key={entity.id}
              className={`bg-card rounded-lg border shadow-sm overflow-hidden ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/50 border-b">
                {selectable && (
                  <input
                    title="Select detailed item"
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectRow(entity.id)}
                    className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2 flex-shrink-0"
                  />
                )}
                <h3 className="text-sm sm:text-base font-semibold text-foreground flex-1 truncate">{title}</h3>
              </div>
              
              <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                {visibleColumns.map(column => {
                  const value = getColumnValue(entity, column.key);
                  return (
                    <div key={String(column.key)} className="flex items-start py-1">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground w-1/3 flex-shrink-0">{column.label}:</label>
                      <span className="text-xs sm:text-sm text-foreground w-2/3 break-words">
                        {renderCell({ column, entity, value, index })}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {(RowActions || actions) && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 flex items-center gap-2 border-t pt-3">
                  {actions ? (
                    <EntityActions actions={actions} entity={entity} mode="buttons" />
                  ) : RowActions ? (
                    <RowActions entity={entity} index={index} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render gallery view
  const renderGalleryView = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const imageUrl = getEntityImageUrl(entity, imageField);
          
          return (
            <div
              key={entity.id}
              className={`bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } cursor-pointer`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {imageUrl ? (
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="aspect-square w-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="p-2 sm:p-3 text-center">
                <div className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">{title}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render current view
  const renderView = () => {
    switch (state.view) {
      case 'table': return renderTableView();
      case 'card': return renderCardView();
      case 'list': return renderListView();
      case 'grid': return renderGridView();
      case 'compact': return renderCompactView();
      case 'timeline': return renderTimelineView();
      case 'detailed': return renderDetailedView();
      case 'gallery': return renderGalleryView();
      default: return renderTableView();
    }
  };

  // Render empty state
  if (!loading && processedData.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
        <div className="text-center space-y-3">
          <div className="text-muted-foreground text-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {emptyMessage}
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating a new item.
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
        <div className="text-center space-y-3">
          <div className="text-destructive text-lg">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Error Loading Data
          </h3>
          <p className="text-sm text-destructive">
            {typeof error === 'string' ? error : error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg border shadow-sm overflow-hidden ${className}`}>
      {renderToolbar()}
      
      {selectable && multiSelect && state.selectedIds.size > 0 && bulkActions && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 sm:py-2 bg-primary/10 border-b">
          <span className="text-xs sm:text-sm font-medium text-center sm:text-left">{state.selectedIds.size} selected</span>
          <div className="flex gap-2 justify-center sm:justify-end flex-wrap">
            {bulkActions}
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ) : (
        <div>
          {renderView()}
        </div>
      )}
      
      {renderPagination()}
    </div>
  );
}
