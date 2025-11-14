import React from 'react';
import { EntityActions } from '../index';
import { EntityActionsConfig } from '../types';
import { EntityList } from '../../EntityList';
import { EntityListColumn } from '../../EntityList/types';

// Mock data for examples
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  status: 'active',
};

const mockUsers = [
  mockUser,
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', status: 'inactive' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active' },
];

const mockPermissions = {
  check: (permission: string) => {
    // Mock permission check
    return ['edit', 'delete', 'view'].includes(permission);
  },
};

// Example 1: Basic Actions
const basicActionsConfig: EntityActionsConfig = {
  actions: [
    {
      id: 'view',
      label: 'View',
      description: 'View user details',
      icon: () => <span>👁️</span>,
      type: 'default',
      actionType: 'immediate',
      onExecute: (item: any) => {
        console.log('Viewing user:', item);
        alert(`Viewing user: ${item.name}`);
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      description: 'Edit user information',
      icon: () => <span>✏️</span>,
      type: 'primary',
      actionType: 'navigation',
      href: (item: any) => `/users/${item.id}/edit`,
      router: 'next',
    },
    {
      id: 'delete',
      label: 'Delete',
      description: 'Delete this user',
      icon: () => <span>🗑️</span>,
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete User',
        content: 'Are you sure you want to delete this user? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger',
      },
      onExecute: (item: any) => {
        console.log('Deleting user:', item);
        alert(`User ${item.name} would be deleted`);
      },
    },
  ],
  permissions: mockPermissions,
  showLabels: true,
  actionButtonVariant: 'outline',
  actionButtonSize: 'sm',
};

// Example 2: Form Actions
const formActionsConfig: EntityActionsConfig = {
  actions: [
    {
      id: 'change-password',
      label: 'Change Password',
      description: 'Change user password',
      icon: () => <span>🔑</span>,
      type: 'default',
      actionType: 'form',
      form: {
        title: 'Change Password',
        fields: [
          {
            key: 'currentPassword',
            label: 'Current Password',
            type: 'password',
            required: true,
          },
          {
            key: 'newPassword',
            label: 'New Password',
            type: 'password',
            required: true,
          },
          {
            key: 'confirmPassword',
            label: 'Confirm New Password',
            type: 'password',
            required: true,
          },
        ],
        onSubmit: async (values, item) => {
          console.log('Changing password for:', item, values);
          alert('Password changed successfully!');
        },
      },
    },
    {
      id: 'update-profile',
      label: 'Update Profile',
      description: 'Update user profile information',
      icon: () => <span>👤</span>,
      type: 'primary',
      actionType: 'form',
      form: {
        title: 'Update Profile',
        fields: [
          {
            key: 'name',
            label: 'Full Name',
            type: 'string',
            required: true,
            defaultValue: (item: any) => item.name,
          },
          {
            key: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            defaultValue: (item: any) => item.email,
          },
          {
            key: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            defaultValue: (item: any) => item.role,
            options: [
              { value: 'admin', label: 'Administrator' },
              { value: 'manager', label: 'Manager' },
              { value: 'user', label: 'User' },
            ],
          },
        ],
        onSubmit: async (values, item) => {
          console.log('Updating profile for:', item, values);
          alert('Profile updated successfully!');
        },
      },
    },
  ],
  permissions: mockPermissions,
  showLabels: true,
  actionButtonVariant: 'outline',
  actionButtonSize: 'sm',
};

// Example 3: Modal and Drawer Actions
const ModalContent: React.FC<{ item: any; onClose: () => void }> = ({ item, onClose }) => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">User Details</h3>
    <div className="space-y-2">
      <p><strong>Name:</strong> {item.name}</p>
      <p><strong>Email:</strong> {item.email}</p>
      <p><strong>Role:</strong> {item.role}</p>
      <p><strong>Status:</strong> {item.status}</p>
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
);

const DrawerContent: React.FC<{ item: any; onClose: () => void }> = ({ item, onClose }) => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Edit User</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          defaultValue={item.name}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          defaultValue={item.email}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter email"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            alert('User updated!');
            onClose();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

const modalDrawerActionsConfig: EntityActionsConfig = {
  actions: [
    {
      id: 'view-details',
      label: 'View Details',
      description: 'View detailed user information',
      icon: () => <span>📋</span>,
      type: 'default',
      actionType: 'modal',
      modal: {
        title: 'User Details',
        content: ModalContent,
        width: 600,
      },
    },
    {
      id: 'quick-edit',
      label: 'Quick Edit',
      description: 'Quick edit user information',
      icon: () => <span>⚡</span>,
      type: 'primary',
      actionType: 'drawer',
      drawer: {
        title: 'Edit User',
        content: DrawerContent,
        width: 400,
        placement: 'right',
      },
    },
  ],
  permissions: mockPermissions,
  showLabels: true,
  actionButtonVariant: 'outline',
  actionButtonSize: 'sm',
};

// Example 4: Bulk Actions
const bulkActionsConfig: EntityActionsConfig = {
  actions: [
    {
      id: 'export',
      label: 'Export',
      description: 'Export selected users',
      icon: () => <span>📤</span>,
      type: 'default',
      actionType: 'immediate',
      onExecute: (item: any) => {
        console.log('Exporting user:', item);
        alert(`Exporting user: ${item.name}`);
      },
    },
  ],
  bulkActions: [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      description: 'Delete selected users',
      icon: () => <span>🗑️</span>,
      type: 'default',
      danger: true,
      actionType: 'confirm',
      minSelection: 1,
      confirm: {
        title: (count) => `Delete ${count} Users`,
        content: (selectedItems) => `Are you sure you want to delete ${selectedItems.length} users? This action cannot be undone.`,
        okText: 'Delete All',
        cancelText: 'Cancel',
        okType: 'danger',
      },
      onExecute: (selectedItems) => {
        console.log('Bulk deleting users:', selectedItems);
        alert(`${selectedItems.length} users would be deleted`);
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      description: 'Export selected users to CSV',
      icon: () => <span>📊</span>,
      type: 'primary',
      actionType: 'immediate',
      minSelection: 1,
      onExecute: (selectedItems) => {
        console.log('Bulk exporting users:', selectedItems);
        alert(`Exporting ${selectedItems.length} users to CSV`);
      },
    },
  ],
  permissions: mockPermissions,
  showLabels: true,
  actionButtonVariant: 'outline',
  actionButtonSize: 'sm',
};

