'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userRoleEntityConfig from '@/components/features/accounts/configs/userRole'
import { notFound } from 'next/navigation'

interface UserRoleDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserRoleDetailPage({ params }: UserRoleDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Role Details</h1>
          <p className="text-muted-foreground">
            View and manage user role information and permissions
          </p>
        </div>
      </div>

      <EntityManager
        config={userRoleEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}