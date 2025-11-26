/**
 * Intake Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Intake } from '../../types';
import { academicYearsApiClient } from '../../academic-years/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const IntakeFormConfig: EntityFormConfig<Intake> = {
  fields: [
    {
      name: 'name',
      label: 'Intake Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., January 2024',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Intake name is required' },
        { type: 'maxLength', value: 255, message: 'Name is too long' },
      ],
      helpText: 'A descriptive name for this intake',
      width: '50%',
    },
    {
      name: 'code',
      label: 'Intake Code',
      type: 'text',
      required: false,
      placeholder: 'e.g., JAN24',
      group: 'basic',
      validation: [
        { type: 'maxLength', value: 20, message: 'Code is too long' },
      ],
      helpText: 'Short unique identifier',
      width: '50%',
    },
    {
      name: 'academic_year',
      label: 'Academic Year',
      type: 'relation',
      required: true,
      group: 'basic',
      validation: [{ type: 'required', message: 'Academic year is required' }],
      relationConfig: {
        entity: 'AcademicYear',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['name', 'code'],
        fetchOptions: async (search?: string) => {
          const response = await academicYearsApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '50%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: false,
      group: 'basic',
      defaultValue: true,
      helpText: 'Is this intake currently active?',
      width: '50%',
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: false,
      group: 'dates',
      helpText: 'When this intake starts',
      width: '50%',
    },
    {
      name: 'end_date',
      label: 'End Date',
      type: 'date',
      required: false,
      group: 'dates',
      helpText: 'When this intake ends',
      width: '50%',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'Optional description for this intake...',
      rows: 3,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Intake Information', collapsible: false },
    { id: 'dates', title: 'Intake Period', collapsible: true, defaultExpanded: true },
    { id: 'details', title: 'Additional Details', collapsible: true, defaultExpanded: false },
  ],

  layout: 'vertical',
};
