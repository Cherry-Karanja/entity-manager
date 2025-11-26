/**
 * Term Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Term } from '../../types';
import { academicYearsApiClient } from '../../academic-years/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const TermFormConfig: EntityFormConfig<Term> = {
  fields: [
    {
      name: 'term_number',
      label: 'Term Number',
      type: 'number',
      required: true,
      placeholder: '1',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Term number is required' },
        { type: 'min', value: 1, message: 'Term must be at least 1' },
        { type: 'max', value: 10, message: 'Term must be at most 10' },
      ],
      helpText: 'Term/Semester number (1-10)',
      width: '33%',
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
        displayField: 'year',
        valueField: 'id',
        searchFields: ['year', 'name'],
        fetchOptions: async (search?: string) => {
          const response = await academicYearsApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '33%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: false,
      group: 'basic',
      defaultValue: false,
      helpText: 'Is this the currently active term?',
      width: '34%',
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: false,
      group: 'dates',
      helpText: 'When this term starts',
      width: '50%',
    },
    {
      name: 'end_date',
      label: 'End Date',
      type: 'date',
      required: false,
      group: 'dates',
      helpText: 'When this term ends',
      width: '50%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Term Information', collapsible: false },
    { id: 'dates', title: 'Term Dates', collapsible: true, defaultExpanded: true },
  ],

  layout: 'vertical',
};
