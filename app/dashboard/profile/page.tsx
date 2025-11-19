/**
 * User Profile Page
 * 
 * Authenticated user's profile page with view and edit capabilities.
 * Showcases EntityView component and profile management.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EntityView } from '@/components/entityManager/components/view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Settings, 
  Shield, 
  Edit, 
  Key,
  Bell,
  Lock,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { UserProfile } from '@/components/features/accounts/profiles/types';
import { profileViewFields, profileViewGroups } from '@/components/features/accounts/profiles/config/view';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authenticated user profile
  const mockProfile: UserProfile = {
    id: 'current-user-profile',
    user_id: 'current-user',
    user_email: 'john.doe@example.com',
    user_name: 'John Doe',
    bio: 'Senior Software Engineer with 10+ years of experience in full-stack development. Passionate about building scalable systems and mentoring junior developers.',
    phone_number: '+1 (555) 123-4567',
    department: 'Engineering',
    job_title: 'Senior Software Engineer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'approved',
    approved_by: 'admin-1',
    approved_by_name: 'Admin User',
    approved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    preferred_language: 'en',
    interface_theme: 'dark',
    allow_notifications: true,
    show_email: true,
    show_phone: false,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setProfile(mockProfile);
      
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const statusConfig = {
    approved: { icon: CheckCircle, label: 'Approved', className: 'bg-green-600 text-white' },
    pending: { icon: Clock, label: 'Pending Approval', className: 'bg-yellow-600 text-white' },
    rejected: { icon: Clock, label: 'Rejected', className: 'bg-red-600 text-white' },
    suspended: { icon: Clock, label: 'Suspended', className: 'bg-gray-600 text-white' },
  };

  const StatusIcon = statusConfig[profile.status].icon;

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.user_name} />
              <AvatarFallback className="text-3xl md:text-4xl">
                {profile.user_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.user_name}</h1>
                <Badge variant="default" className={statusConfig[profile.status].className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[profile.status].label}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile.user_email}</span>
                </div>
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.job_title || 'No job title'}</span>
                  {profile.department && <span>· {profile.department}</span>}
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button className="w-full md:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <CardTitle>Contact Information</CardTitle>
                </div>
                <CardDescription>Your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{profile.user_email}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-sm mt-1">{profile.phone_number || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>Organization</CardTitle>
                </div>
                <CardDescription>Your organizational details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p className="text-sm mt-1">{profile.department || 'Not assigned'}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                  <p className="text-sm mt-1">{profile.job_title || 'Not assigned'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography */}
          {profile.bio && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Biography</CardTitle>
                </div>
                <CardDescription>About you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{profile.bio}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>Preferences</CardTitle>
                </div>
                <CardDescription>Your application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Language</label>
                  <p className="text-sm mt-1">{profile.preferred_language.toUpperCase()}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Theme</label>
                  <p className="text-sm mt-1 capitalize">{profile.interface_theme}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-xs text-muted-foreground mt-1">Receive email updates</p>
                  </div>
                  <Badge variant={profile.allow_notifications ? "default" : "secondary"}>
                    {profile.allow_notifications ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle>Privacy Settings</CardTitle>
                </div>
                <CardDescription>Control your information visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Email Publicly</label>
                    <p className="text-xs text-muted-foreground mt-1">Make email visible to others</p>
                  </div>
                  <Badge variant={profile.show_email ? "default" : "secondary"}>
                    {profile.show_email ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Phone Publicly</label>
                    <p className="text-xs text-muted-foreground mt-1">Make phone visible to others</p>
                  </div>
                  <Badge variant={profile.show_phone ? "default" : "secondary"}>
                    {profile.show_phone ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <p className="text-xs text-muted-foreground mt-1">Last changed 2 weeks ago</p>
                </div>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Two-Factor Authentication</label>
                  <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <CardDescription>Your recent account activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Edit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile updated</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Password changed</p>
                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile approved</p>
                    <p className="text-xs text-muted-foreground">30 days ago by {profile.approved_by_name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
