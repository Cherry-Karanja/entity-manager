// ===== USER ROLE HISTORY LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'
import { UserRoleHistory } from '../../types'

// ===== LIST COLUMNS =====

export const userRoleHistoryListColumns: EntityListColumn[] = [
  // ===== USER INFORMATION =====
  {
    id: 'user',
    header: 'User',
    accessorKey: 'user',
    sortable: true,
    cell: (value: unknown) => {
      const user = value as string
      return <div className="font-medium">{user}</div>
    }
  },

  // ===== ROLE CHANGE DETAILS =====
  {
    id: 'old_role',
    header: 'From Role',
    accessorKey: 'old_role',
    sortable: true,
    cell: (value: unknown) => {
      const oldRole = value as string
      return <div className="text-sm text-muted-foreground">{oldRole || 'None'}</div>
    }
  },
  {
    id: 'new_role',
    header: 'To Role',
    accessorKey: 'new_role',
    sortable: true,
    cell: (value: unknown) => {
      const newRole = value as string
      return <div className="text-sm font-medium">{newRole || 'None'}</div>
    }
  },

  // ===== CHANGE INFORMATION =====
  {
    id: 'changed_by',
    header: 'Changed By',
    accessorKey: 'changed_by',
    sortable: true,
    cell: (value: unknown) => {
      const changedBy = value as string
      return <div className="text-sm">{changedBy || 'System'}</div>
    }
  },
  {
    id: 'reason',
    header: 'Reason',
    accessorKey: 'reason',
    cell: (value: unknown) => {
      const reason = value as string
      return <div className="text-sm max-w-xs truncate" title={reason}>{reason}</div>
    }
  },

  // ===== TIMESTAMPS =====
  {
    id: 'created_at',
    header: 'Change Date',
    accessorKey: 'created_at',
    sortable: true,
    cell: (value: unknown) => {
      const createdAt = value as string
      return <div className="text-sm text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</div>
    }
  }
]

// ===== LIST CONFIGURATION =====

export const userRoleHistoryListConfig = {
  columns: userRoleHistoryListColumns,
  defaultSort: {
    field: 'created_at',
    direction: 'desc' as const
  },
  pageSize: 25,
  searchable: true,
  filterable: true,
  exportable: true
}