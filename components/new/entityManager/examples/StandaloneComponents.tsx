/**
 * Standalone Components Example
 * 
 * This example shows how to use individual components without the
 * EntityManager orchestrator. This is useful when you need more control
 * over the layout or want to integrate components into existing UIs.
 */

import React, { useState, useEffect } from 'react';
import {
  EntityList,
  EntityForm,
  EntityView,
  EntityActions,
  EntityExporter
} from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2024-03-10')
  }
];

// Example 1: Standalone EntityList
export function StandaloneListExample() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: 200
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      filterable: true,
      render: (value: string) => (
        <span className={`badge badge-${value}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      render: (value: string) => (
        <span className={`status-${value}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Standalone List Component</h2>
      
      <EntityList
        data={users}
        columns={columns}
        view="table"
        searchable
        sortable
        filterable
        pagination
        selectable
        multiSelect
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(user) => console.log('Clicked:', user)}
        rowActions={({ entity }) => (
          <div className="flex gap-2">
            <button className="btn btn-sm">Edit</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </div>
        )}
        emptyMessage="No users found"
        className="border rounded-lg"
      />

      {selectedIds.size > 0 && (
        <div className="bg-blue-50 p-4 rounded">
          Selected {selectedIds.size} user(s)
        </div>
      )}
    </div>
  );
}

// Example 2: Standalone EntityForm
export function StandaloneFormExample() {
  const [formData, setFormData] = useState<Partial<User>>({});

  const fields = [
    {
      key: 'name',
      type: 'text' as const,
      label: 'Name',
      required: true,
      placeholder: 'Enter name'
    },
    {
      key: 'email',
      type: 'email' as const,
      label: 'Email',
      required: true,
      validation: [{ type: 'email' as const }]
    },
    {
      key: 'role',
      type: 'select' as const,
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    },
    {
      key: 'status',
      type: 'select' as const,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ];

  const handleSubmit = async (data: Partial<User>) => {
    console.log('Form submitted:', data);
    setFormData(data);
    alert('User saved successfully!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Standalone Form Component</h2>
      
      <div className="max-w-2xl">
        <EntityForm
          fields={fields}
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => console.log('Cancelled')}
          onChange={(data) => console.log('Form changed:', data)}
          submitLabel="Save User"
          cancelLabel="Cancel"
          layout="vertical"
          className="bg-white p-6 rounded-lg shadow"
        />
      </div>
    </div>
  );
}

// Example 3: Standalone EntityView
export function StandaloneViewExample() {
  const user: User = mockUsers[0];

  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', type: 'email' as const },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge badge-${value}`}>
          {value}
        </span>
      )
    },
    { key: 'createdAt', label: 'Created', type: 'date' as const }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Standalone View Component</h2>
      
      <div className="max-w-2xl">
        <EntityView
          data={user}
          fields={fields}
          view="detail"
          showMetadata
          metadata={{
            createdAt: user.createdAt,
            createdBy: 'System Admin',
            updatedAt: new Date(),
            updatedBy: 'System Admin'
          }}
          actions={[
            {
              label: 'Edit',
              icon: 'edit',
              type: 'immediate' as const,
              onClick: () => console.log('Edit')
            },
            {
              label: 'Delete',
              icon: 'delete',
              type: 'confirm' as const,
              variant: 'danger' as const,
              confirm: {
                title: 'Delete User',
                message: 'Are you sure?'
              },
              onClick: () => console.log('Delete')
            }
          ]}
          className="bg-white p-6 rounded-lg shadow"
        />
      </div>
    </div>
  );
}

