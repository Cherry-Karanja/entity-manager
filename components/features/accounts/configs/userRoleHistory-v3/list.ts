import { EntityListConfig } from '@/components/entityManager/types'
import { UserRoleHistoryEntity } from './types'

// ===== USER ROLE HISTORY LIST CONFIGURATION =====

export const listConfig: EntityListConfig<UserRoleHistoryEntity> = {
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
      id: 'user',
      header: 'User',
      accessorKey: 'user',
      sortable: true,
      searchable: true,
      cell: (value) => {
        return `👤 ${value}`
      },
    },
    {
      id: 'old_role',
      header: 'From Role',
      accessorKey: 'old_role',
      sortable: true,
      filterable: true,
      cell: (value) => (value ? String(value) : '➖ None'),
    },
    {
      id: 'new_role',
      header: 'To Role',
      accessorKey: 'new_role',
      sortable: true,
      filterable: true,
      cell: (value) => (value ? `✨ ${value}` : '➖ None'),
    },
    {
      id: 'changed_by',
      header: 'Changed By',
      accessorKey: 'changed_by',
      sortable: true,
      searchable: true,
      cell: (value) => (value ? String(value) : '🤖 System'),
    },
    {
      id: 'reason',
      header: 'Reason',
      accessorKey: 'reason',
      searchable: true,
      cell: (value) => {
        const reason = String(value || '')
        return reason.length > 50 ? `${reason.substring(0, 50)}...` : reason
      },
    },
    {
      id: 'created_at',
      header: 'Change Date',
      accessorKey: 'created_at',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleDateString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search role history by user or reason...',
  globalSearch: true,
  searchFields: ['user', 'changed_by', 'reason'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'old_role',
        label: 'Previous Role',
        type: 'text',
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'new_role',
        label: 'New Role',
        type: 'text',
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'changed_by',
        label: 'Changed By',
        type: 'text',
      },
      operator: 'contains',
    },
    {
      field: {
        name: 'created_at',
        label: 'Change Date',
        type: 'date',
      },
      operator: 'gte',
    },
  ],
  
  // Sort configuration
  sortable: true,
  defaultSort: [{ field: 'created_at', direction: 'desc' }],
  multiSort: true,
  
  // Pagination configuration
  paginated: true,
  pagination: {
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
    pageSizeOptions: [10, 25, 50, 100],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
  },
  serverSidePagination: true,
  
  // Selection configuration (for export only, not for bulk operations since read-only)
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
      onClick: (record) => {
        console.log('View role history:', record)
      },
    },
  ],
  actionColumnWidth: 100,
  showActions: true,
  
  // UI configuration
  size: 'middle',
  bordered: true,
  showHeader: true,
  showFooter: true,
  sticky: true,
  
  // Empty state
  emptyText: 'No role change records found',
  
  // Permissions
  permissions: {
    view: true,
    create: false,  // Read-only
    edit: false,    // Read-only
    delete: false,  // Read-only
    export: true,
  },
}
