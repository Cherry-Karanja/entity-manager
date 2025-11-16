'use client'
import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { permissionEntityConfig } from '@/components/features/accounts/configs'
import { Permission, PermissionFormData } from '@/components/features/accounts/types'

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground">
            Manage system permissions and access controls
          </p>
        </div>
      </div>
      <EntityManager<Permission, PermissionFormData> config={permissionEntityConfig} />
    </div>
  )
}