'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userSessionEntityConfig from '@/components/features/accounts/configs/userSession'

export default function UserSessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Sessions</h1>
          <p className="text-muted-foreground">
            Monitor active user sessions and security activity
          </p>
        </div>
      </div>

      <EntityManager
        config={userSessionEntityConfig}
        initialMode="list"
      />
    </div>
  )
}