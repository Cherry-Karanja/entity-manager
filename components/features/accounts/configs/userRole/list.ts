// ===== USER ROLE LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'

// ===== USER ROLE LIST CONFIGURATION =====

export const userRoleListConfig: {
  columns: EntityListColumn[]
  searchFields?: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }[]
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
      id: 'name',
      header: 'Role Name',
      accessorKey: 'name',
      sortable: true,
      filterable: true
    },
    {
      id: 'displayName',
      header: 'Display Name',
      accessorKey: 'display_name',
      sortable: true
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: (value: unknown) => {
        const desc = value as string
        return desc && desc.length > 50 ? desc.substring(0, 50) + '...' : desc || ''
      }
    },
    {
      id: 'permissionsCount',
      header: 'Permissions',
      accessorKey: 'permissions_count',
      cell: (value: unknown) => {
        const count = value as number
        return count || 0
      },
      sortable: true
    },
    {
      id: 'usersCount',
      header: 'Users',
      accessorKey: 'users_count',
      cell: (value: unknown) => {
        const count = value as number
        return count || 0
      },
      sortable: true
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
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'created_at',
      cell: (value: unknown) => {
        if (!value) return ''
        return new Date(value as string).toLocaleDateString()
      },
      sortable: true
    }
  ],
  searchFields: ['name', 'display_name', 'description'],
  defaultSort: [{ field: 'created_at', direction: 'desc' }]
}