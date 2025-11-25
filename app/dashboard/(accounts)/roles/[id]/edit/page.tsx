/**
 * Role Edit Page
 * 
 * Edit an existing user role.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityForm } from '@/components/entityManager';
import { roleFields } from '@/components/features/accounts/roles/config/fields';
import { userRolesApiClient } from '@/components/features/accounts/roles/api/client';
import { UserRole } from '@/components/features/accounts/roles/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function RoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const response = await userRolesApiClient.get(roleId);
        if (response.error) {
          setError(response.error.message);
        } else {
          setRole(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load role');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId]);

  const handleBack = () => {
    router.push(`/dashboard/roles/${roleId}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/roles/${roleId}`);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      const response = await userRolesApiClient.update(roleId, values as Partial<UserRole>);
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Role updated successfully');
        router.push(`/dashboard/roles/${roleId}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading role...</div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Role not found'}</div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Role
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Edit Role</h1>
            <p className="text-muted-foreground">{role.display_name} ({role.name})</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-4xl">
        <EntityForm<UserRole>
          mode="edit"
          fields={roleFields}
          entity={role}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitText="Update Role"
          loading={submitting}
        />
      </div>
    </div>
  );
}
