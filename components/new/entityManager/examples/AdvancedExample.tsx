/**
 * Advanced Example - Full-Featured Entity Manager with API Integration
 * 
 * This example demonstrates:
 * - API integration with authentication
 * - State management with caching
 * - Advanced field validation
 * - Custom actions and permissions
 * - Export functionality
 */

import React from 'react';
import axios from 'axios';
import {
  EntityManager,
  EntityConfigBuilder,
  EntityApiProvider,
  EntityStateProvider
} from '@/components/new/entityManager';

// 1. Define comprehensive entity type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  bio?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// 2. Configure API client with authentication
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiConfig = {
  client: apiClient,
  entities: {
    users: {
      base: '/users',
      list: '/users',
      get: '/users/:id',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id',
      custom: {
        activate: { method: 'POST', path: '/users/:id/activate' },
        deactivate: { method: 'POST', path: '/users/:id/deactivate' },
        resetPassword: { method: 'POST', path: '/users/:id/reset-password' }
      }
    }
  }
};

// 3. Advanced configuration with all features
const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .setIcon('users')
  .setDescription('Manage user accounts and permissions')
  
  // List columns with custom rendering
  .addColumn('avatar', 'Avatar', {
    width: 60,
    render: (value, user) => (
      <img
        src={user.avatar || '/default-avatar.png'}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  })
  .addColumn('name', 'Name', {
    sortable: true,
    width: 200,
    render: (value, user) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    )
  })
  .addColumn('role', 'Role', {
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Administrator', value: 'admin' },
      { label: 'Manager', value: 'manager' },
      { label: 'User', value: 'user' }
    ],
    render: (value) => {
      const colors = {
        admin: 'bg-purple-100 text-purple-800',
        manager: 'bg-blue-100 text-blue-800',
        user: 'bg-gray-100 text-gray-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }
  })
  .addColumn('department', 'Department', {
    sortable: true,
    filterable: true
  })
  .addColumn('status', 'Status', {
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ],
    render: (value) => {
      const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }
  })
  .addColumn('lastLoginAt', 'Last Login', {
    sortable: true,
    type: 'date',
    render: (value) => {
      if (!value) return <span className="text-gray-400">Never</span>;
      return new Date(value).toLocaleDateString();
    }
  })
  
  // Form fields with advanced validation
  .addField('name', 'text', 'Full Name', {
    required: true,
    placeholder: 'Enter full name',
    validation: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
      { type: 'maxLength', value: 50, message: 'Name must be less than 50 characters' }
    ]
  })
  .addField('email', 'email', 'Email Address', {
    required: true,
    placeholder: 'user@example.com',
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email address' },
      {
        type: 'async',
        validate: async (value, formData) => {
          // Check if email is unique (skip for existing users)
          if (formData.id) return true;
          const response = await apiClient.get(`/users/check-email?email=${value}`);
          return response.data.available || 'Email already in use';
        }
      }
    ]
  })
  .addField('phone', 'tel', 'Phone Number', {
    placeholder: '+1 (555) 000-0000',
    validation: [
      {
        type: 'pattern',
        value: /^\+?[1-9]\d{1,14}$/,
        message: 'Invalid phone number format'
      }
    ]
  })
  .addField('role', 'select', 'Role', {
    required: true,
    options: [
      { label: 'Administrator', value: 'admin' },
      { label: 'Manager', value: 'manager' },
      { label: 'User', value: 'user' }
    ],
    defaultValue: 'user',
    description: 'User role determines access permissions'
  })
  .addField('department', 'select', 'Department', {
    required: true,
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Sales', value: 'sales' },
      { label: 'Support', value: 'support' }
    ]
  })
  .addField('status', 'select', 'Status', {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending Approval', value: 'pending' }
    ],
    defaultValue: 'pending'
  })
  .addField('avatar', 'image', 'Profile Picture', {
    accept: 'image/*',
    maxSize: 2 * 1024 * 1024, // 2MB
    preview: true,
    description: 'Max file size: 2MB. Supported formats: JPG, PNG, GIF'
  })
  .addField('bio', 'textarea', 'Biography', {
    rows: 4,
    placeholder: 'Tell us about yourself...',
    validation: [
      { type: 'maxLength', value: 500, message: 'Bio must be less than 500 characters' }
    ]
  })
  
  // Advanced actions with permissions
  .addAction('edit', 'Edit', 'immediate', {
    icon: 'edit',
    visible: (user, context) => context.permissions?.includes('users:edit'),
    onClick: (user) => console.log('Edit user:', user)
  })
  .addAction('activate', 'Activate', 'confirm', {
    icon: 'check',
    variant: 'success',
    visible: (user) => user.status !== 'active',
    confirm: {
      title: 'Activate User',
      message: 'Activate this user account?'
    },
    onClick: async (user) => {
      await apiClient.post(`/users/${user.id}/activate`);
    }
  })
  .addAction('deactivate', 'Deactivate', 'confirm', {
    icon: 'ban',
    variant: 'warning',
    visible: (user) => user.status === 'active',
    confirm: {
      title: 'Deactivate User',
      message: 'This will prevent the user from accessing the system.'
    },
    onClick: async (user) => {
      await apiClient.post(`/users/${user.id}/deactivate`);
    }
  })
  .addAction('resetPassword', 'Reset Password', 'form', {
    icon: 'key',
    visible: (user, context) => context.permissions?.includes('users:reset-password'),
    form: {
      title: 'Reset Password',
      fields: [
        {
          key: 'sendEmail',
          type: 'checkbox',
          label: 'Send password reset email to user',
          defaultValue: true
        }
      ]
    },
    onClick: async (user, formData) => {
      await apiClient.post(`/users/${user.id}/reset-password`, formData);
    }
  })
  .addAction('delete', 'Delete', 'confirm', {
    icon: 'trash',
    variant: 'danger',
    visible: (user, context) => context.permissions?.includes('users:delete'),
    disabled: (user) => user.role === 'admin',
    confirm: {
      title: 'Delete User',
      message: 'This action cannot be undone. All user data will be permanently deleted.',
      confirmLabel: 'Delete Permanently',
      confirmVariant: 'danger'
    },
    onClick: async (user) => {
      await apiClient.delete(`/users/${user.id}`);
    }
  })
  
  // Enable all features
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] })
  .enableSelection({ multiSelect: true })
  .enableExport(['csv', 'xlsx', 'json'])
  
  // Set permissions
  .setPermissions({
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'user'],
    update: ['admin', 'manager'],
    delete: ['admin']
  })
  
  .build();

