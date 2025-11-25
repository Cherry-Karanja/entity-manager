/**
 * UserSession Configuration
 */

import { EntityConfig } from '@/components/entityManager/composition/config/types';
import { UserSession } from '../../types';
import { UserSessionFormConfig } from './fields';
import { sessionColumns } from './list';
import { sessionViewFields } from './view';
import { UserSessionActionsConfig } from './actions';

export const userSessionConfig: EntityConfig<UserSession> = {
  name: 'userSession',
  label: 'Session',
  labelPlural: 'Sessions',
  description: 'View and manage active user sessions',
  
  list: {
    columns: sessionColumns,
    sortConfig: { field: 'created_at', direction: 'desc' },
    searchable: true,
    searchPlaceholder: 'Search by email, name, IP or device...',
  },
  
  form: UserSessionFormConfig,
  view: {
    fields: sessionViewFields,
  },
  actions: UserSessionActionsConfig,
  exporter: {
    fields: [],
  },
  apiEndpoint: '/api/v1/accounts/user-sessions/',
  icon: 'Monitor',
  
  permissions: {
    create: false, // Sessions are created automatically
    read: true,
    update: false, // Sessions cannot be updated
    delete: true, // Can expire/delete sessions
    export: true,
  },
  
  metadata: {
    color: 'purple',
    category: 'accounts',
    tags: ['sessions', 'security', 'monitoring'],
  },
};

export * from './fields';
export * from './list';
export * from './view';
export * from './actions';
