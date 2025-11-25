/**
 * ClassGroup Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { ClassGroup } from '../../types';

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
      type: 'relationship',
      required: true,
      placeholder: 'Select programme',
      group: 'basic',
      relationshipConfig: {
        endpoint: '/api/v1/institution/programmes/',
        labelField: 'name',
        valueField: 'id',
        searchField: 'search',
      },
      width: '50%',
    },
    {
      name: 'auto_fill_fields',
      label: 'Auto-fill from Name',
      type: 'boolean',
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
      type: 'relationship',
      required: false,
      placeholder: 'Select intake',
      group: 'details',
      relationshipConfig: {
        endpoint: '/api/v1/institution/intakes/',
        labelField: 'name',
        valueField: 'id',
        searchField: 'search',
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
        { value: 'M', label: 'M - Morning' },
        { value: 'H', label: 'H - Half-day' },
        { value: 'O', label: 'O - Other' },
      ],
      width: '25%',
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
      required: false,
      group: 'status',
      defaultValue: true,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Basic Information', collapsible: false },
    { id: 'details', title: 'Class Details', description: 'These are auto-filled if auto-fill is enabled', collapsible: true },
    { id: 'status', title: 'Status', collapsible: false },
  ],

  layout: 'standard',
};
