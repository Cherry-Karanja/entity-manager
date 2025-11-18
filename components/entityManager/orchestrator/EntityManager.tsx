/**
 * Entity Manager Orchestrator
 * 
 * Thin orchestrator that coordinates all components.
 * Maximum ~150 lines - all logic delegated to hooks and components.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BaseEntity } from '../primitives/types';
import { EntityManagerProps, EntityManagerView } from './types';
import { EntityList } from '../components/list';
import { EntityForm } from '../components/form';
import { EntityView } from '../components/view';
import { EntityActions } from '../components/actions';
import { EntityStateProvider, useEntityState } from '../composition/exports';
import { EntityApiProvider, useEntityMutations } from '../composition/exports';

/**
 * Entity Manager Content (with hooks)
 */
function EntityManagerContent<T extends BaseEntity = BaseEntity>(
  props: EntityManagerProps<T>
) {
  const { 
    config, 
    initialView: propsInitialView, 
    initialId: propsInitialId,
    onViewChange 
  } = props;
  
  // Use initialView/initialId from config or props (props take precedence)
  const initialViewToUse = propsInitialView ?? config.initialView ?? 'list';
  const initialIdToUse = propsInitialId ?? config.initialId;
  const onViewChangeToUse = onViewChange ?? config.onViewChange;
  
  const [view, setView] = useState<EntityManagerView>(initialViewToUse);
  const [selectedId, setSelectedId] = useState<string | number | null>(initialIdToUse || null);
  const fetchAttempted = useRef(false);
  const initialListFetchCompleted = useRef(false);
  
  const state = useEntityState<T>();
  const mutations = useEntityMutations<T>();

  // Watch for initialView and initialId changes from parent
  useEffect(() => {
    console.log('initialView changed:', initialViewToUse, 'initialId:', initialIdToUse);
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

  // Auto-fetch data on mount if API client is available
  useEffect(() => {
    if (!config.apiClient || fetchAttempted.current) return;

    fetchAttempted.current = true;
    
    // If starting in edit/view mode with an ID, fetch that specific entity
    if ((initialViewToUse === 'edit' || initialViewToUse === 'view') && initialIdToUse) {
      state.setLoading(true);
      config.apiClient.get(initialIdToUse)
        .then((response) => {
          const entity = response.data;
          state.addEntity(entity);
          state.setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch entity:', error);
          state.setError(error.message || 'Failed to load entity');
          state.setLoading(false);
        });
    }
    // If starting in list mode or create mode, fetch all entities
    else if ((initialViewToUse === 'list' || initialViewToUse === 'create') && state.state.entities.length === 0) {
      state.setLoading(true);
      
      // Build query parameters for initial load with all current state
      const { page, pageSize, sort, search, filters } = state.state;
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
      
      config.apiClient.list(queryParams as never)
        .then((response) => {
          const data = response.data || [];
          state.setEntities(data);
          if (response.meta?.total !== undefined) {
            state.setTotal(response.meta.total);
          }
          state.setLoading(false);
          initialListFetchCompleted.current = true;
        })
        .catch((error) => {
          console.error('Failed to fetch entities:', error);
          state.setError(error.message || 'Failed to load data');
          state.setLoading(false);
          initialListFetchCompleted.current = true;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiClient, state]);

  // Refetch data when sorting, search, or filters change (but not pagination, handled directly)
  useEffect(() => {
    if (!config.apiClient || view !== 'list' || !initialListFetchCompleted.current) return;

    const { page, pageSize, sort, search, filters } = state.state;
    
    state.setLoading(true);
    
    // Build query parameters for server-side filtering/sorting/pagination
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

    config.apiClient.list(queryParams as never)
      .then((response) => {
        const data = response.data || [];
        state.setEntities(data);
        if (response.meta?.total !== undefined) {
          state.setTotal(response.meta.total);
        }
        state.setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch entities:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        state.setError(errorMessage);
        state.setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.state.sort, state.state.search, state.state.filters, view]);

  // Get selected entity
  const selectedEntity = selectedId ? state.getEntity(selectedId) : undefined;

  // Note: These handlers are available for use in action handlers defined in config
  // They can be passed via context or bound to actions in the config
  
  // Handle edit
  const handleEdit = (entity: T) => {
    setView('edit');
    setSelectedId(entity.id);
    onViewChangeToUse?.('edit');
  };

  // Handle view
  const handleView = (entity: T) => {
    setView('view');
    setSelectedId(entity.id);
    onViewChangeToUse?.('view');
  };

  // Handle back to list
  const handleBack = () => {
    setView('list');
    setSelectedId(null);
    onViewChangeToUse?.('list');
  };

  // Handle form submit
  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (view === 'create') {
        const created = await mutations.create(values as Partial<T>);
        state.addEntity(created);
      } else if (view === 'edit' && selectedId) {
        const updated = await mutations.update(selectedId, values as Partial<T>);
        state.updateEntity(updated);
      }
      handleBack();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Handle delete
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: string | number) => {
    try {
      await mutations.delete(id);
      state.deleteEntity(id);
      if (selectedId === id) {
        handleBack();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

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
          columns={config.config.columns}
          view="table"
          toolbar={{ search: true, viewSwitcher: true }}
          selectable={true}
          multiSelect={true}
          selectedIds={state.state.selectedIds}
          onSelectionChange={state.setSelected}
          onRowClick={handleView}
          onRowDoubleClick={handleEdit}
          pagination={true}
          paginationConfig={{
            page: state.state.page,
            pageSize: state.state.pageSize,
            totalCount: state.state.total
          }}
          onPaginationChange={async (paginationConfig) => {
            const newPage = paginationConfig.page || 1;
            const newPageSize = paginationConfig.pageSize || 10;
            
            // Update state immediately
            state.setPage(newPage);
            state.setPageSize(newPageSize);
            
            // Trigger API call directly
            if (config.apiClient && view === 'list') {
              state.setLoading(true);
              
              const { sort, search, filters } = state.state;
              const queryParams: Record<string, unknown> = {
                page: newPage,
                pageSize: newPageSize,
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

              try {
                const response = await config.apiClient.list(queryParams as never);
                const data = response.data || [];
                state.setEntities(data);
                if (response.meta?.total !== undefined) {
                  state.setTotal(response.meta.total);
                }
                state.setLoading(false);
              } catch (error) {
                console.error('Failed to fetch entities:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
                state.setError(errorMessage);
                state.setLoading(false);
              }
            }
          }}
          sortable={true}
          sortConfig={state.state.sort}
          onSortChange={state.setSort}
          searchable={true}
          searchValue={state.state.search}
          onSearchChange={state.setSearch}
          filterable={true}
          filterConfigs={state.state.filters}
          onFilterChange={state.setFilters}
          loading={state.state.loading}
          error={state.state.error}
          rowActions={({ entity }) => (
            <EntityActions
              actions={config.config.actions?.filter(a => a.position === 'row') || []}
              entity={entity}
            />
          )}
          titleField={config.config.titleField}
          subtitleField={config.config.subtitleField}
          imageField={config.config.imageField}
          dateField={config.config.dateField}
        />
      </div>
    );
  }

  // Render form view (create/edit)
  if (view === 'create' || view === 'edit') {
    console.log('Rendering form view:', view);
    console.log('Form fields:', config.config.fields);
    console.log('Form layout:', config.config.formLayout);
    console.log('Form sections:', config.config.formSections);
    console.log('Form fields:', config.config.fields);
    
    return (
      <div className="space-y-3 sm:space-y-4">
        {renderBreadcrumbs()}
        <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
          <EntityForm
            fields={config.config.fields as never}
            entity={view === 'edit' ? selectedEntity : undefined}
            mode={view === 'create' ? 'create' : 'edit'}
            layout={config.config.formLayout}
            sections={config.config.formSections as never}
            onSubmit={handleSubmit}
            onCancel={handleBack}
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
        <EntityActions
          actions={config.config.actions.filter(a => a.position === 'toolbar')}
          entity={selectedEntity}
        />
        
        <EntityView
          entity={selectedEntity}
          fields={config.config.viewFields}
          mode="detail"
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
        initialPageSize={config.config.defaultPageSize}
        initialSort={config.config.defaultSort}
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
