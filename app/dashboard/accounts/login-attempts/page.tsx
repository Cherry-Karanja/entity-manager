'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { loginAttemptEntityConfig } from '@/components/features/accounts/configs'

export default function LoginAttemptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Login Attempts</h1>
          <p className="text-muted-foreground">
            Monitor login activity and security events
          </p>
        </div>
      </div>

      <EntityManager
        config={loginAttemptEntityConfig}
        initialMode="list"
      />
    </div>
  )
}
