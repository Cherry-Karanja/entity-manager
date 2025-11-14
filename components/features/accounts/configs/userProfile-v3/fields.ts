import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for UserProfile entity in one place

export const userProfileFields: FormField[] = [
  {
    name: 'user',
    label: 'User',
    type: 'text',
    required: true,
    readOnly: true,
    validation: {
      required: 'User is required',
    },
    helpText: 'The user this profile belongs to',
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us about yourself...',
    validation: {
      maxLength: 500,
    },
    helpText: 'Brief biography (max 500 characters)',
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'tel',
    required: false,
    placeholder: '+1234567890',
    validation: {
      pattern: /^\+?[\d\s\-\(\)]+$/,
    },
  },
  {
    name: 'department',
    label: 'Department',
    type: 'text',
    required: false,
    placeholder: 'e.g., IT, HR, Finance',
    validation: {
      maxLength: 100,
    },
  },
  {
    name: 'job_title',
    label: 'Job Title',
    type: 'text',
    required: false,
    placeholder: 'e.g., Software Engineer, Manager',
    validation: {
      maxLength: 100,
    },
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    validation: {
      required: 'Status is required',
    },
    options: [
      { value: 'pending', label: 'Pending Approval' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'suspended', label: 'Suspended' },
    ],
    defaultValue: 'pending',
  },
  {
    name: 'approved_by',
    label: 'Approved By',
    type: 'text',
    required: false,
    readOnly: true,
  },
  {
    name: 'approved_at',
    label: 'Approved At',
    type: 'text',
    required: false,
    readOnly: true,
  },
  {
    name: 'preferred_language',
    label: 'Preferred Language',
    type: 'select',
    required: true,
    validation: {
      required: 'Preferred language is required',
    },
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'sw', label: 'Swahili' },
    ],
    defaultValue: 'en',
  },
  {
    name: 'interface_theme',
    label: 'Interface Theme',
    type: 'select',
    required: true,
    validation: {
      required: 'Interface theme is required',
    },
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
    defaultValue: 'system',
    helpText: 'Choose your preferred interface theme',
  },
  {
    name: 'allow_notifications',
    label: 'Allow Notifications',
    type: 'checkbox',
    defaultValue: true,
    helpText: 'Receive notifications about important updates',
  },
  {
    name: 'show_email',
    label: 'Show Email Publicly',
    type: 'checkbox',
    defaultValue: false,
    helpText: 'Display your email address on your public profile',
  },
  {
    name: 'show_phone',
    label: 'Show Phone Publicly',
    type: 'checkbox',
    defaultValue: false,
    helpText: 'Display your phone number on your public profile',
  },
  {
    name: 'created_at',
    label: 'Created At',
    type: 'text',
    required: false,
    readOnly: true,
  },
  {
    name: 'updated_at',
    label: 'Updated At',
    type: 'text',
    required: false,
    readOnly: true,
  },
]
