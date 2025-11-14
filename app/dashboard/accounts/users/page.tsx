'use client'

import { EntityOrchestrator } from '@/components/entityManager/manager/orchestrator-v3'
import { userEntityConfig } from '@/components/features/accounts/configs/index-v3'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      <EntityOrchestrator
        config={userEntityConfig}
        initialView="list"
      />
    </div>
  )
}