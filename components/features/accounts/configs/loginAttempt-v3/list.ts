import { EntityListConfig } from '@/components/entityManager/types'
import { LoginAttemptEntity } from './types'

// ===== LOGIN ATTEMPT LIST CONFIGURATION =====

export const listConfig: EntityListConfig<LoginAttemptEntity> = {
  // Column definitions
  columns: [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
      width: 100,
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
      id: 'success',
      header: 'Status',
      accessorKey: 'success',
      sortable: true,
      filterable: true,
      align: 'center',
      width: 100,
      cell: (value) => (value ? '✅ Success' : '❌ Failed'),
    },
    {
      id: 'failureReason',
      header: 'Failure Reason',
      accessorKey: 'failureReason',
      sortable: false,
      cell: (value) => (value as string) || 'N/A',
    },
    {
      id: 'ipAddress',
      header: 'IP Address',
      accessorKey: 'ipAddress',
      sortable: true,
      searchable: true,
    },
    {
      id: 'deviceType',
      header: 'Device',
      accessorKey: 'deviceType',
      sortable: true,
      filterable: true,
      cell: (value) => {
        const deviceMap: Record<string, string> = {
          desktop: '🖥️ Desktop',
          mobile: '📱 Mobile',
          tablet: '📱 Tablet',
          unknown: '❓ Unknown',
        }
        return (deviceMap[value as string] || value) as string
      },
    },
    {
      id: 'browser',
      header: 'Browser',
      accessorKey: 'browser',
      sortable: true,
      searchable: true,
    },
    {
      id: 'createdAt',
      header: 'Attempt Time',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search by email, IP address, or browser...',
  globalSearch: true,
  searchFields: ['email', 'ipAddress', 'deviceType', 'browser'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'success',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'true', label: 'Successful' },
          { value: 'false', label: 'Failed' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'deviceType',
        label: 'Device Type',
        type: 'select',
        options: [
          { value: 'desktop', label: 'Desktop' },
          { value: 'mobile', label: 'Mobile' },
          { value: 'tablet', label: 'Tablet' },
          { value: 'unknown', label: 'Unknown' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'createdAt',
        label: 'Date Range',
        type: 'date',
      },
      operator: 'range',
    },
  ],
  
  // Sort configuration
  sortable: true,
  defaultSort: [{ field: 'createdAt', direction: 'desc' }],
  multiSort: true,
  
  // Pagination configuration
  paginated: true,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} login attempts`,
  },
  serverSidePagination: true,
  
  // Selection configuration
  selection: {
    selectedKeys: [],
    mode: 'multiple',
    preserveSelectedRowKeys: true,
  },
  
  // Row actions (inline actions for each row)
  actions: [],
  actionColumnWidth: 150,
  showActions: false, // Read-only entity, no row actions
  
  // UI configuration
  size: 'middle',
  bordered: false,
  showHeader: true,
  showFooter: true,
  sticky: true,
  
  // Empty state
  emptyText: 'No login attempts found',
  
  // Permissions
  permissions: {
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
}
