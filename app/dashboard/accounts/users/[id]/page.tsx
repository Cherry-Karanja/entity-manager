'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userEntityConfig from '@/components/features/accounts/configs/user'
import { notFound } from 'next/navigation'

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">
            View and manage user account information
          </p>
        </div>
      </div>

      <EntityManager
        config={userEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}