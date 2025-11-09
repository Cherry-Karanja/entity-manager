// ===== LOGIN ATTEMPT VIEW CONFIGURATION =====

import { EntityViewConfig } from '@/components/entityManager/EntityView/types'
import { LoginAttempt } from '../../types'

export const loginAttemptViewConfig: EntityViewConfig = {
  // ===== VIEW SETTINGS =====
  showHeader: true,
  showActions: true,
  showMetadata: true,

  // ===== FIELD GROUPS =====
  fieldGroups: [
    {
      id: 'attempt_overview',
      title: 'Login Attempt Overview',
      description: 'Basic information about the login attempt',
      fields: [
        {
          key: 'id',
          label: 'Attempt ID',
          type: 'text'
        },
        {
          key: 'email',
          label: 'Email Address',
          type: 'text'
        },
        {
          key: 'user',
          label: 'Associated User',
          type: 'text',
          format: (value: unknown) => String(value || 'N/A')
        },
        {
          key: 'success',
          label: 'Login Successful',
          type: 'boolean',
          format: (value: unknown) => value ? 'Yes' : 'No'
        },
        {
          key: 'failure_reason',
          label: 'Failure Reason',
          type: 'text',
          format: (value: unknown) => String(value || 'N/A')
        },
        {
          key: 'session_id',
          label: 'Session Created',
          type: 'text',
          format: (value: unknown) => String(value || 'N/A')
        }
      ],
      layout: 'grid',
      columns: 2
    },
    {
      id: 'device_browser_info',
      title: 'Device & Browser Information',
      description: 'Technical details about the device and browser used',
      fields: [
        {
          key: 'ip_address',
          label: 'IP Address',
          type: 'text'
        },
        {
          key: 'user_agent',
          label: 'User Agent',
          type: 'text',
          format: (value: unknown) => (
            <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre-wrap">
              {String(value)}
            </code>
          )
        },
        {
          key: 'device_type',
          label: 'Device Type',
          type: 'text',
          format: (value: unknown) => String(value).charAt(0).toUpperCase() + String(value).slice(1)
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
        }
      ],
      layout: 'grid',
      columns: 2
    },
    {
      id: 'location_info',
      title: 'Location Information',
      description: 'Geographic location data (if available)',
      fields: [
        {
          key: 'location_info',
          label: 'Location Details',
          type: 'custom',
          format: (value: unknown) => {
            if (!value) return 'No location data available'

            const location = value as any
            return (
              <div className="space-y-2">
                {location.country && (
                  <div><strong>Country:</strong> {location.country}</div>
                )}
                {location.region && (
                  <div><strong>Region:</strong> {location.region}</div>
                )}
                {location.city && (
                  <div><strong>City:</strong> {location.city}</div>
                )}
                {location.timezone && (
                  <div><strong>Timezone:</strong> {location.timezone}</div>
                )}
                {location.coordinates && (
                  <div>
                    <strong>Coordinates:</strong> {location.coordinates.latitude}, {location.coordinates.longitude}
                  </div>
                )}
              </div>
            )
          }
        }
      ],
      layout: 'vertical'
    },
    {
      id: 'timestamps',
      title: 'Timestamps',
      description: 'When the login attempt occurred',
      fields: [
        {
          key: 'created_at',
          label: 'Attempt Time',
          type: 'custom',
          format: (value: unknown) => (
            <div className="space-y-1">
              <div className="text-lg font-mono">
                {new Date(value as string).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(value as string).toISOString()}
              </div>
            </div>
          )
        }
      ],
      layout: 'vertical'
    }
  ]
}