// Example 5: EntityList Integration
const userColumns: EntityListColumn[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
  { id: 'role', header: 'Role', accessorKey: 'role' },
  { id: 'status', header: 'Status', accessorKey: 'status' },
];

const entityListActionsConfig: EntityActionsConfig = {
  actions: [
    {
      id: 'view',
      label: 'View',
      icon: () => <span>👁️</span>,
      type: 'default',
      actionType: 'modal',
      modal: {
        title: (item: any) => `View ${item.name}`,
        width: 500,
        content: (item: any) => (
          <div className="space-y-4">
            <div><strong>Name:</strong> {item.name}</div>
            <div><strong>Email:</strong> {item.email}</div>
            <div><strong>Role:</strong> {item.role}</div>
            <div><strong>Status:</strong> {item.status}</div>
          </div>
        ),
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: () => <span>✏️</span>,
      type: 'primary',
      actionType: 'drawer',
      drawer: {
        title: (item: any) => `Edit ${item.name}`,
        width: 400,
        content: (item: any) => (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                defaultValue={item.name}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                defaultValue={item.email}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select defaultValue={item.role} className="w-full px-3 py-2 border rounded" aria-label="Select role">
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ),
      },
      onExecute: (item: any) => {
        console.log('Editing user:', item);
        alert(`User ${item.name} would be updated`);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: () => <span>🗑️</span>,
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete User',
        content: (item: any) => `Are you sure you want to delete ${item.name}?`,
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger',
      },
      onExecute: (item: any) => {
        console.log('Deleting user:', item);
        alert(`User ${item.name} would be deleted`);
      },
    },
  ],
  bulkActions: [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: () => <span>🗑️</span>,
      type: 'default',
      danger: true,
      actionType: 'confirm',
      minSelection: 1,
      confirm: {
        title: 'Delete Users',
        content: (selectedItems: any[]) => `Are you sure you want to delete ${selectedItems.length} users?`,
        okText: 'Delete All',
        cancelText: 'Cancel',
        okType: 'danger',
      },
      onExecute: (selectedItems: any[]) => {
        console.log('Bulk deleting users:', selectedItems);
        alert(`${selectedItems.length} users would be deleted`);
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: () => <span>📊</span>,
      type: 'primary',
      actionType: 'immediate',
      minSelection: 1,
      onExecute: (selectedItems: any[]) => {
        console.log('Bulk exporting users:', selectedItems);
        alert(`Exporting ${selectedItems.length} users to CSV`);
      },
    },
  ],
  permissions: mockPermissions,
  maxVisibleActions: 2,
  showLabels: false,
  actionButtonVariant: 'ghost',
  actionButtonSize: 'sm',
};

const entityListConfig = {
  title: 'Users',
  data: mockUsers,
  columns: userColumns,
  entityActions: entityListActionsConfig as any,
  selection: {
    mode: 'multiple' as const,
    selectedKeys: [],
  },
  paginated: true,
  pagination: {
    pageSize: 10,
  },
  searchable: true,
  searchPlaceholder: 'Search users...',
};

// Main Examples Component
export const EntityActionsExamples: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">EntityActions Examples</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive examples of the EntityActions component with different action types,
          configurations, and use cases.
        </p>
      </div>

      {/* Basic Actions Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Basic Actions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Simple immediate and navigation actions with confirmations.
        </p>
        <EntityActions
          config={basicActionsConfig as any}
          context={{ entity: mockUser }}
        />
      </div>

      {/* Form Actions Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Form Actions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Actions that open forms for data input and submission.
        </p>
        <EntityActions
          config={formActionsConfig as any}
          context={{ entity: mockUser }}
        />
      </div>

      {/* Modal and Drawer Actions Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Modal & Drawer Actions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Actions that open modals and drawers for complex interactions.
        </p>
        <EntityActions
          config={modalDrawerActionsConfig as any}
          context={{ entity: mockUser }}
        />
      </div>

      {/* Bulk Actions Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Bulk Actions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Actions that work with multiple selected items.
        </p>
        <EntityActions
          config={bulkActionsConfig as any}
          context={{ entities: [mockUser, { ...mockUser, id: '2', name: 'Jane Smith' }] }}
        />
      </div>

      {/* EntityList Integration Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">EntityList Integration</h2>
        <p className="text-sm text-gray-600 mb-4">
          EntityActions integrated with EntityList component for table views with modals, drawers, and bulk actions.
        </p>
        <EntityList config={entityListConfig} />
      </div>

      {/* Configuration Options */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Configuration Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Display Options:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• showLabels: Show/hide action labels</li>
              <li>• showShortcuts: Display keyboard shortcuts</li>
              <li>• groupActions: Group actions by category</li>
              <li>• maxVisibleActions: Limit visible actions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Integration Options:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• EntityList Integration: Use entityActions in EntityList config</li>
              <li>• Modal/Drawer Actions: Rich action interfaces</li>
              <li>• Bulk Actions: Multi-item operations</li>
              <li>• Form Actions: Data input workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityActionsExamples;