// ===== PERMISSION VIEW CONFIGURATION =====

import { ViewField } from '@/components/entityManager/EntityView/types'

export const permissionViewConfig: {
  title: string
  description?: string
  layout?: 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'
  columns?: number
  fieldGroups: {
    id: string
    title: string
    description?: string
    layout?: 'vertical' | 'horizontal' | 'grid'
    columns?: number
    collapsible?: boolean
    collapsed?: boolean
    fields: ViewField[]
  }[]
} = {
  title: 'Permission Details',
  description: 'View permission information and settings',
  layout: 'grid',
  columns: 1,
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Permission identification details',
      layout: 'grid',
      columns: 2,
      collapsible: false,
      collapsed: false,
      fields: [
        { key: 'name', label: 'Permission Name', type: 'text' },
        { key: 'codename', label: 'Codename', type: 'text' },
        { key: 'app_label', label: 'App Label', type: 'text' },
        { key: 'model', label: 'Model', type: 'text' }
      ]
    },
    {
      id: 'metadata',
      title: 'Metadata',
      description: 'Additional permission information',
      layout: 'grid',
      columns: 1,
      collapsible: true,
      collapsed: false,
      fields: [
        { key: 'content_type_name', label: 'Content Type Name', type: 'text' },
        { key: 'id', label: 'Permission ID', type: 'number' }
      ]
    }
  ]
}