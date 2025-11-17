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
      <div className="entity-list-toolbar">
        {(toolbar?.search || searchable) && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={state.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        )}
        
        {toolbar.viewSwitcher && (
          <div className="view-switcher">
            {(['table', 'card', 'list', 'grid', 'compact', 'timeline', 'detailed', 'gallery'] as ListView[]).map(v => (
              <button
                key={v}
                onClick={() => handleViewChange(v)}
                className={state.view === v ? 'active' : ''}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        
        {toolbar.actions}
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <nav className="entity-list-pagination" role="navigation" aria-label="Pagination">
        <div className="page-info">
          Page {state.page} of {totalPages} ({processedData.length} items)
        </div>
        
        <div className="page-controls">
          <button
            onClick={() => handlePageChange(1)}
            disabled={state.page === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(state.page - 1)}
            disabled={state.page === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(state.page + 1)}
            disabled={state.page >= totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={state.page >= totalPages}
          >
            Last
          </button>
        </div>
        
        <select
          title='Items per page'
          aria-label='Items per page'
          value={state.pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          {getDefaultPageSizes().map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
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
      <table className={`entity-list-table ${bordered ? 'bordered' : ''} ${striped ? 'striped' : ''}`}>
        <thead>
          <tr>
            {selectable && (
              <th className="select-column">
                {multiSelect && (
                  <input
                    title="Select all"
                    aria-label="Select all"
                    type="checkbox"
                    checked={state.selectedIds.size === processedData.length && processedData.length > 0}
                    onChange={() => state.selectedIds.size === processedData.length ? handleDeselectAll() : handleSelectAll()}
                  />
                )}
              </th>
            )}
            {visibleColumns.map(column => (
              <th
                key={String(column.key)}
                style={{ width: column.width, textAlign: column.align }}
                className={column.sortable && sortable ? 'sortable' : ''}
                onClick={() => column.sortable && sortable && handleSort(String(column.key))}
              >
                {column.label}
                {state.sort?.field === column.key && (
                  <span className="sort-indicator">
                    {state.sort.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
            {(RowActions || actions) && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entity, index) => {
            const isSelected = state.selectedIds.has(entity.id);
            const rowClass = rowClassName ? rowClassName(entity, index) : '';
            
            return (
              <tr
                key={entity.id}
                className={`${isSelected ? 'selected' : ''} ${hover ? 'hover' : ''} ${rowClass}`}
                onClick={() => onRowClick?.(entity, index)}
                onDoubleClick={() => onRowDoubleClick?.(entity, index)}
              >
                {selectable && (
                  <td className="select-column">
                    <input
                      title="Select row"
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(entity.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {visibleColumns.map(column => {
                  const value = getColumnValue(entity, column.key);
                  return (
                    <td
                      key={String(column.key)}
                      style={{ textAlign: column.align }}
                    >
                      {renderCell({ column, entity, value, index })}
                    </td>
                  );
                })}
                {(RowActions || actions) && (
                  <td className="actions-column">
                    {actions ? (
                      <EntityActions actions={actions} entity={entity} mode="buttons" />
                    ) : RowActions ? (
                      <RowActions entity={entity} index={index} />
                    ) : null}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Render card view
  const renderCardView = () => {
    return (
      <div className="entity-list-cards">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          const imageUrl = getEntityImageUrl(entity, imageField);
          
          return (
            <div
              key={entity.id}
              className={`entity-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <input
                  title="Select card"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="card-checkbox"
                />
              )}
              
              {imageUrl && (
                <img src={imageUrl} alt={title} className="card-image" />
              )}
              
              <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
                
                <div className="card-fields">
                  {visibleColumns.slice(0, 3).map(column => {
                    const value = getColumnValue(entity, column.key);
                    return (
                      <div key={String(column.key)} className="card-field">
                        <span className="field-label">{column.label}:</span>
                        <span className="field-value">
                          {renderCell({ column, entity, value, index })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {(RowActions || actions) && (
                <div className="card-actions">
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
      <div className="entity-list-list">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          
          return (
            <div
              key={entity.id}
              className={`list-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <input
                  title="Select item"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              <div className="list-content">
                <div className="list-title">{title}</div>
                {subtitle && <div className="list-subtitle">{subtitle}</div>}
              </div>
              
              {(RowActions || actions) && (
                <div className="list-actions">
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
      <div className="entity-list-timeline">
        {paginatedData.map((entity, index) => {
          const title = getEntityTitle(entity, titleField);
          const subtitle = getEntitySubtitle(entity, subtitleField);
          const date = getEntityDate(entity, dateField);
          
          return (
            <div key={entity.id} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-content">
                {date && (
                  <div className="timeline-date">
                    {date.toLocaleDateString()}
                  </div>
                )}
                <div className="timeline-title">{title}</div>
                {subtitle && <div className="timeline-subtitle">{subtitle}</div>}
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
      <div className="entity-list-grid">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          
          return (
            <div
              key={entity.id}
              className={`grid-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {selectable && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <div className="grid-title">{title}</div>
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
      <div className="entity-list-detailed">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          
          return (
            <div
              key={entity.id}
              className={`detailed-item ${isSelected ? 'selected' : ''}`}
            >
              {selectable && (
                <input
                  title="Select detailed item"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRow(entity.id)}
                />
              )}
              
              <h3>{title}</h3>
              
              <div className="detailed-fields">
                {visibleColumns.map(column => {
                  const value = getColumnValue(entity, column.key);
                  return (
                    <div key={String(column.key)} className="detailed-field">
                      <label>{column.label}:</label>
                      <span>{renderCell({ column, entity, value, index })}</span>
                    </div>
                  );
                })}
              </div>
              
              {(RowActions || actions) && (
                <div className="detailed-actions">
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
      <div className="entity-list-gallery">
        {paginatedData.map((entity, index) => {
          const isSelected = state.selectedIds.has(entity.id);
          const title = getEntityTitle(entity, titleField);
          const imageUrl = getEntityImageUrl(entity, imageField);
          
          return (
            <div
              key={entity.id}
              className={`gallery-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onRowClick?.(entity, index)}
            >
              {imageUrl && (
                <img src={imageUrl} alt={title} className="gallery-image" />
              )}
              <div className="gallery-caption">{title}</div>
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
    <div className={`entity-list ${className}`}>
      {renderToolbar()}
      
      {selectable && multiSelect && state.selectedIds.size > 0 && bulkActions && (
        <div className="bulk-actions-bar">
          <span>{state.selectedIds.size} selected</span>
          {bulkActions}
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
        <div className="entity-list-content">
          {renderView()}
        </div>
      )}
      
      {renderPagination()}
    </div>
  );
}
