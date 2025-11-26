/**
 * Academic Year Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { AcademicYear } from '../../types';

const currentYear = new Date().getFullYear();

export const AcademicYearFormConfig: EntityFormConfig<AcademicYear> = {
  fields: [
    {
      name: 'year',
      label: 'Academic Year',
      type: 'number',
      required: true,
      placeholder: String(currentYear),
      group: 'basic',
      validation: [
        { type: 'required', message: 'Year is required' },
        { type: 'min', value: 2000, message: 'Year must be 2000 or later' },
        { type: 'max', value: 3000, message: 'Year must be before 3000' },
      ],
      helpText: 'Academic year as a 4-digit number (e.g., 2024)',
      width: '50%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: false,
      group: 'basic',
      defaultValue: true,
      helpText: 'Is this the active academic year?',
      width: '50%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Academic Year Information', collapsible: false },
  ],

  layout: 'vertical',
};
