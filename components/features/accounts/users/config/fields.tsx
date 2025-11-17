/**
 * User Field Configurations
 * 
 * Defines all form fields for user management.
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { User } from '../../types';

export const userFields: FormField<User>[] = [
  // ===========================
  // Basic Information
  // ===========================
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'user@example.com',
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
    required: true,
    placeholder: '••••••••',
    visible: (values) => !values.id, // Only show on create
    validation: [
      {
        type: 'required',
        message: 'Password is required',
      },
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
    required: true,
    placeholder: '••••••••',
    visible: (values) => !values.id, // Only show on create
    validation: [
      {
        type: 'required',
        message: 'Password confirmation is required',
      },
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
    options: async () => {
      // This will be populated by the API client
      try {
        const response = await fetch('/api/v1/accounts/user-roles/');
        const data = await response.json();
        return data.results.map((role: { name: string; display_name: string }) => ({
          value: role.name,
          label: role.display_name,
        }));
      } catch (error) {
        console.error('Failed to load roles:', error);
        return [];
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
    validation: [
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
    visible: (values) => !!values.id, // Only show on edit
    helpText: 'User can log in and access the system',
    width: '25%',
  },
  {
    name: 'is_approved',
    label: 'Approved',
    type: 'switch',
    required: false,
    visible: (values) => !!values.id, // Only show on edit
    helpText: 'User account has been approved',
    width: '25%',
  },
  {
    name: 'is_verified',
    label: 'Verified',
    type: 'switch',
    required: false,
    visible: (values) => !!values.id, // Only show on edit
    helpText: 'User email/identity has been verified',
    width: '25%',
  },
  {
    name: 'must_change_password',
    label: 'Require Password Change',
    type: 'switch',
    required: false,
    visible: (values) => !!values.id, // Only show on edit
    helpText: 'User must change password on next login',
    width: '25%',
  },
  {
    name: 'is_staff',
    label: 'Staff Status',
    type: 'switch',
    required: false,
    visible: (values) => !!values.id, // Only show on edit
    helpText: 'User has staff privileges',
    width: '25%',
  },
];

