'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import userEntityConfig from '@/components/features/accounts/configs/user'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User, UserFormData } from '@/components/features/accounts/types/user.types'

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  if (!resolvedParams) {
    return <div>Loading...</div>
  }

  const { id } = resolvedParams

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  const handleNavigate = (mode: 'list' | 'view' | 'create' | 'edit', entity?: Partial<User>) => {
    if (mode === 'list') {
      router.push('/dashboard/accounts/users')
    } else if (mode === 'view' && entity) {
      router.push(`/dashboard/accounts/users/${entity.id}`)
    } else if (mode === 'edit' && entity) {
      router.push(`/dashboard/accounts/users/${entity.id}/edit`)
    } else if (mode === 'create') {
      router.push('/dashboard/accounts/users/create')
    }
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

      <EntityManager<User, UserFormData>
        config={userEntityConfig}
        initialMode="view"
        initialData={{ id }}
        onNavigate={handleNavigate}
      />
    </div>
  )
}