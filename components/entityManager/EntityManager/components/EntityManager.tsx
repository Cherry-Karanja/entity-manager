// EntityManager Orchestrator Component
// Main component that coordinates EntityList, EntityView, EntityForm, and EntityActions

import * as React from 'react'
import { EntityManagerConfig, EntityManagerProps, BaseEntity } from '../types'
import { useEntityManager } from '../hooks/useEntityManager'

// Import components (these will be created/adapted)
// TODO: Replace with actual imports once components are implemented
// import { EntityList } from '../../EntityList/components/EntityList'
// import { EntityView } from '../../EntityView/components/EntityView'
// import { EntityForm } from '../../EntityForm/components/EntityForm'
// import { EntityActions } from '../../EntityActions/components/EntityActions'

// Stub components for now
const EntityList: React.FC<any> = ({ config, data, onCreate, onEdit, onView }) => (
  <div className="entity-list">
    <h2>{config.displayNamePlural}</h2>
    <button onClick={onCreate}>Create New</button>
    <div className="list-items">
      {data?.map((item: any) => (
        <div key={item.id} className="list-item">
          <span>{item.name || item.title || `Item ${item.id}`}</span>
          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onView(item)}>View</button>
        </div>
      ))}
    </div>
  </div>
)

const EntityView: React.FC<any> = ({ config, item, onEdit, onBack }) => (
  <div className="entity-view">
    <h2>View {config.displayName}</h2>
    <button onClick={onBack}>Back to List</button>
    {item && (
      <div className="item-details">
        {Object.entries(item).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {String(value)}
          </div>
        ))}
        <button onClick={() => onEdit(item)}>Edit</button>
      </div>
    )}
  </div>
)

const EntityForm: React.FC<any> = ({ config, mode, data, onSubmit, onCancel }) => (
  <div className="entity-form">
    <h2>{mode === 'create' ? `Create ${config.displayName}` : `Edit ${config.displayName}`}</h2>
    <form onSubmit={onSubmit}>
      {/* Basic form fields - in real implementation, this would be generated from config.fields */}
      <div>
        <label htmlFor="name-input">Name:</label>
        <input
          id="name-input"
          type="text"
          defaultValue={data?.name || ''}
          placeholder="Enter name"
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  </div>
)

const EntityActions: React.FC<any> = ({ config, selectedItems, actions }) => (
  <div className="entity-actions">
    {actions?.map((action: any) => (
      <button key={action.key} onClick={() => action.handler(selectedItems)}>
        {action.label}
      </button>
    ))}
  </div>
)

export function EntityManager<TEntity extends BaseEntity = BaseEntity>({
  config,
  initialMode = 'list',
  initialData = [],
  initialFilters = {},
  className,
  onModeChange,
  onDataChange,
  onSelectionChange,
  onAction,
  contextData
}: EntityManagerProps<TEntity>) {
  const orchestrator = useEntityManager({
    config,
    initialMode,
    initialData,
    initialFilters,
    className
  })

  // Handle mode changes
  React.useEffect(() => {
    onModeChange?.(orchestrator.mode, orchestrator.selectedItem)
  }, [orchestrator.mode, orchestrator.selectedItem, onModeChange])

  // Handle data changes
  React.useEffect(() => {
    onDataChange?.(orchestrator.list.data || [])
  }, [orchestrator.list.data, onDataChange])

  // Handle selection changes
  React.useEffect(() => {
    onSelectionChange?.(orchestrator.selectedItem ? [orchestrator.selectedItem.id] : [])
  }, [orchestrator.selectedItem, onSelectionChange])

  // Render based on current mode
  const renderContent = () => {
    switch (orchestrator.mode) {
      case 'list':
        return (
          <EntityList
            config={config}
            data={orchestrator.list.data}
            onCreate={orchestrator.handleCreate}
            onEdit={orchestrator.handleEdit}
            onView={orchestrator.handleView}
          />
        )

      case 'view':
        return (
          <EntityView
            config={config}
            item={orchestrator.selectedItem}
            onEdit={orchestrator.handleEdit}
            onBack={orchestrator.handleBackToList}
          />
        )

      case 'create':
      case 'edit':
        return (
          <EntityForm
            config={config}
            mode={orchestrator.mode}
            data={orchestrator.selectedItem}
            onSubmit={async (formData: any) => {
              try {
                if (orchestrator.mode === 'create') {
                  await orchestrator.form.submit()
                } else {
                  await orchestrator.form.submit()
                }
                orchestrator.handleBackToList()
              } catch (error) {
                console.error('Form submission error:', error)
              }
            }}
            onCancel={orchestrator.handleBackToList}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={`entity-manager ${className || ''}`}>
      {/* Header with title and actions */}
      <div className="entity-manager-header">
        <h1>{config.displayNamePlural}</h1>
        <EntityActions
          config={config}
          selectedItems={orchestrator.selectedItem ? [orchestrator.selectedItem] : []}
          actions={config.actions.customActions}
        />
      </div>

      {/* Main content area */}
      <div className="entity-manager-content">
        {renderContent()}
      </div>

      {/* Footer with additional info */}
      <div className="entity-manager-footer">
        {orchestrator.list.loading && <div>Loading...</div>}
        {orchestrator.list.error && <div className="error">{orchestrator.list.error}</div>}
      </div>
    </div>
  )
}

// Higher-order component for easy configuration
export function createEntityManager<TEntity extends BaseEntity = BaseEntity>(
  config: EntityManagerConfig<TEntity>
) {
  const EntityManagerComponent = (props: Omit<EntityManagerProps<TEntity>, 'config'>) => (
    <EntityManager {...props} config={config} />
  )

  EntityManagerComponent.displayName = `EntityManager(${config.displayName})`

  return EntityManagerComponent
}

// Export types for consumers
export type { EntityManagerProps, EntityManagerConfig }