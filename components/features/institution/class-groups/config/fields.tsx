/**
 * ClassGroup Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';
import { programmesApiClient } from '../../programmes/api/client';
import { intakesApiClient } from '../../intakes/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const ClassGroupFormConfig: EntityFormConfig<ClassGroup> = {
  fields: [
    {
      name: 'name',
      label: 'Class Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., NNP/CAM5/25S2-M',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Class name is required' },
        { type: 'maxLength', value: 255, message: 'Name must be less than 255 characters' },
      ],
      helpText: 'Format: CURRICULUM/CODE/YYIT[-SUFFIX] e.g., NNP/CAM5/25S2-M',
      width: '50%',
    },
    {
      name: 'programme',
      label: 'Programme',
      type: 'relation',
      required: true,
      placeholder: 'Select programme',
      group: 'basic',
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
      name: 'auto_fill_fields',
      label: 'Auto-fill from Name',
      type: 'switch',
      required: false,
      group: 'basic',
      helpText: 'If enabled, intake, year, term, and suffix will be derived from the class name',
      defaultValue: true,
      width: '100%',
    },
    {
      name: 'cirriculum_code',
      label: 'Curriculum Code',
      type: 'text',
      required: false,
      placeholder: 'NNP',
      group: 'details',
      helpText: 'Curriculum code (auto-filled if auto-fill is enabled)',
      width: '25%',
    },
    {
      name: 'intake',
      label: 'Intake',
      type: 'relation',
      required: false,
      placeholder: 'Select intake',
      group: 'details',
      relationConfig: {
        entity: 'Intake',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['name'],
        fetchOptions: async (search?: string) => {
          const response = await intakesApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      helpText: 'Academic intake (auto-filled if auto-fill is enabled)',
      width: '25%',
    },
    {
      name: 'year',
      label: 'Year',
      type: 'number',
      required: false,
      placeholder: '2025',
      group: 'details',
      helpText: 'Full year (auto-filled if auto-fill is enabled)',
      width: '25%',
    },
    {
      name: 'term_number',
      label: 'Term Number',
      type: 'number',
      required: false,
      placeholder: '1',
      group: 'details',
      validation: [
        { type: 'min', value: 1, message: 'Term must be at least 1' },
        { type: 'max', value: 3, message: 'Term must be at most 3' },
      ],
      width: '25%',
    },
    {
      name: 'suffix',
      label: 'Suffix',
      type: 'select',
      required: false,
      placeholder: 'Select suffix',
      group: 'details',
      options: [
        { value: '', label: 'None' },
        { value: 'M', label: 'M - Modular' },
        { value: 'H', label: 'H - Harmonized' },
        { value: 'O', label: 'O - Other' },
      ],
      width: '25%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'switch',
      required: false,
      group: 'status',
      defaultValue: true,
      width: '25%',
    },
  ],

  layout: 'tabs',

  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Core class details',
      fields: ['name', 'programme', 'auto_fill_fields'],
      order: 1,
    },
    {
      id: 'details',
      label: 'Class Details',
      description: 'These are auto-filled if auto-fill is enabled',
      fields: ['cirriculum_code', 'intake', 'year', 'term_number', 'suffix'],
      order: 2,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Class status',
      fields: ['is_active'],
      order: 3,
    },
  ],

  submitText: 'Save Class Group',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,

  disabled: false,
  className: 'class-group-form',
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: false,

};
