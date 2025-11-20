/**
 * UserProfile Actions Configuration
 * 
 * Defines actions available for profile management.
 */

import { Action } from '@/components/entityManager/components/actions/types';
import { UserProfile } from '../types';
import { Edit, CheckCircle, XCircle, Ban, Trash2, Eye } from 'lucide-react';

export const profileActions: Action<UserProfile>[] = [
  {
    id: 'view',
    actionType: 'navigation',
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    variant: 'ghost',
    url: (profile) => `/dashboard/profiles/${(profile as UserProfile).id}`,
    permission: 'view_userprofile',
  },
  {
    id: 'edit',
    actionType: 'navigation',
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    variant: 'ghost',
    url: (profile) => `/dashboard/profiles/${(profile as UserProfile).id}/edit`,
    permission: 'change_userprofile',
  },
  {
    id: 'approve',
    actionType: 'confirm',
    label: 'Approve',
    icon: <CheckCircle className="h-4 w-4" />,
    variant: 'primary',
    confirmMessage: (profile) => `Are you sure you want to approve the profile for ${(profile as UserProfile).user_name}?`,
    confirmText: 'Approve',
    onConfirm: async (profile) => {
      console.log('Approving profile:', (profile as UserProfile).id);
    },
    permission: 'approve_userprofile',
    visible: (profile) => profile ? profile.status === 'pending' : false,
  },
  {
    id: 'reject',
    actionType: 'confirm',
    label: 'Reject',
    icon: <XCircle className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: (profile) => `Are you sure you want to reject the profile for ${(profile as UserProfile).user_name}?`,
    confirmText: 'Reject',
    onConfirm: async (profile) => {
      console.log('Rejecting profile:', (profile as UserProfile).id);
    },
    permission: 'approve_userprofile',
    visible: (profile) => profile ? profile.status === 'pending' : false,
  },
  {
    id: 'suspend',
    actionType: 'confirm',
    label: 'Suspend',
    icon: <Ban className="h-4 w-4" />,
    variant: 'secondary',
    confirmMessage: (profile) => `Are you sure you want to suspend the profile for ${(profile as UserProfile).user_name}?`,
    confirmText: 'Suspend',
    onConfirm: async (profile) => {
      console.log('Suspending profile:', (profile as UserProfile).id);
    },
    permission: 'change_userprofile',
    visible: (profile) => profile ? profile.status === 'approved' : false,
  },
  {
    id: 'delete',
    actionType: 'confirm',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    confirmMessage: (profile) => `Are you sure you want to delete the profile for ${(profile as UserProfile).user_name}? This action cannot be undone.`,
    confirmText: 'Delete Profile',
    onConfirm: async (profile) => {
      console.log('Deleting profile:', (profile as UserProfile).id);
    },
    permission: 'delete_userprofile',
  },
];

export const profileBulkActions: Action<UserProfile>[] = [
  {
    id: 'bulk_approve',
    actionType: 'bulk',
    label: 'Approve Selected',
    icon: <CheckCircle className="h-4 w-4" />,
    variant: 'primary',
    handler: async (profiles) => {
      console.log('Bulk approving profiles:', profiles.map(p => p.id));
    },
    permission: 'approve_userprofile',
  },
  {
    id: 'bulk_reject',
    actionType: 'bulk',
    label: 'Reject Selected',
    icon: <XCircle className="h-4 w-4" />,
    variant: 'destructive',
    handler: async (profiles) => {
      console.log('Bulk rejecting profiles:', profiles.map(p => p.id));
    },
    permission: 'approve_userprofile',
  },
  {
    id: 'bulk_delete',
    actionType: 'bulk',
    label: 'Delete Selected',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    handler: async (profiles) => {
      console.log('Bulk deleting profiles:', profiles.map(p => p.id));
    },
    permission: 'delete_userprofile',
  },
];
