/**
 * User Form Configuration
 * 
 * Defines form layout, sections, and behavior settings for user management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { User as UserType } from '../../types';
import { User, Lock, Building2, Shield } from 'lucide-react';
import { userFields } from './fields';

export const UserFormConfig: EntityFormConfig<UserType> = {
  /** Form fields */
  fields: userFields,

  /** Layout configuration */
  layout: 'tabs',

  /** Form sections */
  sections: [
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
  ],

  /** Form behavior settings */
  submitText: 'Save User',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,
  disabled: true,
  className: 'user-form',
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: true,
};

// Backwards-compatibility named exports (legacy barrels expect these)
export const userFormLayout = UserFormConfig.layout;
export const userFormSections = UserFormConfig.sections;
export const userFormFields = UserFormConfig.fields;
export const userFormSubmitText = UserFormConfig.submitText;
