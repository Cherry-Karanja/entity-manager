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
    render: (user) => (user as User).phone_number || '-',
  },
  {
    key: 'employee_id',
    label: 'Employee ID',
    group: 'personal',
    render: (user) => (user as User).employee_id || '-',
  },
  
  // ===========================
  // Organization
  // ===========================
  {
    key: 'role_display',
    label: 'Role',
    group: 'organization',
    render: (user) => {
      const u = user as User;
      return (
        <Badge variant="outline" className="text-sm">
          {u.role_display || 'No Role Assigned'}
        </Badge>
      );
    },
  },
  {
    key: 'department',
    label: 'Department',
    group: 'organization',
    render: (user) => (user as User).department || '-',
  },
  
  // ===========================
  // Status & Security
  // ===========================
  {
    key: 'is_active',
    label: 'Account Status',
    group: 'status',
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
    render: (user) => {
      const u = user as User;
      return (
        <span className={u.failed_login_attempts > 0 ? 'text-red-600 font-medium' : ''}>
          {u.failed_login_attempts}
        </span>
      );
    },
  },
  {
    key: 'must_change_password',
    label: 'Password Change Required',
    group: 'status',
    render: (user) => {
      const u = user as User;
      return u.must_change_password ? (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Required</Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      );
    },
  },
  {
    key: 'otp_enabled',
    label: 'Two-Factor Authentication',
    group: 'status',
    render: (user) => {
      const u = user as User;
      return u.otp_enabled ? (
        <Badge variant="default" className="bg-green-600 text-white">
          <Shield className="h-3 w-3 mr-1" />
          Enabled
        </Badge>
      ) : (
        <Badge variant="secondary">Disabled</Badge>
      );
    },
  },
  
  // ===========================
  // Activity
  // ===========================
  {
    key: 'last_login',
    label: 'Last Login',
    group: 'activity',
    render: (user) => {
      const u = user as User;
      return u.last_login ? new Date(u.last_login).toLocaleString() : 'Never';
    },
  },
  {
    key: 'last_login_ip',
    label: 'Last Login IP',
    group: 'activity',
    render: (user) => (user as User).last_login_ip || '-',
  },
  {
    key: 'date_joined',
    label: 'Date Joined',
    group: 'activity',
    render: (user) => new Date((user as User).date_joined).toLocaleString(),
  },
  {
    key: 'password_changed_at',
    label: 'Password Last Changed',
    group: 'activity',
    render: (user) => {
      const u = user as User;
      return u.password_changed_at ? new Date(u.password_changed_at).toLocaleString() : 'Never';
    },
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

