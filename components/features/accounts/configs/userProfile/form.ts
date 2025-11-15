// ===== USER PROFILE FORM CONFIGURATION =====

import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';

export const userProfileFormConfig: EntityFormConfig = {
  fields: [
    {
      name: 'user',
      label: 'User',
      type: 'text',
      required: true
    },
    {
      name: 'job_title',
      label: 'Job Title',
      type: 'text'
    },
    {
      name: 'department',
      label: 'Department',
      type: 'text'
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text'
    },
    {
      name: 'timezone',
      label: 'Timezone',
      type: 'text'
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'image'
    },
    {
      name: 'is_public',
      label: 'Public Profile',
      type: 'checkbox'
    },
    {
      name: 'created_at',
      label: 'Created At',
      type: 'datetime',
      disabled: true
    },
    {
      name: 'updated_at',
      label: 'Updated At',
      type: 'datetime',
      disabled: true
    }
  ]
};