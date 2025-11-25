/**
 * Academic Year Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { AcademicYear } from '../../types';
import { AcademicYearFormConfig } from './fields';
import { AcademicYearListConfig } from './list';
import { AcademicYearViewConfig } from './view';
import { AcademicYearActionsConfig } from './actions';
import { AcademicYearExporterConfig } from './export';

export const academicYearConfig: EntityConfig<AcademicYear> = {
  name: 'academicYear',
  label: 'Academic Year',
  labelPlural: 'Academic Years',
  description: 'Manage academic years',
  
  list: AcademicYearListConfig,
  form: AcademicYearFormConfig,
  view: AcademicYearViewConfig,
  actions: AcademicYearActionsConfig,
  exporter: AcademicYearExporterConfig,
  
  onValidate: async (values: Partial<AcademicYear>) => {
    const errors: Record<string, string> = {};
    if (!values.year) errors.year = 'Year is required';
    else if (values.year < 2000 || values.year > 3000) errors.year = 'Year must be between 2000 and 3000';
    return errors;
  },

  apiEndpoint: '/api/v1/institution/academic-years/',
  icon: 'Calendar',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { AcademicYearFormConfig, AcademicYearListConfig, AcademicYearViewConfig, AcademicYearActionsConfig, AcademicYearExporterConfig };
