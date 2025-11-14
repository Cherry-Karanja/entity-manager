'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { userRoleEntityConfig } from '@/components/features/accounts/configs'

export default function UserRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and their associated permissions
          </p>
        </div>
      </div>

      <EntityManager
        config={userRoleEntityConfig}
        initialMode="list"
      />
    </div>
  )
}
