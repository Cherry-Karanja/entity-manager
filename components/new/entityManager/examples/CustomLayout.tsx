/**
 * Custom Layout Example - Building Your Own Orchestrator
 * 
 * This example shows how to create custom layouts and orchestrators
 * when the default EntityManager doesn't fit your needs.
 */

import React, { useState, useCallback } from 'react';
import {
  EntityList,
  EntityForm,
  EntityView,
  EntityActions,
  EntityExporter,
  EntityStateProvider,
  useEntityState,
  EntityConfigBuilder,
  type EntityConfig,
  type BaseEntity
} from '@/components/new/entityManager';

interface User extends BaseEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  avatar?: string;
  createdAt: Date;
  [key: string]: unknown;
}

// 1. Custom Split Layout (List + Detail Side-by-Side)
export function SplitLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const { state, select, deselect } = useEntityState<User>();
  const { entities, selectedIds } = state;
  const selectedUser = selectedIds.size === 1 
    ? entities.find((e: User) => e.id === Array.from(selectedIds)[0])
    : null;

  return (
    <div className="flex h-screen">
      {/* Left panel - List */}
      <div className="w-1/2 border-r overflow-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <EntityList
            data={entities}
            columns={config.fields.map((f: any) => ({
              key: f.name,
              header: f.label,
              label: f.label,
              sortable: true
            }))}
            view="table"
            searchable
            sortable
            selectable
            selectedIds={selectedIds}
            onSelectionChange={select as any}
          />
        </div>
      </div>

      {/* Right panel - Detail */}
      <div className="w-1/2 overflow-auto">
        <div className="p-4">
          {selectedUser ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Details</h2>
                <EntityActions
                  entity={selectedUser}
                  actions={config.actions || []}
                />
              </div>
              <EntityView
                entity={selectedUser}
                fields={config.fields.map((f: any) => ({
                  key: f.name,
                  label: f.label,
                  type: f.type
                }))}
                mode="detail"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a user to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Custom Tab Layout (List, Form, Detail as Tabs)
export function TabLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'view' | 'detail'>('list');
  const { state } = useEntityState<User>();
  const { entities, selectedIds } = state;
  const selectedUser = selectedIds.size === 1 
    ? entities.find((e: User) => e.id === Array.from(selectedIds)[0])
    : null;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-4 px-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'list' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent'
            }`}
          >
            List ({entities.length})
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'form' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent'
            }`}
          >
            Create New
          </button>
          <button
            onClick={() => setActiveTab('detail')}
            disabled={!selectedUser}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'detail' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent'
            } ${!selectedUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Detail {selectedUser ? `(${selectedUser.name})` : ''}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'list' && (
          <EntityList
            data={entities}
            columns={config.columns}
            view="table"
            searchable
            sortable
            filterable
            pagination
          />
        )}

        {activeTab === 'form' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <EntityForm
              fields={config.fields}
              onSubmit={async (data) => {
                console.log('Create:', data);
                setActiveTab('list');
              }}
              onCancel={() => setActiveTab('list')}
            />
          </div>
        )}

        {activeTab === 'detail' && selectedUser && (
          <div className="max-w-2xl mx-auto">
            <EntityView
              entity={selectedUser}
              fields={config.fields.map((f: any) => ({
                key: f.name,
                label: f.label,
                type: f.type
              }))}
              mode="detail"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Custom Modal Layout (List with Modal Forms)
export function ModalLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { state } = useEntityState<User>();
  const { entities } = state;

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          Create User
        </button>
      </div>

      <EntityList
        data={entities}
        columns={config.columns}
        view="table"
        searchable
        sortable
        pagination
        rowActions={({ entity }) => (
          <EntityActions
            entity={entity}
            actions={config.actions || []}
          />
        )}
      />

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Create User'}
            </h2>
            <EntityForm
              fields={config.fields}
              entity={editingUser || undefined}
              onSubmit={async (data) => {
                console.log('Submit:', data);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Custom Dashboard Layout (Cards + Stats)
export function DashboardLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const { state } = useEntityState<User>();
  const { entities } = state;

  const stats = {
    total: entities.length,
    active: entities.filter((u: User) => u.status === 'active').length,
    admins: entities.filter((u: User) => u.role === 'admin').length,
    pending: entities.filter((u: User) => u.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Administrators</div>
          <div className="text-3xl font-bold text-blue-600">{stats.admins}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Recent Users</h2>
        </div>
        <EntityList
          data={entities.slice(0, 10)}
          columns={config.columns}
          view="table"
          pagination={false}
        />
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Export Data</h2>
        <EntityExporter
          data={entities}
          fields={config.fields.map(f => ({
            key: f.key,
            label: f.label,
            type: f.type
          }))}
          filename="users"
        />
      </div>
    </div>
  );
}

// 5. Custom Wizard Layout (Multi-Step Form)
export function WizardLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({});

  const steps = [
    {
      title: 'Basic Info',
      fields: config.fields.filter((f: any) =>
        ['name', 'email'].includes(f.name)
      )
    },
    {
      title: 'Role & Access',
      fields: config.fields.filter((f: any) =>
        ['role', 'department'].includes(f.name)
      )
    },
    {
      title: 'Additional Details',
      fields: config.fields.filter((f: any) =>
        ['status', 'avatar'].includes(f.name)
      )
    }
  ];

  const handleNext = async (data: Partial<User>) => {
    setFormData({ ...formData, ...data });
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Submit
      console.log('Final data:', { ...formData, ...data });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`text-sm font-medium ${
                i + 1 === step ? 'text-blue-600' : 
                i + 1 < step ? 'text-green-600' : 
                'text-gray-400'
              }`}
            >
              {i + 1}. {s.title}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">{steps[step - 1].title}</h2>
        <EntityForm
          fields={steps[step - 1].fields as any}
          initialData={formData}
          onSubmit={handleNext}
          onCancel={step > 1 ? () => setStep(step - 1) : undefined}
          cancelLabel={step > 1 ? 'Back' : undefined}
        />
      </div>
    </div>
  );
}

// 6. Custom Kanban Layout (Status-Based Columns)
export function KanbanLayoutOrchestrator({ config }: { config: EntityConfig<User> }) {
  const { state } = useEntityState<User>();
  const { entities } = state;

  const columns = [
    { status: 'pending', title: 'Pending', color: 'yellow' },
    { status: 'active', title: 'Active', color: 'green' },
    { status: 'inactive', title: 'Inactive', color: 'gray' }
  ];

  return (
    <div className="flex gap-4 h-screen overflow-auto p-4">
      {columns.map(column => {
        const columnUsers = entities.filter((u: User) => u.status === column.status);
        
        return (
          <div key={column.status} className="flex-1 min-w-[300px]">
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
              <div className={`p-4 bg-${column.color}-100 border-b`}>
                <h3 className="font-bold text-lg">
                  {column.title} ({columnUsers.length})
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {columnUsers.map((user: User) => (
                  <div key={user.id} className="bg-gray-50 p-4 rounded border">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                    )}
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500 mt-1">{user.role}</div>
                    <div className="mt-3">
                      <EntityActions
                        entity={user}
                        actions={config.actions || []}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Example usage - EntityConfigBuilder
// NOTE: This example uses an old API and needs to be updated
/*
const userConfig = new EntityConfigBuilder<User>({
  name: 'user',
  display: {
    singular: 'User',
    plural: 'Users'
  },
  endpoints: {
    list: '/api/users',
    create: '/api/users',
    read: '/api/users/:id',
    update: '/api/users/:id',
    delete: '/api/users/:id'
  },
  fields: [],
  actions: []
})
  .addColumn('name', 'Name', { sortable: true })
  .addColumn('email', 'Email', { sortable: true })
  .addColumn('role', 'Role', { filterable: true })
  .addColumn('status', 'Status', { filterable: true })
  .addField('name', 'text', 'Name', { required: true })
  .addField('email', 'email', 'Email', { required: true })
  .addField('role', 'select', 'Role', {
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  })
  .addField('department', 'select', 'Department', {
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Sales', value: 'sales' }
    ]
  })
  .addField('status', 'select', 'Status', {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  })
  .addAction('edit', 'Edit', 'immediate', {
    onClick: (user) => console.log('Edit:', user)
  })
  .addAction('delete', 'Delete', 'confirm', {
    variant: 'danger',
    confirm: { title: 'Delete User', message: 'Are you sure?' },
    onClick: (user) => console.log('Delete:', user)
  })
  .build();
*/

// Simple user config for demo
const userConfig: EntityConfig<User> = {
  name: 'user',
  display: {
    singular: 'User',
    plural: 'Users'
  },
  endpoints: {
    list: '/api/users',
    create: '/api/users',
    read: '/api/users/:id',
    update: '/api/users/:id',
    delete: '/api/users/:id'
  },
  fields: [
    { key: 'name', type: 'text', label: 'Name', required: true },
    { key: 'email', type: 'text', label: 'Email', required: true },
    { key: 'role', type: 'select', label: 'Role', options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]},
    { key: 'department', type: 'select', label: 'Department', options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Sales', value: 'sales' }
    ]},
    { key: 'status', type: 'select', label: 'Status', options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]}
  ],
  actions: [
    {
      id: 'edit',
      label: 'Edit',
      onClick: (user: User) => console.log('Edit:', user)
    },
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger',
      onClick: (user: User) => console.log('Delete:', user)
    }
  ]
};

// Main demo page
export default function CustomLayoutExamples() {
  const [layout, setLayout] = useState<string>('split');

  const layouts = [
    { key: 'split', label: 'Split Layout', Component: SplitLayoutOrchestrator },
    { key: 'tab', label: 'Tab Layout', Component: TabLayoutOrchestrator },
    { key: 'modal', label: 'Modal Layout', Component: ModalLayoutOrchestrator },
    { key: 'dashboard', label: 'Dashboard', Component: DashboardLayoutOrchestrator },
    { key: 'wizard', label: 'Wizard', Component: WizardLayoutOrchestrator },
    { key: 'kanban', label: 'Kanban', Component: KanbanLayoutOrchestrator }
  ];

  const CurrentLayout = layouts.find(l => l.key === layout)?.Component || SplitLayoutOrchestrator;

  return (
    <EntityStateProvider>
      <div className="h-screen flex flex-col">
        {/* Layout Selector */}
        <div className="bg-white border-b p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Custom Layout Examples</h1>
            <div className="flex gap-2">
              {layouts.map(l => (
                <button
                  key={l.key}
                  onClick={() => setLayout(l.key)}
                  className={`px-4 py-2 rounded ${
                    layout === l.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Layout */}
        <div className="flex-1 overflow-hidden">
          <CurrentLayout config={userConfig} />
        </div>
      </div>
    </EntityStateProvider>
  );
}

/**
 * Key Takeaways:
 * 
 * 1. You have full control over layout
 * 2. Components work independently
 * 3. Use state management hooks for coordination
 * 4. Mix and match components as needed
 * 5. Create custom orchestrators for specific use cases
 * 
 * When to use custom layouts:
 * - Default EntityManager doesn't fit your UX
 * - Need specific workflow (wizard, kanban, etc.)
 * - Want to integrate with existing UI
 * - Require advanced features
 */
