import { EntityListConfig } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'

// ===== USER ROLE LIST CONFIGURATION =====

export const listConfig: EntityListConfig<UserRoleEntity> = {
  // Column definitions
  columns: [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
      width: 120,
      align: 'center',
      cell: (value) => {
        const id = value as string
        return id ? id.substring(0, 8) + '...' : ''
      },
    },
    {
      id: 'name',
      header: 'Role Name',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      filterable: true,
    },
    {
      id: 'displayName',
      header: 'Display Name',
      accessorKey: 'display_name',
      sortable: true,
      searchable: true,
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: (value) => {
        const desc = value as string
        return desc && desc.length > 50 ? desc.substring(0, 50) + '...' : desc || ''
      },
    },
    {
      id: 'permissionsCount',
      header: 'Permissions',
      accessorKey: 'permissions_count',
      sortable: true,
      align: 'center',
      width: 120,
      cell: (value) => {
        const count = value as number
        return count || 0
      },
    },
    {
      id: 'usersCount',
      header: 'Users',
      accessorKey: 'users_count',
      sortable: true,
      align: 'center',
      width: 100,
      cell: (value) => {
        const count = value as number
        return count || 0
      },
    },
    {
      id: 'isActive',
      header: 'Status',
      accessorKey: 'is_active',
      sortable: true,
      filterable: true,
      align: 'center',
      width: 100,
      cell: (value) => (value ? '✅ Active' : '❌ Inactive'),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'created_at',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleDateString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search roles by name or description...',
  globalSearch: true,
  searchFields: ['name', 'display_name', 'description'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'is_active',
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
        name: 'created_at',
        label: 'Created After',
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
  defaultSort: [{ field: 'created_at', direction: 'desc' }],
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
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
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
      onExecute: (role) => {
        console.log('View role:', role)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      type: 'default',
      actionType: 'navigation',
      onExecute: (role) => {
        console.log('Edit role:', role)
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      type: 'text',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Role',
        content: (role) => `Are you sure you want to delete ${(role as UserRoleEntity).name}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
      },
      onExecute: async (role) => {
        console.log('Delete role:', role)
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
  emptyText: 'No roles found',
  
  // Permissions
  permissions: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    export: true,
  },
}
