import { EntityListConfig } from '@/components/entityManager/types'
import { UserEntity } from './types'

// ===== USER LIST CONFIGURATION =====

export const listConfig: EntityListConfig<UserEntity> = {
  // Column definitions
  columns: [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
      width: 80,
      align: 'center',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      searchable: true,
    },
    {
      id: 'firstName',
      header: 'First Name',
      accessorKey: 'firstName',
      sortable: true,
      searchable: true,
    },
    {
      id: 'lastName',
      header: 'Last Name',
      accessorKey: 'lastName',
      sortable: true,
      searchable: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      filterable: true,
      cell: (value) => {
        const roleMap: Record<string, string> = {
          admin: '👑 Admin',
          user: '👤 User',
          guest: '🎭 Guest',
          moderator: '⚖️ Moderator',
        }
        return roleMap[value as string] || value
      },
    },
    {
      id: 'isActive',
      header: 'Status',
      accessorKey: 'isActive',
      sortable: true,
      filterable: true,
      align: 'center',
      width: 100,
      cell: (value) => (value ? '✅ Active' : '❌ Inactive'),
    },
    {
      id: 'dateJoined',
      header: 'Date Joined',
      accessorKey: 'dateJoined',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleDateString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search users by name or email...',
  globalSearch: true,
  searchFields: ['email', 'firstName', 'lastName', 'username'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'admin', label: 'Administrator' },
          { value: 'user', label: 'User' },
          { value: 'guest', label: 'Guest' },
          { value: 'moderator', label: 'Moderator' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'isActive',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'dateJoined',
        label: 'Joined After',
        type: 'date',
      },
      operator: 'gte',
    },
  ],
  filterLayout: 'inline',
  showFilterReset: true,
  collapsibleFilters: true,
  defaultFiltersCollapsed: false,
  
  // Sort configuration
  sortable: true,
  defaultSort: [{ field: 'email', direction: 'asc' }],
  multiSort: true,
  
  // Pagination configuration
  paginated: true,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    pageSizeOptions: [10, 25, 50, 100],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
  },
  serverSidePagination: true,
  
  // Selection configuration
  selection: {
    selectedKeys: [],
    mode: 'multiple',
    preserveSelectedRowKeys: true,
  },
  
  // Row actions (inline actions for each row)
  actions: [
    {
      id: 'view',
      label: 'View',
      type: 'default',
      actionType: 'navigation',
      onExecute: (user) => {
        console.log('View user:', user)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      type: 'default',
      actionType: 'navigation',
      onExecute: (user) => {
        console.log('Edit user:', user)
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      type: 'text',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete User',
        content: (user) => `Are you sure you want to delete ${(user as UserEntity).email}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
      },
      onExecute: async (user) => {
        console.log('Delete user:', user)
      },
    },
  ],
  actionColumnWidth: 150,
  showActions: true,
  
  // UI configuration
  size: 'middle',
  bordered: true,
  showHeader: true,
  showFooter: true,
  sticky: true,
  
  // Empty state
  emptyText: 'No users found',
  
  // Permissions
  permissions: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    export: true,
  },
}
