/**
 * Topic Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Topic } from '../../types';
import { unitsApiClient } from '../../units/api/client';
import { getListData } from '@/components/entityManager/composition/api/responseUtils';

export const TopicFormConfig: EntityFormConfig<Topic> = {
  fields: [
    {
      name: 'name',
      label: 'Topic Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Variables and Data Types',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Topic name is required' },
        { type: 'maxLength', value: 255, message: 'Name is too long' },
      ],
      width: '70%',
    },
    {
      name: 'order',
      label: 'Order',
      type: 'number',
      required: false,
      placeholder: '1',
      group: 'basic',
      validation: [
        { type: 'min', value: 1, message: 'Order must be at least 1' },
      ],
      helpText: 'Display order within the unit',
      width: '30%',
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'relation',
      required: true,
      group: 'associations',
      validation: [{ type: 'required', message: 'Unit is required' }],
      relationConfig: {
        entity: 'Unit',
        displayField: 'name',
        valueField: 'id',
        searchFields: ['name'],
        fetchOptions: async (search?: string) => {
          const response = await unitsApiClient.list({ search, pageSize: 50 });
          return getListData(response);
        },
      },
      width: '100%',
    },
    {
      name: 'duration_hours',
      label: 'Duration (Hours)',
      type: 'number',
      required: false,
      placeholder: '2',
      group: 'scheduling',
      validation: [
        { type: 'min', value: 0.5, message: 'Duration must be at least 0.5 hours' },
      ],
      helpText: 'Estimated teaching hours',
      width: '50%',
    },
    {
      name: 'weight',
      label: 'Weight (%)',
      type: 'number',
      required: false,
      placeholder: '10',
      group: 'scheduling',
      validation: [
        { type: 'min', value: 0, message: 'Weight must be positive' },
        { type: 'max', value: 100, message: 'Weight cannot exceed 100%' },
      ],
      helpText: 'Percentage weight in unit assessment',
      width: '50%',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'Topic description and coverage...',
      rows: 3,
      width: '100%',
    },
    {
      name: 'learning_objectives',
      label: 'Learning Objectives',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'What students will learn...',
      rows: 3,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Topic Information', collapsible: false },
    { id: 'associations', title: 'Unit Association', collapsible: true, defaultExpanded: true },
    { id: 'scheduling', title: 'Duration & Assessment', collapsible: true, defaultExpanded: true },
    { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
  ],

  layout: 'vertical',
};
