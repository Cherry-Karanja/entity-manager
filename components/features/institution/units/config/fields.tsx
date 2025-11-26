/**
 * Unit Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Unit } from '../../types';
import { programmesApiClient } from '../../programmes/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const UnitFormConfig: EntityFormConfig<Unit> = {
  fields: [
    {
      name: 'name',
      label: 'Unit Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Introduction to Programming',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Unit name is required' },
        { type: 'maxLength', value: 255, message: 'Name is too long' },
      ],
      width: '50%',
    },
    {
      name: 'code',
      label: 'Unit Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., CS101',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Unit code is required' },
        { type: 'maxLength', value: 20, message: 'Code is too long' },
      ],
      helpText: 'Unique identifier for this unit',
      width: '25%',
    },
    {
      name: 'credits',
      label: 'Credits',
      type: 'number',
      required: false,
      placeholder: '3',
      group: 'basic',
      validation: [
        { type: 'min', value: 0, message: 'Credits must be positive' },
        { type: 'max', value: 20, message: 'Credits cannot exceed 20' },
      ],
      helpText: 'Credit hours for this unit',
      width: '25%',
    },
    {
      name: 'programme',
      label: 'Programme',
      type: 'relation',
      required: true,
      group: 'associations',
      validation: [{ type: 'required', message: 'Programme is required' }],
      relationConfig: {
        entity: 'Programme',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['name', 'code'],
        fetchOptions: async (search?: string) => {
          const response = await programmesApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '50%',
    },
    {
      name: 'level',
      label: 'Level/Year',
      type: 'number',
      required: false,
      placeholder: '1',
      group: 'associations',
      validation: [
        { type: 'min', value: 1, message: 'Level must be at least 1' },
        { type: 'max', value: 10, message: 'Level cannot exceed 10' },
      ],
      helpText: 'Year/Level when this unit is typically taken',
      width: '25%',
    },
    {
      name: 'term_number',
      label: 'Term Number',
      type: 'number',
      required: false,
      placeholder: '1',
      group: 'associations',
      validation: [
        { type: 'min', value: 1, message: 'Term must be at least 1' },
      ],
      helpText: 'Which term this unit is taught',
      width: '25%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: false,
      group: 'status',
      defaultValue: true,
      width: '50%',
    },
    {
      name: 'is_core',
      label: 'Core Unit',
      type: 'boolean',
      required: false,
      group: 'status',
      defaultValue: true,
      helpText: 'Is this a core/required unit?',
      width: '50%',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'Unit description and objectives...',
      rows: 4,
      width: '100%',
    },
    {
      name: 'learning_outcomes',
      label: 'Learning Outcomes',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'Expected learning outcomes...',
      rows: 4,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Basic Information', collapsible: false },
    { id: 'associations', title: 'Programme & Scheduling', collapsible: true, defaultExpanded: true },
    { id: 'status', title: 'Status', collapsible: true, defaultExpanded: true },
    { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
  ],

  layout: 'vertical',
};
