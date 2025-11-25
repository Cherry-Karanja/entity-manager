/**
 * Entity Manager Orchestrator
 * 
 * Thin orchestrator that coordinates all components.
 * Maximum ~150 lines - all logic delegated to hooks and components.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { BaseEntity, FilterConfig, SortConfig } from '../primitives/types';
import { EntityManagerProps, EntityManagerView } from './types';
import { EntityList } from '../components/list';
import { EntityForm } from '../components/form';
import { EntityView } from '../components/view';
import { EntityStateProvider, useEntityState } from '../composition/exports';
import { EntityApiProvider, useEntityMutations } from '../composition/exports';
import { FormMode } from '../components/form/types';
import { toast } from 'sonner';

/**
 * Build query parameters for API calls
 */
function buildQueryParams(
  page: number,
  pageSize: number,
  sort: SortConfig | null,
  search: string,
  filters: FilterConfig[]
): Record<string, unknown> {
  const queryParams: Record<string, unknown> = {
    page,
    pageSize,
  };
  
  if (sort) {
    queryParams.sortField = sort.field;
    queryParams.sortDirection = sort.direction;
  }
  
  if (search) {
    queryParams.search = search;
  }
  
  if (filters && filters.length > 0) {
    queryParams.filters = filters;
  }
  
  return queryParams;
}

/**
 * Parse error message from unknown error
 */
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}

/**
 * Entity Manager Content (with hooks)
 */
