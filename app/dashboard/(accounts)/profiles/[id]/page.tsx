/**
 * Profile View Page
 * 
 * View a single user profile's details.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntityView } from '@/components/entityManager';
import { profileViewFields, profileViewGroups } from '@/components/features/accounts/profiles/config/view';
import { userProfilesApiClient } from '@/components/features/accounts/profiles/api/client';
import { UserProfile } from '@/components/features/accounts/profiles/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    router.push('/dashboard/profiles');
  };

  const handleEdit = () => {
    router.push(`/dashboard/profiles/${profileId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      approved: { className: 'bg-green-600 text-white', label: 'Approved' },
      pending: { className: 'bg-yellow-600 text-white', label: 'Pending' },
      rejected: { className: 'bg-red-600 text-white', label: 'Rejected' },
      suspended: { className: 'bg-gray-600 text-white', label: 'Suspended' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
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
          Back to Profiles
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
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.user_name || 'Profile'} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profile.user_name || 'User Profile'}</h1>
                {getStatusBadge(profile.status)}
              </div>
              <p className="text-muted-foreground">{profile.user_email || profile.job_title || 'No details'}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Details */}
      <EntityView
        entity={profile}
        fields={profileViewFields}
        groups={profileViewGroups}
        mode="detail"
      />
    </div>
  );
}
