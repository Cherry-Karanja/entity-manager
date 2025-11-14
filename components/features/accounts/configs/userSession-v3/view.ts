import React from 'react'
import { EntityViewConfig } from '@/components/entityManager/types'
import { UserSessionEntity } from './types'

// ===== USER SESSION VIEW CONFIGURATION =====

export const viewConfig: EntityViewConfig<UserSessionEntity> = {
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
      id: 'session-info',
      title: 'Session Information',
      description: 'Core session details',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'id',
          label: 'Session ID',
          type: 'text',
          copyable: true,
        },
        {
          key: 'user',
          label: 'User',
          type: 'text',
          copyable: true,
        },
        {
          key: 'session_key',
          label: 'Session Key',
          type: 'text',
          copyable: true,
        },
        {
          key: 'is_active',
          label: 'Status',
          type: 'badge',
          format: (value) => (value ? '✅ Active' : '❌ Inactive'),
        },
      ],
    },
    {
      id: 'device-info',
      title: 'Device & Browser Information',
      collapsed: false,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'device_type',
          label: 'Device Type',
          type: 'badge',
          format: (value): React.ReactNode => {
            const deviceMap: Record<string, string> = {
              desktop: '🖥️ Desktop',
              mobile: '📱 Mobile',
              tablet: '📱 Tablet',
              unknown: '❓ Unknown',
            }
            return deviceMap[value as string] || (value as string)
          },
        },
        {
          key: 'device_os',
          label: 'Operating System',
          type: 'text',
        },
        {
          key: 'browser',
          label: 'Browser',
          type: 'text',
        },
        {
          key: 'user_agent',
          label: 'User Agent',
          type: 'text',
        },
      ],
    },
    {
      id: 'network-info',
      title: 'Network Information',
      collapsed: false,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'ip_address',
          label: 'IP Address',
          type: 'text',
          copyable: true,
        },
        {
          key: 'location_info',
          label: 'Location',
          type: 'text',
          format: (value): React.ReactNode => {
            if (!value || typeof value !== 'object') return 'N/A'
            const loc = value as Record<string, string>
            return `${loc.city || 'Unknown'}, ${loc.country || 'Unknown'}` as React.ReactNode
          },
        },
      ],
    },
    {
      id: 'timing-info',
      title: 'Session Timing',
      collapsed: true,
      collapsible: true,
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'created_at',
          label: 'Session Started',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'last_activity',
          label: 'Last Activity',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
        {
          key: 'expires_at',
          label: 'Expires At',
          type: 'datetime',
          format: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
        },
      ],
    },
  ],
  
  // Permissions
  permissions: {
    view: true,
    edit: false, // Read-only entity
    delete: true, // Can terminate session
    navigate: false,
  },
  
  // Styling
  fieldSpacing: 'md',
  borderRadius: 'md',
  shadow: 'sm',
}
