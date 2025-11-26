/**
 * UserProfile List Configuration
 * 
 * Defines columns and settings for the profile list view.
 */

import { Column } from '@/components/entityManager/components/list/types';
import { UserProfile } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Ban, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const profileColumns: Column<UserProfile>[] = [
  {
    key: 'user_name',
    label: 'User',
    sortable: true,
    width: '25%',
    render: (_value, profile) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.user_name} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{profile?.user_name || 'Unknown User'}</div>
          <div className="text-xs text-muted-foreground">{profile?.user_email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'job_title',
    label: 'Job Title',
    sortable: true,
    width: '20%',
    render: (_value, profile) => (
      <div>
        <div className="font-medium">{profile?.job_title || '-'}</div>
        {profile?.department && (
          <div className="text-xs text-muted-foreground">{profile.department}</div>
        )}
      </div>
    ),
  },
  {
    key: 'phone_number',
    label: 'Contact',
    sortable: false,
    width: '15%',
    render: (_value, profile) => (
      <span className="text-sm">{profile?.phone_number || '-'}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    width: '15%',
    render: (_value, profile) => {
      const statusConfig = {
        approved: {
          icon: CheckCircle,
          label: 'Approved',
          className: 'bg-green-600 text-white',
        },
        pending: {
          icon: Clock,
          label: 'Pending',
          className: 'bg-yellow-600 text-white',
        },
        rejected: {
          icon: XCircle,
          label: 'Rejected',
          className: 'bg-red-600 text-white',
        },
        suspended: {
          icon: Ban,
          label: 'Suspended',
          className: 'bg-gray-600 text-white',
        },
      };
      
      const config = statusConfig[(profile?.status ?? 'pending') as keyof typeof statusConfig] ?? {
        icon: Clock,
        label: 'Unknown',
        className: 'bg-gray-600 text-white',
      };
      const Icon = config.icon;
      
      return (
        <Badge variant="default" className={config.className}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    type: 'date',
    width: '15%',
  },
  {
    key: 'approved_at',
    label: 'Approved',
    sortable: true,
    type: 'date',
    width: '10%',
    render: (_value, profile) => (
      <span className="text-sm">
        {profile?.approved_at ? new Date(profile.approved_at).toLocaleDateString() : '-'}
      </span>
    ),
  },
];

export const profileListConfig = {
  defaultView: 'grid' as const,
  defaultPageSize: 20,
  enableSearch: true,
  enableFilters: true,
  enableExport: true,
  enableBulkActions: true,
};
