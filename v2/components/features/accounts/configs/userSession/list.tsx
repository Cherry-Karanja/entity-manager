// ===== USER SESSION LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'
import { UserSession } from '../../types'

// ===== USER SESSION LIST COLUMNS =====

export const userSessionListColumns: EntityListColumn[] = [
  // ===== BASIC INFO =====
  {
    id: 'user',
    header: 'User',
    accessorKey: 'user',
    cell: (value: unknown) => {
      if (typeof value === 'object' && value && 'email' in value) {
        return (value as { email: string }).email
      }
      return String(value || 'Unknown')
    },
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    id: 'ip_address',
    header: 'IP Address',
    accessorKey: 'ip_address',
    cell: (value: unknown) => String(value || 'N/A'),
    sortable: true,
    filterable: true,
    width: 140
  },
  {
    id: 'device_type',
    header: 'Device',
    accessorKey: 'device_type',
    cell: (value: unknown) => String(value || 'Unknown'),
    sortable: true,
    filterable: true,
    width: 120
  },
  {
    id: 'browser',
    header: 'Browser',
    accessorKey: 'browser',
    cell: (value: unknown) => String(value || 'Unknown'),
    sortable: true,
    filterable: true,
    width: 120
  },

  // ===== STATUS =====
  {
    id: 'is_active',
    header: 'Status',
    accessorKey: 'is_active',
    cell: (value: unknown) => {
      return value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      )
    },
    sortable: true,
    filterable: true,
    width: 100
  },

  // ===== TIMING =====
  {
    id: 'last_activity',
    header: 'Last Activity',
    accessorKey: 'last_activity',
    cell: (value: unknown) => {
      if (value) {
        return new Date(String(value)).toLocaleString()
      }
      return 'No activity'
    },
    sortable: true,
    filterable: true,
    width: 160
  },
  {
    id: 'expires_at',
    header: 'Expires',
    accessorKey: 'expires_at',
    cell: (value: unknown, item: any) => {
      if (!value) return <span className="text-gray-500">Never</span>

      const date = new Date(String(value))
      const now = new Date()
      const isExpired = date < now

      return (
        <span className={isExpired ? 'text-red-600' : 'text-gray-900'}>
          {date.toLocaleString()}
        </span>
      )
    },
    sortable: true,
    filterable: true,
    width: 160
  },

  // ===== TIMESTAMPS =====
  {
    id: 'created_at',
    header: 'Created',
    accessorKey: 'created_at',
    cell: (value: unknown) => {
      if (value) {
        return new Date(String(value)).toLocaleDateString()
      }
      return 'Unknown'
    },
    sortable: true,
    filterable: true,
    width: 160
  }
]
