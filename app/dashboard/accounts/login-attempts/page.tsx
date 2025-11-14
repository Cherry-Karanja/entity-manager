'use client'

import { EntityOrchestrator } from '@/components/entityManager/manager/orchestrator-v3'
import { loginAttemptEntityConfig } from '@/components/features/accounts/configs/index-v3'

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

      <EntityOrchestrator
        config={loginAttemptEntityConfig}
        initialView="list"
      />
    </div>
  )
}