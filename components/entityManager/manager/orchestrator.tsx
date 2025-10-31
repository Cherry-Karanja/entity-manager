'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { EntityList } from '../EntityList'
import { EntityView } from '../EntityView'
import { EntityForm } from '../EntityForm'
import { EntityActions } from '../EntityActions'
import { useEntityState, useEntityApi, useEntityActions, useEntityForm } from './hooks'
import { EntityConfig, BaseEntity } from './types'
import { transformEntityFieldsToFormFields } from './utils'

// ===== TYPES =====

export interface EntityManagerProps<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  initialMode?: 'list' | 'view' | 'create' | 'edit'
  initialData?: TEntity
  className?: string
}

// ===== MAIN COMPONENT =====

export function EntityManager<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>({
  config,
  initialMode = 'list',
  initialData,
  className
}: EntityManagerProps<TEntity, TFormData>) {
  // ===== STATE MANAGEMENT =====

  // Current mode and selected entity
  const [mode, setMode] = useState<'list' | 'view' | 'create' | 'edit'>(initialMode)
  const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(initialData || null)
  const [formData, setFormData] = useState<Partial<TFormData> | null>(null)

  // ===== HOOKS =====

  // Entity state management
  const entityState = useEntityState({
    config,
    initialMode
  })

  // API operations
  const entityApi = useEntityApi<TEntity, TFormData>({
    config,
    state: entityState.state,
    actions: entityState.actions
  })

  // Entity actions
  const entityActions = useEntityActions<TEntity, TFormData>({
    config,
    state: entityState.state,
    actions: entityState.actions,
    apiActions: entityApi
  })

  // Form management
  const entityForm = useEntityForm({
    config,
    mode: mode === 'create' ? 'create' : 'edit'
  })

  // ===== INITIALIZATION =====

  // Load initial data when component mounts and mode is list
  const hasInitializedRef = React.useRef(false)
  React.useEffect(() => {
    // Clear any previous errors on initialization
    entityState.actions.setError(null)

    if (mode === 'list' && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      entityApi.fetchEntities().catch((error) => {
        console.error('Failed to load initial data:', error)
        // Mark as loaded even on error to prevent infinite retries
        entityState.actions.setHasLoadedOnce(true)
      })
    }
  }, [mode, entityApi.fetchEntities, entityState.actions])

  // ===== COMPUTED VALUES =====

  // Entity List configuration
  const listConfig = useMemo(() => {
    const listConfig = ({
    data: entityState.cachedData?.results || [],
    columns: config.listConfig.columns,
    filters: [], // Filters can be added to config.filters if needed
    actions: [], // List-level actions - bulk actions handled separately
    entityActions: { actions: config.customActions?.item || [] },
    pagination: { pageSize: config.listConfig.pageSize || 10 },
    searchable: (config.listConfig.searchableFields?.length ?? 0) > 0,
    sortable: true,
    selectable: config.listConfig.allowBatchActions,
    exportable: config.listConfig.allowExport,
    permissions: config.permissions,
    loading: entityApi.isLoading,
    error: entityState.state.error
  })
  console.log('List config error:', listConfig.error)
  console.log('Cached data:', entityState.cachedData)
  return listConfig
  }, [config, entityState.cachedData, entityApi.isLoading, entityState.state.error])

  // Entity View configuration
  const viewConfig = useMemo(() => ({
    mode: 'detail' as const,
    layout: 'single' as const,
    fields: config.fields.map(field => ({
      key: field.key,
      label: field.label,
      type: (field.viewType === 'list' ? 'text' : field.viewType) || 'text',
      value: selectedEntity?.[field.key as keyof TEntity]
    })),
    showHeader: true,
    showActions: true,
    showMetadata: true,
    actions: [], // Actions handled through entityActions
    entityActions: { actions: config.customActions?.item || [] },
    permissions: config.permissions
  }), [config, selectedEntity])

  // Entity Form configuration
  const formConfig = useMemo(() => ({
    fields: transformEntityFieldsToFormFields(config.fields, { includeValidation: true }),
    mode: mode === 'create' ? 'create' as const : 'edit' as const,
    layout: (config.formConfig?.layout as 'vertical' | 'horizontal' | 'grid') || 'vertical',
    columns: config.formConfig?.columns || 1,
    initialData: formData || (selectedEntity as Record<string, unknown>) || {},
    validateOnChange: true,
    validateOnBlur: true,
    submitButtonText: config.formConfig?.submitLabel,
    cancelButtonText: config.formConfig?.cancelLabel,
    enableBulkImport: config.bulkImport?.enabled,
    showProgress: true,
    showValidationErrors: true,
    autoFocus: true,
    disabled: false,
    permissions: config.permissions
  }), [config, mode, formData, selectedEntity])

  // ===== EVENT HANDLERS =====

  // Handle list actions
  const handleListAction = useCallback((action: any, item: any) => {
    switch (action.id) {
      case 'view':
        entityActions.handleView(item)
        break
      case 'edit':
        entityActions.handleEdit(item)
        break
      case 'delete':
        entityActions.handleOpenDeleteDialog(item.id)
        break
      default:
        console.warn('Unknown action:', action.id)
    }
  }, [entityActions])

  // Handle view actions
  const handleViewAction = useCallback((action: any, data?: unknown) => {
    switch (action.id) {
      case 'edit':
        if (selectedEntity) {
          entityActions.handleEdit(selectedEntity)
        }
        break
      case 'back':
        setMode('list')
        break
      case 'delete':
        if (selectedEntity) {
          entityActions.handleOpenDeleteDialog(selectedEntity.id)
        }
        break
      default:
        console.warn('Unknown action:', action.id)
    }
  }, [entityActions, selectedEntity])

  // Handle form submission
  const handleFormSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (mode === 'create') {
        await entityApi.createEntity(data as TFormData)
      } else if (mode === 'edit' && selectedEntity) {
        await entityApi.updateEntity(selectedEntity.id, data as Partial<TFormData>)
      }
    } catch (error) {
      console.error('Form submission failed:', error)
      throw error // Re-throw to let the form handle the error
    }
  }, [mode, selectedEntity, entityApi])

  // Handle form cancellation
  const handleFormCancel = useCallback(() => {
    if (selectedEntity) {
      setMode('view')
    } else {
      setMode('list')
    }
  }, [selectedEntity])

  // ===== RENDER =====

  // Render based on current mode
  const renderContent = () => {
    switch (mode) {
      case 'list':
        return (
          <EntityList
            config={listConfig}
            onSelectionChange={(keys, items) => {
              // Handle selection changes if needed
              console.log('Selection changed:', keys, items)
            }}
            onAction={handleListAction}
          />
        )

      case 'view':
        return selectedEntity ? (
          <EntityView
            config={viewConfig}
            data={selectedEntity}
            onActionClick={handleViewAction}
          />
        ) : null

      case 'create':
      case 'edit':
        return (
          <EntityForm
            config={formConfig}
            data={formData || (selectedEntity as Record<string, unknown>) || {}}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={entityState.state.isLoading}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      {renderContent()}
    </div>
  )
}