// ===== USER PROFILE LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'
import { UserProfile } from '../../types'

// ===== USER PROFILE LIST COLUMNS =====

export const userProfileListColumns: EntityListColumn[] = [
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
    id: 'job_title',
    header: 'Job Title',
    accessorKey: 'job_title',
    cell: (value: unknown) => String(value || 'Not specified'),
    sortable: true,
    filterable: true,
    width: 150
  },
  {
    id: 'department',
    header: 'Department',
    accessorKey: 'department',
    cell: (value: unknown) => String(value || 'Not specified'),
    sortable: true,
    filterable: true,
    width: 150
  },

  // ===== STATUS =====
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (value: unknown) => {
      const statusConfig = {
        pending: { label: 'Pending', variant: 'secondary' },
        approved: { label: 'Approved', variant: 'default' },
        rejected: { label: 'Rejected', variant: 'destructive' },
        suspended: { label: 'Suspended', variant: 'outline' }
      }
      const config = statusConfig[value as keyof typeof statusConfig] || { label: String(value), variant: 'secondary' }

      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
          {config.label}
        </span>
      )
    },
    sortable: true,
    filterable: true,
    width: 120
  },

  // ===== CONTACT =====
  {
    id: 'phone_number',
    header: 'Phone',
    accessorKey: 'phone_number',
    cell: (value: unknown) => String(value || 'Not provided'),
    sortable: false,
    filterable: false,
    width: 130
  },

  // ===== PREFERENCES =====
  {
    id: 'preferred_language',
    header: 'Language',
    accessorKey: 'preferred_language',
    cell: (value: unknown) => {
      const languages = {
        en: 'English',
        sw: 'Swahili',
        fr: 'French'
      }
      return languages[value as keyof typeof languages] || String(value || 'English')
    },
    sortable: true,
    filterable: true,
    width: 100
  },
  {
    id: 'interface_theme',
    header: 'Theme',
    accessorKey: 'interface_theme',
    cell: (value: unknown) => {
      const themes = {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto'
      }
      return themes[value as keyof typeof themes] || String(value || 'Light')
    },
    sortable: true,
    filterable: true,
    width: 100
  },

  // ===== APPROVAL =====
  {
    id: 'approved',
    header: 'Approved',
    accessorKey: 'approved_at',
    cell: (value: unknown) => {
      return value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Pending
        </span>
      )
    },
    sortable: true,
    filterable: false,
    width: 150
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
    filterable: false,
    width: 150
  },
  {
    id: 'updated_at',
    header: 'Updated',
    accessorKey: 'updated_at',
    cell: (value: unknown) => {
      if (value) {
        return new Date(String(value)).toLocaleDateString()
      }
      return 'Unknown'
    },
    sortable: true,
    filterable: false,
    width: 150
  }
]

export const userProfileListConfig = {
  columns: userProfileListColumns,
  defaultSort: { key: 'created_at', direction: 'desc' as const },
  defaultFilters: {},
  pageSize: 20,
  searchable: true,
  searchFields: ['user', 'job_title', 'department', 'bio']
}
