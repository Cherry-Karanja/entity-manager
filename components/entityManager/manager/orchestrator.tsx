'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { EntityList } from '../EntityList'
import { EntityView } from '../EntityView'
import { EntityForm } from '../EntityForm'
import { EntityActions } from '../EntityActions'
import { useEntityState, useEntityApi, useEntityActions, useEntityForm } from './hooks'
import { EntityConfig, BaseEntity } from './types'
import { EntityListItem } from '../EntityList/types'
import { FieldDisplayType, ViewFieldGroup } from '../EntityView/types'
import { transformEntityFieldsToFormFields } from './utils'
import EntityTableView from '../EntityList/views/EntityTableView'
import EntityCardView from '../EntityList/views/EntityCardView'
import EntityListView from '../EntityList/views/EntityListView'
import EntityGridView from '../EntityList/views/EntityGridView'
import EntityCompactView from '../EntityList/views/EntityCompactView'
import { usePermissions } from '@/hooks/use-permissions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ===== BREADCRUMB COMPONENT =====

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length <= 1) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm text-muted-foreground mb-4 ${className || ''}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// ===== TYPES =====

export interface BreadcrumbItem {
  label: string
  mode: 'list' | 'view' | 'create' | 'edit'
  entity?: BaseEntity
  onClick?: () => void
}

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

  // Breadcrumb navigation state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    {
      label: `${config.displayName || config.namePlural}`,
      mode: 'list'
    }
  ])

  // Update breadcrumbs when mode changes
  const updateBreadcrumbs = useCallback((newMode: 'list' | 'view' | 'create' | 'edit', entity?: TEntity) => {
    setBreadcrumbs(prev => {
      const newBreadcrumbs: BreadcrumbItem[] = [
        {
          label: `${config.displayName || config.namePlural}`,
          mode: 'list',
          onClick: () => {
            setMode('list')
            setSelectedEntity(null)
            setFormData(null)
          }
        }
      ]

      if (newMode === 'view' && entity) {
        newBreadcrumbs.push({
          label: `View ${config.name}`,
          mode: 'view',
          entity,
          onClick: () => {
            setMode('view')
            setSelectedEntity(entity)
          }
        })
      } else if (newMode === 'edit' && entity) {
        newBreadcrumbs.push({
          label: `Edit ${config.name}`,
          mode: 'edit',
          entity,
          onClick: () => {
            setMode('edit')
            setSelectedEntity(entity)
            setFormData(null)
          }
        })
      } else if (newMode === 'create') {
        newBreadcrumbs.push({
          label: `Create ${config.name}`,
          mode: 'create',
          onClick: () => {
            setMode('create')
            setSelectedEntity(null)
            setFormData(null)
          }
        })
      }

      return newBreadcrumbs
    })
  }, [config.displayName, config.namePlural, config.name])

  // Initialize breadcrumbs based on initial mode
  React.useEffect(() => {
    if (initialMode !== 'list' && initialData) {
      updateBreadcrumbs(initialMode, initialData)
    }
  }, [initialMode, initialData, updateBreadcrumbs])

  // ===== HOOKS =====

  // Permissions hook
  const permissions = usePermissions()

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
    apiActions: entityApi,
    cachedData: entityState.cachedData
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

  // Stable refresh handler
  const handleRefresh = useCallback(() => {
    entityApi.fetchEntities(true).catch((error) => {
      console.error('Failed to refresh data:', error)
    })
  }, [entityApi.fetchEntities])

  // List actions with handlers
  const listActionsWithHandlers = useMemo(() => {
    // Inject onClick handlers for entity actions
    const actionsWithHandlers = (config.customActions?.item || []).map(action => {
      // Create the base action without confirm (since EntityListAction.confirm has different signature)
      const { confirm, ...actionWithoutConfirm } = action

      return {
        ...actionWithoutConfirm,
        onClick: (item: EntityListItem) => {
          const typedItem = item as TEntity
          switch (action.id) {
            case 'view':
              setMode('view')
              setSelectedEntity(typedItem)
              updateBreadcrumbs('view', typedItem)
              break
            case 'edit':
              setMode('edit')
              setSelectedEntity(typedItem)
              setFormData(null) // Clear form data to load from selected entity
              updateBreadcrumbs('edit', typedItem)
              break
            case 'delete':
              entityActions.handleOpenDeleteDialog(typedItem.id)
              break
            default:
              // Call the original onExecute if it exists
              if (action.onExecute) {
                action.onExecute(item)
              }
          }
        }
      }
    })

    return actionsWithHandlers
  }, [config.customActions?.item, entityActions, setMode, setSelectedEntity, setFormData, updateBreadcrumbs])

  // Bulk actions with handlers
  const bulkActionsWithHandlers = useMemo(() => {
    // Convert custom bulk actions to EntityList bulk actions
    const bulkActionsWithHandlers = (config.customActions?.bulk || []).map(action => ({
      ...action,
      onClick: async (items: unknown[]) => {
        if (action.onExecute) {
          await action.onExecute(items)
        }
      }
    }))

    return bulkActionsWithHandlers
  }, [config.customActions?.bulk])

  // Entity List configuration
  const listConfig = useMemo(() => ({
    data: entityState.cachedData?.results || [],
    columns: config.listConfig.columns,
    filters: [], // Filters can be added to config.filters if needed
    actions: listActionsWithHandlers,
    entityActions: undefined, // Use actions instead of entityActions
    bulkActions: bulkActionsWithHandlers,
    pagination: { pageSize: config.listConfig.pageSize || 10 },
    paginated: true, // Enable pagination
    views: [
      { id: 'table', name: 'Table', component: EntityTableView },
      { id: 'card', name: 'Cards', component: EntityCardView },
      { id: 'list', name: 'List', component: EntityListView },
      { id: 'grid', name: 'Grid', component: EntityGridView },
      { id: 'compact', name: 'Compact', component: EntityCompactView }
    ],
    defaultView: 'table',
    searchable: (config.listConfig.searchableFields?.length ?? 0) > 0,
    sortable: true,
    selectable: config.listConfig.allowBatchActions,
    export: config.listConfig.allowExport ? {
      enabled: true,
      formats: ['csv', 'xlsx', 'json'] as ('csv' | 'xlsx' | 'json' | 'pdf')[]
    } : undefined,
    onCreate: permissions.hasEntityPermission('create') && config.permissions?.create !== false ? () => {
      setMode('create')
      setSelectedEntity(null)
      setFormData(null)
      updateBreadcrumbs('create')
    } : undefined,
    onRefresh: handleRefresh,
    permissions: config.permissions,
    loading: entityApi.isLoading,
    error: entityState.state.error
  }), [config, entityState.cachedData, entityApi.isLoading, entityState.state.error, listActionsWithHandlers, bulkActionsWithHandlers, handleRefresh])

  // Entity View configuration
  const viewConfig = useMemo(() => {
    // Inject onExecute handlers for entity actions in view mode
    const viewEntityActionsWithHandlers = (config.customActions?.item || []).map(action => ({
      ...action,
      onExecute: (item?: unknown) => {
        const targetItem = (item || selectedEntity) as TEntity
        if (!targetItem) return

        switch (action.id) {
          case 'edit':
            setMode('edit')
            setSelectedEntity(targetItem)
            setFormData(null) // Clear form data to load from selected entity
            break
          case 'delete':
            entityActions.handleOpenDeleteDialog(targetItem.id)
            break
          case 'back':
            setMode('list')
            setSelectedEntity(null)
            break
          default:
            // Call the original onExecute if it exists
            if (action.onExecute) {
              action.onExecute(item)
            }
        }
      }
    }))

    // Create field groups from fields if fieldGroups is not provided
    let fieldGroups: ViewFieldGroup[] = []

    if (config.viewConfig?.fieldGroups) {
      fieldGroups = config.viewConfig.fieldGroups
    } else if (config.viewConfig?.fields) {
      // Convert fields to fieldGroups
      fieldGroups = [{
        id: 'default',
        title: 'Details',
        fields: config.viewConfig.fields.map(viewField => ({
          ...viewField,
          value: selectedEntity?.[viewField.key as keyof TEntity]
        })),
        layout: 'vertical' as const,
        collapsible: false
      }]
    } else {
      // Fallback to form fields
      fieldGroups = [{
        id: 'default',
        title: 'Details',
        fields: config.fields.map(field => {
          // Map form field types to view field types
          let viewType: FieldDisplayType = 'text'
          switch (field.type) {
            case 'string':
              viewType = 'text'
              break
            case 'number':
            case 'integer32':
            case 'integer64':
            case 'float':
            case 'double':
            case 'decimal':
              viewType = 'number'
              break
            case 'boolean':
              viewType = 'boolean'
              break
            case 'date':
              viewType = 'date'
              break
            case 'email':
              viewType = 'email'
              break
            case 'url':
              viewType = 'url'
              break
            default:
              viewType = 'text'
          }

          return {
            key: field.key,
            label: field.label,
            type: viewType,
            value: selectedEntity?.[field.key as keyof TEntity],
            copyable: config.viewConfig?.fields?.find(vf => vf.key === field.key)?.copyable || false
          }
        }),
        layout: 'vertical' as const,
        collapsible: false
      }]
    }

    return {
    mode: config.viewConfig?.mode || 'detail' as const,
    layout: config.viewConfig?.layout || 'single' as const,
    theme: config.viewConfig?.theme,
    fields: config.viewConfig?.fields,
    fieldGroups,
    data: config.viewConfig?.data,
    dataFetcher: config.viewConfig?.dataFetcher,
    showHeader: config.viewConfig?.showHeader ?? true,
    showActions: config.viewConfig?.showActions ?? true,
    showMetadata: config.viewConfig?.showMetadata ?? true,
    showNavigation: config.viewConfig?.showNavigation,
    compact: config.viewConfig?.compact,
    customComponents: config.viewConfig?.customComponents,
    dataTransformer: config.viewConfig?.dataTransformer,
    fieldMapper: config.viewConfig?.fieldMapper,
    actions: config.viewConfig?.actions || [], // Actions handled through entityActions
    entityActions: { actions: viewEntityActionsWithHandlers },
    navigation: config.viewConfig?.navigation,
    permissions: config.viewConfig?.permissions || config.permissions,
    hooks: config.viewConfig?.hooks,
    className: config.viewConfig?.className,
    style: config.viewConfig?.style,
    fieldSpacing: config.viewConfig?.fieldSpacing,
    borderRadius: config.viewConfig?.borderRadius,
    shadow: config.viewConfig?.shadow
  }}, [config, selectedEntity, entityActions])

  // Entity Form configuration
  const formConfig = useMemo(() => {
    // Transform initial data for date fields
    const transformInitialData = (data: Record<string, unknown>) => {
      if (!data) return {}
      
      const transformed = { ...data }
      config.fields.forEach(field => {
        if (field.type === 'date' && transformed[field.key]) {
          const value = transformed[field.key]
          if (typeof value === 'string') {
            // Convert datetime string to date-only format
            try {
              const date = new Date(value)
              if (!isNaN(date.getTime())) {
                transformed[field.key] = date.toISOString().split('T')[0] // yyyy-MM-dd format
              }
            } catch (error) {
              console.warn(`Failed to parse date for field ${field.key}:`, value)
            }
          }
        }
      })
      return transformed
    }

    return {
    fields: transformEntityFieldsToFormFields(config.fields, { includeValidation: true, mode: mode === 'create' ? 'create' : 'edit' }),
    mode: mode === 'create' ? 'create' as const : 'edit' as const,
    layout: (config.formConfig?.layout as 'vertical' | 'horizontal' | 'grid') || 'vertical',
    columns: config.formConfig?.columns || 1,
    initialData: transformInitialData(formData || (selectedEntity as Record<string, unknown>) || {}),
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
  }}, [config, mode, formData, selectedEntity])

  // ===== EVENT HANDLERS =====

  // Handle list actions
  const handleListAction = useCallback((action: any, item: any) => {
    switch (action.id) {
      case 'view':
        setMode('view')
        setSelectedEntity(item)
        updateBreadcrumbs('view', item)
        break
      case 'edit':
        setMode('edit')
        setSelectedEntity(item)
        setFormData(null)
        updateBreadcrumbs('edit', item)
        break
      case 'delete':
        entityActions.handleOpenDeleteDialog(item.id)
        break
      default:
        console.warn('Unknown action:', action.id)
    }
  }, [entityActions, updateBreadcrumbs])

  // Handle view actions
  const handleViewAction = useCallback((action: any, data?: unknown) => {
    switch (action.id) {
      case 'edit':
        if (selectedEntity) {
          setMode('edit')
          setFormData(null)
          updateBreadcrumbs('edit', selectedEntity)
        }
        break
      case 'back':
        setMode('list')
        setSelectedEntity(null)
        updateBreadcrumbs('list')
        break
      case 'delete':
        if (selectedEntity) {
          entityActions.handleOpenDeleteDialog(selectedEntity.id)
        }
        break
      default:
        console.warn('Unknown action:', action.id)
    }
  }, [entityActions, selectedEntity, updateBreadcrumbs])

  // Handle form submission
  const handleFormSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (mode === 'create') {
        const createdEntity = await entityApi.createEntity(data as TFormData)
        if (createdEntity) {
          setSelectedEntity(createdEntity)
          setMode('view')
          updateBreadcrumbs('view', createdEntity)
        }
      } else if (mode === 'edit' && selectedEntity) {
        const updatedEntity = await entityApi.updateEntity(selectedEntity.id, data as Partial<TFormData>)
        if (updatedEntity) {
          setSelectedEntity(updatedEntity)
          setMode('view')
          updateBreadcrumbs('view', updatedEntity)
        }
      }
    } catch (error) {
      console.error('Form submission failed:', error)
      throw error // Re-throw to let the form handle the error
    }
  }, [mode, selectedEntity, entityApi, updateBreadcrumbs])

  // Handle form cancellation
  const handleFormCancel = useCallback(() => {
    if (selectedEntity) {
      setMode('view')
      updateBreadcrumbs('view', selectedEntity)
    } else {
      setMode('list')
      updateBreadcrumbs('list')
    }
  }, [selectedEntity, updateBreadcrumbs])

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
      <Breadcrumb items={breadcrumbs} />
      {renderContent()}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={entityState.state.deleteDialog.open} 
        onOpenChange={(open) => {
          if (!open) {
            entityActions.handleCloseDeleteDialog()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {config.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {config.name.toLowerCase()}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                await entityActions.handleConfirmDelete()
                setMode('list')
                setSelectedEntity(null)
                updateBreadcrumbs('list')
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}