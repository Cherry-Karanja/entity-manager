/**
 * User Edit Page
 * 
 * Edit an existing user.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityForm } from '@/components/entityManager';
import { userFields, userFormLayout, userFormSections } from '@/components/features/accounts/users/config';
import { usersApiClient } from '@/components/features/accounts/users/api/client';
import { User } from '@/components/features/accounts/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await usersApiClient.get(userId);
        if (response.error) {
          setError(response.error.message);
        } else {
          setUser(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleBack = () => {
    router.push(`/dashboard/accounts/users/${userId}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/accounts/users/${userId}`);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      const response = await usersApiClient.update(userId, values as Partial<User>);
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('User updated successfully');
        router.push(`/dashboard/accounts/users/${userId}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading user...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'User not found'}</div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to User
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
        <div>
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="text-muted-foreground">{user.full_name} ({user.email})</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-4xl">
        <EntityForm<User>
          mode="edit"
          fields={userFields}
          entity={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          layout={userFormLayout}
          sections={userFormSections}
          submitText="Update User"
          loading={submitting}
        />
      </div>
    </div>
  );
}