// Example 4: Standalone EntityActions
export function StandaloneActionsExample() {
  const user: User = mockUsers[0];

  const actions = [
    {
      key: 'edit',
      label: 'Edit',
      type: 'immediate' as const,
      icon: 'edit',
      onClick: (user: User) => console.log('Edit:', user)
    },
    {
      key: 'activate',
      label: 'Activate',
      type: 'confirm' as const,
      variant: 'success' as const,
      visible: (user: User) => user.status !== 'active',
      confirm: {
        title: 'Activate User',
        message: 'Activate this user?'
      },
      onClick: async (user: User) => {
        console.log('Activate:', user);
      }
    },
    {
      key: 'delete',
      label: 'Delete',
      type: 'confirm' as const,
      icon: 'delete',
      variant: 'danger' as const,
      confirm: {
        title: 'Delete User',
        message: 'This cannot be undone.'
      },
      onClick: async (user: User) => {
        console.log('Delete:', user);
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Standalone Actions Component</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">User: {user.name}</h3>
        
        <EntityActions
          entity={user}
          actions={actions}
          layout="horizontal"
          align="left"
        />
      </div>
    </div>
  );
}

// Example 5: Standalone EntityExporter
export function StandaloneExporterExample() {
  const fields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date' as const,
      formatter: (value: Date) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Standalone Exporter Component</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">Export {mockUsers.length} users to various formats:</p>
        
        <EntityExporter
          data={mockUsers}
          fields={fields}
          formats={['csv', 'json', 'xlsx']}
          filename="users"
          buttonLabel="Export Users"
          layout="separate"
          fieldSelection
        />
      </div>
    </div>
  );
}

// Example 6: Complete Custom Layout
export function CompleteCustomLayout() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', filterable: true }
  ];

  const fields = [
    { key: 'name', type: 'text' as const, label: 'Name', required: true },
    { key: 'email', type: 'email' as const, label: 'Email', required: true },
    {
      key: 'role',
      type: 'select' as const,
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    }
  ];

  const viewFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created', type: 'date' as const }
  ];

  const handleCreate = () => {
    setEditingUser(null);
    setView('form');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setView('form');
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setView('detail');
  };

  const handleSubmit = async (data: Partial<User>) => {
    if (editingUser) {
      // Update existing
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      // Create new
      const newUser = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date()
      } as User;
      setUsers([...users, newUser]);
    }
    setView('list');
  };

  const handleDelete = async (user: User) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Complete Custom Layout</h2>
      
      {/* Header with navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`btn ${view === 'list' ? 'btn-primary' : ''}`}
          >
            List
          </button>
          {view === 'form' && (
            <span className="text-gray-600 ml-2">
              {editingUser ? 'Edit User' : 'Create User'}
            </span>
          )}
          {view === 'detail' && (
            <span className="text-gray-600 ml-2">
              View User
            </span>
          )}
        </div>
        
        {view === 'list' && (
          <button onClick={handleCreate} className="btn btn-primary">
            Create User
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="bg-white rounded-lg shadow">
        {view === 'list' && (
          <EntityList
            data={users}
            columns={columns}
            view="table"
            searchable
            sortable
            pagination
            onRowClick={handleView}
            rowActions={({ entity }) => (
              <EntityActions
                entity={entity}
                actions={[
                  {
                    key: 'edit',
                    label: 'Edit',
                    type: 'immediate',
                    onClick: handleEdit
                  },
                  {
                    key: 'delete',
                    label: 'Delete',
                    type: 'confirm',
                    variant: 'danger',
                    confirm: { title: 'Delete User', message: 'Are you sure?' },
                    onClick: handleDelete
                  }
                ]}
                layout="horizontal"
                size="small"
              />
            )}
          />
        )}

        {view === 'form' && (
          <div className="p-6">
            <EntityForm
              fields={fields}
              initialData={editingUser || {}}
              onSubmit={handleSubmit}
              onCancel={() => setView('list')}
              submitLabel={editingUser ? 'Update' : 'Create'}
            />
          </div>
        )}

        {view === 'detail' && selectedUser && (
          <div className="p-6">
            <EntityView
              data={selectedUser}
              fields={viewFields}
              view="detail"
              actions={[
                {
                  label: 'Edit',
                  type: 'immediate',
                  onClick: () => handleEdit(selectedUser)
                },
                {
                  label: 'Delete',
                  type: 'confirm',
                  variant: 'danger',
                  confirm: { title: 'Delete', message: 'Are you sure?' },
                  onClick: () => {
                    handleDelete(selectedUser);
                    setView('list');
                  }
                }
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Main example page
export default function StandaloneComponentsExample() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Standalone Components</h1>
        <p className="text-gray-600 mt-2">
          Examples of using individual components without the EntityManager orchestrator
        </p>
      </div>

      <StandaloneListExample />
      <StandaloneFormExample />
      <StandaloneViewExample />
      <StandaloneActionsExample />
      <StandaloneExporterExample />
      <CompleteCustomLayout />
    </div>
  );
}
