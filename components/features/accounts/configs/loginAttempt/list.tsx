// ===== LOGIN ATTEMPT LIST CONFIGURATION =====

import { EntityListColumn } from '@/components/entityManager/EntityList/types'
import { LoginAttempt } from '../../types'

export const loginAttemptListColumns: EntityListColumn[] = [
  {
    id: 'email',
    header: 'Email',
    cell: (value: unknown, item: any) => (
      <div className="font-medium text-gray-900">
        {item.email}
      </div>
    ),
    sortable: true
  },
  {
    id: 'success',
    header: 'Status',
    cell: (value: unknown, item: any) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        item.success
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {item.success ? 'Success' : 'Failed'}
      </span>
    ),
    sortable: true
  },
  {
    id: 'failure_reason',
    header: 'Failure Reason',
    cell: (value: unknown, item: any) => (
      <div className="text-sm text-gray-600 max-w-xs truncate">
        {item.failure_reason || '-'}
      </div>
    ),
    sortable: false
  },
  {
    id: 'ip_address',
    header: 'IP Address',
    cell: (value: unknown, item: any) => (
      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
        {item.ip_address}
      </code>
    ),
    sortable: true
  },
  {
    id: 'device_type',
    header: 'Device',
    cell: (value: unknown, item: any) => (
      <div className="text-sm">
        <div className="font-medium capitalize">{item.device_type}</div>
        <div className="text-gray-500 text-xs">{item.browser} • {item.device_os}</div>
      </div>
    ),
    sortable: true
  },
  {
    id: 'created_at',
    header: 'Attempt Time',
    cell: (value: unknown, item: any) => (
      <div className="text-sm text-gray-600">
        {new Date(item.created_at).toLocaleString()}
      </div>
    ),
    sortable: true
  }
]