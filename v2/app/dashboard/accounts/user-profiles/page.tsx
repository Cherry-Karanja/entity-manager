'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userProfileEntityConfig from '@/components/features/accounts/configs/userProfile'

export default function UserProfilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profiles</h1>
          <p className="text-muted-foreground">
            Manage user profile information and approval workflows
          </p>
        </div>
      </div>

      <EntityManager
        config={userProfileEntityConfig}
        initialMode="list"
      />
    </div>
  )
}