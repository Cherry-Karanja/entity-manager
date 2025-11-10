'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import loginAttemptEntityConfig from '@/components/features/accounts/configs/loginAttempt'
import { notFound } from 'next/navigation'

interface LoginAttemptDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LoginAttemptDetailPage({ params }: LoginAttemptDetailPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Login Attempt Details</h1>
          <p className="text-muted-foreground">
            View detailed login attempt information
          </p>
        </div>
      </div>

      <EntityManager
        config={loginAttemptEntityConfig}
        initialMode="view"
        initialData={{ id } as any}
      />
    </div>
  )
}