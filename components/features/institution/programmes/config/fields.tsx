/**
 * Programme Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { authApi } from '@/components/connectionManager/http/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';
import { Programme, Department } from '../../types';

export const ProgrammeFormConfig: EntityFormConfig<Programme> = {
  fields: [
    {
      name: 'name',
      label: 'Programme Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Computer Science',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Programme name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
        { type: 'maxLength', value: 255, message: 'Name must be less than 255 characters' },
      ],
      width: '50%',
    },
    {
      name: 'code',
      label: 'Programme Code',
      type: 'text',
      required: false,
      placeholder: 'e.g., CS101',
      group: 'basic',
      validation: [
        { type: 'maxLength', value: 20, message: 'Code must be less than 20 characters' },
      ],
      helpText: 'Unique programme code identifier',
      width: '25%',
    },
    {
      name: 'level',
      label: 'Level',
      type: 'number',
      required: true,
      placeholder: '1',
      group: 'basic',
      validation: [
        { type: 'min', value: 0, message: 'Level must be at least 0' },
        { type: 'max', value: 10, message: 'Level must be at most 10' },
      ],
      helpText: 'Programme level (1-10)',
      width: '25%',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'relation',
      required: true,
      placeholder: 'Select department',
      group: 'basic',
      relationConfig: {
        entity: 'departments',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['search'],
        fetchOptions: async (query?: string) => {
          const params = query ? { params: { search: query } } : undefined;
          const resp = await authApi.get('/api/v1/institution/departments/', params as Record<string, unknown> | undefined);
          return getListData<Department>(resp.data);
        },
      },
      width: '100%',
    },
  ],

  fieldGroups: [
    {
      id: 'basic',
      title: 'Programme Information',
      description: 'Basic programme details',
      collapsible: false,
    },
  ],

  layout: 'vertical',
};
