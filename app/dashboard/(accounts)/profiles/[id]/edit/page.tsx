/**
 * Profile Edit Page
 * 
 * Edit an existing user profile.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityForm } from '@/components/entityManager';
import { profileFields } from '@/components/features/accounts/profiles/config/fields';
import { userProfilesApiClient } from '@/components/features/accounts/profiles/api/client';
import { UserProfile } from '@/components/features/accounts/profiles/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileEditPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userProfilesApiClient.get(profileId);
        if (response.error) {
          setError(response.error.message);
        } else {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleBack = () => {
    router.push(`/dashboard/profiles/${profileId}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/profiles/${profileId}`);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      const response = await userProfilesApiClient.update(profileId, values as Partial<UserProfile>);
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Profile updated successfully');
        router.push(`/dashboard/profiles/${profileId}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-destructive">{error || 'Profile not found'}</div>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
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
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.user_name || 'Profile'} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">{profile.user_name || profile.user_email || 'User Profile'}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-4xl">
        <EntityForm<UserProfile>
          mode="edit"
          fields={profileFields}
          entity={profile}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitText="Update Profile"
          loading={submitting}
        />
      </div>
    </div>
  );
}
