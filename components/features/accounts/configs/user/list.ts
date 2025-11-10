// ===== USER LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'

// ===== USER LIST CONFIGURATION =====

export const userListConfig: {
  columns: EntityListColumn[]
  searchableFields?: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  pageSize?: number
  allowBatchActions?: boolean
  allowExport?: boolean
} = {
  columns: [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      width: 100,
      sortable: true,
      cell: (value: unknown) => {
        const id = value as string
        return id ? id.substring(0, 8) + '...' : ''
      }
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      filterable: true
    },
    {
      id: 'firstName',
      header: 'First Name',
      accessorKey: 'first_name',
      sortable: true
    },
    {
      id: 'lastName',
      header: 'Last Name',
      accessorKey: 'last_name',
      sortable: true
    },
    {
      id: 'fullName',
      header: 'Full Name',
      accessorKey: 'full_name',
      sortable: true
    },
    {
      id: 'roleDisplay',
      header: 'Role',
      accessorKey: 'role_display',
      filterable: true,
      cell: (value: unknown) => String(value || 'No Role')
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      filterable: true,
      cell: (value: unknown) => String(value || 'Not Set')
    },
    {
      id: 'isActive',
      header: 'Active',
      accessorKey: 'is_active',
      cell: (value: unknown) => {
        return value ? '✓' : '✗'
      },
      filterable: true
    },
    {
      id: 'isApproved',
      header: 'Approved',
      accessorKey: 'is_approved',
      cell: (value: unknown) => {
        return value ? '✓' : '✗'
      },
      filterable: true
    },
    {
      id: 'isVerified',
      header: 'Verified',
      accessorKey: 'is_verified',
      cell: (value: unknown) => {
        return value ? '✓' : '✗'
      },
      filterable: true
    },
    {
      id: 'dateJoined',
      header: 'Date Joined',
      accessorKey: 'date_joined',
      cell: (value: unknown) => {
        if (!value) return ''
        return new Date(value as string).toLocaleDateString()
      },
      sortable: true
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      accessorKey: 'last_login',
      cell: (value: unknown) => {
        if (!value) return 'Never'
        return new Date(value as string).toLocaleDateString()
      },
      sortable: true
    }
  ],
  searchableFields: ['email', 'first_name', 'last_name', 'full_name', 'employee_id'],
  defaultSort: { field: 'date_joined', direction: 'desc' },
  pageSize: 10,
  allowBatchActions: true,
  allowExport: true
}