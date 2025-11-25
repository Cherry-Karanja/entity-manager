/**
 * Profile Page
 * 
 * User profile management page connected to the backend.
 * Uses the ProfileManager component with backend API integration.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ProfileManager } from '@/components/profile';
import { authApi } from '@/components/connectionManager/http/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  department?: string;
  avatar?: string;
}

interface UserResponse {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile?: {
    bio?: string;
    department?: string;
    profile_picture?: string;
  };
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authApi.get<UserResponse>('/api/v1/accounts/users/me/');
        const userData = response.data;
        
        setProfileData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone: userData.phone_number,
          bio: userData.profile?.bio,
          department: userData.profile?.department,
          avatar: userData.profile?.profile_picture,
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
        toast.error('Failed to load profile', {
          description: 'Please try refreshing the page.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (data: Partial<ProfileData>) => {
    try {
      await authApi.patch('/api/v1/accounts/users/me/', {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone,
      });

      // Update profile separately if bio/department changed
      if (data.bio !== undefined || data.department !== undefined) {
        await authApi.patch('/api/v1/accounts/user-profiles/me/', {
          bio: data.bio,
          department: data.department,
        });
      }

      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.',
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile', {
        description: 'Please try again.',
      });
      throw err;
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (data: { 
    current_password: string; 
    new_password: string; 
    confirm_password: string;
  }) => {
    try {
      await authApi.post('/api/v1/accounts/users/change-password/', {
        old_password: data.current_password,
        new_password: data.new_password,
        new_password2: data.confirm_password,
      });

      toast.success('Password updated', {
        description: 'Your password has been changed successfully.',
      });
    } catch (err) {
      console.error('Failed to update password:', err);
      toast.error('Failed to update password', {
        description: 'Please check your current password and try again.',
      });
      throw err;
    }
  };

  // Handle notification preferences update
  const handleNotificationUpdate = async (data: Record<string, boolean>) => {
    try {
      await authApi.patch('/api/v1/accounts/user-profiles/me/', {
        notification_preferences: data,
        allow_notifications: Object.values(data).some(Boolean),
      });

      toast.success('Notification preferences updated', {
        description: 'Your notification settings have been saved.',
      });
    } catch (err) {
      console.error('Failed to update notifications:', err);
      toast.error('Failed to update notification preferences', {
        description: 'Please try again.',
      });
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button 
            variant="outline"
            onClick={() => {
              setError(null);
              setLoading(true);
              // Re-fetch profile
              const retryFetch = async () => {
                try {
                  const response = await authApi.get<UserResponse>('/api/v1/accounts/users/me/');
                  const userData = response.data;
                  
                  setProfileData({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    phone: userData.phone_number,
                    bio: userData.profile?.bio,
                    department: userData.profile?.department,
                    avatar: userData.profile?.profile_picture,
                  });
                  setError(null);
                } catch (err) {
                  console.error('Failed to fetch profile:', err);
                  setError('Failed to load profile data');
                } finally {
                  setLoading(false);
                }
              };
              retryFetch();
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProfileManager
      initialData={profileData || undefined}
      onProfileUpdate={handleProfileUpdate}
      onPasswordUpdate={handlePasswordUpdate}
      onNotificationUpdate={handleNotificationUpdate}
    />
  );
}
