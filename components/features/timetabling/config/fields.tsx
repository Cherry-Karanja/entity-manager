/**
 * Timetable Field Configurations
 * 
 * Defines all form fields for timetable management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { Timetable } from '../types';
import { Calendar, FileText, Settings } from 'lucide-react';

export const TimetableFormConfig: EntityFormConfig<Timetable> = {
  fields: [
    // ===========================
    // Basic Information
    // ===========================
    {
      name: 'name',
      label: 'Timetable Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Term 1 2024 Timetable',
      group: 'basic',
      validation: [
        {
          type: 'required',
          message: 'Timetable name is required',
        },
        {
          type: 'minLength',
          value: 3,
          message: 'Name must be at least 3 characters',
        },
        {
          type: 'maxLength',
          value: 200,
          message: 'Name must be less than 200 characters',
        },
      ],
      width: '100%',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter a description for this timetable...',
      group: 'basic',
      validation: [
        {
          type: 'maxLength',
          value: 1000,
          message: 'Description must be less than 1000 characters',
        },
      ],
      width: '100%',
    },
    {
      name: 'academic_year',
      label: 'Academic Year',
      type: 'select',
      required: true,
      group: 'basic',
      options: [
        { label: '2023-2024', value: '2023-2024' },
        { label: '2024-2025', value: '2024-2025' },
        { label: '2025-2026', value: '2025-2026' },
      ],
      validation: [
        {
          type: 'required',
          message: 'Academic year is required',
        },
      ],
      width: '50%',
    },
    {
      name: 'term',
      label: 'Term/Semester',
      type: 'select',
      required: true,
      group: 'basic',
      options: [
        { label: 'Term 1', value: 'term_1' },
        { label: 'Term 2', value: 'term_2' },
        { label: 'Term 3', value: 'term_3' },
        { label: 'Semester 1', value: 'semester_1' },
        { label: 'Semester 2', value: 'semester_2' },
      ],
      validation: [
        {
          type: 'required',
          message: 'Term is required',
        },
      ],
      width: '50%',
    },

    // ===========================
    // Status Fields
    // ===========================
    {
      name: 'is_active',
      label: 'Active',
      type: 'switch',
      required: false,
      group: 'status',
      defaultValue: true,
      helpText: 'Active timetables can be edited and generated',
      width: '50%',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      group: 'status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Generating', value: 'generating' },
        { label: 'Generated', value: 'generated' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      disabled: true, // Status is managed programmatically
      width: '50%',
    },
  ],

  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Core timetable details',
      fields: ['name', 'description', 'academic_year', 'term'],
      collapsible: false,
    },
    {
      id: 'status',
      label: 'Status & Settings',
      icon: <Settings className="h-4 w-4" />,
      description: 'Timetable status and activation',
      fields: ['is_active', 'status'],
      collapsible: true,
      defaultCollapsed: false,
    },
  ],

  layout: 'vertical',
  showReset: true,
};

// ===========================
// Schedule Entry Form Config
// ===========================

import { ScheduleEntry } from '../types';

export const ScheduleEntryFormConfig: EntityFormConfig<ScheduleEntry> = {
  fields: [
    {
      name: 'class_group',
      label: 'Class/Group',
      type: 'select',
      required: true,
      group: 'assignment',
      placeholder: 'Select class...',
      validation: [
        { type: 'required', message: 'Class is required' },
      ],
      width: '50%',
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'select',
      required: true,
      group: 'assignment',
      placeholder: 'Select subject...',
      validation: [
        { type: 'required', message: 'Subject is required' },
      ],
      width: '50%',
    },
    {
      name: 'teacher',
      label: 'Teacher',
      type: 'select',
      required: true,
      group: 'assignment',
      placeholder: 'Select teacher...',
      validation: [
        { type: 'required', message: 'Teacher is required' },
      ],
      width: '50%',
    },
    {
      name: 'room',
      label: 'Room',
      type: 'select',
      required: true,
      group: 'assignment',
      placeholder: 'Select room...',
      validation: [
        { type: 'required', message: 'Room is required' },
      ],
      width: '50%',
    },
    {
      name: 'time_slot',
      label: 'Time Slot',
      type: 'select',
      required: true,
      group: 'timing',
      placeholder: 'Select time slot...',
      validation: [
        { type: 'required', message: 'Time slot is required' },
      ],
      width: '100%',
    },
    {
      name: 'is_locked',
      label: 'Lock Entry',
      type: 'switch',
      required: false,
      group: 'options',
      helpText: 'Locked entries are not modified during regeneration',
      width: '50%',
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
      group: 'options',
      placeholder: 'Optional notes about this schedule entry...',
      width: '100%',
    },
  ],

  sections: [
    {
      id: 'assignment',
      label: 'Assignment',
      icon: <FileText className="h-4 w-4" />,
      description: 'Class, subject, teacher, and room assignment',
      fields: ['class_group', 'subject', 'teacher', 'room'],
      collapsible: false,
    },
    {
      id: 'timing',
      label: 'Time Slot',
      icon: <Calendar className="h-4 w-4" />,
      description: 'When this lesson occurs',
      fields: ['time_slot'],
      collapsible: false,
    },
    {
      id: 'options',
      label: 'Options',
      icon: <Settings className="h-4 w-4" />,
      description: 'Additional settings',
      fields: ['is_locked', 'notes'],
      collapsible: true,
      defaultCollapsed: true,
    },
  ],

  layout: 'vertical',
  showReset: true,
};
