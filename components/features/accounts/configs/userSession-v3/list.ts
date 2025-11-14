import { EntityListConfig } from '@/components/entityManager/types'
import { UserSessionEntity } from './types'

// ===== USER SESSION LIST CONFIGURATION =====

export const listConfig: EntityListConfig<UserSessionEntity> = {
  // Column definitions
  columns: [
    {
      id: 'id',
      header: 'Session ID',
      accessorKey: 'id',
      sortable: true,
      width: 100,
      align: 'center',
    },
    {
      id: 'user',
      header: 'User',
      accessorKey: 'user',
      sortable: true,
      searchable: true,
    },
    {
      id: 'ip_address',
      header: 'IP Address',
      accessorKey: 'ip_address',
      sortable: true,
      searchable: true,
    },
    {
      id: 'device_type',
      header: 'Device',
      accessorKey: 'device_type',
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
    },
    {
      id: 'device_os',
      header: 'OS',
      accessorKey: 'device_os',
      sortable: true,
    },
    {
      id: 'is_active',
      header: 'Status',
      accessorKey: 'is_active',
      sortable: true,
      filterable: true,
      align: 'center',
      width: 100,
      cell: (value) => (value ? '✅ Active' : '❌ Inactive'),
    },
    {
      id: 'last_activity',
      header: 'Last Activity',
      accessorKey: 'last_activity',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
    {
      id: 'expires_at',
      header: 'Expires At',
      accessorKey: 'expires_at',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search sessions by user, IP, or user agent...',
  globalSearch: true,
  searchFields: ['user', 'ip_address', 'user_agent'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'device_type',
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
        name: 'last_activity',
        label: 'Active After',
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
  defaultSort: [{ field: 'last_activity', direction: 'desc' }],
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
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sessions`,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (session: any) => {
        console.log('View session:', session)
      },
    },
    {
      id: 'terminate',
      label: 'Terminate',
      type: 'text',
      danger: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      condition: (session: any) => session.is_active,
      confirm: {
        title: 'Terminate Session',
        content: 'Are you sure you want to terminate this session? The user will be logged out immediately.',
        okText: 'Terminate',
        okType: 'danger',
        cancelText: 'Cancel',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: async (session: any) => {
        console.log('Terminate session:', session)
      },
    },
    {
      id: 'view_user',
      label: 'View User',
      type: 'default',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (session: any) => {
        console.log('View user:', session.user)
      },
    },
  ],
  actionColumnWidth: 180,
  showActions: true,
  
  // UI configuration
  size: 'middle',
  bordered: true,
  showHeader: true,
  showFooter: true,
  sticky: true,
  
  // Empty state
  emptyText: 'No sessions found',
  
  // Permissions
  permissions: {
    view: true,
    create: false, // Read-only entity
    edit: false, // Read-only entity
    delete: true, // Can terminate/revoke sessions
    export: true,
  },
}
