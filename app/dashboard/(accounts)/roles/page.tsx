/**
 * Roles Management Page
 * 
 * List and manage user roles with full CRUD operations.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EntityList } from '@/components/entityManager/components/list';
import { EntityActions } from '@/components/entityManager/components/actions';
import { userRoleConfig, roleColumns } from '@/components/features/accounts/roles/config';
import { UserRole } from '@/components/features/accounts/roles/types';
import { userRoleApi } from '@/components/features/accounts/roles/api/client';
import { Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RolesPage() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Mock data for development
  const mockRoles: UserRole[] = [
    {
      id: '1',
      name: 'super_admin',
      display_name: 'Super Administrator',
      description: 'Full system access with all permissions',
      is_active: true,
      users_count: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'admin',
      display_name: 'Administrator',
      description: 'Administrative access with most permissions',
      is_active: true,
      users_count: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'manager',
      display_name: 'Manager',
      description: 'Manage users and content',
      is_active: true,
      users_count: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'staff',
      display_name: 'Staff',
      description: 'Standard staff member access',
      is_active: true,
      users_count: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'viewer',
      display_name: 'Viewer',
      description: 'Read-only access to the system',
      is_active: false,
      users_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for now
      // In production, uncomment this:
      // const response = await userRoleApi.list();
      // setRoles(response.results);
      // setTotalCount(response.count);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles(mockRoles);
      setTotalCount(mockRoles.length);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRoles();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Roles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user roles and permissions
            </p>
          </div>
        </div>
        
        <Link href="/dashboard/roles/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </Link>
      </div>

      {/* Role List */}
      <EntityList
        data={roles}
        columns={roleColumns}
        loading={loading}
        error={error || undefined}
        pagination={true}
        paginationConfig={{
          page: 1,
          pageSize: 20,
          totalCount: totalCount,
        }}
        searchable
        filterable
        sortable
        selectable
        toolbar={{
          search: true,
          viewSwitcher: true,
        }}
      />
    </div>
  );
}
