'use client'

import { EntityOrchestrator } from '@/components/entityManager/manager/orchestrator-v3'
import { userRoleEntityConfig } from '@/components/features/accounts/configs/index-v3'

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

      <EntityOrchestrator
        config={userRoleEntityConfig}
        initialView="list"
      />
    </div>
  )
}