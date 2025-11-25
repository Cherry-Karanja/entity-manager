/**
 * Enrollment Configuration Index
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { Enrollment } from '../../types';
import { EnrollmentFormConfig } from './fields';
import { EnrollmentListConfig } from './list';
import { EnrollmentViewConfig } from './view';
import { EnrollmentActionsConfig } from './actions';
import { EnrollmentExporterConfig } from './export';

export const enrollmentConfig: EntityConfig<Enrollment> = {
  name: 'enrollment',
  label: 'Enrollment',
  labelPlural: 'Enrollments',
  description: 'Manage trainee enrollments in class groups',
  
  list: EnrollmentListConfig,
  form: EnrollmentFormConfig,
  view: EnrollmentViewConfig,
  actions: EnrollmentActionsConfig,
  exporter: EnrollmentExporterConfig,
  
  onValidate: async (values: Partial<Enrollment>) => {
    const errors: Record<string, string> = {};
    if (!values.trainee) errors.trainee = 'Trainee is required';
    if (!values.class_group) errors.class_group = 'Class group is required';
    if (!values.enrollment_date) errors.enrollment_date = 'Enrollment date is required';
    if (!values.status) errors.status = 'Status is required';
    return errors;
  },

  apiEndpoint: '/api/v1/academics/enrollments/',
  icon: 'UserCheck',

  permissions: { create: true, read: true, update: true, delete: true, export: true },
  metadata: { createdAtField: 'created_at', updatedAtField: 'updated_at' },
};

export { EnrollmentFormConfig, EnrollmentListConfig, EnrollmentViewConfig, EnrollmentActionsConfig, EnrollmentExporterConfig };
