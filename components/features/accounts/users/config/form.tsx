/**
 * User Form Configuration
 * 
 * Defines form layout and sections for user management.
 */

import { FormLayout, FieldSection } from '@/components/entityManager/components/form/types';

export const userFormLayout: FormLayout = 'tabs';

export const userFormSections: FieldSection[] = [
  {
    id: 'basic',
    label: 'Basic Information',
    description: 'Core user details and contact information',
    fields: ['email', 'username', 'first_name', 'last_name'],
    order: 1,
  },
  {
    id: 'authentication',
    label: 'Authentication',
    description: 'Password and security settings',
    fields: ['password', 'password2'],
    order: 2,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Role, department, and organizational details',
    fields: ['role_name', 'employee_id', 'department', 'job_title', 'phone_number', 'location'],
    order: 3,
  },
  {
    id: 'status',
    label: 'Status & Permissions',
    description: 'Account status and access control',
    fields: ['is_active', 'is_approved', 'is_verified', 'is_staff', 'must_change_password'],
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
    sections: userFormSections,
  },
};
