/**
 * LoginAttempt Field Configurations
 */

import { FormField } from '@/components/entityManager/components/form/types';
import { LoginAttempt } from '../../types';

export const loginAttemptFields: FormField<LoginAttempt>[] = [
  // Read-only fields for viewing
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: false,
    group: 'basic',
    disabled: true,
  },
  {
    name: 'success',
    label: 'Success',
    type: 'checkbox',
    required: false,
    group: 'basic',
    disabled: true,
  },
];

export const LoginAttemptFormConfig = {
  fields: loginAttemptFields,
  groups: [
    {
      name: 'basic',
      label: 'Login Attempt Information',
      description: 'Details about the login attempt',
    },
  ],
};
