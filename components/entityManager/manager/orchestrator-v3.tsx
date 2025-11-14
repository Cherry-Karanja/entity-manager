// ===== ENTITY ORCHESTRATOR V3.0 =====
// Complete rewrite - thin coordinator that passes configs directly to components

import React, { useState, useCallback, useEffect } from 'react'
import { EntityManagerConfig, Entity } from '../types'

// Component imports (to be created/updated)
// import { EntityList } from '../EntityList'
// import { EntityForm } from '../EntityForm'
// import { EntityView } from '../EntityView'
// import { EntityActions } from '../EntityActions'

export interface EntityOrchestratorProps<TEntity extends Entity = Entity> {
  config: EntityManagerConfig<TEntity>
  initialView?: 'list' | 'form' | 'view'
  className?: string
}

export const EntityOrchestrator = <TEntity extends Entity = Entity>({
  config,
  initialView = 'list',
  className,
}: EntityOrchestratorProps<TEntity>) => {
  // ===== STATE =====
  const [view, setView] = useState<'list' | 'form' | 'view'>(initialView)
  const [selectedEntity, setSelectedEntity] = useState<TEntity | undefined>()
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [entities, setEntities] = useState<TEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===== DATA FETCHING =====
  const fetchEntities = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Call beforeFetch hook
      await config.hooks?.beforeFetch?.()
      
      // Fetch data
      const response = await fetch(config.endpoints.list)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      let data = await response.json() as TEntity[]
      
      // Call afterFetch hook
      if (config.hooks?.afterFetch) {
        data = await config.hooks.afterFetch(data)
      }
      
      setEntities(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [config.endpoints.list, config.hooks])

  // Fetch on mount
  useEffect(() => {
    fetchEntities()
  }, [fetchEntities])

  // ===== NAVIGATION =====
  const showList = useCallback(() => {
    setView('list')
    setSelectedEntity(undefined)
    setFormMode('create')
  }, [])

  const showForm = useCallback((entity?: TEntity) => {
    setFormMode(entity ? 'edit' : 'create')
    setSelectedEntity(entity)
    setView('form')
  }, [])

  const showView = useCallback((entity: TEntity) => {
    setSelectedEntity(entity)
    setView('view')
  }, [])

  // ===== CRUD OPERATIONS =====
  const handleCreate = useCallback(async (data: Partial<TEntity>) => {
    try {
      // Validation hook
      const validationError = await config.hooks?.validateCreate?.(data)
      if (validationError) {
        throw new Error(validationError)
      }
      
      // Before create hook
      let processedData = data
      if (config.hooks?.beforeCreate) {
        processedData = await config.hooks.beforeCreate(data)
      }
      
      // API call
      const response = await fetch(config.endpoints.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const created = await response.json() as TEntity
      
      // After create hook
      await config.hooks?.afterCreate?.(created)
      
      // Refresh and navigate
      await fetchEntities()
      showList()
    } catch (err) {
      console.error('Create error:', err)
      throw err
    }
  }, [config, fetchEntities, showList])

  const handleUpdate = useCallback(async (data: Partial<TEntity>) => {
    if (!selectedEntity) return
    
    try {
      // Validation hook
      const validationError = await config.hooks?.validateUpdate?.(data)
      if (validationError) {
        throw new Error(validationError)
      }
      
      // Before update hook
      let processedData = data
      if (config.hooks?.beforeUpdate) {
        processedData = await config.hooks.beforeUpdate(data)
      }
      
      // API call
      const endpoint = config.endpoints.update.replace(':id', String(selectedEntity.id))
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const updated = await response.json() as TEntity
      
      // After update hook
      await config.hooks?.afterUpdate?.(updated)
      
      // Refresh and navigate
      await fetchEntities()
      showList()
    } catch (err) {
      console.error('Update error:', err)
      throw err
    }
  }, [config, selectedEntity, fetchEntities, showList])

  const handleDelete = useCallback(async (entity: TEntity) => {
    try {
      // Before delete hook (can prevent deletion)
      const canDelete = await config.hooks?.beforeDelete?.(entity.id)
      if (canDelete === false) {
        throw new Error('Deletion prevented by beforeDelete hook')
      }
      
      // API call
      const endpoint = config.endpoints.delete.replace(':id', String(entity.id))
      const response = await fetch(endpoint, { method: 'DELETE' })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // After delete hook
      await config.hooks?.afterDelete?.(entity.id)
      
      // Refresh
      await fetchEntities()
    } catch (err) {
      console.error('Delete error:', err)
      throw err
    }
  }, [config, fetchEntities])

  // ===== ACTION CONTEXT =====
  // Provide helpers to actions so they can trigger CRUD operations
  const actionContext = {
    entity: selectedEntity,
    entities,
    refresh: fetchEntities,
    showList,
    showForm,
    showView,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  }

  // ===== RENDER =====
  if (loading && entities.length === 0) {
    return <div className={className}>Loading {config.entityNamePlural || config.entityName}...</div>
  }

  if (error && entities.length === 0) {
    return <div className={className}>Error: {error}</div>
  }

  return (
    <div className={`entity-orchestrator ${className || ''}`}>
      {/* Global Actions - pass config directly */}
      {config.actions && (
        <div className="entity-actions-container">
          {/* <EntityActions config={config.actions} context={actionContext} /> */}
          <p>Actions placeholder</p>
        </div>
      )}

      {/* Main Content - pass config directly to components */}
      {view === 'list' && config.list && (
        <div className="entity-list-container">
          {/* <EntityList
            config={config.list}
            data={entities}
            loading={loading}
            onRowClick={showView}
            onEdit={showForm}
            onDelete={handleDelete}
            onRefresh={fetchEntities}
          /> */}
          <p>List view: {entities.length} items</p>
        </div>
      )}

      {view === 'form' && config.form && (
        <div className="entity-form-container">
          {/* <EntityForm
            config={config.form}
            data={formMode === 'edit' ? selectedEntity : undefined}
            onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
            onCancel={showList}
          /> */}
          <p>Form view: {formMode} mode</p>
        </div>
      )}

      {view === 'view' && config.view && selectedEntity && (
        <div className="entity-view-container">
          {/* <EntityView
            config={config.view}
            data={selectedEntity}
            onEdit={() => showForm(selectedEntity)}
            onDelete={() => handleDelete(selectedEntity)}
            onBack={showList}
          /> */}
          <p>Detail view for: {selectedEntity.id}</p>
        </div>
      )}
    </div>
  )
}

// Export with displayName for debugging
EntityOrchestrator.displayName = 'EntityOrchestrator'
