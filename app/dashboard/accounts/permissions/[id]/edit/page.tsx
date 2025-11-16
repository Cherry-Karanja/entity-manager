import { EntityManager } from '@/components/entityManager/manager/orchestrator'
import { permissionEntityConfig } from '@/components/features/accounts/configs'
import { notFound } from 'next/navigation'
import { Permission, PermissionFormData } from '@/components/features/accounts/types'

interface PermissionEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PermissionEditPage({ params }: PermissionEditPageProps) {
  const { id } = await params

  // Validate ID
  if (!id || id === 'create') {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Permission</h1>
          <p className="text-muted-foreground">
            Update permission details and settings
          </p>
        </div>
      </div>

      <EntityManager<Permission, PermissionFormData>
        config={permissionEntityConfig}
        initialMode="edit"
        initialData={{ id }}
      />
    </div>
  )
}