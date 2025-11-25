/**
 * User Form Configuration
 * 
 * Defines form layout and sections for user management.
 */

import { FormLayout, FieldSection } from '@/components/entityManager/components/form/types';
import { User, Lock, Building2, Shield } from 'lucide-react';

export const userFormLayout: FormLayout = 'tabs';

export const userFormSections: FieldSection[] = [
  {
    id: 'basic',
    label: 'Basic Information',
    description: 'Core user details and contact information',
    fields: ['email', 'username', 'first_name', 'last_name'],
    icon: <User className="h-4 w-4" />,
    order: 1,
  },
  {
    id: 'authentication',
    label: 'Authentication',
    description: 'Password and security settings',
    fields: ['password', 'password2'],
    icon: <Lock className="h-4 w-4" />,
    order: 2,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Department and organizational details',
    fields: ['employee_id', 'department', 'job_title', 'phone_number', 'location'],
    icon: <Building2 className="h-4 w-4" />,
    order: 3,
  },
  {
    id: 'status',
    label: 'Status & Permissions',
    description: 'Account status, role and access control',
    fields: ['role_name', 'is_active', 'is_approved', 'is_verified', 'is_staff', 'must_change_password'],
    icon: <Shield className="h-4 w-4" />,
    order: 4,
  },
];

export const userFormMode: Record<string, Partial<{ layout: FormLayout; sections: FieldSection[] }>> = {
  create: {
    layout: 'tabs',
    sections: userFormSections,
  },
  edit: {
    layout: 'tabs',
    sections: userFormSections.filter(s => s.id !== 'authentication'), // Don't show password fields in edit mode
  },
};
