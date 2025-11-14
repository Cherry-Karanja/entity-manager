'use client'

import { EntityOrchestrator } from '@/components/entityManager/manager/orchestrator-v3'
import { userRoleHistoryEntityConfig } from '@/components/features/accounts/configs/index-v3'

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

      <EntityOrchestrator
        config={userRoleHistoryEntityConfig}
        initialView="list"
      />
    </div>
  )
}