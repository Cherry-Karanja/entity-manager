import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';
import { User } from '../../types';

// ===== USER FORM CONFIGURATION =====

export const userFormConfig: EntityFormConfig<User> = {
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text'
    },
    {
      name: 'employee_id',
      label: 'Employee ID',
      type: 'text'
    },
    {
      name: 'role_name',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Moderator', label: 'Moderator' },
        { value: 'User', label: 'User' }
      ]
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'checkbox'
    }
  ]
}
