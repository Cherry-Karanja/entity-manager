/**
 * Enrollment Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';

export const EnrollmentFormConfig: EntityFormConfig<Enrollment> = {
  fields: [
    {
      name: 'trainee',
      label: 'Trainee',
      type: 'select',
      required: true,
      group: 'enrollment',
      validation: [{ type: 'required', message: 'Trainee is required' }],
      optionsConfig: {
        endpoint: '/api/v1/accounts/trainees/',
        labelField: 'full_name',
        valueField: 'id',
        searchable: true,
      },
      width: '50%',
    },
    {
      name: 'class_group',
      label: 'Class Group',
      type: 'select',
      required: true,
      group: 'enrollment',
      validation: [{ type: 'required', message: 'Class group is required' }],
      optionsConfig: {
        endpoint: '/api/v1/institution/class-groups/',
        labelField: 'name',
        valueField: 'id',
        searchable: true,
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

  layout: 'standard',
};
