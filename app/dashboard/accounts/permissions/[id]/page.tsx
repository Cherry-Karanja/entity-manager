'use client'

import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { permissionEntityConfig } from '@/components/features/accounts/configs'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Permission, PermissionFormData } from '@/components/features/accounts/types'

interface PermissionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PermissionDetailPage({ params }: PermissionDetailPageProps) {
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

  const handleNavigate = (mode: 'list' | 'view' | 'create' | 'edit', entity?: Partial<Permission>) => {
    if (mode === 'list') {
      router.push('/dashboard/accounts/permissions')
    } else if (mode === 'view' && entity) {
      router.push(`/dashboard/accounts/permissions/${entity.id}`)
    } else if (mode === 'edit' && entity) {
      router.push(`/dashboard/accounts/permissions/${entity.id}/edit`)
    } else if (mode === 'create') {
      router.push('/dashboard/accounts/permissions/create')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Details</h1>
          <p className="text-muted-foreground">
            View and manage Permission account information
          </p>
        </div>
      </div>

      <EntityManager<Permission, PermissionFormData>
        config={permissionEntityConfig}
        initialMode="view"
        initialData={{ id }}
        onNavigate={handleNavigate}
      />
    </div>
  )
}