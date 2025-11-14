import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for User entity in one place

export const userFields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: { 
      email: true,
      required: 'Email is required',
    },
    placeholder: 'user@example.com',
    helpText: 'User email address for login and communication',
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    validation: { 
      required: 'First name is required',
      minLength: 2,
    },
    placeholder: 'John',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    validation: { 
      required: 'Last name is required',
      minLength: 2,
    },
    placeholder: 'Doe',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: false,
    validation: { 
      minLength: 3,
      maxLength: 30,
    },
    placeholder: 'johndoe',
    helpText: 'Optional unique username',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    validation: {
      required: 'Role is required',
    },
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
      { value: 'moderator', label: 'Moderator' },
    ],
    defaultValue: 'user',
  },
  {
    name: 'isActive',
    label: 'Active',
    type: 'checkbox',
    defaultValue: true,
    helpText: 'Inactive users cannot log in',
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    required: false,
    placeholder: '+1 (555) 123-4567',
  },
  {
    name: 'bio',
    label: 'Biography',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us about yourself...',
    validation: {
      maxLength: 500,
    },
  },
  {
    name: 'avatar',
    label: 'Avatar',
    type: 'image',
    required: false,
    helpText: 'Profile picture (max 2MB)',
  },
  {
    name: 'dateJoined',
    label: 'Date Joined',
    type: 'date',
    required: false,
    readOnly: true,
  },
]
