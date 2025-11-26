/**
 * Enrollment Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { usersApiClient } from '@/components/features/accounts/users/api/client';
import { classGroupsApiClient } from '../../class-groups/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const EnrollmentFormConfig: EntityFormConfig<Enrollment> = {
  fields: [
    {
      name: 'trainee',
      label: 'Trainee',
      type: 'relation',
      required: true,
      group: 'enrollment',
      validation: [{ type: 'required', message: 'Trainee is required' }],
      relationConfig: {
        entity: 'User',
        displayField: 'full_name',
        valueField: 'id',
        searchFields: ['full_name', 'email'],
        fetchOptions: async (search?: string) => {
          const response = await usersApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '50%',
    },
    {
      name: 'class_group',
      label: 'Class Group',
      type: 'relation',
      required: true,
      group: 'enrollment',
      validation: [{ type: 'required', message: 'Class group is required' }],
      relationConfig: {
        entity: 'ClassGroup',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['name'],
        fetchOptions: async (search?: string) => {
          const response = await classGroupsApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '50%',
    },
    {
      name: 'enrollment_date',
      label: 'Enrollment Date',
      type: 'date',
      required: true,
      group: 'enrollment',
      validation: [{ type: 'required', message: 'Enrollment date is required' }],
      width: '50%',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      group: 'enrollment',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Withdrawn', value: 'withdrawn' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Deferred', value: 'deferred' },
      ],
      defaultValue: 'active',
      width: '50%',
    },
    {
      name: 'grade',
      label: 'Grade',
      type: 'text',
      required: false,
      group: 'academic',
      placeholder: 'e.g., A, B+, 85%',
      helpText: 'Final grade for this enrollment',
      width: '50%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'switch',
      required: false,
      group: 'academic',
      defaultValue: true,
      helpText: 'Whether this enrollment is currently active',
      width: '50%',
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      group: 'additional',
      placeholder: 'Additional notes about the enrollment...',
      rows: 3,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'enrollment', title: 'Enrollment Details', collapsible: false },
    { id: 'academic', title: 'Academic Information', collapsible: true, defaultExpanded: true },
    { id: 'additional', title: 'Additional Information', collapsible: true, defaultExpanded: false },
  ],

  layout: 'vertical',
};
