'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userProfileEntityConfig from '@/components/features/accounts/configs/userProfile'
import { notFound } from 'next/navigation'

interface UserProfileDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfileDetailPage({ params }: UserProfileDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile Details</h1>
          <p className="text-muted-foreground">
            View and manage user profile information
          </p>
        </div>
      </div>

      <EntityManager
        config={userProfileEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}