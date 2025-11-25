/**
 * User Field Configurations
 * 
 * Defines all form fields for user management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { User } from '../../types';
import { User as UserIcon, Lock, Building2, Shield } from 'lucide-react';

export const UserFormConfig: EntityFormConfig<User> = 
{
    /** Form fields */

  fields: [
    // ===========================
    // Basic Information
    // ===========================
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'user@example.com',
      group: 'basic',
      validation: [
        {
          type: 'required',
          message: 'Email is required',
        },
        {
          type: 'email',
          message: 'Invalid email format',
        },
      ],
      width: '50%',
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: false,
      placeholder: 'username',
      group: 'basic',
      validation: [
        {
          type: 'minLength',
          value: 3,
          message: 'Username must be at least 3 characters',
        },
        {
          type: 'maxLength',
          value: 150,
          message: 'Username must be less than 150 characters',
        },
      ],
      helpText: 'Unique username for login',
      width: '50%',
    },
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'John',
      group: 'basic',
      validation: [
        {
          type: 'required',
          message: 'First name is required',
        },
        {
          type: 'minLength',
          value: 2,
          message: 'First name must be at least 2 characters',
        },
        {
          type: 'maxLength',
          value: 150,
          message: 'First name must be less than 150 characters',
        },
      ],
      width: '25%',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Doe',
      group: 'basic',
      validation: [
        {
          type: 'required',
          message: 'Last name is required',
        },
        {
          type: 'minLength',
          value: 2,
          message: 'Last name must be at least 2 characters',
        },
        {
          type: 'maxLength',
          value: 150,
          message: 'Last name must be less than 150 characters',
        },
      ],
      width: '25%',
    },
    
    // ===========================
    // Password (Create Only)
    // ===========================
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: (values) => !values.id,
      placeholder: '••••••••',
      group: 'authentication',
      visible: true,
      validation: [
        {
          type: 'minLength',
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      ],
      width: '50%',
    },
    {
      name: 'password2',
      label: 'Confirm Password',
      type: 'password',
      required: (values) => !values.id,
      placeholder: '••••••••',
      group: 'authentication',
      visible: (values) => !values.id,
      validation: [
        {
          type: 'custom',
          validator: (value: unknown, formValues: Record<string, unknown>) => {
            return value === formValues.password;
          },
          message: 'Passwords do not match',
        },
      ],
      width: '50%',
    },
    
    // ===========================
    // Role & Organization
    // ===========================
    {
      name: 'role_name',
      label: 'Role',
      type: 'select',
      required: false,
      placeholder: 'Select role',
      group: 'status',
      searchable: true,
      options: async (values, query = '') => {
        try {
          const { authApi } = await import('@/components/connectionManager/http');
          const params = query ? { search: query } : {};
          const response = await authApi.get('/api/v1/accounts/user-roles/', { params });
          const options = response.data.results.map((role: { name: string; description: string }) => ({
            value: role.name,
            label: role.description,
          }));
          
          // Ensure the current role is included in options
          const currentRole = (values as Record<string, unknown>).role_name as string;
          if (currentRole && !options.some((opt: { value: string }) => opt.value === currentRole)) {
            options.unshift({ value: currentRole, label: currentRole }); // Add at the top
          }
          
          return options;
        } catch (error) {
          console.error('Failed to load roles:', error);
          // Fallback: include current role if available
          const currentRole = (values as Record<string, unknown>).role_name as string;
          return currentRole ? [{ value: currentRole, label: currentRole }] : [];
        }
      },
      width: '25%',
    },
    {
      name: 'employee_id',
      label: 'Employee ID',
      type: 'text',
      required: false,
      placeholder: 'EMP-001',
      group: 'organization',
      validation: [
        {
          type: 'required',
          message: 'Employee ID is required',
        },
        {
          type: 'maxLength',
          value: 50,
          message: 'Employee ID must be less than 50 characters',
        },
      ],
      width: '25%',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'text',
      required: false,
      placeholder: 'IT Department',
      group: 'organization',
      validation: [
        {
          type: 'maxLength',
          value: 100,
          message: 'Department must be less than 100 characters',
        },
      ],
      width: '25%',
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      required: false,
      placeholder: '+1 (555) 123-4567',
      group: 'organization',
      validation: [
        {
          type: 'maxLength',
          value: 20,
          message: 'Phone number must be less than 20 characters',
        },
      ],
      width: '25%',
    },
    {
      name: 'job_title',
      label: 'Job Title',
      type: 'text',
      required: false,
      placeholder: 'Software Engineer',
      group: 'organization',
      validation: [
        {
          type: 'maxLength',
          value: 100,
          message: 'Job title must be less than 100 characters',
        },
      ],
      width: '25%',
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: false,
      placeholder: 'City, Country',
      group: 'organization',
      validation: [
        {
          type: 'maxLength',
          value: 200,
          message: 'Location must be less than 200 characters',
        },
      ],
      width: '50%',
    },
    
    // ===========================
    // Status Fields (Edit Only)
    // ===========================
    {
      name: 'is_active',
      label: 'Active',
      type: 'switch',
      required: false,
      group: 'status',
      helpText: 'User can log in and access the system',
      width: '25%',
    },
    {
      name: 'is_approved',
      label: 'Approved',
      type: 'switch',
      required: false,
      group: 'status',
      helpText: 'User account has been approved',
      width: '25%',
    },
    {
      name: 'is_verified',
      label: 'Verified',
      type: 'switch',
      required: false,
      group: 'status',
      helpText: 'User email/identity has been verified',
      width: '25%',
    },
    {
      name: 'must_change_password',
      label: 'Require Password Change',
      type: 'switch',
      required: false,
      group: 'status',
      helpText: 'User must change password on next login',
      width: '25%',
    },
    {
      name: 'is_staff',
      label: 'Staff Status',
      type: 'switch',
      required: false,
      group: 'status',
      helpText: 'User has staff privileges',
      width: '25%',
    },
  ],

  layout: 'tabs',
  sections: [
  {
    id: 'basic',
    label: 'Basic Information',
    description: 'Core user details and contact information',
    fields: ['email', 'username', 'first_name', 'last_name'],
    icon: <UserIcon className="h-4 w-4" />,
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
  },],
  
  submitText: 'Save User',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,

  disabled:true,
  className: 'user-form',
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: true,

};

// Convenience exports for backward compatibility
export const userFields = UserFormConfig.fields;