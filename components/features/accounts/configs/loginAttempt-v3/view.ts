import { EntityViewConfig } from '@/components/entityManager/types'
import { LoginAttemptEntity } from './types'

// ===== LOGIN ATTEMPT VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<LoginAttemptEntity> = {
  // View mode and layout
  mode: 'detail',
  layout: 'single',
  theme: 'default',
  
  // Display options
  showHeader: true,
  showActions: true,
  showMetadata: true,
  showNavigation: false,
  compact: false,
  
  // Field groups for organized display
  fieldGroups: [
    {
      id: 'attempt-info',
      title: 'Attempt Information',
      description: 'Login attempt details',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          copyable: true,
        },
        {
          key: 'user',
          label: 'User',
          type: 'text',
        },
        {
          key: 'success',
          label: 'Status',
          type: 'badge',
          format: (value) => (value ? '✅ Success' : '❌ Failed'),
        },
        {
          key: 'failureReason',
          label: 'Failure Reason',
          type: 'text',
          format: (value) => (value as string) || 'N/A',
        },
        {
          key: 'sessionId',
          label: 'Session ID',
          type: 'text',
          copyable: true,
        },
        {
          key: 'createdAt',
          label: 'Attempt Time',
          type: 'date',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
      ],
    },
    {
      id: 'network-info',
      title: 'Network Information',
      description: 'IP address and location details',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'ipAddress',
          label: 'IP Address',
          type: 'text',
          copyable: true,
        },
        {
          key: 'locationInfo',
          label: 'Location',
          type: 'json',
          format: (value) => {
            if (!value) return 'N/A'
            if (typeof value === 'object') {
              return JSON.stringify(value, null, 2)
            }
            return value as string
          },
        },
      ],
    },
    {
      id: 'device-info',
      title: 'Device & Browser Information',
      description: 'Client device and browser details',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'deviceType',
          label: 'Device Type',
          type: 'badge',
          format: (value) => {
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
          key: 'deviceOs',
          label: 'Operating System',
          type: 'text',
        },
        {
          key: 'browser',
          label: 'Browser',
          type: 'text',
        },
        {
          key: 'userAgent',
          label: 'User Agent',
          type: 'text',
          copyable: true,
        },
      ],
    },
  ],
  
  // Permissions
  permissions: {
    view: true,
    edit: false,
    delete: false,
    navigate: false,
  },
  
  // Styling
  fieldSpacing: 'md',
  borderRadius: 'md',
  shadow: 'sm',
}
