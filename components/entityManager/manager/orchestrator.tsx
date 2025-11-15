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
import EntityTableView from '../EntityList/views/EntityTableView'
import EntityCardView from '../EntityList/views/EntityCardView'
import EntityListView from '../EntityList/views/EntityListView'
import EntityGridView from '../EntityList/views/EntityGridView'
import EntityCompactView from '../EntityList/views/EntityCompactView'
// import { usePermissions } from '@/hooks/use-permissions'
import { RealTimeIndicator } from '../utils/RealTimeIndicator'
import OptimisticUI from '../utils/OptimisticUI'
import { CollaborativeIndicator } from '../utils/CollaborativeIndicator'
import { ConflictNotification } from '../utils/ConflictResolution'
import { ConnectionState } from '@/components/connectionManager/websockets'
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

  // Real-time/WebSocket state
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED)
  const [queuedMessagesCount, setQueuedMessagesCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<number | undefined>(undefined)

  // Breadcrumb navigation state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    {
      label: `${config.entityName || config.entityNamePlural}`,
      mode: 'list'
    }
  ])

  // Update breadcrumbs when mode changes
  const updateBreadcrumbs = useCallback((newMode: 'list' | 'view' | 'create' | 'edit', entity?: TEntity) => {
    setBreadcrumbs(prev => {
      const newBreadcrumbs: BreadcrumbItem[] = [
        {
          label: `${config.entityName || config.entityNamePlural}`,
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
          label: `View ${config.entityName}`,
          mode: 'view',
          entity,
          onClick: () => {
            setMode('view')
            setSelectedEntity(entity)
          }
        })
      } else if (newMode === 'edit' && entity) {
        newBreadcrumbs.push({
          label: `Edit ${config.entityName}`,
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
          label: `Create ${config.entityName}`,
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
  }, [config.entityName, config.entityNamePlural])

  // Initialize breadcrumbs based on initial mode
  React.useEffect(() => {
    if (initialMode !== 'list' && initialData) {
      updateBreadcrumbs(initialMode, initialData)
    }
  }, [initialMode, initialData, updateBreadcrumbs])

  // ===== HOOKS =====

  // Permissions hook - not used in this component
  // const { hasPermission } = usePermissions()

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

  // Chat toggle handler
  const handleChatToggle = useCallback(() => {
    // Removed - chat not in interface
  }, [])

  // List actions with handlers
  const listActionsWithHandlers = useMemo(() => {
    // Inject onClick handlers for entity actions
    const actionsWithHandlers = (config.actions?.actions || []).map(action => {
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
  }, [config.actions?.actions, entityActions, setMode, setSelectedEntity, setFormData, updateBreadcrumbs])

  // Bulk actions with handlers
  const bulkActionsWithHandlers = useMemo(() => {
    // Convert custom bulk actions to EntityList bulk actions
    const bulkActionsWithHandlers = (config.actions?.bulkActions || []).map(action => ({
      ...action,
      onClick: async (items: unknown[]) => {
        if (action.onExecute) {
          await action.onExecute(items)
        }
      }
    }))

    return bulkActionsWithHandlers
  }, [config.actions?.bulkActions])

  // Entity List configuration
  const listConfig = useMemo(() => ({
    name: config.entityName,
    data: entityState.cachedData?.results || [],
    columns: config.list?.columns || [],
    filters: [], // Filters can be added to config.filters if needed
    actions: listActionsWithHandlers,
    entityActions: undefined, // Use actions instead of entityActions
    bulkActions: bulkActionsWithHandlers,
    pagination: { pageSize: config.list?.pagination?.pageSize || 10 },
    paginated: true, // Enable pagination
    views: [
      { id: 'table', name: 'Table', component: EntityTableView },
      { id: 'card', name: 'Cards', component: EntityCardView },
      { id: 'list', name: 'List', component: EntityListView },
      { id: 'grid', name: 'Grid', component: EntityGridView },
      { id: 'compact', name: 'Compact', component: EntityCompactView }
    ],
    defaultView: 'table',
    searchable: (config.list?.searchFields?.length ?? 0) > 0,
    sortable: true,
    selectable: config.list?.selection?.mode === 'multiple',
    export: config.list?.export?.enabled ? {
      enabled: true,
      formats: ['csv', 'xlsx', 'json'] as ('csv' | 'xlsx' | 'json' | 'pdf')[]
    } : undefined,
    onCreate: config.permissions?.create !== false ? () => {
      setMode('create')
      setSelectedEntity(null)
      setFormData(null)
      updateBreadcrumbs('create')
    } : undefined,
    onRefresh: handleRefresh,
    permissions: config.permissions,
    loading: entityApi.isLoading,
    error: entityState.state.error
  }), [config, entityState.cachedData, entityApi.isLoading, entityState.state.error, listActionsWithHandlers, bulkActionsWithHandlers, handleRefresh, updateBreadcrumbs])

  // Re-fetch list when relevant list parameters change (page, pageSize, search, sort, filters)
  React.useEffect(() => {
    if (mode !== 'list') return

    // Whenever pagination, search, sort or filters change, fetch updated data.
    // Depend explicitly on the concrete state values here to avoid a re-creation
    // loop caused by including a function (entityApi.fetchEntities) whose
    // identity can change when internal state/cache updates.
    ;(async () => {
      try {
        await entityApi.fetchEntities()
      } catch (error) {
        console.error('Failed to fetch data after param change:', error)
      }
    })()
    // NOTE: intentionally not including entityApi.fetchEntities in deps to avoid
    // an effect loop when fetchEntities is re-created on internal state changes.
  }, [mode, entityState.state.currentPage, entityState.state.pageSize, entityState.state.debouncedSearchTerm, entityState.state.sortConfig, entityState.state.filterValues, entityApi])

  // Entity Form configuration
  const formConfig = useMemo(() => {
    // Transform initial data for date fields
    const transformInitialData = (data: Record<string, unknown>) => {
      if (!data) return {}
      
      const transformed = { ...data }
      config.form?.fields?.forEach(field => {
        if (field.type === 'date' && transformed[field.name]) {
          const value = transformed[field.name]
          if (typeof value === 'string') {
            // Convert datetime string to date-only format
            try {
              const date = new Date(value)
              if (!isNaN(date.getTime())) {
                transformed[field.name] = date.toISOString().split('T')[0] // yyyy-MM-dd format
              }
            } catch (error) {
              console.warn(`Failed to parse date for field ${field.name}:`, value)
            }
          }
        }
      })
      return transformed
    }

    return {
    fields: config.form?.fields || [],
    mode: mode === 'create' ? 'create' as const : 'edit' as const,
    layout: (config.form?.layout as 'vertical' | 'horizontal' | 'grid') || 'vertical',
    columns: config.form?.columns || 1,
    initialData: transformInitialData(formData || (selectedEntity as Record<string, unknown>) || {}) as Partial<TEntity>,
    validateOnChange: true,
    validateOnBlur: true,
    submitButtonText: config.form?.submitButtonText,
    cancelButtonText: config.form?.cancelButtonText,
    enableBulkImport: config.form?.enableBulkImport,
    showProgress: true,
    showValidationErrors: true,
    autoFocus: true,
    disabled: false,
    permissions: config.permissions
  }}, [config, mode, formData, selectedEntity])

  // ===== EVENT HANDLERS =====

  // Handle form submission
  const handleFormSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (mode === 'create') {
        const result = await entityApi.createEntity(data as TFormData)
        if (result.success) {
          setSelectedEntity(result.data)
          setMode('view')
          updateBreadcrumbs('view', result.data)
        } else {
          // Throw error so EntityForm shows error toast
          throw new Error(result.validationErrors.nonFieldErrors.join(', ') || 'Form submission failed')
        }
      } else if (mode === 'edit' && selectedEntity) {
        const result = await entityApi.updateEntity(selectedEntity.id, data as Partial<TFormData>)
        if (result.success) {
          setSelectedEntity(result.data)
          setMode('view')
          updateBreadcrumbs('view', result.data)
        } else {
          // Throw error so EntityForm shows error toast
          throw new Error(result.validationErrors.nonFieldErrors.join(', ') || 'Form submission failed')
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
            data={listConfig.data}
            onSelectionChange={(keys, items) => {
              // Handle selection changes if needed
              console.log('Selection changed:', keys, items)
            }}
            // Wire list UI events to manager state so API requests use latest params
            onSearch={(term: string) => {
              entityState.actions.setSearchTerm(term)
            }}
            onFilter={(filters: Record<string, unknown>) => {
              entityState.actions.setFilterValues(filters)
            }}
            onSort={(sorts: { field: string; direction: 'asc' | 'desc' }[]) => {
              // Pass EntityListSort[] directly to state
              entityState.actions.setSortConfig(sorts)
            }}
            onRowClick={(item: EntityListItem) => {
              const typedItem = item as TEntity
              setMode('view')
              setSelectedEntity(typedItem)
              updateBreadcrumbs('view', typedItem)
            }}
            onPageChange={(page: number, pageSize: number) => {
              // Update pagination state
              entityState.actions.setPageSize(pageSize)
              entityState.actions.setCurrentPage(page)
            }}
            onAction={undefined}
          />
        )

      case 'view':
        return selectedEntity && config.view ? (
          <EntityView
            config={config.view}
            data={selectedEntity}
          />
        ) : null

      case 'create':
      case 'edit':
        return (
          <EntityForm
            config={formConfig}
            data={selectedEntity || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={breadcrumbs} />
        <div className="flex items-center gap-3">
          <OptimisticUI.OptimisticStatusBadge
            optimisticState={entityApi.optimisticState}
          />
          {entityApi.realTimeState && (
            <RealTimeIndicator
              isConnected={entityApi.realTimeState.isConnected}
              connectionState={entityApi.realTimeState.connectionState}
              queuedMessagesCount={entityApi.realTimeState.queuedMessagesCount}
              compact
            />
          )}
          <CollaborativeIndicator
            activeUsers={entityApi.presenceState.activeUsers}
            entityLocks={entityApi.presenceState.entityLocks}
            userCursors={entityApi.presenceState.userCursors}
            currentUserId={entityApi.presenceState.currentUser?.id ? parseInt(entityApi.presenceState.currentUser.id) : undefined}
            className="ml-2"
          />
        </div>
      </div>
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
            <AlertDialogTitle>Delete {config.entityName}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {config.entityName.toLowerCase()}? This action cannot be undone.
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

      {/* Chat Panel */}
      {/* Removed - chat not in EntityConfig interface */}

      {/* Optimistic Operation Toast */}
      <OptimisticUI.OptimisticOperationToast
        optimisticState={entityApi.optimisticState}
        onRollback={entityApi.optimisticActions.rollbackOperation}
        onRetry={entityApi.optimisticActions.retryOperation}
        onClearFailed={entityApi.optimisticActions.clearFailedOperations}
      />

      {/* Conflict Resolution Notification */}
      <ConflictNotification
        conflicts={entityApi.optimisticState.conflicts}
        onResolve={entityApi.optimisticActions.resolveConflict}
        onDismiss={entityApi.optimisticActions.dismissConflict}
      />
    </div>
  )
}