// 4. Main component with providers
export default function AdvancedExample() {
  // Mock user context (replace with real auth)
  const currentUser = {
    id: '1',
    role: 'admin',
    permissions: ['users:edit', 'users:delete', 'users:reset-password']
  };

  return (
    <EntityApiProvider config={apiConfig}>
      <EntityStateProvider>
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Advanced User Management</h1>
            <p className="text-gray-600 mt-2">
              Full-featured example with API integration, caching, and permissions
            </p>
          </div>
          
          <EntityManager 
            config={userConfig}
            context={{
              user: currentUser,
              permissions: currentUser.permissions
            }}
          />
        </div>
      </EntityStateProvider>
    </EntityApiProvider>
  );
}

/**
 * This advanced example includes:
 * 
 * ✅ API Integration
 *    - Axios client with auth interceptors
 *    - Automatic token injection
 *    - Error handling and redirects
 *    - Custom endpoints for activate/deactivate
 * 
 * ✅ Advanced Validation
 *    - Synchronous validation (required, email, pattern)
 *    - Asynchronous validation (unique email check)
 *    - Custom error messages
 *    - Field-level validation rules
 * 
 * ✅ Custom Rendering
 *    - Avatar images
 *    - Status badges with colors
 *    - Role badges
 *    - Formatted dates
 * 
 * ✅ Permissions
 *    - Role-based action visibility
 *    - Context-aware permissions
 *    - Disabled states for system users
 * 
 * ✅ Advanced Actions
 *    - Activate/deactivate workflows
 *    - Password reset with email option
 *    - Conditional visibility and disabled states
 * 
 * ✅ Export Functionality
 *    - CSV, Excel, and JSON export
 *    - Field selection
 *    - Custom formatters
 * 
 * ✅ State Management
 *    - Automatic caching
 *    - Optimistic updates
 *    - Real-time sync
 */
