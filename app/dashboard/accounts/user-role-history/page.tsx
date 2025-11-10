'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userRoleHistoryEntityConfig from '@/components/features/accounts/configs/userRoleHistory'

export default function UserRoleHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Role History</h1>
          <p className="text-muted-foreground">
            Audit trail of role assignments and changes
          </p>
        </div>
      </div>

      <EntityManager
        config={userRoleHistoryEntityConfig}
        initialMode="list"
      />
    </div>
  )
}