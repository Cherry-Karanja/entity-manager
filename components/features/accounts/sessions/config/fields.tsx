/**
 * UserSession Field Configurations
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { UserSession } from '../../types';

export const sessionFields: FormField<UserSession>[] = [
  // Sessions are read-only, so minimal fields
  {
    name: 'user_email',
    label: 'User Email',
    type: 'text',
    required: false,
    group: 'basic',
    helpText: 'Email of the user',
    width: '50%',
    disabled: true,
  },
  {
    name: 'ip_address',
    label: 'IP Address',
    type: 'text',
    required: false,
    group: 'basic',
    helpText: 'IP address of the session',
    width: '50%',
    disabled: true,
  },
];

export const UserSessionFormConfig = {
  fields: sessionFields,
  groups: [
    {
      name: 'basic',
      label: 'Session Information',
      description: 'Basic session details',
    },
  ],
};
