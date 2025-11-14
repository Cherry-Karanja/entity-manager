'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { userEntityConfig } from '@/components/features/accounts/configs'

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

      <EntityManager
        config={userEntityConfig}
        initialMode="list"
      />
    </div>
  )
}
