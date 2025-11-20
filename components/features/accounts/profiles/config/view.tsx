/**
 * UserProfile View Configuration
 * 
 * Defines fields for the profile detail view.
 */

import { ViewField } from '@/components/entityManager/primitives/types';
import { UserProfile } from '../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Ban, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const profileViewFields: ViewField<UserProfile>[] = [
  {
    key: 'avatar_url',
    label: 'Profile Picture',
    render: (profile) => {
      const p = profile as UserProfile;
      return (
        <Avatar className="h-24 w-24">
          <AvatarImage src={p.avatar_url || undefined} alt={p.user_name} />
          <AvatarFallback className="text-2xl">
            {p.user_name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    key: 'user_name',
    label: 'User',
    type: 'text',
    copyable: true,
  },
  {
    key: 'user_email',
    label: 'Email',
    type: 'text',
    copyable: true,
  },
  {
    key: 'bio',
    label: 'Biography',
    type: 'text',
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    copyable: true,
  },
  {
    key: 'department',
    label: 'Department',
    type: 'text',
  },
  {
    key: 'job_title',
    label: 'Job Title',
    type: 'text',
  },
  {
    key: 'status',
    label: 'Status',
    render: (profile) => {
      const p = profile as UserProfile;
      const statusConfig = {
        approved: { icon: CheckCircle, label: 'Approved', className: 'bg-green-600 text-white' },
        pending: { icon: Clock, label: 'Pending Approval', className: 'bg-yellow-600 text-white' },
        rejected: { icon: XCircle, label: 'Rejected', className: 'bg-red-600 text-white' },
        suspended: { icon: Ban, label: 'Suspended', className: 'bg-gray-600 text-white' },
      };
      const config = statusConfig[p.status];
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
    key: 'approved_by_name',
    label: 'Approved By',
    type: 'text',
  },
  {
    key: 'approved_at',
    label: 'Approved At',
    type: 'date',
  },
  {
    key: 'preferred_language',
    label: 'Preferred Language',
    type: 'text',
  },
  {
    key: 'interface_theme',
    label: 'Interface Theme',
    type: 'text',
  },
  {
    key: 'allow_notifications',
    label: 'Email Notifications',
    render: (profile) => {
      const p = profile as UserProfile;
      return p.allow_notifications ? (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Check className="h-3 w-3 mr-1" />
          Enabled
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 border-gray-600">
          <X className="h-3 w-3 mr-1" />
          Disabled
        </Badge>
      );
    },
  },
  {
    key: 'show_email',
    label: 'Show Email Publicly',
    type: 'boolean',
  },
  {
    key: 'show_phone',
    label: 'Show Phone Publicly',
    type: 'boolean',
  },
  {
    key: 'created_at',
    label: 'Created At',
    type: 'date',
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    type: 'date',
  },
];

export const profileViewGroups = [
  {
    id: 'basic',
    label: 'Profile Information',
    description: 'Basic profile details',
    fields: ['avatar_url', 'user_name', 'user_email', 'bio'],
    collapsible: false,
    order: 1,
  },
  {
    id: 'contact',
    label: 'Contact Information',
    description: 'Contact details',
    fields: ['phone_number'],
    collapsible: false,
    order: 2,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Department and job information',
    fields: ['department', 'job_title'],
    collapsible: false,
    order: 3,
  },
  {
    id: 'approval',
    label: 'Approval Status',
    description: 'Profile approval information',
    fields: ['status', 'approved_by_name', 'approved_at'],
    collapsible: true,
    order: 4,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'User preferences and settings',
    fields: ['preferred_language', 'interface_theme', 'allow_notifications'],
    collapsible: true,
    order: 5,
  },
  {
    id: 'privacy',
    label: 'Privacy Settings',
    description: 'Privacy and visibility settings',
    fields: ['show_email', 'show_phone'],
    collapsible: true,
    order: 6,
  },
  {
    id: 'metadata',
    label: 'Metadata',
    description: 'Creation and modification information',
    fields: ['created_at', 'updated_at'],
    collapsible: true,
    defaultCollapsed: true,
    order: 7,
  },
];
