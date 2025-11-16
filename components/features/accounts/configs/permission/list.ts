// ===== PERMISSION LIST CONFIGURATION =====

import { EntityListConfig } from '@/components/entityManager/EntityList/types'
import { Permission } from '../../types'

export const permissionListConfig: EntityListConfig<Permission> = {
  title: 'Permissions',
  description: 'Manage system permissions',
  searchPlaceholder: 'Search permissions...',
  searchable: true,
  defaultSort: [
    {
      field: 'app_label',
      direction: 'asc'
    }
  ],
  columns: [
    {
      id: 'name',
      header: 'Permission Name',
      accessorKey: 'name',
      sortable: true,
      width: '25%'
    },
    {
      id: 'codename',
      header: 'Codename',
      accessorKey: 'codename',
      sortable: true,
      width: '20%'
    },
    {
      id: 'app_label',
      header: 'App',
      accessorKey: 'app_label',
      sortable: true,
      width: '15%'
    },
    {
      id: 'model',
      header: 'Model',
      accessorKey: 'model',
      sortable: true,
      width: '15%'
    },
    {
      id: 'content_type_name',
      header: 'Content Type',
      accessorKey: 'content_type_name',
      sortable: false,
      width: '20%'
    }
  ]
}