import { EntityListConfig } from '@/components/entityManager/types'
import { UserProfileEntity } from './types'

// ===== USER PROFILE LIST CONFIGURATION =====

export const listConfig: EntityListConfig<UserProfileEntity> = {
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
    },
    {
      id: 'job_title',
      header: 'Job Title',
      accessorKey: 'job_title',
      sortable: true,
      searchable: true,
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
      searchable: true,
      filterable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      align: 'center',
      width: 120,
      cell: (value) => {
        const statusMap: Record<string, string> = {
          pending: '⏳ Pending',
          approved: '✅ Approved',
          rejected: '❌ Rejected',
          suspended: '🚫 Suspended',
        }
        return statusMap[value as string] || value
      },
    },
    {
      id: 'preferred_language',
      header: 'Language',
      accessorKey: 'preferred_language',
      sortable: true,
      filterable: true,
      width: 100,
      cell: (value) => {
        const langMap: Record<string, string> = {
          en: '🇬🇧 EN',
          es: '🇪🇸 ES',
          fr: '🇫🇷 FR',
          de: '🇩🇪 DE',
          sw: '🇰🇪 SW',
        }
        return langMap[value as string] || value
      },
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      sortable: true,
      cell: (value) => value ? new Date(value as string).toLocaleDateString() : 'N/A',
    },
  ],
  
  // Search configuration
  searchable: true,
  searchPlaceholder: 'Search profiles by user, job title, or department...',
  globalSearch: true,
  searchFields: ['user', 'job_title', 'department', 'bio'],
  
  // Filter configuration
  filters: [
    {
      field: {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending Approval' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'suspended', label: 'Suspended' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'department',
        label: 'Department',
        type: 'text',
      },
      operator: 'contains',
    },
    {
      field: {
        name: 'preferred_language',
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'sw', label: 'Swahili' },
        ],
      },
      operator: 'exact',
    },
    {
      field: {
        name: 'allow_notifications',
        label: 'Notifications',
        type: 'select',
        options: [
          { value: 'true', label: 'Enabled' },
          { value: 'false', label: 'Disabled' },
        ],
      },
      operator: 'exact',
    },
  ],
  
  // Sorting
  defaultSort: {
    field: 'created_at',
    direction: 'desc',
  },
  
  // Pagination
  pagination: {
    enabled: true,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showPageInfo: true,
    showPageSizeSelector: true,
  },
  
  // Row actions
  enableRowActions: true,
  rowActionsPosition: 'end',
  
  // Selection
  enableSelection: true,
  enableBulkActions: true,
  
  // UI
  density: 'comfortable',
  striped: true,
  hoverable: true,
  bordered: false,
  
  // Features
  enableExport: true,
  enableColumnVisibility: true,
  enableColumnResize: true,
  enableColumnReorder: false,
}
