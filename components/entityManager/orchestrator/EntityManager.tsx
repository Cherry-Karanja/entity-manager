/**
 * Entity Manager Orchestrator
 * 
 * Thin orchestrator that coordinates all components.
 * Maximum ~150 lines - all logic delegated to hooks and components.
 */

'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { BaseEntity } from '../primitives/types';
import { EntityManagerProps, EntityManagerView } from './types';
import { EntityList } from '../components/list';
import { EntityForm } from '../components/form';
import { EntityView } from '../components/view';
import { EntityActions } from '../components/actions';
import { ActionDefinition } from '../components/actions/types';
import { EntityExporter } from '../components/exporter';
import { EntityStateProvider, useEntityState } from '../composition/exports';
import { EntityApiProvider, useEntityMutations } from '../composition/exports';

/**
 * Entity Manager Content (with hooks)
 */
function EntityManagerContent<T extends BaseEntity = BaseEntity>(
  props: EntityManagerProps<T>
) {
  const { config, initialView = 'list', initialId } = props;
  const [view, setView] = useState<EntityManagerView>(initialView);
  const [selectedId, setSelectedId] = useState<string | number | null>(initialId || null);
  const fetchAttempted = useRef(false);
  
  const state = useEntityState<T>();
  const mutations = useEntityMutations<T>();

  // Watch for initialView changes from parent
  useEffect(() => {
    setView(initialView);
    if (initialView === 'list') {
      setSelectedId(null);
    }
  }, [initialView]);

  // Auto-fetch data on mount if API client is available
  useEffect(() => {
    if (!config.apiClient || fetchAttempted.current) return;

    fetchAttempted.current = true;
    
    // If starting in edit/view mode with an ID, fetch that specific entity
    if ((initialView === 'edit' || initialView === 'view') && initialId) {
      state.setLoading(true);
      config.apiClient.get(initialId)
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
    else if ((initialView === 'list' || initialView === 'create') && state.state.entities.length === 0) {
      state.setLoading(true);
      config.apiClient.list()
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
          state.setError(error.message || 'Failed to load data');
          state.setLoading(false);
        });
    }
  }, [config.apiClient, initialView, initialId, state]);

  // Get selected entity
  const selectedEntity = selectedId ? state.getEntity(selectedId) : undefined;

  // Note: These handlers are available for use in action handlers defined in config
  // They can be passed via context or bound to actions in the config
  
  // Handle create
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreate = () => {
    setView('create');
    setSelectedId(null);
  };

  // Handle edit
  const handleEdit = (entity: T) => {
    setView('edit');
    setSelectedId(entity.id);
  };

  // Handle view
  const handleView = (entity: T) => {
    setView('view');
    setSelectedId(entity.id);
  };

  // Handle back to list
  const handleBack = () => {
    setView('list');
    setSelectedId(null);
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
      <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button
              onClick={handleBack}
              className={`inline-flex items-center text-sm font-medium ${
                view === 'list'
                  ? 'text-primary cursor-default'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              disabled={view === 'list'}
            >
              {config.config.name || 'Items'}
            </button>
          </li>
          {view !== 'list' && (
            <>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-muted-foreground mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="ml-1 text-sm font-medium text-primary md:ml-2">
                    {view === 'create' && 'Create New'}
                    {view === 'edit' && 'Edit'}
                    {view === 'view' && 'View Details'}
                  </span>
                </div>
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
          onPaginationChange={(paginationConfig) => {
            state.setPage(paginationConfig.page || 1);
            state.setPageSize(paginationConfig.pageSize || 10);
          }}
          sortable={true}
          sortConfig={state.state.sort}
          onSortChange={state.setSort}
          searchable={true}
          searchValue={state.state.search}
          onSearchChange={state.setSearch}
          loading={state.state.loading}
          error={state.state.error}
          rowActions={({ entity }) => (
            <EntityActions
              actions={config.config.actions?.filter(a => a.position === 'row') || []}
              entity={entity}
            />
          )}
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
    
    return (
      <div className="space-y-4">
        {renderBreadcrumbs()}
        <div className="bg-card rounded-lg border p-6">
          <EntityForm
          fields={config.config.fields}
          entity={view === 'edit' ? selectedEntity : undefined}
          mode={view === 'create' ? 'create' : 'edit'}
          layout={config.config.formLayout}
          sections={config.config.formSections}
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
        <div className="space-y-4">
          {renderBreadcrumbs()}
          <div className="bg-card rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No entity selected</p>
            <button onClick={handleBack} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Back to List
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {renderBreadcrumbs()}
        <div className="bg-card rounded-lg border p-6">
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
      <EntityStateProvider initialEntities={config.initialData}>
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