function EntityManagerContent<T extends BaseEntity = BaseEntity>(
  props: EntityManagerProps<T>
) {
  const { 
    config, 
  } = props;
  
  // Use initialView/initialId from config or props (props take precedence)
  const initialViewToUse = config.initialView ?? 'list';
  const initialIdToUse = config.initialId;
  const onViewChangeToUse = config.onViewChange;
  
  const [view, setView] = useState<EntityManagerView>(initialViewToUse);
  const [selectedId, setSelectedId] = useState<string | number | null>(initialIdToUse || null);
  const fetchAttempted = useRef(false);
  const initialListFetchCompleted = useRef(false);
  
  const state = useEntityState<T>();
  const mutations = useEntityMutations<T>();

  // Memoize pagination config to prevent unnecessary re-renders
  const memoizedPaginationConfig = useMemo(() => ({
    ...config.config.list.paginationConfig,
    page: state.state.page,
    pageSize: state.state.pageSize,
    totalCount: state.state.total
  }), [config.config.list.paginationConfig, state.state.page, state.state.pageSize, state.state.total]);

  // Watch for initialView and initialId changes from parent
  useEffect(() => {
    setView(initialViewToUse);
    
    if (initialViewToUse === 'list') {
      setSelectedId(null);
    } else if (initialIdToUse !== undefined && initialIdToUse !== null) {
      setSelectedId(initialIdToUse);
    }
    
    // Reset fetch flag when view changes to allow refetching if needed
    if (initialViewToUse !== 'list') {
      fetchAttempted.current = false;
    }
  }, [initialViewToUse, initialIdToUse]);

  /**
   * Fetch entities from API with given parameters
   */
  const fetchEntities = useCallback(async (
    page: number,
    pageSize: number,
    sort: SortConfig | null,
    search: string,
    filters: FilterConfig[]
  ) => {
    if (!config.apiClient) return;
    
    state.setLoading(true);
    const queryParams = buildQueryParams(page, pageSize, sort, search, filters);
    
    try {
      const response = await config.apiClient.list(queryParams as Parameters<typeof config.apiClient.list>[0]);
      const data = response.data || [];
      state.setEntities(data);
      if (response.meta?.total !== undefined) {
        state.setTotal(response.meta.total);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load data');
      state.setError(errorMessage);
    } finally {
      state.setLoading(false);
    }
  }, [config, state]);

  /**
   * Fetch a single entity by ID
   */
  const fetchSingleEntity = useCallback(async (id: string | number) => {
    if (!config.apiClient) return;
    
    state.setLoading(true);
    
    try {
      const response = await config.apiClient.get(id);
      const entity = response.data;
      state.setEntities([entity]);
      state.setTotal(1);
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load entity');
      state.setError(errorMessage);
    } finally {
      state.setLoading(false);
    }
  }, [config.apiClient, state]);

  // Auto-fetch data on mount if API client is available
  useEffect(() => {
    if (!config.apiClient || fetchAttempted.current) {
      // If no API client or fetch already attempted, mark as completed to allow filter/sort changes
      initialListFetchCompleted.current = true;
      return;
    }

    fetchAttempted.current = true;
    
    // If starting in edit/view mode with an ID, fetch that specific entity
    if ((initialViewToUse === 'edit' || initialViewToUse === 'view') && initialIdToUse) {
      initialListFetchCompleted.current = true;
      fetchSingleEntity(initialIdToUse);
    }
    // If starting in list mode with an initial ID, fetch only that entity
    else if (initialViewToUse === 'list' && initialIdToUse) {
      fetchSingleEntity(initialIdToUse).then(() => {
        initialListFetchCompleted.current = true;
      });
    }
    // If starting in list mode or create mode, fetch all entities
else if ((initialViewToUse === 'list' || initialViewToUse === 'create') && state.state.entities.length === 0) {
        const { page, pageSize, sort, search, filters } = state.state;
        fetchEntities(page, pageSize, sort ?? null, search, filters).then(() => {
        initialListFetchCompleted.current = true;
      });
    }
    else {
      // No initial fetch needed (e.g., initialData provided), mark as completed
      initialListFetchCompleted.current = true;
    }
  }, [config.apiClient, initialViewToUse, initialIdToUse, fetchEntities, fetchSingleEntity, state.state]);

  // Use ref to track previous filters and only update when content actually changes
  const prevFiltersRef = useRef<string>('');
  const prevFiltersObjectRef = useRef<FilterConfig[]>([]);
  const stableFilters = useMemo(() => {
    const filtersJson = JSON.stringify(state.state.filters);
    if (filtersJson !== prevFiltersRef.current) {
      prevFiltersRef.current = filtersJson;
      prevFiltersObjectRef.current = state.state.filters;
      return state.state.filters;
    }
    // Return the same reference if content hasn't changed
    return prevFiltersObjectRef.current;
  }, [state.state.filters]);

  // Refetch data when sorting, search, or filters change (but not pagination, handled directly)
  useEffect(() => {
    // Don't fetch if:
    // - No API client
    // - Not in list view
    // - Initial list fetch is still in progress (loading and not yet completed)
    if (!config.apiClient || view !== 'list') return;
    if (!initialListFetchCompleted.current && state.state.loading) return;

    const { page, pageSize, sort, search } = state.state;
    fetchEntities(page, pageSize, sort ?? null, search, stableFilters);
    // Note: Using specific state properties to avoid unnecessary refetches while satisfying deps
  }, [config.apiClient, view, state.state, stableFilters, fetchEntities]);

  // listen for view change and call onviewchange callback
  useEffect(() => {
    onViewChangeToUse?.(view);
  }, [view, onViewChangeToUse]);
  
  // Get selected entity
  const selectedEntity = selectedId ? state.getEntity(selectedId) : undefined;

  // Refresh function for actions
  const refreshData = useCallback(async () => {
    if (!config.apiClient || view !== 'list') return;

    const { page, pageSize, sort, search } = state.state;
    await fetchEntities(page, pageSize, sort ?? null, search, stableFilters);
  }, [config.apiClient, view, state.state, stableFilters, fetchEntities]);

  // Memoize actions with context to prevent re-renders
  const actionsWithContext = useMemo(() => {
    if (!config.config.list.actions) return undefined;
    
    return {
      ...config.config.list.actions,
      context: {
        ...config.config.list.actions.context,
        refresh: refreshData,
        customData: {
          allData: state.state.entities, // Pass all data for export
        },
      },
    };
  }, [config.config.list.actions, refreshData, state.state.entities]);
  
  // Handle edit
  const handleEdit = useCallback((entity: T) => {
    setView('edit');
    setSelectedId(entity.id);
  }, []);

  // Handle view
  const handleView = useCallback((entity: T) => {
    setView('view');
    setSelectedId(entity.id);
  }, []);

  // Handle back to list
  const handleBack = useCallback(() => {
    setView('list');
    setSelectedId(null);
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(async (values: Record<string, unknown>) => {
    try {
      if (view === 'create') {
        const created = await mutations.create(values as Partial<T>);
        state.addEntity(created);
        toast.success('Created successfully');
      } else if (view === 'edit' && selectedId) {
        const updated = await mutations.update(selectedId, values as Partial<T>);
        state.updateEntity(updated);
        toast.success('Updated successfully');
      }
      handleBack();
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Operation failed');
      toast.error(errorMessage);
      state.setError(errorMessage);
    }
  }, [view, selectedId, mutations, state, handleBack]);

  // Handle pagination change
  const handlePaginationChange = useCallback(async (paginationConfig: { page?: number; pageSize?: number }) => {
    const newPage = paginationConfig.page || 1;
    const newPageSize = paginationConfig.pageSize || 10;
    
    // Update state immediately
    state.setPage(newPage);
    state.setPageSize(newPageSize);
    
    // Trigger API call directly
    if (config.apiClient && view === 'list') {
      const { sort, search, filters } = state.state;
      await fetchEntities(newPage, newPageSize, sort ?? null, search, filters);
    }
  }, [config.apiClient, view, state, fetchEntities]);

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <nav className="flex mb-3 sm:mb-4 text-xs sm:text-sm overflow-x-auto" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 min-w-max px-1">
          <li className="inline-flex items-center">
            <button
              onClick={handleBack}
              className={`inline-flex items-center font-medium transition-colors ${
                view === 'list'
                  ? 'text-primary cursor-default'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              disabled={view === 'list'}
              aria-current={view === 'list' ? 'page' : undefined}
            >
              {config.config.name || 'Items'}
            </button>
          </li>
          {view !== 'list' && (
            <>
              <li aria-hidden="true">
                <div className="flex items-center">
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground mx-1"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </div>
              </li>
              <li>
                <span className="ml-0.5 sm:ml-1 font-medium text-primary">
                  {view === 'create' && 'Create New'}
                  {view === 'edit' && 'Edit'}
                  {view === 'view' && 'View Details'}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    );
  };

  // Render list view
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {renderBreadcrumbs()}
        <EntityList
          data={state.state.entities}
          columns={config.config.list.columns}
          view="table"
          toolbar={config.config.list.toolbar}
          selectable={config.config.list.selectable}
          multiSelect={config.config.list.multiSelect}
          selectedIds={state.state.selectedIds}
          onSelectionChange={state.setSelected}
          onRowClick={handleView}
          onRowDoubleClick={handleEdit}
          pagination={true}
          paginationConfig={memoizedPaginationConfig}
          onPaginationChange={handlePaginationChange}
          sortable={config.config.list.sortable}
          sortConfig={state.state.sort}
          onSortChange={state.setSort}
          filterable={config.config.list.filterable}
          filterConfigs={state.state.filters}
          onFilterChange={state.setFilters}
          searchable={config.config.list.searchable}
          searchValue={state.state.search}
          onSearchChange={state.setSearch}
          searchPlaceholder={config.config.list.searchPlaceholder}
          emptyMessage={config.config.list.emptyMessage}
          loading={state.state.loading}
          error={state.state.error}
          actions={actionsWithContext}
          className={config.config.list.className}
          hover={config.config.list.hover}
          striped={config.config.list.striped}
          bordered={config.config.list.bordered}
          titleField={config.config.list.titleField}
          subtitleField={config.config.list.subtitleField}
          imageField={config.config.list.imageField}
          dateField={config.config.list.dateField}
        />
      </div>
    );
  }

  // Render form view (create/edit)
  if (view === 'create' || view === 'edit') {
    const currentMode: FormMode = view === 'create' ? 'create' : 'edit';
    
    const formLayout = config.config.form.layout;
    const formSections = config.config.form.sections;
    const formFields = config.config.form.fields;
    
    return (
      <div className="space-y-3 sm:space-y-4">
        {renderBreadcrumbs()}
        <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
          <EntityForm
            fields={formFields as never}
            entity={view === 'edit' ? selectedEntity : undefined}
            mode={currentMode}
            layout={formLayout}
            sections={formSections as never}
            onSubmit={handleSubmit}
            onCancel={handleBack}
            onValidate={config.config.onValidate}
          />
        </div>
      </div>
    );
  }

  // Render detail view
  if (view === 'view') {
    if (!selectedEntity) {
      return (
        <div className="space-y-3 sm:space-y-4">
          {renderBreadcrumbs()}
          <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground mb-4">No entity selected</p>
            <button 
              onClick={handleBack} 
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-3 sm:space-y-4">
        {renderBreadcrumbs()}
        <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
          <EntityView
            entity={selectedEntity}
            fields={config.config.view.fields}
            groups={config.config.view.groups}
            mode={config.config.view.mode || "detail"}
            showMetadata={config.config.view.showMetadata}
            tabs={config.config.view.tabs}
            titleField={config.config.view.titleField}
            subtitleField={config.config.view.subtitleField}
            imageField={config.config.view.imageField}
            loading={state.state.loading}
            error={state.state.error}
            className={config.config.view.className}
            onCopy={() => {
              toast.success('Successfully copied to clipboard');
            }}
            actions={config.config.view.actions}
          />
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Entity Manager Component
 */
export function EntityManager<T extends BaseEntity = BaseEntity>(
  props: EntityManagerProps<T>
) {
  const { config, className = '', children } = props;

  // Custom layout via children
  if (children) {
    return <div className={`entity-manager ${className}`}>{children}</div>;
  }

  // Default layout with providers
  return (
    <div className={`entity-manager ${className}`}>
      <EntityStateProvider 
        initialEntities={config.initialData}
        initialPageSize={config.config.list.paginationConfig?.pageSize || 10}
        initialSort={config.config.list.sortConfig}
      >
        {config.apiClient ? (
          <EntityApiProvider client={config.apiClient}>
            <EntityManagerContent {...props} />
          </EntityApiProvider>
        ) : (
          <EntityManagerContent {...props} />
        )}
      </EntityStateProvider>
    </div>
  );
}
