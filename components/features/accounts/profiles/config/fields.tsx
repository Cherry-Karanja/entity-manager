/**
 * UserProfile Field Configurations
 * 
 * Defines all form fields for profile management.
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { UserProfile } from '../types';

export const profileFields: FormField<UserProfile>[] = [
  // ===========================
  // Avatar Upload - Showcase FileUpload Component!
  // ===========================
  {
    name: 'avatar',
    label: 'Profile Picture',
    type: 'file',
    required: false,
    group: 'basic',
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    helpText: 'Upload a profile picture (max 5MB, JPG/PNG)',
    width: '100%',
  },
  
  // ===========================
  // Basic Information
  // ===========================
  {
    name: 'bio',
    label: 'Biography',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us about yourself...',
    group: 'basic',
    rows: 4,
    validation: [
      {
        type: 'maxLength',
        value: 500,
        message: 'Biography must be less than 500 characters',
      },
    ],
    helpText: 'A brief description about yourself',
    width: '100%',
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    required: false,
    placeholder: '+1 (555) 123-4567',
    group: 'contact',
    validation: [
      {
        type: 'pattern',
        value: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$',
        message: 'Please enter a valid phone number',
      },
    ],
    helpText: 'Your contact phone number',
    width: '50%',
  },
  {
    name: 'department',
    label: 'Department',
    type: 'text',
    required: false,
    placeholder: 'Engineering',
    group: 'organization',
    validation: [
      {
        type: 'maxLength',
        value: 100,
        message: 'Department must be less than 100 characters',
      },
    ],
    helpText: 'Your department or division',
    width: '50%',
  },
  {
    name: 'job_title',
    label: 'Job Title',
    type: 'text',
    required: false,
    placeholder: 'Senior Software Engineer',
    group: 'organization',
    validation: [
      {
        type: 'maxLength',
        value: 100,
        message: 'Job title must be less than 100 characters',
      },
    ],
    helpText: 'Your position or role',
    width: '50%',
  },
  
  // ===========================
  // Preferences
  // ===========================
  {
    name: 'preferred_language',
    label: 'Preferred Language',
    type: 'select',
    required: false,
    defaultValue: 'en',
    group: 'preferences',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
      { value: 'fr', label: 'Français' },
      { value: 'de', label: 'Deutsch' },
      { value: 'zh', label: '中文' },
      { value: 'ja', label: '日本語' },
    ],
    helpText: 'Your preferred language for the interface',
    width: '50%',
  },
  {
    name: 'interface_theme',
    label: 'Interface Theme',
    type: 'select',
    required: false,
    defaultValue: 'light',
    group: 'preferences',
    options: [
      { value: 'light', label: 'Light Theme' },
      { value: 'dark', label: 'Dark Theme' },
      { value: 'auto', label: 'Auto (System)' },
    ],
    helpText: 'Choose your preferred interface theme',
    width: '50%',
  },
  {
    name: 'allow_notifications',
    label: 'Email Notifications',
    type: 'checkbox',
    required: false,
    defaultValue: true,
    group: 'preferences',
    helpText: 'Receive email notifications for important updates',
    width: '50%',
  },
  
  // ===========================
  // Privacy Settings
  // ===========================
  {
    name: 'show_email',
    label: 'Show Email Publicly',
    type: 'checkbox',
    required: false,
    defaultValue: false,
    group: 'privacy',
    helpText: 'Make your email address visible to other users',
    width: '50%',
  },
  {
    name: 'show_phone',
    label: 'Show Phone Publicly',
    type: 'checkbox',
    required: false,
    defaultValue: false,
    group: 'privacy',
    helpText: 'Make your phone number visible to other users',
    width: '50%',
  },
];

export const UserProfileFormConfig = {
  fields: profileFields,
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Your profile picture and biography',
      fields: ['avatar', 'bio'],
    },
    {
      id: 'contact',
      label: 'Contact Information',
      description: 'Your contact details',
      fields: ['phone_number'],
    },
    {
      id: 'organization',
      label: 'Organization',
      description: 'Your department and job title',
      fields: ['department', 'job_title'],
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Your language and theme preferences',
      fields: ['preferred_language', 'interface_theme', 'allow_notifications'],
    },
    {
      id: 'privacy',
      label: 'Privacy Settings',
      description: 'Control what information is visible to others',
      fields: ['show_email', 'show_phone'],
    },
  ],
};
