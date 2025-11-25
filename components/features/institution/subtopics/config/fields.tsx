/**
 * Subtopic Field Configurations
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Subtopic } from '../../types';

export const SubtopicFormConfig: EntityFormConfig<Subtopic> = {
  fields: [
    {
      name: 'name',
      label: 'Subtopic Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Integer data types',
      group: 'basic',
      validation: [
        { type: 'required', message: 'Subtopic name is required' },
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
      helpText: 'Display order within the topic',
      width: '30%',
    },
    {
      name: 'topic',
      label: 'Topic',
      type: 'select',
      required: true,
      group: 'associations',
      validation: [{ type: 'required', message: 'Topic is required' }],
      optionsConfig: {
        endpoint: '/api/v1/academics/topics/',
        labelField: 'name',
        valueField: 'id',
        searchable: true,
      },
      width: '100%',
    },
    {
      name: 'duration_minutes',
      label: 'Duration (Minutes)',
      type: 'number',
      required: false,
      placeholder: '30',
      group: 'scheduling',
      validation: [
        { type: 'min', value: 5, message: 'Duration must be at least 5 minutes' },
      ],
      helpText: 'Estimated teaching time in minutes',
      width: '50%',
    },
    {
      name: 'content_type',
      label: 'Content Type',
      type: 'select',
      required: false,
      group: 'scheduling',
      options: [
        { label: 'Lecture', value: 'lecture' },
        { label: 'Practical', value: 'practical' },
        { label: 'Discussion', value: 'discussion' },
        { label: 'Assessment', value: 'assessment' },
        { label: 'Self-Study', value: 'self-study' },
      ],
      width: '50%',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'Subtopic description and key points...',
      rows: 3,
      width: '100%',
    },
    {
      name: 'resources',
      label: 'Resources / References',
      type: 'textarea',
      required: false,
      group: 'details',
      placeholder: 'List of learning resources, links, etc...',
      rows: 3,
      width: '100%',
    },
  ],

  fieldGroups: [
    { id: 'basic', title: 'Subtopic Information', collapsible: false },
    { id: 'associations', title: 'Topic Association', collapsible: true, defaultExpanded: true },
    { id: 'scheduling', title: 'Duration & Type', collapsible: true, defaultExpanded: true },
    { id: 'details', title: 'Details', collapsible: true, defaultExpanded: false },
  ],

  layout: 'standard',
};
