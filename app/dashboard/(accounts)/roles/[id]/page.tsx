/**
 * Role View Page
 * 
 * View a single user role's details.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityView } from '@/components/entityManager';
import { roleViewFields, roleViewGroups } from '@/components/features/accounts/roles/config/view';
import { userRolesApiClient } from '@/components/features/accounts/roles/api/client';
import { UserRole } from '@/components/features/accounts/roles/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RoleViewPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    router.push('/dashboard/roles');
  };

  const handleEdit = () => {
    router.push(`/dashboard/roles/${roleId}/edit`);
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
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{role.display_name}</h1>
                {role.is_active ? (
                  <Badge variant="default" className="bg-green-600 text-white">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <p className="text-muted-foreground font-mono text-sm">{role.name}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Role
        </Button>
      </div>

      {/* Role Details */}
      <EntityView
        entity={role}
        fields={roleViewFields}
        groups={roleViewGroups}
        mode="detail"
      />
    </div>
  );
}
