/**
 * User View Field Configurations
 * 
 * Defines fields for the user detail view.
 */

import { ViewField } from '@/components/entityManager/components/view/types';
import { User } from '../../types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield, Lock } from 'lucide-react';

export const userViewFields: ViewField[] = [
  // ===========================
  // Personal Information
  // ===========================
  {
    key: 'email',
    label: 'Email Address',
    group: 'personal',
    // Keep custom render: composite display (email + verified badge)
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{u.email}</span>
          {u.is_verified && <Badge variant="default" className="text-xs bg-green-600 text-white">Verified</Badge>}
        </div>
      );
    },
  },
  {
    key: 'full_name',
    label: 'Full Name',
    group: 'personal',
    // Keep custom render: composite display (name + role badges)
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{u.full_name}</span>
          {u.is_superuser && <Badge variant="default">Superuser</Badge>}
          {u.is_staff && <Badge variant="secondary">Staff</Badge>}
        </div>
      );
    },
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    group: 'personal',
    type: 'text',
    formatter: (value) => (value as string) || '-',
  },
  {
    key: 'employee_id',
    label: 'Employee ID',
    group: 'personal',
    type: 'text',
    formatter: (value) => (value as string) || '-',
  },
  
  // ===========================
  // Organization
  // ===========================
  {
    key: 'role_display',
    label: 'Role',
    group: 'organization',
    type: 'text',
    formatter: (value) => (value as string) || 'No Role Assigned',
  },
  {
    key: 'department',
    label: 'Department',
    group: 'organization',
    type: 'text',
    formatter: (value) => (value as string) || '-',
  },
  
  // ===========================
  // Status & Security
  // ===========================
  {
    key: 'is_active',
    label: 'Account Status',
    group: 'status',
    // Keep custom render: complex multi-badge status display
    render: (user) => {
      const u = user as User;
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {u.is_active ? (
              <Badge variant="default" className="bg-green-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {u.is_approved ? (
              <Badge variant="outline" className="text-xs">Approved</Badge>
            ) : (
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">Pending Approval</Badge>
            )}
            {u.is_verified && (
              <Badge variant="outline" className="text-xs">Verified</Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: 'account_locked_until',
    label: 'Account Lock',
    group: 'status',
    // Keep custom render: complex conditional date logic
    render: (user) => {
      const u = user as User;
      if (!u.account_locked_until) {
        return <span className="text-muted-foreground">Not Locked</span>;
      }
      const lockDate = new Date(u.account_locked_until);
      const isLocked = lockDate > new Date();
      return isLocked ? (
        <Badge variant="destructive">
          <Lock className="h-3 w-3 mr-1" />
          Locked until {lockDate.toLocaleString()}
        </Badge>
      ) : (
        <span className="text-muted-foreground">Not Locked</span>
      );
    },
  },
  {
    key: 'failed_login_attempts',
    label: 'Failed Login Attempts',
    group: 'status',
    type: 'number',
  },
  {
    key: 'must_change_password',
    label: 'Password Change Required',
    group: 'status',
    type: 'boolean',
  },
  {
    key: 'otp_enabled',
    label: 'Two-Factor Authentication',
    group: 'status',
    type: 'boolean',
  },
  
  // ===========================
  // Activity
  // ===========================
  {
    key: 'last_login',
    label: 'Last Login',
    group: 'activity',
    type: 'date',
    formatter: (value) => !value ? 'Never' : (value as string),
  },
  {
    key: 'last_login_ip',
    label: 'Last Login IP',
    group: 'activity',
    type: 'text',
    formatter: (value) => (value as string) || '-',
  },
  {
    key: 'date_joined',
    label: 'Date Joined',
    group: 'activity',
    type: 'date',
  },
  {
    key: 'password_changed_at',
    label: 'Password Last Changed',
    group: 'activity',
    type: 'date',
    formatter: (value) => !value ? 'Never' : (value as string),
  },
];

// Field groups for organizing the view
export const userViewGroups = [
  {
    id: 'personal',
    label: 'Personal Information',
    description: 'Basic personal and contact information',
    order: 1,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Role and department information',
    order: 2,
  },
  {
    id: 'status',
    label: 'Status & Security',
    description: 'Account status and security settings',
    order: 3,
  },
  {
    id: 'activity',
    label: 'Activity',
    description: 'Login and activity history',
    order: 4,
  },
];

