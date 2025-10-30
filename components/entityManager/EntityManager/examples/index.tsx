// EntityManager Examples
// Demonstrates EntityManager orchestrator with user management and property management

import * as React from 'react'
import { EntityManager, createEntityManager } from '../components/EntityManager'
import { USER_CONFIG, TENANT_PROFILE_CONFIG, PROPERTY_CONFIG } from '../api/config'

// Example 1: User Management with EntityManager
export function UserManagementExample() {
  return (
    <div className="user-management-example">
      <h1>User Management</h1>
      <EntityManager config={USER_CONFIG} />
    </div>
  )
}

// Example 2: Property Management with EntityManager
export function PropertyManagementExample() {
  return (
    <div className="property-management-example">
      <h1>Property Management</h1>
      <EntityManager config={PROPERTY_CONFIG} />
    </div>
  )
}

// Example 3: Using createEntityManager HOC
const UserManager = createEntityManager(USER_CONFIG)
const PropertyManager = createEntityManager(PROPERTY_CONFIG)

export function PreConfiguredExamples() {
  return (
    <div className="pre-configured-examples">
      <div className="section">
        <h2>Pre-configured User Manager</h2>
        <UserManager />
      </div>

      <div className="section">
        <h2>Pre-configured Property Manager</h2>
        <PropertyManager />
      </div>
    </div>
  )
}

// Example 4: Tenant Profile Management with related entities
export function TenantProfileManagementExample() {
  return (
    <div className="tenant-profile-example">
      <h1>Tenant Profile Management</h1>
      <EntityManager
        config={TENANT_PROFILE_CONFIG}
        initialMode="list"
        onModeChange={(mode, item) => {
          console.log('Mode changed:', mode, item)
        }}
        onDataChange={(data) => {
          console.log('Data changed:', data.length, 'items')
        }}
        onSelectionChange={(selectedIds) => {
          console.log('Selection changed:', selectedIds)
        }}
        onAction={(action, data) => {
          console.log('Action executed:', action, data)
        }}
      />
    </div>
  )
}

// Example 5: Full entity management with variations
export function FullEntityManagementExample() {
  const [currentEntity, setCurrentEntity] = React.useState<'user' | 'property' | 'tenant_profile'>('user')

  return (
    <div className="full-entity-management">
      <h1>Full Entity Management Demo</h1>

      {/* Entity Type Selector */}
      <div className="entity-selector">
        <button
          onClick={() => setCurrentEntity('user')}
          className={currentEntity === 'user' ? 'active' : ''}
        >
          Users
        </button>
        <button
          onClick={() => setCurrentEntity('property')}
          className={currentEntity === 'property' ? 'active' : ''}
        >
          Properties
        </button>
        <button
          onClick={() => setCurrentEntity('tenant_profile')}
          className={currentEntity === 'tenant_profile' ? 'active' : ''}
        >
          Tenant Profiles
        </button>
      </div>

      {/* Entity Manager - Render based on current entity */}
      {currentEntity === 'user' && (
        <EntityManager
          key="user"
          config={USER_CONFIG}
          initialMode="list"
          className="demo-entity-manager"
        />
      )}

      {currentEntity === 'property' && (
        <EntityManager
          key="property"
          config={PROPERTY_CONFIG}
          initialMode="list"
          className="demo-entity-manager"
        />
      )}

      {currentEntity === 'tenant_profile' && (
        <EntityManager
          key="tenant_profile"
          config={TENANT_PROFILE_CONFIG}
          initialMode="list"
          className="demo-entity-manager"
        />
      )}

      {/* Instructions */}
      <div className="instructions">
        <h3>Demo Features:</h3>
        <ul>
          <li>Switch between different entity types</li>
          <li>View list, create, edit, and detail modes</li>
          <li>Experience different view variants (table, card, etc.)</li>
          <li>Test CRUD operations with MyLandlord backend</li>
          <li>See related entity handling</li>
          <li>Observe form variations and validation</li>
        </ul>
      </div>
    </div>
  )
}

// Example 6: Custom EntityManager with context data
export function CustomEntityManagerExample() {
  const contextData = {
    currentUser: { id: 1, role: 'admin' },
    organization: { id: 1, name: 'Demo Property Management' },
    permissions: ['create', 'read', 'update', 'delete']
  }

  return (
    <div className="custom-entity-manager">
      <h1>Custom EntityManager with Context</h1>
      <EntityManager
        config={USER_CONFIG}
        initialMode="list"
        contextData={contextData}
        onAction={(action, data) => {
          // Custom action handling with context
          console.log('Action with context:', action, data, contextData)
        }}
      />
    </div>
  )
}

// Main examples export
export const EntityManagerExamples = {
  UserManagement: UserManagementExample,
  PropertyManagement: PropertyManagementExample,
  PreConfigured: PreConfiguredExamples,
  TenantProfileManagement: TenantProfileManagementExample,
  FullEntityManagement: FullEntityManagementExample,
  CustomEntityManager: CustomEntityManagerExample
}

export default EntityManagerExamples