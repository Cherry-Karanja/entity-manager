/**
 * Department Field Configurations
 * 
 * Defines all form fields for department management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Department } from '../../types';
import { usersApiClient } from '@/components/features/accounts/users/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const DepartmentFormConfig: EntityFormConfig<Department> = {
  fields: [
    {
      name: 'name',
      label: 'Department Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Computer Science',
      group: 'basic',
      validation: [
        {
          type: 'required',
          message: 'Department name is required',
        },
        {
          type: 'minLength',
          value: 2,
          message: 'Department name must be at least 2 characters',
        },
        {
          type: 'maxLength',
          value: 255,
          message: 'Department name must be less than 255 characters',
        },
      ],
      helpText: 'Full name of the department',
      width: '100%',
    },
    {
      name: 'hod',
      label: 'Head of Department',
      type: 'relation',
      required: false,
      placeholder: 'Select Head of Department',
      group: 'basic',
      relationConfig: {
        entity: 'user',
        displayField: 'full_name',
        valueField: 'id',
        searchFields: ['email', 'first_name', 'last_name'],
        fetchOptions: async (search?: string) => {
          const res = await usersApiClient.list({ search, pageSize: 50 });
          return getListData(res);
        },
      },
      helpText: 'User assigned as the Head of Department',
      width: '100%',
    },
    {
      name: 'trainers',
      label: 'Trainers',
      type: 'relation',
      required: false,
      placeholder: 'Select trainers',
      group: 'basic',
      multiple: true,
      relationConfig: {
        entity: 'user',
        displayField: 'full_name',
        valueField: 'id',
        searchFields: ['search'],
        fetchOptions: async (search?: string) => {
          const res = await usersApiClient.list({ search, pageSize: 50 });
          return getListData(res);
        },
      },
      helpText: 'Trainers assigned to this department',
      width: '100%',
    },
  ],

  sections: [
    {
      id: 'basic',
      label: 'Department Information',
      description: 'Basic department details',
      collapsible: false,
      fields: ['name', 'hod', 'trainers'],
    },
  ],

  layout: 'vertical',
};
