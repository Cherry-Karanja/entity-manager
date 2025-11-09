'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userRoleHistoryEntityConfig from '@/components/features/accounts/configs/userRoleHistory'
import { notFound } from 'next/navigation'

interface UserRoleHistoryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserRoleHistoryDetailPage({ params }: UserRoleHistoryDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role History Details</h1>
          <p className="text-muted-foreground">
            View detailed role change information and audit trail
          </p>
        </div>
      </div>

      <EntityManager
        config={userRoleHistoryEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}