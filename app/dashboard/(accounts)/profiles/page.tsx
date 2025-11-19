/**
 * Profiles Management Page
 * 
 * List and manage user profiles with avatar upload support.
 * Showcases the FileUpload component!
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EntityList } from '@/components/entityManager/components/list';
import { userProfileConfig, profileColumns } from '@/components/features/accounts/profiles/config';
import { UserProfile } from '@/components/features/accounts/profiles/types';
import { userProfileApi } from '@/components/features/accounts/profiles/api/client';
import { User } from 'lucide-react';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Mock data for development with various statuses
  const mockProfiles: UserProfile[] = [
    {
      id: '1',
      user_id: 'user-1',
      user_email: 'john.doe@example.com',
      user_name: 'John Doe',
      bio: 'Senior Software Engineer with 10+ years of experience in full-stack development.',
      phone_number: '+1 (555) 123-4567',
      department: 'Engineering',
      job_title: 'Senior Software Engineer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      status: 'approved',
      approved_by: 'admin-1',
      approved_by_name: 'Admin User',
      approved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      preferred_language: 'en',
      interface_theme: 'dark',
      allow_notifications: true,
      show_email: true,
      show_phone: false,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      user_id: 'user-2',
      user_email: 'jane.smith@example.com',
      user_name: 'Jane Smith',
      bio: 'Product Manager passionate about building great user experiences.',
      phone_number: '+1 (555) 234-5678',
      department: 'Product',
      job_title: 'Product Manager',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      status: 'approved',
      approved_by: 'admin-1',
      approved_by_name: 'Admin User',
      approved_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      preferred_language: 'en',
      interface_theme: 'light',
      allow_notifications: true,
      show_email: false,
      show_phone: false,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      user_id: 'user-3',
      user_email: 'mike.johnson@example.com',
      user_name: 'Mike Johnson',
      bio: 'UX Designer focused on creating intuitive and beautiful interfaces.',
      phone_number: '+1 (555) 345-6789',
      department: 'Design',
      job_title: 'UX Designer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      status: 'pending',
      preferred_language: 'en',
      interface_theme: 'auto',
      allow_notifications: true,
      show_email: true,
      show_phone: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      user_id: 'user-4',
      user_email: 'sarah.williams@example.com',
      user_name: 'Sarah Williams',
      bio: 'Marketing specialist with expertise in digital marketing and social media.',
      phone_number: '+1 (555) 456-7890',
      department: 'Marketing',
      job_title: 'Marketing Specialist',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      status: 'approved',
      approved_by: 'admin-1',
      approved_by_name: 'Admin User',
      approved_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      preferred_language: 'en',
      interface_theme: 'light',
      allow_notifications: false,
      show_email: false,
      show_phone: false,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      user_id: 'user-5',
      user_email: 'alex.brown@example.com',
      user_name: 'Alex Brown',
      bio: 'Data analyst helping teams make data-driven decisions.',
      department: 'Analytics',
      job_title: 'Data Analyst',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      status: 'suspended',
      approved_by: 'admin-1',
      approved_by_name: 'Admin User',
      approved_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      preferred_language: 'en',
      interface_theme: 'dark',
      allow_notifications: true,
      show_email: true,
      show_phone: false,
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for now
      // In production, uncomment this:
      // const response = await userProfileApi.list();
      // setProfiles(response.results);
      // setTotalCount(response.count);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfiles(mockProfiles);
      setTotalCount(mockProfiles.length);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadProfiles();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Profiles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user profiles and personal information
            </p>
          </div>
        </div>
      </div>

      {/* Profile List */}
      <EntityList
        data={profiles}
        columns={profileColumns}
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
