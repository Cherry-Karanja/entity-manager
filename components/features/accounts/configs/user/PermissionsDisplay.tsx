// ===== PERMISSIONS DISPLAY COMPONENT =====

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { FieldRendererProps } from '@/components/entityManager/EntityView/components/FieldRenderer'
import { Permission } from '../../types'

export const PermissionsDisplay: React.FC<FieldRendererProps> = ({ value }) => {
  const permissions = value as Permission[] | undefined

  if (!permissions || permissions.length === 0) {
    return <span className="text-muted-foreground">No permissions</span>
  }

  // Group permissions by app_label
  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.app_label]) {
      acc[perm.app_label] = []
    }
    acc[perm.app_label].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([app, perms]) => (
        <div key={app} className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium capitalize text-sm">{app.replace(/_/g, ' ')}</span>
            <Badge variant="secondary" className="text-xs">
              {perms.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {perms.map((perm) => (
              <Badge key={perm.id} variant="outline" className="text-xs" title={perm.name}>
                {perm.codename}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}