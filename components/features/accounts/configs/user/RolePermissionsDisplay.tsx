// ===== ROLE PERMISSIONS DISPLAY COMPONENT =====

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { FieldRendererProps } from '@/components/entityManager/EntityView/components/FieldRenderer'

export const RolePermissionsDisplay: React.FC<FieldRendererProps> = ({ value }) => {
  const permissions = value as Record<string, string[]> | undefined

  if (!permissions || Object.keys(permissions).length === 0) {
    return <span className="text-muted-foreground">No permissions</span>
  }

  return (
    <div className="space-y-4">
      {Object.entries(permissions).map(([app, perms]) => (
        <div key={app} className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium capitalize text-sm">{app.replace(/_/g, ' ')}</span>
            <Badge variant="secondary" className="text-xs">
              {perms.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {perms.map((perm, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {perm}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}