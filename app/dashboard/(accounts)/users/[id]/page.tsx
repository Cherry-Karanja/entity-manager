/**
 * User View Page
 * 
 * View a single user's details.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityView } from '@/components/entityManager';
import { userViewFields } from '@/components/features/accounts/users/config';
import { usersApiClient } from '@/components/features/accounts/users/api/client';
import { User } from '@/components/features/accounts/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    router.push('/dashboard/accounts/users');
  };

  const handleEdit = () => {
    router.push(`/dashboard/accounts/users/${userId}/edit`);
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
          Back to Users
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
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      {/* User Details */}
      <EntityView
        entity={user}
        fields={userViewFields}
      />
    </div>
  );
}
