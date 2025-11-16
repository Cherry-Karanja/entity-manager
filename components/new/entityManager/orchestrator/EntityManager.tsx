/**
 * Entity Manager Orchestrator
 * 
 * Thin orchestrator that coordinates all components.
 * Maximum ~150 lines - all logic delegated to hooks and components.
 */

'use client';

import React, { useState } from 'react';
import { BaseEntity } from '../primitives/types';
import { EntityManagerProps, EntityManagerView } from './types';
import { EntityList } from '../components/list';
import { EntityForm } from '../components/form';
import { EntityView } from '../components/view';
import { EntityActions } from '../components/actions';
import { EntityExporter } from '../components/exporter';
import { EntityStateProvider, useEntityState } from '../composition/state';
import { EntityApiProvider, useEntityMutations } from '../composition/api';

/**
 * Entity Manager Content (with hooks)
 */
function EntityManagerContent<T extends BaseEntity = BaseEntity>(
  props: EntityManagerProps<T>
) {
  const { config } = props;
  const [view, setView] = useState<EntityManagerView>('list');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  
  const state = useEntityState<T>();
  const mutations = useEntityMutations<T>();

  // Get selected entity
  const selectedEntity = selectedId ? state.getEntity(selectedId) : undefined;

  // Handle create
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

  // Render list view
  if (view === 'list') {
    return (
      <div className="entity-manager-list-view">
        <div className="entity-manager-toolbar">
          <EntityActions
            actions={config.config.actions.filter(a => a.position === 'toolbar')}
            onActionExecute={async (action) => {
              if (action.id === 'create') handleCreate();
            }}
          />
          <EntityExporter
            data={state.state.entities}
            fields={config.config.exportFields}
          />
        </div>
        
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
            pageSize: state.state.pageSize
          }}
          onPaginationChange={(config) => {
            state.setPage(config.page || 1);
            state.setPageSize(config.pageSize || 10);
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
              actions={config.config.actions.filter(a => a.position === 'row')}
              entity={entity}
              onActionExecute={async (action) => {
                if (action.id === 'edit') handleEdit(entity);
                if (action.id === 'view') handleView(entity);
                if (action.id === 'delete') handleDelete(entity.id);
              }}
            />
          )}
        />
      </div>
    );
  }

  // Render form view (create/edit)
  if (view === 'create' || view === 'edit') {
    return (
      <div className="entity-manager-form-view">
        <EntityForm
          fields={config.config.fields}
          entity={selectedEntity}
          mode={view === 'create' ? 'create' : 'edit'}
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      </div>
    );
  }

  // Render detail view
  if (view === 'view' && selectedEntity) {
    return (
      <div className="entity-manager-detail-view">
        <EntityActions
          actions={config.config.actions.filter(a => a.position === 'toolbar')}
          entity={selectedEntity}
          onActionExecute={async (action) => {
            if (action.id === 'edit') handleEdit(selectedEntity);
            if (action.id === 'delete') handleDelete(selectedEntity.id);
            if (action.id === 'back') handleBack();
          }}
        />
        
        <EntityView
          entity={selectedEntity}
          fields={config.config.viewFields}
          mode="detail"
        />
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
