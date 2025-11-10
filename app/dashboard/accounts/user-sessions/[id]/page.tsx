'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userSessionEntityConfig from '@/components/features/accounts/configs/userSession'
import { notFound } from 'next/navigation'

interface UserSessionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserSessionDetailPage({ params }: UserSessionDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Session Details</h1>
          <p className="text-muted-foreground">
            View detailed session information and activity
          </p>
        </div>
      </div>

      <EntityManager
        config={userSessionEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}