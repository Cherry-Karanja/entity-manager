/**
 * LoginAttempt Configuration
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { LoginAttempt } from '../../types';
import { LoginAttemptFormConfig } from './fields';
import { loginAttemptColumns } from './list';
import { loginAttemptViewFields } from './view';
import { LoginAttemptActionsConfig } from './actions';
import { LoginAttemptExporterConfig } from './export';

export const loginAttemptConfig: EntityConfig<LoginAttempt> = {
  name: 'loginAttempt',
  label: 'Login Attempt',
  labelPlural: 'Login Attempts',
  description: 'View login attempt history and security monitoring',
  
  list: {
    columns: loginAttemptColumns,
    sortConfig: { field: 'created_at', direction: 'desc' },
    searchable: true,
  },
  
  form: LoginAttemptFormConfig,
  view: {
    fields: loginAttemptViewFields,
  },
  actions: LoginAttemptActionsConfig,
  exporter: LoginAttemptExporterConfig,
  apiEndpoint: '/api/v1/accounts/login-attempts/',
  icon: 'ShieldAlert',
  
  permissions: {
    create: false, // Login attempts are created automatically
    read: true,
    update: false,
    delete: false, // Keep for audit trail
    export: true,
  },
  
  metadata: {
    color: 'red',
    category: 'accounts',
    tags: ['security', 'audit', 'monitoring'],
  },
};

export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
export * from './export';
