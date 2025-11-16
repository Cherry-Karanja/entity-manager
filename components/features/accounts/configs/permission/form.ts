// ===== PERMISSION FORM CONFIGURATION =====

import { EntityFormConfig } from '@/components/entityManager/EntityForm/types';
import { Permission } from '../../types';

export const permissionFormConfig: EntityFormConfig<Permission> = {
  fields: [
    {
      name: 'name',
      label: 'Permission Name',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 255,
      placeholder: 'Enter permission name (e.g., Can view users)'
    },
    {
      name: 'codename',
      label: 'Codename',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 100,
      placeholder: 'Enter codename (e.g., view_user)'
    },
    {
      name: 'app_label',
      label: 'App Label',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 100,
      placeholder: 'Enter app label (e.g., accounts)'
    },
    {
      name: 'model',
      label: 'Model',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 100,
      placeholder: 'Enter model name (e.g., user)'
    }
  ]
}