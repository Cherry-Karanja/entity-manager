/**
 * Basic Example - Simple Entity Manager Setup
 * 
 * This example demonstrates the simplest way to set up an entity manager
 * for a User entity with minimal configuration.
 */

import React from 'react';
import { EntityManager, EntityConfigBuilder } from '@/components/new/entityManager';

// 1. Define your entity type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: Date;
}

// 2. Create basic configuration
const userConfig = new EntityConfigBuilder<User>('user')
  .setLabel('User', 'Users')
  .setIcon('user')
  
  // List view columns
  .addColumn('name', 'Name', { sortable: true })
  .addColumn('email', 'Email', { sortable: true })
  .addColumn('role', 'Role', { filterable: true })
  .addColumn('active', 'Active', {
    render: (value) => (
      <span className={`badge ${value ? 'badge-success' : 'badge-secondary'}`}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  })
  
  // Form fields
  .addField('name', 'text', 'Name', {
    required: true,
    placeholder: 'Enter full name'
  })
  .addField('email', 'email', 'Email', {
    required: true,
    validation: [{ type: 'email', message: 'Invalid email address' }]
  })
  .addField('role', 'select', 'Role', {
    options: [
      { label: 'Administrator', value: 'admin' },
      { label: 'User', value: 'user' }
    ],
    defaultValue: 'user'
  })
  .addField('active', 'checkbox', 'Active', {
    description: 'Enable user account',
    defaultValue: true
  })
  
  // Basic actions
  .addAction('edit', 'Edit', 'immediate', {
    icon: 'edit',
    onClick: (user) => console.log('Edit user:', user)
  })
  .addAction('delete', 'Delete', 'confirm', {
    icon: 'delete',
    variant: 'danger',
    confirm: {
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    },
    onClick: async (user) => {
      console.log('Delete user:', user);
      // Handle deletion here
    }
  })
  
  // Enable features
  .enableSearch()
  .enableFilters()
  .enableSort()
  .enablePagination({ pageSize: 25 })
  
  .build();

// 3. Use the EntityManager component
export default function BasicExample() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600 mt-2">
          Basic example showing simple entity manager setup
        </p>
      </div>
      
      <EntityManager config={userConfig} />
    </div>
  );
}

/**
 * What you get with this basic setup:
 * 
 * ✅ List View
 *    - Sortable columns (name, email)
 *    - Filterable role column
 *    - Search across all fields
 *    - Pagination (25 items per page)
 *    - Custom badge rendering for active status
 * 
 * ✅ Create/Edit Forms
 *    - Name field (required, text input)
 *    - Email field (required, with email validation)
 *    - Role selector (dropdown with admin/user options)
 *    - Active checkbox (enabled by default)
 * 
 * ✅ Detail View
 *    - Shows all user information
 *    - Formatted dates
 * 
 * ✅ Actions
 *    - Edit button (immediate action)
 *    - Delete button (with confirmation dialog)
 * 
 * Next Steps:
 * - See AdvancedExample.tsx for API integration
 * - See StandaloneComponents.tsx for using components individually
 * - See CustomLayout.tsx for custom orchestrator layouts
 */
