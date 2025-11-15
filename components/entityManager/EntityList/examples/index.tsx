'use client'

import React, { useEffect, useState } from 'react'
import { EntityList } from '../index'
import { EntityListConfig, EntityListItem, EntityListSort } from '../types'
import { Eye, Edit, Trash2, CheckCircle, Users, Mail, Shield, Activity, MessageSquare, Phone, MapPin, Calendar, Star, AlertTriangle } from 'lucide-react'
import EntityTableView from '../views/EntityTableView'
import EntityCardView from '../views/EntityCardView'
import EntityListView from '../views/EntityListView'
import EntityCompactView from '../views/EntityCompactView'
import EntityGridView from '../views/EntityGridView'
import EntityTimelineView from '../views/EntityTimelineView'
import EntityDetailedListView from '../views/EntityDetailedListView'
import EntityGalleryView from '../views/EntityGalleryView'


// Custom Modal Components
const UserDetailsModal: React.FC<{ item: unknown; onClose: () => void }> = ({ item, onClose }) => {
  const userItem = item as EntityListItem
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
          <p className="text-sm">{String(userItem.name || '')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="text-sm">{String(userItem.email || '')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Role</label>
          <p className="text-sm">{String(userItem.role || '')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <p className="text-sm">{String(userItem.status || '')}</p>
        </div>
      </div>
    </div>
  )
}

// Edit User Modal Component
const EditUserModal: React.FC<{ item: unknown; onClose: () => void }> = ({ item, onClose }) => {
  const userItem = item as EntityListItem
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="modal-edit-name">Name</label>
        <input
          id="modal-edit-name"
          type="text"
          defaultValue={String(userItem.name || '')}
          placeholder="Enter user name"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="modal-edit-email">Email</label>
        <input
          id="modal-edit-email"
          type="email"
          defaultValue={String(userItem.email || '')}
          placeholder="Enter email address"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="modal-edit-role">Role</label>
        <select
          id="modal-edit-role"
          defaultValue={String(userItem.role || '')}
          className="w-full mt-1 px-3 py-2 border rounded-md"
        >
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="flex gap-2 pt-4 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log('Saving user:', userItem)
            onClose()
          }}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

// Sample data
const sampleUsers: EntityListItem[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', createdAt: '2024-01-25' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'active', createdAt: '2024-02-01' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'pending', createdAt: '2024-02-05' },
]

// Configuration
const userListConfig: EntityListConfig = {
  title: 'User Management',
  description: 'Manage system users and their permissions',
  data: sampleUsers,
  columns: [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      helpText: 'User\'s full display name',
      tooltip: 'Click to sort by name'
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      searchable: true,
      helpText: 'Primary email address',
      tooltip: 'User\'s registered email'
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      sortable: false,
      filterable: true,
      helpText: 'User role and permissions',
      tooltip: 'Determines system access level'
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: false,
      filterable: true,
      helpText: 'Current account status',
      tooltip: 'Active, Inactive, or Pending',
      cell: (value) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        )
      }
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      sortable: true,
      helpText: 'Account creation date',
      tooltip: 'When the user was registered'
    }
  ],
  views: [
    { id: 'table', name: 'Table', component: EntityTableView },
    { id: 'card', name: 'Cards', component: EntityCardView },
    { id: 'list', name: 'List', component: EntityListView },
    { id: 'compact', name: 'Compact', component: EntityCompactView },
    { id: 'grid', name: 'Grid', component: EntityGridView },
    { id: 'timeline', name: 'Timeline', component: EntityTimelineView },
    { id: 'detailed', name: 'Detailed', component: EntityDetailedListView },
    { id: 'gallery', name: 'Gallery', component: EntityGalleryView }
  ],
  searchable: true,
  searchPlaceholder: 'Search users...',
  globalSearch: true,
  filters: [
    {
      icon: Users,
      placeholder:' Search by name...',
      field: {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Search by name...',
        icon: Users,
        helpText: 'Filter users by their display name'
      },
      operator: 'icontains',
      tooltip: 'users name'
    },
    {
      icon: Mail,
      field: {
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Search by email...',
        icon: Mail,
        helpText: 'Filter users by email address'
      }
    },
    {
      icon: Shield,
      field: {
        name: 'role',
        label: 'Role',
        type: 'select',
        icon: Shield,
        placeholder: 'Select a role',
        helpText: 'Filter by user role in the system',
        options: [
          { value: 'Admin', label: 'Admin' },
          { value: 'Moderator', label: 'Moderator' },
          { value: 'User', label: 'User' }
        ]
      }
    },
    {
      icon: Activity,
      field: {
        name: 'status',
        label: 'Account Status',
        type: 'multiselect',
        icon: Activity,
        helpText: 'Select one or more account statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending Approval' }
        ]
      }
    },
    {
      icon: Calendar,
      field: {
        name: 'createdAt',
        label: 'Created Date',
        type: 'date',
        helpText: 'Filter by account creation date range'
      }
    }
  ],
  filterLayout: 'inline',
  collapsibleFilters: true,
  defaultFiltersCollapsed: true,
  sortable: true,
  defaultSort: [{ field: 'createdAt', direction: 'desc' }],
  paginated: true,
  pagination: {
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
  },
  selection: {
    mode: 'multiple',
    selectedKeys: [],
    onChange: (keys, items) => console.log('Selection changed:', keys, items)
  },
  showActions: true,
  entityActions: {
    actions: [
      {
        id: 'view-details',
        label: 'View Details',
        description: 'View complete user information',
        icon: Eye,
        type: 'primary',
        actionType: 'modal',
        modal: {
          title: (item) => `User Details - ${(item as EntityListItem).name}`,
          content: UserDetailsModal,
          width: 600
        }
      },
      {
        id: 'edit-user',
        label: 'Edit User',
        description: 'Modify user information',
        icon: Edit,
        type: 'default',
        actionType: 'modal',
        modal: {
          title: (item) => `Edit User - ${(item as EntityListItem).name}`,
          content: EditUserModal,
          width: 500
        }
      },
      {
        id: 'send-message',
        label: 'Send Message',
        description: 'Send a message to this user',
        icon: MessageSquare,
        type: 'default',
        actionType: 'form',
        form: {
          title: 'Send Message',
          fields: [
            {
              key: 'subject',
              label: 'Subject',
              type: 'string',
              required: true,
              placeholder: 'Enter message subject'
            },
            {
              key: 'message',
              label: 'Message',
              type: 'textarea',
              required: true,
              placeholder: 'Enter your message'
            }
          ],
          submitText: 'Send Message',
          onSubmit: async (values, item) => {
            console.log('Sending message to user:', item, 'Message:', values)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      },
      {
        id: 'call-user',
        label: 'Call User',
        description: 'Initiate a phone call',
        icon: Phone,
        type: 'default',
        actionType: 'immediate',
        onExecute: (item) => {
          console.log('Calling user:', item)
          alert(`Calling ${(item as EntityListItem).name}...`)
        }
      },
      {
        id: 'view-location',
        label: 'View Location',
        description: 'Show user location on map',
        icon: MapPin,
        type: 'default',
        actionType: 'navigation',
        href: (item) => `https://maps.google.com/?q=${encodeURIComponent(String((item as EntityListItem).name || ''))}`,
        target: '_blank'
      },
      {
        id: 'schedule-meeting',
        label: 'Schedule Meeting',
        description: 'Schedule a meeting with this user',
        icon: Calendar,
        type: 'default',
        actionType: 'form',
        form: {
          title: 'Schedule Meeting',
          fields: [
            {
              key: 'title',
              label: 'Meeting Title',
              type: 'string',
              required: true,
              placeholder: 'Enter meeting title'
            },
            {
              key: 'date',
              label: 'Date & Time',
              type: 'date',
              required: true
            },
            {
              key: 'duration',
              label: 'Duration (minutes)',
              type: 'number',
              required: true,
              defaultValue: 30
            }
          ],
          submitText: 'Schedule Meeting',
          onSubmit: async (values, item) => {
            console.log('Scheduling meeting with user:', item, 'Details:', values)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      },
      {
        id: 'toggle-favorite',
        label: 'Toggle Favorite',
        description: 'Mark user as favorite',
        icon: Star,
        type: 'default',
        actionType: 'immediate',
        onExecute: (item) => {
          console.log('Toggling favorite for user:', item)
        }
      },
      {
        id: 'report-issue',
        label: 'Report Issue',
        description: 'Report an issue with this user',
        icon: AlertTriangle,
        type: 'default',
        actionType: 'confirm',
        confirm: {
          title: 'Report Issue',
          content: 'Are you sure you want to report an issue with this user?',
          okText: 'Report',
          cancelText: 'Cancel',
          okType: 'danger'
        },
        onExecute: (item) => {
          console.log('Reporting issue for user:', item)
        }
      },
      {
        id: 'delete-user',
        label: 'Delete User',
        description: 'Permanently delete this user',
        icon: Trash2,
        type: 'default',
        danger: true,
        actionType: 'confirm',
        confirm: {
          title: 'Delete User',
          content: (item) => `Are you sure you want to delete ${(item as EntityListItem).name}? This action cannot be undone.`,
          okText: 'Delete',
          cancelText: 'Cancel',
          okType: 'danger'
        },
        onExecute: (item) => {
          console.log('Deleting user:', item)
        }
      }
    ],
    bulkActions: [
      {
        id: 'bulk-message',
        label: 'Send Bulk Message',
        description: 'Send message to selected users',
        icon: MessageSquare,
        type: 'default',
        actionType: 'immediate',
        minSelection: 1,
        onExecute: (items: unknown[]) => {
          console.log('Sending bulk message to users:', items)
          alert(`Sending message to ${items.length} users...`)
        }
      },
      {
        id: 'bulk-activate',
        label: 'Activate Users',
        description: 'Activate selected user accounts',
        icon: CheckCircle,
        type: 'default',
        minSelection: 1,
        actionType: 'confirm',
        confirm: {
          title: (count: number) => `Activate ${count} Users`,
          content: (selectedItems: unknown[]) => `Are you sure you want to activate ${selectedItems.length} user accounts?`,
          okText: 'Activate',
          cancelText: 'Cancel'
        },
        onExecute: (items: unknown[]) => {
          console.log('Activating users:', items)
        }
      },
      {
        id: 'bulk-delete',
        label: 'Delete Users',
        description: 'Delete selected users',
        icon: Trash2,
        type: 'default',
        danger: true,
        minSelection: 1,
        actionType: 'confirm',
        confirm: {
          title: (count: number) => `Delete ${count} Users`,
          content: (selectedItems: unknown[]) => `Are you sure you want to delete ${selectedItems.length} users? This action cannot be undone.`,
          okText: 'Delete',
          cancelText: 'Cancel',
          okType: 'danger'
        },
        onExecute: (items: unknown[]) => {
          console.log('Bulk deleting users:', items)
        }
      }
    ],
    maxVisibleActions: 3,
    showLabels: true
  },
  export: {
    enabled: true,
    formats: ['csv', 'xlsx', 'json'],
    filename: 'users'
  },
  permissions: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    export: true
  },
  onCreate: () => console.log('Create new user'),
  onRefresh: () => console.log('Refresh users')
}

export const BasicEntityListExample: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({})
  const [sortConfig, setSortConfig] = useState<EntityListSort[]>([{ field: 'createdAt', direction: 'desc' }])

  // Validation: Only configured fields can be searched, filtered, or sorted
  // Search: Only searches fields marked as searchable (name, email by default)
  // Filters: Only allows filtering on role and status fields as configured
  // Sort: Only allows sorting on fields marked as sortable (name, email, role, status, createdAt)
  useEffect(() => {
    console.log('Search term changed:', searchTerm)
  }, [searchTerm])

  useEffect(() => {
    console.log('Active filters changed:', activeFilters)
  }, [activeFilters])

  useEffect(() => {
    console.log('Sort config changed:', sortConfig)
  }, [sortConfig])

  useEffect(() => {
    console.log('Selected keys',selectedKeys)
  },[selectedKeys])
  return (
    <div className="p-6 space-y-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold mb-2">EntityList Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples showing different configurations and use cases for the EntityList component.
        </p>
      </div>

      <EntityList
        config={{ ...userListConfig, 
          selection:{ 
            selectedKeys: selectedKeys, 
            mode: 'multiple' 
          },
          savedFiltersKey:activeFilters,
          defaultSort: sortConfig
         }}
        searchTerm={searchTerm}
        onSelectionChange={(selectedKeys,selectedItems)=>{
          console.log('Selected Items',selectedItems)
          setSelectedKeys(selectedKeys)
        }}
        onSearch={(term) => {
          console.log('Search term validated and set:', term)
          setSearchTerm(term)
        }}
        onFilter={(filters) => {
          console.log('Filters validated and set:', filters)
          setActiveFilters(filters)
        }}
        onSort={(sort) => {
          console.log('Sort config validated and set:', sort)
          setSortConfig(sort)
        }}
        onExport={(format) => console.log(`Export as ${format}`)}
      />
    </div>
  )
}

export const MinimalEntityListExample: React.FC = () => {
  const minimalConfig: EntityListConfig = {
    data: sampleUsers,
    columns: [
      { id: 'name', header: 'Name', accessorKey: 'name' },
      { id: 'email', header: 'Email', accessorKey: 'email' },
      { id: 'role', header: 'Role', accessorKey: 'role' }
    ],
    searchable: true
  }

  return (
    <div className="p-6 bg-transparent">
      <h2 className="text-xl font-semibold mb-4">Minimal Configuration</h2>
      <EntityList config={minimalConfig} />
    </div>
  )
}

export const AdvancedEntityListExample: React.FC = () => {
  const advancedConfig: EntityListConfig = {
    ...userListConfig,
    title: 'Advanced User Management'
  }

  return (
    <div className="p-6 bg-transparent">
      <h2 className="text-xl font-semibold mb-4">Advanced Configuration</h2>
      <EntityList config={advancedConfig} />
    </div>
  )
}