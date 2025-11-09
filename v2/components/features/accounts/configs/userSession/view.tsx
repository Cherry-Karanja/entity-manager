// ===== USER SESSION VIEW CONFIGURATION =====

import { EntityViewConfig } from '@/components/entityManager/EntityView/types'
import { UserSession } from '../../types'

export const userSessionViewConfig: EntityViewConfig = {
  // ===== BASIC CONFIGURATION =====
  mode: 'detail',
  layout: 'single',
  showHeader: true,
  showActions: true,
  showMetadata: true,

  // ===== FIELD GROUPS =====
  fieldGroups: [
    {
      id: 'session_overview',
      title: 'Session Overview',
      description: 'Core session information and status',
      fields: [
        {
          key: 'id',
          label: 'Session ID',
          type: 'text'
        },
        {
          key: 'user',
          label: 'User',
          type: 'text',
          format: (value) => {
            if (typeof value === 'object' && value && 'email' in value) {
              return (value as { email: string }).email
            }
            return String(value || 'Unknown')
          }
        },
        {
          key: 'session_key',
          label: 'Session Key',
          type: 'text'
        },
        {
          key: 'is_active',
          label: 'Status',
          type: 'badge',
          format: (value) => {
            return value ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium">Active Session</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="font-medium">Inactive Session</span>
              </div>
            )
          }
        }
      ],
      layout: 'grid',
      columns: 2
    },
    {
      id: 'device_details',
      title: 'Device & Browser Details',
      description: 'Technical information about the user\'s device and browser',
      fields: [
        {
          key: 'device_type',
          label: 'Device Type',
          type: 'text',
          format: (value) => String(value || 'Unknown').charAt(0).toUpperCase() + String(value || 'Unknown').slice(1)
        },
        {
          key: 'device_os',
          label: 'Operating System',
          type: 'text'
        },
        {
          key: 'browser',
          label: 'Browser',
          type: 'text'
        },
        {
          key: 'user_agent',
          label: 'User Agent',
          type: 'text'
        }
      ],
      layout: 'grid',
      columns: 2
    },
    {
      id: 'network_info',
      title: 'Network Information',
      description: 'IP address and location data',
      fields: [
        {
          key: 'ip_address',
          label: 'IP Address',
          type: 'text'
        },
        {
          key: 'location_info',
          label: 'Location',
          type: 'custom',
          format: (value) => {
            if (!value) return <span className="text-gray-500">No location data</span>

            const location = value as any
            return (
              <div className="space-y-1">
                {location.city && <div>City: {location.city}</div>}
                {location.country && <div>Country: {location.country}</div>}
                {location.region && <div>Region: {location.region}</div>}
                {location.timezone && <div>Timezone: {location.timezone}</div>}
              </div>
            )
          }
        }
      ],
      layout: 'grid',
      columns: 1
    },
    {
      id: 'session_timeline',
      title: 'Session Timeline',
      description: 'Session creation, activity, and expiration details',
      fields: [
        {
          key: 'created_at',
          label: 'Created',
          type: 'datetime'
        },
        {
          key: 'last_activity',
          label: 'Last Activity',
          type: 'custom',
          format: (value) => {
            if (!value) return <span className="text-gray-500">No activity recorded</span>

            const date = new Date(String(value))
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMins = Math.floor(diffMs / (1000 * 60))

            let timeAgo = 'Just now'
            if (diffMins < 60) timeAgo = `${diffMins} minutes ago`
            else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)} hours ago`
            else timeAgo = `${Math.floor(diffMins / 1440)} days ago`

            return (
              <div>
                <div className="font-medium">{date.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            )
          }
        },
        {
          key: 'expires_at',
          label: 'Expires',
          type: 'custom',
          format: (value) => {
            if (!value) return <span className="text-gray-500">Never expires</span>

            const date = new Date(String(value))
            const now = new Date()
            const isExpired = date < now

            return (
              <div className="flex items-center space-x-2">
                <span className={isExpired ? 'text-red-600' : 'text-gray-900'}>
                  {date.toLocaleString()}
                </span>
                {isExpired && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Expired
                  </span>
                )}
              </div>
            )
          }
        }
      ],
      layout: 'grid',
      columns: 3
    }
  ],

  // ===== PERMISSIONS =====
  permissions: {
    view: true,
    edit: false,
    delete: false,
    navigate: true
  }
}
